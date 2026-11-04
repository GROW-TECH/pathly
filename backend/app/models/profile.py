from typing import Dict, Any, List, Optional
from datetime import datetime

class CandidateProfileModel:
    @staticmethod
    def calculate_completion(doc: Dict[str, Any]) -> int:
        score = 20  # Base registration completion
        if doc.get("career_status"):
            score += 10
        if doc.get("target_role"):
            score += 15
        if doc.get("interests") and len(doc["interests"]) > 0:
            score += 15
        if doc.get("skills") and len(doc["skills"]) > 0:
            score += 20
        if doc.get("preferred_locations") and len(doc["preferred_locations"]) > 0:
            score += 10
        if doc.get("resume_name"):
            score += 10
        return min(100, score)

    @staticmethod
    def create_default(user_id: str, career_status: str = "fresher") -> Dict[str, Any]:
        now = datetime.utcnow()
        doc = {
            "user_id": str(user_id),
            "career_status": career_status,
            "target_role": "Frontend Engineer",
            "experience_years": "0" if career_status == "fresher" else "2",
            "preferred_locations": ["Chennai", "Bangalore"],
            "preferred_work_modes": ["hybrid", "remote"],
            "gov_exam_scope": "all",
            "interests": ["technology", "design"],
            "skills": [
                {"name": "React", "level": "Intermediate", "category": "Frontend"},
                {"name": "TypeScript", "level": "Beginner", "category": "Languages"},
                {"name": "Tailwind CSS", "level": "Advanced", "category": "Styling"},
            ],
            "bio": "Aspiring engineer focused on building intuitive and performant web products.",
            "headline": "Frontend Developer · React & Next.js",
            "education": [
                {"degree": "B.Tech in Computer Science", "institution": "Anna University", "year": "2025"}
            ],
            "experience": [],
            "resume_name": "Alex_Morgan_Resume.pdf",
            "resume_url": None,
            "ats_score": 78,
            "created_at": now,
            "updated_at": now,
        }
        doc["profile_completion_percentage"] = CandidateProfileModel.calculate_completion(doc)
        return doc

    @staticmethod
    def to_response(doc: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "user_id": str(doc.get("user_id")),
            "career_status": doc.get("career_status", "fresher"),
            "target_role": doc.get("target_role", "Frontend Engineer"),
            "experience_years": str(doc.get("experience_years", "0")),
            "preferred_locations": doc.get("preferred_locations", []),
            "preferred_work_modes": doc.get("preferred_work_modes", []),
            "gov_exam_scope": doc.get("gov_exam_scope", "all"),
            "interests": doc.get("interests", []),
            "skills": doc.get("skills", []),
            "bio": doc.get("bio", ""),
            "headline": doc.get("headline", ""),
            "education": doc.get("education", []),
            "experience": doc.get("experience", []),
            "resume_name": doc.get("resume_name", "Alex_Morgan_Resume.pdf"),
            "resume_url": doc.get("resume_url", None),
            "ats_score": doc.get("ats_score", 78),
            "profile_completion_percentage": doc.get(
                "profile_completion_percentage",
                CandidateProfileModel.calculate_completion(doc)
            ),
            "updated_at": doc.get("updated_at", datetime.utcnow()),
        }

