"""
Pydantic Schemas for Pathly Admin Module:
- Admin Login & Profile
- Course Creation & Update
- Mentor Creation & Update
- Mentorship Booking
- Dashboard Statistics & Filter Requests
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, EmailStr


class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminUserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: str
    last_login: Optional[str] = None


class AdminAuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: AdminUserResponse


# ------------------------------------------------------------------------------
# COURSE SCHEMAS
# ------------------------------------------------------------------------------

class CourseLessonSchema(BaseModel):
    id: str
    title: str
    duration: Optional[str] = "15m"
    type: Optional[str] = "video"
    video_url: Optional[str] = None


class CourseModuleSchema(BaseModel):
    id: str
    title: str
    lessons: List[CourseLessonSchema] = []


class CourseCreateRequest(BaseModel):
    title: str = Field(..., min_length=3)
    category: str = "webdev"
    description: str = Field(..., min_length=10)
    skills: List[str] = []
    duration: str = "10 Hours"
    level: str = "Beginner"
    price: str = "Free"
    provider: str = "Pathly Academy"
    instructor: str = "Senior Specialist"
    thumbnail: Optional[str] = ""
    what_you_learn: Optional[List[str]] = []
    modules: Optional[List[Dict[str, Any]]] = []
    status: str = "published"  # 'published', 'draft'


class CourseUpdateRequest(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    skills: Optional[List[str]] = None
    duration: Optional[str] = None
    level: Optional[str] = None
    price: Optional[str] = None
    provider: Optional[str] = None
    instructor: Optional[str] = None
    thumbnail: Optional[str] = None
    what_you_learn: Optional[List[str]] = None
    modules: Optional[List[Dict[str, Any]]] = None
    status: Optional[str] = None


class CourseStatusUpdateRequest(BaseModel):
    status: str  # 'published', 'draft', 'archived'


# ------------------------------------------------------------------------------
# MENTOR SCHEMAS
# ------------------------------------------------------------------------------

class MentorCreateRequest(BaseModel):
    name: str = Field(..., min_length=2)
    role: str = Field(..., min_length=2)
    company: str = Field(..., min_length=2)
    email: Optional[str] = None
    mobile: Optional[str] = None
    skills: List[str] = []
    specialty: List[str] = []
    bio: Optional[str] = ""
    experience: str = "5+ Years"
    languages: Optional[List[str]] = ["English"]
    session_duration: str = "45 mins"
    session_price: str = "Free"
    availability: Optional[List[str]] = None
    meeting_link: Optional[str] = "https://meet.google.com/pat-hly-pro"
    avatar_bg: Optional[str] = "from-[#635BFF] to-[#8B5CF6]"
    photo_url: Optional[str] = ""
    status: str = "active"


class MentorUpdateRequest(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    company: Optional[str] = None
    email: Optional[str] = None
    mobile: Optional[str] = None
    skills: Optional[List[str]] = None
    specialty: Optional[List[str]] = None
    bio: Optional[str] = None
    experience: Optional[str] = None
    languages: Optional[List[str]] = None
    session_duration: Optional[str] = None
    session_price: Optional[str] = None
    availability: Optional[List[str]] = None
    meeting_link: Optional[str] = None
    avatar_bg: Optional[str] = None
    photo_url: Optional[str] = None
    status: Optional[str] = None


class BookMentorshipRequest(BaseModel):
    date: str
    time_slot: str
    topic: Optional[str] = "Career Guidance & Resume Review"


# ------------------------------------------------------------------------------
# USER MANAGEMENT SCHEMAS
# ------------------------------------------------------------------------------

class UserStatusUpdateRequest(BaseModel):
    is_active: bool


# ------------------------------------------------------------------------------
# DASHBOARD STATS SCHEMA
# ------------------------------------------------------------------------------

class DashboardStatsResponse(BaseModel):
    total_users: int
    active_users: int
    total_courses: int
    active_courses: int
    total_mentors: int
    active_mentors: int
    course_enrollments: int
    completed_courses: int
    mentorship_bookings: int
    recent_activity: List[Dict[str, Any]] = []
