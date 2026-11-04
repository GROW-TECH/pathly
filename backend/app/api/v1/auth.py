from typing import Optional
import httpx
from fastapi import APIRouter, Request, Response, Depends, HTTPException, status
from pydantic import BaseModel

from app.core.config import settings
from app.api.deps import get_current_user
from app.schemas.auth import (
    UserSignUpRequest,
    UserLoginRequest,
    TokenResponse,
    MessageResponse,
)
from app.schemas.user import AuthUserResponse, UserResponse
from app.schemas.profile import CandidateProfileResponse
from app.services.auth_service import AuthService
from app.services.profile_service import ProfileService

router = APIRouter(prefix="/auth", tags=["Authentication"])

def set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    """Set secure HttpOnly cookies on the HTTP response."""
    # Access token cookie (valid across entire API)
    response.set_cookie(
        key=settings.ACCESS_TOKEN_COOKIE_NAME,
        value=access_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    # Refresh token cookie (restricted to auth endpoints)
    response.set_cookie(
        key=settings.REFRESH_TOKEN_COOKIE_NAME,
        value=refresh_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        path="/api/v1/auth",
    )

def clear_auth_cookies(response: Response) -> None:
    """Delete authentication cookies on logout."""
    response.delete_cookie(
        key=settings.ACCESS_TOKEN_COOKIE_NAME,
        path="/",
        httponly=True,
        samesite=settings.COOKIE_SAMESITE,
    )
    response.delete_cookie(
        key=settings.REFRESH_TOKEN_COOKIE_NAME,
        path="/api/v1/auth",
        httponly=True,
        samesite=settings.COOKIE_SAMESITE,
    )

@router.post(
    "/signup",
    response_model=AuthUserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new candidate account"
)
async def signup(
    data: UserSignUpRequest,
    request: Request,
    response: Response,
):
    """
    Registers a new user in MongoDB, initializes their career profile,
    and establishes an authenticated session with secure HttpOnly cookies.
    """
    user_dict, profile_dict = await AuthService.register_user(data)
    user_id = user_dict["id"]

    client_ip = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("user-agent", "Unknown")

    access_token, refresh_token = await AuthService.create_user_session(
        user_id=user_id,
        user_agent=user_agent,
        ip_address=client_ip,
    )

    set_auth_cookies(response, access_token, refresh_token)

    return AuthUserResponse(
        user=UserResponse(**user_dict),
        profile=CandidateProfileResponse(**profile_dict)
    )

@router.post(
    "/login",
    response_model=AuthUserResponse,
    summary="Authenticate candidate and start session"
)
async def login(
    data: UserLoginRequest,
    request: Request,
    response: Response,
):
    """
    Validates credentials with bcrypt against MongoDB and sets secure session cookies.
    Includes rate-limiting protection.
    """
    client_ip = request.client.host if request.client else "127.0.0.1"
    user_doc = await AuthService.authenticate_user(
        email_or_mobile=data.email,
        password=data.password,
        client_ip=client_ip,
    )
    user_id = str(user_doc["_id"])
    user_agent = request.headers.get("user-agent", "Unknown")

    access_token, refresh_token = await AuthService.create_user_session(
        user_id=user_id,
        user_agent=user_agent,
        ip_address=client_ip,
    )

    set_auth_cookies(response, access_token, refresh_token)

    user_dict = {
        "id": user_id,
        "full_name": user_doc["full_name"],
        "email": user_doc["email"],
        "mobile": user_doc["mobile"],
        "career_status": user_doc.get("career_status", "fresher"),
        "is_active": user_doc.get("is_active", True),
        "created_at": user_doc["created_at"],
    }
    profile_dict = await ProfileService.get_profile(user_id)

    return AuthUserResponse(
        user=UserResponse(**user_dict),
        profile=CandidateProfileResponse(**profile_dict)
    )

@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Refresh expired access token"
)
async def refresh_session(
    request: Request,
    response: Response,
):
    """
    Reads the refresh token from HttpOnly cookie, verifies it against the sessions collection,
    rotates the session, and sets refreshed cookies.
    """
    refresh_token = request.cookies.get(settings.REFRESH_TOKEN_COOKIE_NAME)
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No refresh session token found. Please log in."
        )

    access_token, new_refresh_token, _ = await AuthService.refresh_session(refresh_token)
    set_auth_cookies(response, access_token, new_refresh_token)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Invalidate session and log out"
)
async def logout(
    request: Request,
    response: Response,
):
    """
    Revokes the active refresh token in MongoDB and clears authentication cookies.
    """
    refresh_token = request.cookies.get(settings.REFRESH_TOKEN_COOKIE_NAME)
    if refresh_token:
        await AuthService.revoke_session(refresh_token)

    clear_auth_cookies(response)
    return MessageResponse(success=True, message="Successfully logged out.")

@router.get(
    "/me",
    response_model=AuthUserResponse,
    summary="Get currently authenticated candidate profile and session"
)
async def get_me(
    current_user: dict = Depends(get_current_user),
):
    """
    Returns the currently authenticated user's information and candidate profile.
    Used on app load to restore active login sessions.
    """
    user_id = current_user["id"]
    profile_dict = await ProfileService.get_profile(user_id)

    return AuthUserResponse(
        user=UserResponse(**current_user),
        profile=CandidateProfileResponse(**profile_dict)
    )

class GoogleAuthRequest(BaseModel):
    credential: Optional[str] = None
    access_token: Optional[str] = None

@router.post(
    "/google",
    summary="Google OAuth authentication",
    response_model=AuthUserResponse
)
async def google_auth(
    data: GoogleAuthRequest,
    request: Request,
    response: Response,
):
    """
    Authenticates with Google OAuth. Verifies the Google ID token with Google's tokeninfo API,
    registers or logs in the user, creates a session with HttpOnly cookies, and returns the candidate profile.
    """
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth is not configured on this server."
        )

    if not data.credential and not data.access_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google ID token (credential) or access_token is required."
        )

    google_info = {}
    if data.credential:
        # 1a. Verify ID token with Google's public tokeninfo endpoint
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                token_res = await client.get(
                    f"https://oauth2.googleapis.com/tokeninfo?id_token={data.credential}"
                )
                if token_res.status_code != 200:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid or expired Google OAuth credential."
                    )
                google_info = token_res.json()
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Unable to reach Google token verification servers: {str(exc)}"
            )

        # Verify audience matches our Client ID
        aud = google_info.get("aud")
        if aud != settings.GOOGLE_CLIENT_ID:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Google token audience mismatch."
            )
    elif data.access_token:
        # 1b. Verify access token with Google's userinfo endpoint
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                userinfo_res = await client.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    headers={"Authorization": f"Bearer {data.access_token}"}
                )
                if userinfo_res.status_code != 200:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Invalid or expired Google access token."
                    )
                google_info = userinfo_res.json()
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Unable to reach Google userinfo servers: {str(exc)}"
            )

    email = google_info.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account did not return an email address."
        )

    name = google_info.get("name") or email.split("@")[0]

    # 3. Register or get user
    user_doc = await AuthService.register_or_get_google_user(email=email, full_name=name)
    user_id = str(user_doc["_id"])

    # 4. Create real session and cookies
    client_ip = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("user-agent", "Unknown")

    access_token, refresh_token = await AuthService.create_user_session(
        user_id=user_id,
        user_agent=user_agent,
        ip_address=client_ip,
    )

    set_auth_cookies(response, access_token, refresh_token)

    user_dict = {
        "id": user_id,
        "full_name": user_doc["full_name"],
        "email": user_doc["email"],
        "mobile": user_doc.get("mobile", ""),
        "career_status": user_doc.get("career_status", "fresher"),
        "is_active": user_doc.get("is_active", True),
        "created_at": user_doc["created_at"],
    }
    profile_dict = await ProfileService.get_profile(user_id)

    return AuthUserResponse(
        user=UserResponse(**user_dict),
        profile=CandidateProfileResponse(**profile_dict)
    )

