import logging
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import HTTPException, status

from app.db.mongodb import get_database
from app.models.profile import CandidateProfileModel
from app.schemas.profile import CandidateProfileUpdate

logger = logging.getLogger("pathly.profile_service")

class ProfileService:
    @staticmethod
    async def get_profile(user_id: str) -> Dict[str, Any]:
        db = get_database()
        profile = await db.candidate_profiles.find_one({"user_id": str(user_id)})
        if not profile:
            # Create default profile for this user if it doesn't exist
            profile = CandidateProfileModel.create_default(user_id=user_id)
            await db.candidate_profiles.insert_one(profile)
        return CandidateProfileModel.to_response(profile)

    @staticmethod
    async def update_profile(user_id: str, data: CandidateProfileUpdate) -> Dict[str, Any]:
        db = get_database()
        existing = await db.candidate_profiles.find_one({"user_id": str(user_id)})
        if not existing:
            existing = CandidateProfileModel.create_default(user_id=user_id)

        update_dict = data.model_dump(exclude_unset=True)

        # Merge fields
        for key, val in update_dict.items():
            if val is not None:
                existing[key] = val

        # Recalculate completion score
        existing["profile_completion_percentage"] = CandidateProfileModel.calculate_completion(existing)
        existing["updated_at"] = datetime.utcnow()

        await db.candidate_profiles.update_one(
            {"user_id": str(user_id)},
            {"$set": existing},
            upsert=True
        )

        # Sync career_status to user record if modified
        if "career_status" in update_dict and update_dict["career_status"]:
            from app.services.auth_service import to_query_id
            await db.users.update_one(
                {"_id": to_query_id(user_id)},
                {"$set": {"career_status": update_dict["career_status"], "updated_at": datetime.utcnow()}}
            )

        logger.info(f"Updated candidate profile for user {user_id} (Score: {existing['profile_completion_percentage']}%)")
        return CandidateProfileModel.to_response(existing)

