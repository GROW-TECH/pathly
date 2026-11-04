"""
MongoDB Data Models & Document Converters for Skills Roadmap & Learning Module.
Handles user_roadmaps, learning_progress, and saved_courses collections.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
import uuid

class LearningProgressModel:
    @staticmethod
    def create(
        user_id: str,
        course_id: str,
        completed_modules: Optional[List[str]] = None,
        completed_lessons: Optional[List[str]] = None,
        total_lessons: int = 10,
    ) -> Dict[str, Any]:
        now = datetime.utcnow()
        modules = completed_modules or []
        lessons = completed_lessons or []
        progress_pct = min(100, int((len(lessons) / max(total_lessons, 1)) * 100))
        status = "completed" if progress_pct >= 100 else ("in_progress" if progress_pct > 0 or modules or lessons else "enrolled")
        
        doc_id = f"prog_{uuid.uuid4().hex[:12]}"
        return {
            "_id": doc_id,
            "id": doc_id,
            "user_id": str(user_id),
            "course_id": course_id,
            "completed_modules": modules,
            "completed_lessons": lessons,
            "total_lessons": total_lessons,
            "progress_percentage": progress_pct,
            "status": status,
            "enrolled_at": now,
            "last_accessed_at": now,
            "completed_at": now if status == "completed" else None,
            "updated_at": now,
        }

    @staticmethod
    def to_response(doc: Dict[str, Any]) -> Dict[str, Any]:
        enrolled = doc.get("enrolled_at", datetime.utcnow())
        last_acc = doc.get("last_accessed_at", datetime.utcnow())
        comp_at = doc.get("completed_at")
        return {
            "id": str(doc.get("id") or doc.get("_id")),
            "user_id": str(doc.get("user_id")),
            "course_id": str(doc.get("course_id")),
            "completed_modules": doc.get("completed_modules", []),
            "completed_lessons": doc.get("completed_lessons", []),
            "total_lessons": doc.get("total_lessons", 10),
            "progress_percentage": doc.get("progress_percentage", 0),
            "status": doc.get("status", "enrolled"),
            "enrolled_at": enrolled.isoformat() if isinstance(enrolled, datetime) else str(enrolled),
            "last_accessed_at": last_acc.isoformat() if isinstance(last_acc, datetime) else str(last_acc),
            "completed_at": comp_at.isoformat() if isinstance(comp_at, datetime) else (str(comp_at) if comp_at else None),
        }

class SavedCourseModel:
    @staticmethod
    def create(user_id: str, course_id: str) -> Dict[str, Any]:
        now = datetime.utcnow()
        doc_id = f"save_{uuid.uuid4().hex[:12]}"
        return {
            "_id": doc_id,
            "id": doc_id,
            "user_id": str(user_id),
            "course_id": course_id,
            "saved_at": now,
        }

    @staticmethod
    def to_response(doc: Dict[str, Any]) -> Dict[str, Any]:
        saved_at = doc.get("saved_at", datetime.utcnow())
        return {
            "id": str(doc.get("id") or doc.get("_id")),
            "user_id": str(doc.get("user_id")),
            "course_id": str(doc.get("course_id")),
            "saved_at": saved_at.isoformat() if isinstance(saved_at, datetime) else str(saved_at),
        }

class UserRoadmapModel:
    @staticmethod
    def create(
        user_id: str,
        target_role: str,
        title: str,
        description: str,
        milestones: List[Dict[str, Any]],
        course_id: Optional[str] = None,
        course_title: Optional[str] = None,
        icon_type: str = "tech",
        stages: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        now = datetime.utcnow()
        doc_id = f"roadmap_{uuid.uuid4().hex[:12]}"
        
        # Calculate real overall progress from actual completed milestones
        total_milestones = len(milestones)
        completed_milestones = sum(1 for m in milestones if m.get("status") == "completed")
        overall_progress = int((completed_milestones / max(total_milestones, 1)) * 100) if total_milestones > 0 else 0

        return {
            "_id": doc_id,
            "id": doc_id,
            "user_id": str(user_id),
            "target_role": target_role,
            "title": title,
            "description": description,
            "milestones": milestones,
            "course_id": course_id,
            "course_title": course_title,
            "icon_type": icon_type,
            "stages": stages or [],
            "overall_progress": overall_progress,
            "progress": overall_progress,
            "total_milestones": total_milestones,
            "completed_milestones": completed_milestones,
            "created_at": now,
            "updated_at": now,
        }

    @staticmethod
    def to_response(doc: Dict[str, Any]) -> Dict[str, Any]:
        created = doc.get("created_at", datetime.utcnow())
        updated = doc.get("updated_at", datetime.utcnow())
        milestones = doc.get("milestones", [])
        
        # If legacy doc only has stages, extract milestones from stages
        if not milestones and doc.get("stages"):
            for s in doc.get("stages", []):
                for m in s.get("milestones", []):
                    milestones.append(m)

        total_milestones = len(milestones)
        completed_milestones = sum(1 for m in milestones if m.get("status") == "completed")
        overall_progress = doc.get("progress", doc.get("overall_progress", 0))
        if total_milestones > 0:
            overall_progress = int((completed_milestones / total_milestones) * 100)

        return {
            "id": str(doc.get("id") or doc.get("_id")),
            "user_id": str(doc.get("user_id")),
            "target_role": doc.get("target_role", "Frontend Engineer"),
            "title": doc.get("title", f"{doc.get('target_role', 'Career')} Career Track"),
            "description": doc.get("description", ""),
            "milestones": milestones,
            "course_id": doc.get("course_id", "course-1"),
            "course_title": doc.get("course_title", "Recommended Course"),
            "icon_type": doc.get("icon_type", "tech"),
            "stages": doc.get("stages", []),
            "overall_progress": overall_progress,
            "progress": overall_progress,
            "total_milestones": total_milestones,
            "completed_milestones": completed_milestones,
            "created_at": created.isoformat() if isinstance(created, datetime) else str(created),
            "updated_at": updated.isoformat() if isinstance(updated, datetime) else str(updated),
        }
