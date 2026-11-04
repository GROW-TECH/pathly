from typing import Optional, Dict, Any
from fastapi import Request, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import settings
from app.core.security import decode_token
from app.services.auth_service import AuthService

security_scheme = HTTPBearer(auto_error=False)

ADMIN_COOKIE_NAME = "pathly_admin_access_token"

async def get_current_user(
    request: Request,
    bearer: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)
) -> Dict[str, Any]:
    """
    Extract JWT access token from HttpOnly cookie or Authorization Bearer header.
    Returns the authenticated user or raises HTTP 401.
    """
    token: Optional[str] = None

    # 1. Check HttpOnly cookie first (secure browser flow)
    if settings.ACCESS_TOKEN_COOKIE_NAME in request.cookies:
        token = request.cookies.get(settings.ACCESS_TOKEN_COOKIE_NAME)

    # 2. Check Bearer authorization header fallback (API / programmatic clients)
    if not token and bearer:
        token = bearer.credentials

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired or token is invalid. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Malformed token claims.",
        )

    user = await AuthService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or account deactivated.",
        )

    return user


async def get_current_admin(
    request: Request,
    bearer: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)
) -> Dict[str, Any]:
    """
    Extract admin JWT token from cookie or header and enforce admin role authorization.
    Rejects unauthorized non-admin users with HTTP 403 Forbidden.
    """
    token: Optional[str] = None

    # 1. Admin cookie
    if ADMIN_COOKIE_NAME in request.cookies:
        token = request.cookies.get(ADMIN_COOKIE_NAME)
    # 2. Fallback to general access token cookie
    elif settings.ACCESS_TOKEN_COOKIE_NAME in request.cookies:
        token = request.cookies.get(settings.ACCESS_TOKEN_COOKIE_NAME)

    # 3. Bearer header
    if not token and bearer:
        token = bearer.credentials

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Administrator authentication required. Please log in to admin panel.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin session expired or invalid. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check role claims
    role = payload.get("role")
    is_admin_claim = payload.get("is_admin", False)
    admin_id = payload.get("sub")

    if not admin_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Malformed admin token claims.",
        )

    # Import AdminService lazily to prevent circular imports
    from app.services.admin_service import AdminService
    admin_user = await AdminService.get_admin_by_id(admin_id)

    if not admin_user:
        # Check if candidate user token was supplied by mistake
        candidate = await AuthService.get_user_by_id(admin_id)
        if candidate and candidate.get("role") not in ["admin", "super_admin"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: Candidate users are not permitted to access administrative resources.",
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin account not found or suspended.",
        )

    if not admin_user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account has been suspended.",
        )

    if admin_user.get("role") not in ["admin", "super_admin"] and not is_admin_claim and role not in ["admin", "super_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Administrative role required.",
        )

    return admin_user


