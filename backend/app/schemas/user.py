from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.schemas.profile import CandidateProfileResponse

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    mobile: str
    career_status: Optional[str] = "fresher"
    is_active: bool = True
    created_at: datetime

class AuthUserResponse(BaseModel):
    user: UserResponse
    profile: Optional[CandidateProfileResponse] = None

