"""
Pathly Admin REST API Router - /api/v1/admin
Protected endpoints for platform administrators with role-based access control.
"""

import logging
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Query

from app.api.deps import get_current_admin, ADMIN_COOKIE_NAME
from app.core.config import settings
from app.services.admin_service import AdminService
from app.schemas.admin import (
    AdminLoginRequest,
    AdminAuthResponse,
    AdminUserResponse,
    CourseCreateRequest,
    CourseUpdateRequest,
    CourseStatusUpdateRequest,
    MentorCreateRequest,
    MentorUpdateRequest,
    UserStatusUpdateRequest,
    DashboardStatsResponse,
)

logger = logging.getLogger("pathly.admin_api")
router = APIRouter(prefix="/admin", tags=["admin"])


# ------------------------------------------------------------------------------
# 1. ADMIN AUTHENTICATION
# ------------------------------------------------------------------------------

@router.post("/auth/login", response_model=AdminAuthResponse)
async def admin_login(payload: AdminLoginRequest, response: Response):
    """
    Authenticate an administrator and issue JWT access token.
    Sets HttpOnly cookie 'pathly_admin_access_token' and returns auth payload.
    """
    admin_info, token = await AdminService.authenticate_admin(payload)

    # Set HttpOnly cookie for admin session
    response.set_cookie(
        key=ADMIN_COOKIE_NAME,
        value=token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/",
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "admin": admin_info,
    }


@router.get("/auth/me", response_model=AdminUserResponse)
async def get_admin_me(current_admin: Dict[str, Any] = Depends(get_current_admin)):
    """Return currently logged-in administrator profile."""
    return current_admin


@router.post("/auth/logout")
async def admin_logout(response: Response):
    """Clear admin session cookie."""
    response.delete_cookie(key=ADMIN_COOKIE_NAME, path="/")
    return {"message": "Admin signed out successfully."}


# ------------------------------------------------------------------------------
# 2. DASHBOARD METRICS & STATS
# ------------------------------------------------------------------------------

@router.get("/dashboard/stats", response_model=DashboardStatsResponse)
async def get_dashboard_statistics(current_admin: Dict[str, Any] = Depends(get_current_admin)):
    """Fetch live counts and activity streams from MongoDB."""
    return await AdminService.get_dashboard_stats()


# ------------------------------------------------------------------------------
# 3. COURSE MANAGEMENT
# ------------------------------------------------------------------------------

@router.get("/courses")
async def list_admin_courses(
    status: Optional[str] = Query(None, description="Filter by status (published, draft, archived, all)"),
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search courses by keyword"),
    current_admin: Dict[str, Any] = Depends(get_current_admin),
):
    """List all courses in MongoDB with filtering and search."""
    return await AdminService.list_courses(status_filter=status, category_filter=category, search=search)


@router.post("/courses", status_code=status.HTTP_201_CREATED)
async def create_course(
    payload: CourseCreateRequest,
    current_admin: Dict[str, Any] = Depends(get_current_admin),
):
    """Create a new course in MongoDB."""
    return await AdminService.create_course(payload)


@router.get("/courses/{course_id}")
async def get_course_detail(
    course_id: str,
    current_admin: Dict[str, Any] = Depends(get_current_admin),
):
    """Get complete course details."""
    course = await AdminService.get_course_by_id(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.put("/courses/{course_id}")
async def update_course(
    course_id: str,
    payload: CourseUpdateRequest,
    current_admin: Dict[str, Any] = Depends(get_current_admin),
):
    """Update existing course fields."""
    return await AdminService.update_course(course_id, payload)


@router.patch("/courses/{course_id}/status")
async def update_course_status(
    course_id: str,
    payload: CourseStatusUpdateRequest,
    current_admin: Dict[str, Any] = Depends(get_current_admin),
):
    """Toggle course publishing status (published, draft, archived)."""
    return await AdminService.update_course_status(course_id, payload.status)


@router.delete("/courses/{course_id}")
async def delete_course(
    course_id: str,
    current_admin: Dict[str, Any] = Depends(get_current_admin),
):
    """Permanently delete or archive a course."""
    success = await AdminService.delete_course(course_id)
    if not success:
        raise HTTPException(status_code=404, detail="Course not found or could not be deleted")
    return {"message": "Course deleted successfully", "course_id": course_id}


# ------------------------------------------------------------------------------
# 4. MENTOR MANAGEMENT
# ------------------------------------------------------------------------------

@router.get("/mentors")
async def list_admin_mentors(
    status: Optional[str] = Query(None, description="Filter by status (active, inactive, all)"),
    search: Optional[str] = Query(None, description="Search mentors by name/skill"),
    current_admin: Dict[str, Any] = Depends(get_current_admin),
):
    """List all industry mentors in MongoDB."""
    return await AdminService.list_mentors(status_filter=status, search=search)


@router.post("/mentors", status_code=status.HTTP_201_CREATED)
async def create_mentor(
    payload: MentorCreateRequest,
    current_admin: Dict[str, Any] = Depends(get_current_admin),
):
    """Add a new industry mentor."""
    return await AdminService.create_mentor(payload)


@router.get("/mentors/{mentor_id}")
async def get_mentor_detail(
    mentor_id: str,
    current_admin: Dict[str, Any] = Depends(get_current_admin),
):
    """Get mentor details."""
    mentor = await AdminService.get_mentor_by_id(mentor_id)
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    return mentor


@router.put("/mentors/{mentor_id}")
async def update_mentor(
    mentor_id: str,
    payload: MentorUpdateRequest,
    current_admin: Dict[str, Any] = Depends(get_current_admin),
):
    """Update mentor fields."""
    return await AdminService.update_mentor(mentor_id, payload)


@router.delete("/mentors/{mentor_id}")
async def delete_mentor(
    mentor_id: str,
    current_admin: Dict[str, Any] = Depends(get_current_admin),
):
    """Delete a mentor from the platform."""
    success = await AdminService.delete_mentor(mentor_id)
    if not success:
        raise HTTPException(status_code=404, detail="Mentor not found")
    return {"message": "Mentor deleted successfully", "mentor_id": mentor_id}


# ------------------------------------------------------------------------------
# 5. REGISTERED USER ADMINISTRATION
# ------------------------------------------------------------------------------

@router.get("/users")
async def list_registered_users(
    search: Optional[str] = Query(None, description="Search by name, email, or mobile"),
    status: Optional[str] = Query(None, description="Filter by status (active, inactive, all)"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_admin: Dict[str, Any] = Depends(get_current_admin),
):
    """Paginated list of actual registered users from MongoDB with profile details."""
    return await AdminService.list_registered_users(
        search=search,
        status_filter=status,
        page=page,
        page_size=page_size,
    )


@router.get("/users/{user_id}")
async def get_user_detail(
    user_id: str,
    current_admin: Dict[str, Any] = Depends(get_current_admin),
):
    """Fetch complete user profile, enrolled courses, roadmap, and bookings."""
    return await AdminService.get_user_full_detail(user_id)


@router.patch("/users/{user_id}/status")
async def update_user_status(
    user_id: str,
    payload: UserStatusUpdateRequest,
    current_admin: Dict[str, Any] = Depends(get_current_admin),
):
    """Activate or deactivate a candidate account."""
    return await AdminService.update_user_status(user_id, payload.is_active)


# ------------------------------------------------------------------------------
# 6. ENROLLMENTS & MENTORSHIP SESSIONS
# ------------------------------------------------------------------------------

@router.get("/enrollments")
async def list_enrollments(current_admin: Dict[str, Any] = Depends(get_current_admin)):
    """List all real course enrollments with user and course information."""
    return await AdminService.list_all_enrollments()


@router.get("/mentorship-sessions")
async def list_mentorship_sessions(current_admin: Dict[str, Any] = Depends(get_current_admin)):
    """List all 1:1 mentorship bookings with schedule and meeting details."""
    return await AdminService.list_mentorship_bookings()


# ------------------------------------------------------------------------------
# 7. REPORTS & ANALYTICS
# ------------------------------------------------------------------------------

@router.get("/reports")
async def get_reports(current_admin: Dict[str, Any] = Depends(get_current_admin)):
    """System analytics: category distributions, completion rates, and user growth."""
    return await AdminService.get_reports()


@router.get("/analytics")
async def get_bi_analytics(
    days: str = Query("30", description="Timeframe filter: 7, 30, 90, 365, all"),
    current_admin: Dict[str, Any] = Depends(get_current_admin),
):
    """
    Comprehensive interactive business intelligence analytics across
    users, courses, enrollments, and mentorship.
    """
    return await AdminService.get_bi_analytics(days=days)


