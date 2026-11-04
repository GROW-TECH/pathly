from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator
import re

class UserSignUpRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100, description="Candidate full name")
    email: EmailStr = Field(..., description="Valid candidate email address")
    mobile: str = Field(..., description="10-digit mobile number")
    password: str = Field(..., min_length=6, max_length=128, description="Account password (min 6 characters)")
    career_status: Optional[str] = Field("fresher", description="'fresher' or 'experienced'")

    @field_validator("mobile")
    @classmethod
    def validate_mobile(cls, v: str) -> str:
        clean = re.sub(r"\D", "", v)
        if len(clean) == 10 and clean[0] in "6789":
            return clean
        if len(clean) > 10 and clean[-10] in "6789":
            return clean[-10:]
        raise ValueError("Please enter a valid 10-digit mobile phone number")

    @field_validator("career_status")
    @classmethod
    def validate_career_status(cls, v: Optional[str]) -> Optional[str]:
        if v and v.lower() not in ("fresher", "experienced"):
            return "fresher"
        return v.lower() if v else "fresher"

class UserLoginRequest(BaseModel):
    email: str = Field(..., description="Email address or registered mobile number")
    password: str = Field(..., min_length=1, description="Account password")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

class MessageResponse(BaseModel):
    success: bool = True
    message: str

