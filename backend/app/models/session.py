from typing import Dict, Any, Optional
from datetime import datetime

class AuthSessionModel:
    @staticmethod
    def create_document(
        user_id: str,
        refresh_token_hash: str,
        expires_at: datetime,
        user_agent: Optional[str] = None,
        ip_address: Optional[str] = None,
    ) -> Dict[str, Any]:
        return {
            "user_id": str(user_id),
            "refresh_token_hash": refresh_token_hash,
            "expires_at": expires_at,
            "is_revoked": False,
            "user_agent": user_agent or "Unknown",
            "ip_address": ip_address or "Unknown",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }

