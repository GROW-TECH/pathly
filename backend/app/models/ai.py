"""
MongoDB Data Models & Document Converters for AI Career Assistant.
Handles ai_conversations, ai_messages, ai_skill_gap_analyses, and ai_learning_roadmaps.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
import uuid

class AIConversationModel:
    @staticmethod
    def create(user_id: str, title: Optional[str] = None) -> Dict[str, Any]:
        now = datetime.utcnow()
        conv_id = f"conv_{uuid.uuid4().hex[:12]}"
        return {
            "_id": conv_id,
            "id": conv_id,
            "user_id": str(user_id),
            "title": title or "Career Discussion",
            "message_count": 0,
            "created_at": now,
            "updated_at": now,
        }

    @staticmethod
    def to_response(doc: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "id": str(doc.get("id") or doc.get("_id")),
            "user_id": str(doc.get("user_id")),
            "title": doc.get("title", "Career Discussion"),
            "message_count": doc.get("message_count", 0),
            "created_at": doc.get("created_at", datetime.utcnow()).isoformat() if isinstance(doc.get("created_at"), datetime) else str(doc.get("created_at")),
            "updated_at": doc.get("updated_at", datetime.utcnow()).isoformat() if isinstance(doc.get("updated_at"), datetime) else str(doc.get("updated_at")),
        }

class AIMessageModel:
    @staticmethod
    def create(
        conversation_id: str,
        user_id: str,
        sender: str,
        text: str,
        course_recommendations: Optional[List[Dict[str, Any]]] = None,
        roadmap: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        now = datetime.utcnow()
        msg_id = f"msg_{uuid.uuid4().hex[:12]}"
        return {
            "_id": msg_id,
            "id": msg_id,
            "conversation_id": conversation_id,
            "user_id": str(user_id),
            "sender": sender,  # "user" | "ai"
            "text": text,
            "course_recommendations": course_recommendations or [],
            "roadmap": roadmap,
            "feedback": None,  # "up" | "down" | None
            "created_at": now,
        }

    @staticmethod
    def to_response(doc: Dict[str, Any]) -> Dict[str, Any]:
        created = doc.get("created_at", datetime.utcnow())
        created_str = created.isoformat() if isinstance(created, datetime) else str(created)
        return {
            "id": str(doc.get("id") or doc.get("_id")),
            "conversation_id": doc.get("conversation_id"),
            "sender": doc.get("sender"),
            "text": doc.get("text", ""),
            "course_recommendations": doc.get("course_recommendations", []),
            "roadmap": doc.get("roadmap"),
            "feedback": doc.get("feedback"),
            "created_at": created_str,
        }

class AISkillGapModel:
    @staticmethod
    def create(
        user_id: str,
        target_role: str,
        readiness_score: int,
        existing_strengths: List[str],
        missing_skills: List[str],
        priority_skills: List[str],
        recommended_courses: List[Dict[str, Any]],
        project_suggestions: List[str],
        summary: str,
    ) -> Dict[str, Any]:
        now = datetime.utcnow()
        analysis_id = f"gap_{uuid.uuid4().hex[:12]}"
        return {
            "_id": analysis_id,
            "id": analysis_id,
            "user_id": str(user_id),
            "target_role": target_role,
            "readiness_score": readiness_score,
            "existing_strengths": existing_strengths,
            "missing_skills": missing_skills,
            "priority_skills": priority_skills,
            "recommended_courses": recommended_courses,
            "project_suggestions": project_suggestions,
            "summary": summary,
            "created_at": now,
        }

    @staticmethod
    def to_response(doc: Dict[str, Any]) -> Dict[str, Any]:
        created = doc.get("created_at", datetime.utcnow())
        return {
            "id": str(doc.get("id") or doc.get("_id")),
            "user_id": str(doc.get("user_id")),
            "target_role": doc.get("target_role"),
            "readiness_score": doc.get("readiness_score", 0),
            "existing_strengths": doc.get("existing_strengths", []),
            "missing_skills": doc.get("missing_skills", []),
            "priority_skills": doc.get("priority_skills", []),
            "recommended_courses": doc.get("recommended_courses", []),
            "project_suggestions": doc.get("project_suggestions", []),
            "summary": doc.get("summary", ""),
            "created_at": created.isoformat() if isinstance(created, datetime) else str(created),
        }

class AILearningRoadmapModel:
    @staticmethod
    def create(
        user_id: str,
        goal: str,
        duration_weeks: int,
        stages: List[Dict[str, Any]],
        notes: Optional[str] = None,
    ) -> Dict[str, Any]:
        now = datetime.utcnow()
        roadmap_id = f"road_{uuid.uuid4().hex[:12]}"
        return {
            "_id": roadmap_id,
            "id": roadmap_id,
            "user_id": str(user_id),
            "goal": goal,
            "duration_weeks": duration_weeks,
            "stages": stages,
            "notes": notes or "",
            "created_at": now,
            "updated_at": now,
        }

    @staticmethod
    def to_response(doc: Dict[str, Any]) -> Dict[str, Any]:
        created = doc.get("created_at", datetime.utcnow())
        updated = doc.get("updated_at", datetime.utcnow())
        return {
            "id": str(doc.get("id") or doc.get("_id")),
            "user_id": str(doc.get("user_id")),
            "goal": doc.get("goal"),
            "duration_weeks": doc.get("duration_weeks", 4),
            "stages": doc.get("stages", []),
            "notes": doc.get("notes", ""),
            "created_at": created.isoformat() if isinstance(created, datetime) else str(created),
            "updated_at": updated.isoformat() if isinstance(updated, datetime) else str(updated),
        }
