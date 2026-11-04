from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

class SkillItem(BaseModel):
    name: str
    level: str = "Beginner"  # "Beginner" | "Intermediate" | "Advanced"
    category: Optional[str] = "general"

class ExperienceItem(BaseModel):
    title: str
    company: str
    duration: Optional[str] = ""
    description: Optional[str] = ""

class EducationItem(BaseModel):
    degree: str
    institution: str
    year: Optional[str] = ""

class CandidateProfileBase(BaseModel):
    career_status: Optional[str] = "fresher"
    target_role: Optional[str] = "Frontend Engineer"
    experience_years: Optional[str] = "0"
    preferred_locations: List[str] = Field(default_factory=list)
    preferred_work_modes: List[str] = Field(default_factory=list)
    gov_exam_scope: Optional[str] = "all"
    interests: List[str] = Field(default_factory=list)
    skills: List[SkillItem] = Field(default_factory=list)
    bio: Optional[str] = ""
    headline: Optional[str] = ""
    education: List[EducationItem] = Field(default_factory=list)
    experience: List[ExperienceItem] = Field(default_factory=list)
    resume_name: Optional[str] = "Alex_Morgan_Resume.pdf"
    resume_url: Optional[str] = None
    ats_score: Optional[int] = 78

class CandidateProfileUpdate(CandidateProfileBase):
    pass

class CandidateProfileResponse(CandidateProfileBase):
    user_id: str
    profile_completion_percentage: int = 40
    updated_at: datetime = Field(default_factory=datetime.utcnow)

