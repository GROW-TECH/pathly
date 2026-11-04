"""
Pathly Skills Roadmap & Learning API Endpoints.
All endpoints require authentication and enforce user data authorization.
"""

import logging
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user
from app.schemas.learning import (
    LearningDashboardSummary,
    UserRoadmapResponse,
    ToggleMilestoneRequest,
    CourseProgressUpdateRequest,
    CourseProgressResponse,
    SavedCourseResponse,
    ToggleSaveCourseResponse,
)
from app.services.learning_service import LearningService

logger = logging.getLogger("pathly.learning_api")

router = APIRouter(prefix="/learning", tags=["Skills Roadmap & Learning"])

@router.get("/dashboard", response_model=LearningDashboardSummary)
async def get_learning_dashboard(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Retrieve full learning dashboard metrics, active courses, and upcoming milestone."""
    user_id = str(current_user["id"])
    try:
        return await LearningService.get_dashboard_summary(user_id)
    except Exception as e:
        logger.error(f"Error fetching learning dashboard: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch learning dashboard: {str(e)}",
        )

@router.get("/roadmap", response_model=UserRoadmapResponse)
async def get_user_roadmap(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Get the user's current personalized 3-stage skills roadmap (Beginner, Intermediate, Advanced)."""
    user_id = str(current_user["id"])
    try:
        return await LearningService.get_or_create_user_roadmap(user_id)
    except Exception as e:
        logger.error(f"Error retrieving user roadmap: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load career roadmap: {str(e)}",
        )

@router.post("/roadmap/generate", response_model=UserRoadmapResponse)
async def generate_user_roadmap(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Regenerate/refresh the user's career roadmap based on their latest skills and career goals."""
    user_id = str(current_user["id"])
    try:
        return await LearningService.generate_ai_roadmap(user_id)
    except Exception as e:
        logger.error(f"Error generating roadmap: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate career roadmap: {str(e)}",
        )

@router.post("/roadmap/milestones/{milestone_id}/toggle", response_model=UserRoadmapResponse)
async def toggle_milestone(
    milestone_id: str,
    payload: ToggleMilestoneRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Mark a roadmap milestone as completed or in-progress, updating stage and overall progress."""
    user_id = str(current_user["id"])
    try:
        return await LearningService.toggle_roadmap_milestone(
            user_id=user_id,
            milestone_id=milestone_id,
            completed=payload.completed,
            stage_id=payload.stage_id,
        )
    except Exception as e:
        logger.error(f"Error toggling milestone {milestone_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update milestone: {str(e)}",
        )

@router.get("/courses")
async def get_all_courses(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """List all available Pathly courses enriched with the user's real progress and saved status."""
    user_id = str(current_user["id"])
    try:
        return await LearningService.get_all_courses_enriched(user_id)
    except Exception as e:
        logger.error(f"Error fetching enriched courses: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch courses: {str(e)}",
        )

@router.get("/courses/{course_id}")
async def get_course_by_id_endpoint(
    course_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Retrieve details for a single course from MongoDB."""
    user_id = str(current_user["id"])
    try:
        from app.db.mongodb import get_database
        db = get_database()
        doc = await db.courses.find_one({"$or": [{"_id": course_id}, {"id": course_id}]})
        if not doc:
            from app.core.courses_catalog import get_course_by_id
            doc = get_course_by_id(course_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Course not found")

        doc_copy = dict(doc)
        doc_copy["id"] = str(doc_copy.get("id") or doc_copy.get("_id"))
        return doc_copy
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching course {course_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch course: {str(e)}",
        )


@router.post("/courses/{course_id}/enroll", response_model=CourseProgressResponse)
async def enroll_course(
    course_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Enroll the user in a course and initialize progress tracking."""
    user_id = str(current_user["id"])
    try:
        return await LearningService.enroll_course(user_id, course_id)
    except Exception as e:
        logger.error(f"Error enrolling in course {course_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to enroll in course: {str(e)}",
        )

@router.post("/courses/{course_id}/progress", response_model=CourseProgressResponse)
async def update_course_progress(
    course_id: str,
    payload: CourseProgressUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Mark a lesson or module as completed/incompleted and recalculate actual percentage."""
    user_id = str(current_user["id"])
    try:
        return await LearningService.update_course_progress(
            user_id=user_id,
            course_id=course_id,
            module_id=payload.module_id,
            lesson_id=payload.lesson_id,
            completed=payload.completed,
        )
    except Exception as e:
        logger.error(f"Error updating progress for course {course_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update course progress: {str(e)}",
        )

@router.get("/saved", response_model=List[SavedCourseResponse])
async def get_saved_courses(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Retrieve all courses bookmarked by the user."""
    user_id = str(current_user["id"])
    try:
        return await LearningService.get_saved_courses(user_id)
    except Exception as e:
        logger.error(f"Error fetching saved courses: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch saved courses: {str(e)}",
        )

@router.post("/saved/{course_id}", response_model=ToggleSaveCourseResponse)
async def toggle_save_course(
    course_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Bookmark or remove bookmark for a course."""
    user_id = str(current_user["id"])
    try:
        return await LearningService.toggle_save_course(user_id, course_id)
    except Exception as e:
        logger.error(f"Error toggling save on course {course_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save course: {str(e)}",
        )

@router.get("/recommendations")
async def get_recommended_courses(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Get personalized course recommendations addressing skill gaps, prioritizing free courses."""
    user_id = str(current_user["id"])
    try:
        return await LearningService.get_gap_recommendations(user_id)
    except Exception as e:
        logger.error(f"Error getting recommendations: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch course recommendations: {str(e)}",
        )
