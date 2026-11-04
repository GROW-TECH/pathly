"""
Pydantic Schemas for Skills Roadmap & Learning API.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class CourseProgressUpdateRequest(BaseModel):
    module_id: Optional[str] = Field(None, description="Module identifier (e.g. m1)")
    lesson_id: Optional[str] = Field(None, description="Lesson identifier (e.g. m1-l2)")
    completed: bool = Field(True, description="Mark as completed or incompleted")

class CourseProgressResponse(BaseModel):
    id: str
    user_id: str
    course_id: str
    completed_modules: List[str]
    completed_lessons: List[str]
    total_lessons: int
    progress_percentage: int
    status: str
    enrolled_at: str
    last_accessed_at: str
    completed_at: Optional[str] = None

class MilestoneItem(BaseModel):
    id: str
    title: str
    skills: List[str] = []
    status: str  # "completed" | "current" | "upcoming"
    course_id: Optional[str] = None
    project: Optional[str] = None
    completed_at: Optional[str] = None

class RoadmapStageItem(BaseModel):
    stage_id: str
    level: str  # "Beginner" | "Intermediate" | "Advanced"
    title: str
    description: str
    estimated_duration: str
    focus_skills: List[str] = []
    progress: int = 0
    milestones: List[MilestoneItem] = []
    matched_course_id: Optional[str] = None

class UserRoadmapResponse(BaseModel):
    id: str
    user_id: str
    target_role: str
    title: str
    description: str
    icon_type: str = "tech"
    progress: int = 0
    overall_progress: int = 0
    total_milestones: int = 0
    completed_milestones: int = 0
    milestones: List[MilestoneItem] = []
    stages: List[RoadmapStageItem] = []
    course_id: Optional[str] = None
    course_title: Optional[str] = None
    created_at: str
    updated_at: str

class ToggleMilestoneRequest(BaseModel):
    stage_id: Optional[str] = None
    milestone_id: str
    completed: bool

class LearningDashboardSummary(BaseModel):
    active_courses_count: int
    completed_courses_count: int
    skills_improved_count: int
    overall_progress_percentage: int
    active_courses: List[Dict[str, Any]]
    completed_courses: List[Dict[str, Any]]
    skills_improved: List[str]
    upcoming_milestone: Optional[Dict[str, Any]] = None

class SavedCourseResponse(BaseModel):
    id: str
    user_id: str
    course_id: str
    saved_at: str
    course_details: Optional[Dict[str, Any]] = None

class ToggleSaveCourseResponse(BaseModel):
    course_id: str
    is_saved: bool
    message: str
