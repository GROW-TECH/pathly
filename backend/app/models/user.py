from typing import Optional, Dict, Any
from datetime import datetime

class UserModel:
    @staticmethod
    def create_document(
        full_name: str,
        email: str,
        mobile: str,
        hashed_password: str,
        career_status: str = "fresher",
    ) -> Dict[str, Any]:
        now = datetime.utcnow()
        return {
            "full_name": full_name.strip(),
            "email": email.strip().lower(),
            "mobile": mobile.strip(),
            "hashed_password": hashed_password,
            "career_status": career_status.lower(),
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        }

    @staticmethod
    def to_response(doc: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "id": str(doc.get("_id", doc.get("id"))),
            "full_name": doc.get("full_name", ""),
            "email": doc.get("email", ""),
            "mobile": doc.get("mobile", ""),
            "career_status": doc.get("career_status", "fresher"),
            "is_active": doc.get("is_active", True),
            "created_at": doc.get("created_at", datetime.utcnow()),
        }

