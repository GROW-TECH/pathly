"""
Pydantic Schemas for AI Career Assistant API requests and responses.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class CourseRecommendationItem(BaseModel):
    id: str
    title: str
    provider: str
    level: str
    duration: str
    skills: List[str]
    description: str
    price: str
    rating: float
    why_recommended: str

class ChatMessageRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000, description="User prompt or career question")
    conversation_id: Optional[str] = Field(None, description="Existing conversation ID for multi-turn context")
    stream: bool = Field(False, description="Whether to stream the response via Server-Sent Events (SSE)")

class ChatMessageResponse(BaseModel):
    id: str
    conversation_id: str
    sender: str
    text: str
    course_recommendations: List[CourseRecommendationItem] = []
    roadmap: Optional[Dict[str, Any]] = None
    created_at: str
    feedback: Optional[str] = None

class ChatResponse(BaseModel):
    conversation_id: str
    message: ChatMessageResponse

class ConversationSummary(BaseModel):
    id: str
    user_id: str
    title: str
    message_count: int
    created_at: str
    updated_at: str

class ConversationDetail(BaseModel):
    conversation: ConversationSummary
    messages: List[ChatMessageResponse]

class FeedbackRequest(BaseModel):
    feedback: Optional[str] = Field(None, description="'up', 'down', or null to clear")

class SkillGapRequest(BaseModel):
    target_role: Optional[str] = Field(None, description="Target role e.g. 'Frontend Developer'")
    skills: Optional[List[str]] = Field(None, description="Optional override list of current skills")

class SkillGapResponse(BaseModel):
    id: str
    user_id: str
    target_role: str
    readiness_score: int
    existing_strengths: List[str]
    missing_skills: List[str]
    priority_skills: List[str]
    recommended_courses: List[CourseRecommendationItem]
    project_suggestions: List[str]
    summary: str
    created_at: str

class CourseRecommendationRequest(BaseModel):
    skills: Optional[List[str]] = Field(None, description="Current skills or topics")
    career_goal: Optional[str] = Field(None, description="Target career role or goal")
    limit: int = Field(4, ge=1, le=10)

class CourseRecommendationResponse(BaseModel):
    courses: List[CourseRecommendationItem]
    summary: str

class RoadmapStageItem(BaseModel):
    stage_number: int
    title: str
    focus_skills: List[str]
    action_items: List[str]
    matched_course_ids: List[str] = []
    courses: List[CourseRecommendationItem] = []

class LearningRoadmapRequest(BaseModel):
    goal: str = Field(..., min_length=2, max_length=200, description="Learning goal e.g. 'Become a Frontend Developer'")
    duration_weeks: int = Field(4, ge=1, le=24, description="Target timeline in weeks")

class LearningRoadmapResponse(BaseModel):
    id: str
    user_id: str
    goal: str
    duration_weeks: int
    stages: List[RoadmapStageItem]
    notes: Optional[str] = ""
    created_at: str
    updated_at: str
