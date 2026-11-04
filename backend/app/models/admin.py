"""
MongoDB Data Models & Document Converters for Pathly Admin Module:
- AdminUser: Administrators with role-based access
- Course: Dynamic courses catalog in MongoDB
- Mentor: Industry mentors available for 1:1 sessions
- MentorshipBooking: Scheduled 1:1 sessions with double-booking prevention
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
import uuid
from bson import ObjectId


def safe_id(val: Any) -> str:
    if val is None:
        return ""
    if isinstance(val, (ObjectId, str)):
        return str(val)
    return str(val)


class AdminUserModel:
    @staticmethod
    def create(
        email: str,
        hashed_password: str,
        full_name: str = "Admin",
        role: str = "admin",  # 'admin' or 'super_admin'
        is_active: bool = True,
    ) -> Dict[str, Any]:
        now = datetime.utcnow()
        doc_id = f"adm_{uuid.uuid4().hex[:12]}"
        return {
            "_id": doc_id,
            "id": doc_id,
            "email": email.strip().lower(),
            "hashed_password": hashed_password,
            "full_name": full_name.strip(),
            "role": role,
            "is_active": is_active,
            "created_at": now,
            "updated_at": now,
            "last_login": None,
        }

    @staticmethod
    def to_response(doc: Dict[str, Any]) -> Dict[str, Any]:
        created = doc.get("created_at", datetime.utcnow())
        last_log = doc.get("last_login")
        return {
            "id": safe_id(doc.get("id") or doc.get("_id")),
            "email": doc.get("email", ""),
            "full_name": doc.get("full_name", ""),
            "role": doc.get("role", "admin"),
            "is_active": doc.get("is_active", True),
            "created_at": created.isoformat() if isinstance(created, datetime) else str(created),
            "last_login": last_log.isoformat() if isinstance(last_log, datetime) else (str(last_log) if last_log else None),
        }


class CourseModel:
    @staticmethod
    def create(
        title: str,
        category: str,
        description: str,
        skills: List[str],
        duration: str,
        level: str = "Beginner",
        price: str = "Free",
        provider: str = "Pathly Academy",
        instructor: str = "Senior Industry Specialist",
        thumbnail: str = "",
        rating: float = 4.8,
        review_count: int = 0,
        what_you_learn: Optional[List[str]] = None,
        modules: Optional[List[Dict[str, Any]]] = None,
        status: str = "published",  # 'published', 'draft', 'archived'
        custom_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        now = datetime.utcnow()
        doc_id = custom_id or f"course-{uuid.uuid4().hex[:8]}"
        return {
            "_id": doc_id,
            "id": doc_id,
            "title": title.strip(),
            "category": category.strip().lower(),
            "description": description.strip(),
            "skills": skills,
            "duration": duration,
            "level": level,
            "price": price,
            "provider": provider,
            "instructor": instructor,
            "thumbnail": thumbnail,
            "rating": rating,
            "reviewCount": review_count,
            "whatYouLearn": what_you_learn or [],
            "modules": modules or [],
            "status": status,
            "created_at": now,
            "updated_at": now,
        }

    @staticmethod
    def to_response(doc: Dict[str, Any]) -> Dict[str, Any]:
        created = doc.get("created_at", datetime.utcnow())
        updated = doc.get("updated_at", datetime.utcnow())
        return {
            "id": safe_id(doc.get("id") or doc.get("_id")),
            "title": doc.get("title", ""),
            "category": doc.get("category", "general"),
            "description": doc.get("description", ""),
            "skills": doc.get("skills", []),
            "duration": doc.get("duration", "10 Hours"),
            "level": doc.get("level", "Beginner"),
            "price": doc.get("price", "Free"),
            "provider": doc.get("provider", "Pathly Academy"),
            "instructor": doc.get("instructor", "Senior Specialist"),
            "thumbnail": doc.get("thumbnail", ""),
            "rating": float(doc.get("rating", 4.8)),
            "reviewCount": int(doc.get("reviewCount", 0)),
            "whatYouLearn": doc.get("whatYouLearn", []),
            "modules": doc.get("modules", []),
            "status": doc.get("status", "published"),
            "link": f"/courses/{safe_id(doc.get('id') or doc.get('_id'))}",
            "created_at": created.isoformat() if isinstance(created, datetime) else str(created),
            "updated_at": updated.isoformat() if isinstance(updated, datetime) else str(updated),
        }


class MentorModel:
    @staticmethod
    def create(
        name: str,
        role: str,
        company: str,
        email: Optional[str] = None,
        mobile: Optional[str] = None,
        skills: Optional[List[str]] = None,
        specialty: Optional[List[str]] = None,
        bio: str = "",
        experience: str = "5+ Years",
        languages: Optional[List[str]] = None,
        session_duration: str = "45 mins",
        session_price: str = "Free",
        availability: Optional[List[str]] = None,
        meeting_link: str = "https://meet.google.com/pat-hly-pro",
        avatar_bg: str = "from-[#635BFF] to-[#8B5CF6]",
        photo_url: str = "",
        rating: float = 4.9,
        sessions_count: int = 0,
        status: str = "active",  # 'active', 'inactive'
        custom_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        now = datetime.utcnow()
        doc_id = custom_id or f"m_{uuid.uuid4().hex[:8]}"
        default_avail = [
            "10:00 AM",
            "02:30 PM",
            "05:00 PM",
            "07:30 PM",
            "09:00 PM",
        ]
        return {
            "_id": doc_id,
            "id": doc_id,
            "name": name.strip(),
            "role": role.strip(),
            "company": company.strip(),
            "email": (email or "").strip().lower(),
            "mobile": (mobile or "").strip(),
            "skills": skills or [],
            "specialty": specialty or [],
            "bio": bio.strip(),
            "experience": experience,
            "languages": languages or ["English", "Tamil", "Hindi"],
            "session_duration": session_duration,
            "session_price": session_price,
            "availability": availability or default_avail,
            "meeting_link": meeting_link,
            "avatarBg": avatar_bg,
            "photo_url": photo_url,
            "rating": rating,
            "sessionsCount": sessions_count,
            "status": status,
            "created_at": now,
            "updated_at": now,
        }

    @staticmethod
    def to_response(doc: Dict[str, Any]) -> Dict[str, Any]:
        created = doc.get("created_at", datetime.utcnow())
        updated = doc.get("updated_at", datetime.utcnow())
        return {
            "id": safe_id(doc.get("id") or doc.get("_id")),
            "name": doc.get("name", ""),
            "role": doc.get("role", ""),
            "company": doc.get("company", ""),
            "email": doc.get("email", ""),
            "mobile": doc.get("mobile", ""),
            "skills": doc.get("skills", []),
            "specialty": doc.get("specialty", []),
            "bio": doc.get("bio", ""),
            "experience": doc.get("experience", "5+ Years"),
            "languages": doc.get("languages", ["English"]),
            "session_duration": doc.get("session_duration", "45 mins"),
            "session_price": doc.get("session_price", "Free"),
            "availability": doc.get("availability", []),
            "meeting_link": doc.get("meeting_link", "https://meet.google.com/pat-hly-pro"),
            "avatarBg": doc.get("avatarBg", "from-[#635BFF] to-[#8B5CF6]"),
            "photo_url": doc.get("photo_url", ""),
            "rating": float(doc.get("rating", 4.9)),
            "sessionsCount": int(doc.get("sessionsCount", 0)),
            "status": doc.get("status", "active"),
            "created_at": created.isoformat() if isinstance(created, datetime) else str(created),
            "updated_at": updated.isoformat() if isinstance(updated, datetime) else str(updated),
        }


class MentorshipBookingModel:
    @staticmethod
    def create(
        user_id: str,
        user_name: str,
        user_email: str,
        mentor_id: str,
        mentor_name: str,
        date: str,
        time_slot: str,
        topic: str = "Career Roadmap & Resume Review",
        meeting_link: str = "https://meet.google.com/pat-hly-pro",
        status: str = "confirmed",  # 'confirmed', 'completed', 'cancelled'
    ) -> Dict[str, Any]:
        now = datetime.utcnow()
        doc_id = f"book_{uuid.uuid4().hex[:10]}"
        return {
            "_id": doc_id,
            "id": doc_id,
            "booking_id": f"PB-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:4].upper()}",
            "user_id": str(user_id),
            "user_name": user_name,
            "user_email": user_email,
            "mentor_id": mentor_id,
            "mentor_name": mentor_name,
            "date": date,
            "time_slot": time_slot,
            "topic": topic,
            "meeting_link": meeting_link,
            "status": status,
            "created_at": now,
            "updated_at": now,
        }

    @staticmethod
    def to_response(doc: Dict[str, Any]) -> Dict[str, Any]:
        created = doc.get("created_at", datetime.utcnow())
        return {
            "id": safe_id(doc.get("id") or doc.get("_id")),
            "booking_id": doc.get("booking_id", ""),
            "user_id": str(doc.get("user_id")),
            "user_name": doc.get("user_name", "Student"),
            "user_email": doc.get("user_email", ""),
            "mentor_id": str(doc.get("mentor_id")),
            "mentor_name": doc.get("mentor_name", "Mentor"),
            "date": doc.get("date", ""),
            "time_slot": doc.get("time_slot", ""),
            "topic": doc.get("topic", "1-on-1 Mentorship"),
            "meeting_link": doc.get("meeting_link", "https://meet.google.com/pat-hly-pro"),
            "status": doc.get("status", "confirmed"),
            "created_at": created.isoformat() if isinstance(created, datetime) else str(created),
        }
