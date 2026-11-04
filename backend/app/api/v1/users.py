from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import get_current_user
from app.schemas.profile import CandidateProfileResponse, CandidateProfileUpdate
from app.services.profile_service import ProfileService

router = APIRouter(prefix="/user", tags=["Candidate Profile"])

@router.get(
    "/profile",
    response_model=CandidateProfileResponse,
    summary="Get candidate's career profile"
)
async def get_candidate_profile(
    current_user: dict = Depends(get_current_user),
):
    """
    Fetch the persistent profile for the currently logged-in candidate.
    Only the profile owner can access this data.
    """
    user_id = current_user["id"]
    profile_dict = await ProfileService.get_profile(user_id)
    return CandidateProfileResponse(**profile_dict)

@router.put(
    "/profile",
    response_model=CandidateProfileResponse,
    summary="Update candidate's career profile"
)
async def update_candidate_profile(
    data: CandidateProfileUpdate,
    current_user: dict = Depends(get_current_user),
):
    """
    Update skills, interests, target role, work preferences, and bio.
    Immediately persists changes to MongoDB and recalculates completion percentage.
    """
    user_id = current_user["id"]
    updated_profile = await ProfileService.update_profile(user_id, data)
    return CandidateProfileResponse(**updated_profile)

