"""
Pathly Candidate Mentorship Router - /api/v1/mentors
Allows candidate users to browse active mentors and book 1:1 sessions.
"""

import logging
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user
from app.services.admin_service import AdminService
from app.schemas.admin import BookMentorshipRequest

logger = logging.getLogger("pathly.mentors_api")
router = APIRouter(prefix="/mentors", tags=["mentors"])


@router.get("")
async def list_active_mentors(current_user: Dict[str, Any] = Depends(get_current_user)):
    """List all active industry mentors available for 1:1 sessions."""
    return await AdminService.list_mentors(status_filter="active")


@router.get("/my-bookings")
async def get_my_bookings(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieve all mentorship bookings for the logged-in candidate."""
    user_id = str(current_user["id"])
    return await AdminService.get_user_bookings(user_id)


@router.get("/{mentor_id}")
async def get_mentor(mentor_id: str, current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get mentor profile and availability."""
    mentor = await AdminService.get_mentor_by_id(mentor_id)
    if not mentor or mentor.get("status") != "active":
        raise HTTPException(status_code=404, detail="Mentor not found or unavailable")
    return mentor


@router.post("/{mentor_id}/book")
async def book_session(
    mentor_id: str,
    payload: BookMentorshipRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    Book a 1:1 live Google Meet session with an industry mentor.
    Validates slot availability and prevents double booking in MongoDB.
    """
    user_id = str(current_user["id"])
    return await AdminService.book_session(
        user_id=user_id,
        mentor_id=mentor_id,
        data=payload,
    )

