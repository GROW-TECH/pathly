import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any, Tuple
from bson import ObjectId
from fastapi import HTTPException, status

from app.core.config import settings
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_refresh_token,
)
from app.db.mongodb import get_database
from app.models.user import UserModel
from app.models.profile import CandidateProfileModel
from app.models.session import AuthSessionModel
from app.schemas.auth import UserSignUpRequest
from app.services.rate_limiter import login_rate_limiter

logger = logging.getLogger("pathly.auth_service")

def to_query_id(val: str) -> Any:
    try:
        return ObjectId(val)
    except Exception:
        return val

class AuthService:
    @staticmethod
    async def register_user(data: UserSignUpRequest) -> Tuple[Dict[str, Any], Dict[str, Any]]:
        db = get_database()
        email_clean = data.email.strip().lower()
        mobile_clean = data.mobile.strip()

        # 1. Check duplicate email
        existing_email = await db.users.find_one({"email": email_clean})
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email address already exists. Please sign in."
            )

        # 2. Check duplicate mobile
        existing_mobile = await db.users.find_one({"mobile": mobile_clean})
        if existing_mobile:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this mobile number already exists. Please sign in."
            )

        # 3. Hash password with bcrypt
        hashed_pw = get_password_hash(data.password)

        # 4. Create user document
        user_doc = UserModel.create_document(
            full_name=data.full_name,
            email=email_clean,
            mobile=mobile_clean,
            hashed_password=hashed_pw,
            career_status=data.career_status or "fresher",
        )
        insert_result = await db.users.insert_one(user_doc)
        user_id = str(insert_result.inserted_id)
        user_doc["_id"] = user_id

        # 5. Create default candidate profile
        profile_doc = CandidateProfileModel.create_default(
            user_id=user_id,
            career_status=data.career_status or "fresher"
        )
        await db.candidate_profiles.insert_one(profile_doc)

        logger.info(f"Registered new candidate user {email_clean} (ID: {user_id})")
        return UserModel.to_response(user_doc), CandidateProfileModel.to_response(profile_doc)

    @staticmethod
    async def register_or_get_google_user(email: str, full_name: str) -> Dict[str, Any]:
        db = get_database()
        email_clean = email.strip().lower()

        existing = await db.users.find_one({"email": email_clean})
        if existing:
            return existing

        user_doc = UserModel.create_document(
            full_name=full_name,
            email=email_clean,
            mobile=f"+google_{email_clean[:10]}",
            hashed_password="",
            career_status="fresher",
        )
        insert_result = await db.users.insert_one(user_doc)
        user_id = str(insert_result.inserted_id)
        user_doc["_id"] = user_id

        profile_doc = CandidateProfileModel.create_default(
            user_id=user_id,
            career_status="fresher"
        )
        await db.candidate_profiles.insert_one(profile_doc)
        logger.info(f"Registered new Google SSO candidate user {email_clean} (ID: {user_id})")
        return user_doc

    @staticmethod
    async def authenticate_user(
        email_or_mobile: str,
        password: str,
        client_ip: str = "127.0.0.1"
    ) -> Dict[str, Any]:
        # 1. Check rate limit
        rate_key = f"{client_ip}:{email_or_mobile.strip().lower()}"
        if login_rate_limiter.is_rate_limited(rate_key):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many failed login attempts. Please wait 5 minutes before trying again."
            )

        db = get_database()
        clean_input = email_or_mobile.strip()

        # 2. Look up by email (case-insensitive) or by mobile
        query = {
            "$or": [
                {"email": clean_input.lower()},
                {"mobile": clean_input}
            ]
        }
        user = await db.users.find_one(query)

        # 3. Verify existence and password
        if not user or not verify_password(password, user.get("hashed_password", "")):
            login_rate_limiter.record_failed_attempt(rate_key)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email/mobile or password. Please check your credentials."
            )

        # 4. Check active status
        if not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This account has been deactivated. Please contact Pathly support."
            )

        # Reset rate limit counter on success
        login_rate_limiter.reset_attempts(rate_key)
        return user

    @staticmethod
    async def create_user_session(
        user_id: str,
        user_agent: Optional[str] = None,
        ip_address: Optional[str] = None
    ) -> Tuple[str, str]:
        """Generate JWT access token and store hashed refresh token session."""
        db = get_database()
        access_token = create_access_token(subject=user_id)
        refresh_token = create_refresh_token(subject=user_id)

        # Hash refresh token before database storage
        rf_hash = hash_refresh_token(refresh_token)
        expires_at = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

        session_doc = AuthSessionModel.create_document(
            user_id=user_id,
            refresh_token_hash=rf_hash,
            expires_at=expires_at,
            user_agent=user_agent,
            ip_address=ip_address
        )
        await db.auth_sessions.insert_one(session_doc)
        return access_token, refresh_token

    @staticmethod
    async def refresh_session(refresh_token: str) -> Tuple[str, str, Dict[str, Any]]:
        """Validate refresh token and issue new rotated tokens."""
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired session token. Please log in again."
            )

        user_id = payload.get("sub")
        rf_hash = hash_refresh_token(refresh_token)
        db = get_database()

        # Check in sessions collection
        session = await db.auth_sessions.find_one({
            "refresh_token_hash": rf_hash,
            "user_id": user_id,
            "is_revoked": False,
        })
        if not session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session has been revoked or expired. Please sign in."
            )

        # Invalidate old session (token rotation for security)
        await db.auth_sessions.update_one(
            {"_id": session["_id"]},
            {"$set": {"is_revoked": True, "updated_at": datetime.utcnow()}}
        )

        # Fetch active user
        user = await db.users.find_one({"_id": to_query_id(user_id)})
        if not user or not user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account no longer active."
            )

        # Issue new token pair
        new_access_token, new_refresh_token = await AuthService.create_user_session(
            user_id=user_id,
            user_agent=session.get("user_agent"),
            ip_address=session.get("ip_address"),
        )
        return new_access_token, new_refresh_token, UserModel.to_response(user)

    @staticmethod
    async def revoke_session(refresh_token: str) -> None:
        """Revoke the refresh session token on logout."""
        if not refresh_token:
            return
        rf_hash = hash_refresh_token(refresh_token)
        db = get_database()
        await db.auth_sessions.update_many(
            {"refresh_token_hash": rf_hash},
            {"$set": {"is_revoked": True, "updated_at": datetime.utcnow()}}
        )

    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
        db = get_database()
        user = await db.users.find_one({"_id": to_query_id(user_id)})
        if user and user.get("is_active", True):
            return UserModel.to_response(user)
        return None

