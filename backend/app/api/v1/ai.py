"""
Pathly AI Career Assistant API Endpoints.
Provides chat, conversation management, skill gap analysis, course recommendations, and learning roadmaps.
All endpoints require authentication and enforce user data authorization.
"""

import logging
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse

from app.api.deps import get_current_user
from app.db.mongodb import get_database
from app.schemas.ai import (
    ChatMessageRequest,
    ChatMessageResponse,
    ChatResponse,
    ConversationSummary,
    ConversationDetail,
    FeedbackRequest,
    SkillGapRequest,
    SkillGapResponse,
    CourseRecommendationRequest,
    CourseRecommendationResponse,
    CourseRecommendationItem,
    LearningRoadmapRequest,
    LearningRoadmapResponse,
)
from app.services.ai_service import AIService, AIConfigurationError
from app.models.ai import (
    AIConversationModel,
    AIMessageModel,
    AISkillGapModel,
    AILearningRoadmapModel,
)
from app.core.courses_catalog import find_courses_for_skills_or_query

logger = logging.getLogger("pathly.ai_api")

router = APIRouter(prefix="/ai", tags=["AI Career Assistant"])

@router.post("/chat", response_model=ChatResponse)
async def chat(
    payload: ChatMessageRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    Send a message to the AI Career Assistant.
    Supports multi-turn memory, profile personalization, and course recommendations.
    If stream=True, returns text/event-stream SSE.
    """
    user_id = str(current_user["id"])

    if payload.stream:
        try:
            return StreamingResponse(
                AIService.chat_stream(
                    user_id=user_id,
                    user_text=payload.message,
                    conversation_id=payload.conversation_id,
                ),
                media_type="text/event-stream",
                headers={
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                    "X-Accel-Buffering": "no",
                },
            )
        except AIConfigurationError as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=str(e),
            )
        except Exception as e:
            logger.error(f"Chat streaming error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"AI service error: {str(e)}",
            )

    try:
        result = await AIService.chat(
            user_id=user_id,
            user_text=payload.message,
            conversation_id=payload.conversation_id,
        )
        return result
    except AIConfigurationError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI service error: {str(e)}",
        )

@router.get("/conversations", response_model=List[ConversationSummary])
async def list_conversations(
    current_user: Dict[str, Any] = Depends(get_current_user),
    limit: int = Query(20, ge=1, le=50),
):
    """List all AI conversations for the current authenticated user."""
    db = get_database()
    user_id = str(current_user["id"])
    cursor = db.ai_conversations.find({"user_id": user_id}).sort("updated_at", -1).limit(limit)
    convs = await cursor.to_list(length=limit)
    return [AIConversationModel.to_response(c) for c in convs]

@router.get("/conversations/{conversation_id}", response_model=ConversationDetail)
async def get_conversation(
    conversation_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Retrieve full conversation history and messages for a specific conversation."""
    db = get_database()
    user_id = str(current_user["id"])
    
    conv = await db.ai_conversations.find_one({"id": conversation_id, "user_id": user_id})
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found or access denied.",
        )

    msg_cursor = db.ai_messages.find({"conversation_id": conversation_id}).sort("created_at", 1)
    msg_docs = await msg_cursor.to_list(length=100)

    return {
        "conversation": AIConversationModel.to_response(conv),
        "messages": [AIMessageModel.to_response(m) for m in msg_docs],
    }

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Delete a conversation and all its messages."""
    db = get_database()
    user_id = str(current_user["id"])
    
    conv = await db.ai_conversations.find_one({"id": conversation_id, "user_id": user_id})
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found or access denied.",
        )

    await db.ai_conversations.delete_one({"id": conversation_id})
    await db.ai_messages.delete_many({"conversation_id": conversation_id})

    return {"message": "Conversation deleted successfully", "id": conversation_id}

@router.post("/messages/{message_id}/feedback")
async def message_feedback(
    message_id: str,
    payload: FeedbackRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Save thumbs up / thumbs down feedback on an AI message."""
    db = get_database()
    user_id = str(current_user["id"])
    
    msg = await db.ai_messages.find_one({"id": message_id, "user_id": user_id})
    if not msg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found or access denied.",
        )

    await db.ai_messages.update_one(
        {"id": message_id},
        {"$set": {"feedback": payload.feedback}}
    )
    return {"message": "Feedback recorded", "id": message_id, "feedback": payload.feedback}

@router.post("/skill-gap", response_model=SkillGapResponse)
async def skill_gap_analysis(
    payload: SkillGapRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Perform a skill gap analysis against user profile and target role."""
    user_id = str(current_user["id"])
    try:
        result = await AIService.analyze_skill_gap(
            user_id=user_id,
            target_role=payload.target_role,
            custom_skills=payload.skills,
        )
        return result
    except Exception as e:
        logger.error(f"Skill gap analysis error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate skill gap analysis: {str(e)}",
        )

@router.post("/recommend-courses", response_model=CourseRecommendationResponse)
async def recommend_courses(
    payload: CourseRecommendationRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Recommend relevant Pathly courses based on candidate skills and career goal."""
    user_id = str(current_user["id"])
    profile = await AIService.get_user_profile(user_id)

    query_skills = payload.skills or [
        s.get("name") if isinstance(s, dict) else str(s)
        for s in profile.get("skills", [])
    ]
    if payload.career_goal:
        query_skills.append(payload.career_goal)
    else:
        query_skills.append(profile.get("target_role", "Frontend"))

    matched = find_courses_for_skills_or_query(query_skills)[:payload.limit]
    
    courses_result = []
    for c in matched:
        c_copy = dict(c)
        c_copy["why_recommended"] = f"Matches your target skill focus ({c['title']})."
        courses_result.append(c_copy)

    summary = f"Found {len(courses_result)} tailored Pathly courses to accelerate your career progression."
    return {"courses": courses_result, "summary": summary}

@router.post("/learning-roadmap", response_model=LearningRoadmapResponse)
async def create_learning_roadmap(
    payload: LearningRoadmapRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Generate and persist a structured learning roadmap for a career goal."""
    user_id = str(current_user["id"])
    try:
        roadmap = await AIService.generate_learning_roadmap(
            user_id=user_id,
            goal=payload.goal,
            duration_weeks=payload.duration_weeks,
        )
        return roadmap
    except Exception as e:
        logger.error(f"Learning roadmap creation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create learning roadmap: {str(e)}",
        )

@router.get("/learning-roadmaps", response_model=List[LearningRoadmapResponse])
async def list_learning_roadmaps(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """List saved learning roadmaps for the current authenticated user."""
    db = get_database()
    user_id = str(current_user["id"])
    cursor = db.ai_learning_roadmaps.find({"user_id": user_id}).sort("updated_at", -1)
    roadmaps = await cursor.to_list(length=20)
    return [AILearningRoadmapModel.to_response(r) for r in roadmaps]

