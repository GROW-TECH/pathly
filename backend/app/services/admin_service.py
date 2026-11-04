"""
Admin Business Logic & MongoDB Operations Service for Pathly.
Handles Admin Auth, Course Management, Mentor Management,
Registered User Administration, Mentorship Bookings, and Live Statistics.
"""

import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional, Tuple
from bson import ObjectId
from fastapi import HTTPException, status

from app.db.mongodb import get_database
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.admin import AdminUserModel, CourseModel, MentorModel, MentorshipBookingModel
from app.models.user import UserModel
from app.schemas.admin import (
    AdminLoginRequest,
    CourseCreateRequest,
    CourseUpdateRequest,
    MentorCreateRequest,
    MentorUpdateRequest,
    BookMentorshipRequest,
)
from app.core.courses_catalog import PATHLY_COURSES

logger = logging.getLogger("pathly.admin_service")


def to_mongo_id(val: str) -> Any:
    try:
        return ObjectId(val)
    except Exception:
        return val


class AdminService:
    # --------------------------------------------------------------------------
    # SEEDING & INITIALIZATION
    # --------------------------------------------------------------------------
    @staticmethod
    async def seed_defaults_if_needed() -> None:
        """Seed default admin, courses catalog, and initial mentors if collections are empty."""
        db = get_database()

        # 1. Seed Default Admin
        admin_count = await db.admin_users.count_documents({})
        if admin_count == 0:
            default_admin = AdminUserModel.create(
                email="admin@pathly.io",
                hashed_password=get_password_hash("AdminPassword123!"),
                full_name="Pathly Administrator",
                role="super_admin",
            )
            await db.admin_users.insert_one(default_admin)
            logger.info("Default super_admin created: admin@pathly.io / AdminPassword123!")

        # 2. Seed Courses into MongoDB
        course_count = await db.courses.count_documents({})
        if course_count == 0:
            courses_to_insert = []
            for c in PATHLY_COURSES:
                doc = CourseModel.create(
                    custom_id=c["id"],
                    title=c["title"],
                    category=c.get("category", "webdev"),
                    description=c.get("description", ""),
                    skills=c.get("skills", []),
                    duration=c.get("duration", "10 Hours"),
                    level=c.get("level", "Beginner"),
                    price=c.get("price", "Free"),
                    provider=c.get("provider", "Pathly Academy"),
                    instructor="Pathly Lead Instructor",
                    rating=c.get("rating", 4.8),
                    review_count=c.get("reviewCount", 120),
                    what_you_learn=c.get("whatYouLearn", []),
                    status="published",
                )
                courses_to_insert.append(doc)

            if courses_to_insert:
                await db.courses.insert_many(courses_to_insert)
                logger.info(f"Seeded {len(courses_to_insert)} initial courses into MongoDB courses collection.")

        # 3. Seed Mentors into MongoDB
        mentor_count = await db.mentors.count_documents({})
        if mentor_count == 0:
            initial_mentors = [
                {
                    "custom_id": "m1",
                    "name": "Karthik Raja",
                    "role": "Staff Frontend Engineer",
                    "company": "Google (Ex-Amazon)",
                    "email": "karthik.raja@mentors.pathly.io",
                    "experience": "8+ Years",
                    "rating": 4.9,
                    "sessions_count": 142,
                    "specialty": ["React / Next.js", "System Design", "Mock Tech Interview"],
                    "skills": ["React", "Next.js", "System Design", "TypeScript"],
                    "avatar_bg": "from-[#635BFF] to-[#8B5CF6]",
                    "session_price": "Free",
                    "bio": "Staff Frontend Engineer helping aspiring developers transition to product companies and crack high-impact engineering interviews.",
                },
                {
                    "custom_id": "m2",
                    "name": "Priya Sundaram",
                    "role": "Assistant Commissioner (TNPSC Rank 4)",
                    "company": "Govt of Tamil Nadu",
                    "email": "priya.sundaram@mentors.pathly.io",
                    "experience": "6+ Years",
                    "rating": 4.95,
                    "sessions_count": 98,
                    "specialty": ["TNPSC Group 1/2", "General Studies", "Interview Board Prep"],
                    "skills": ["General Studies", "TNPSC Group 4", "Tamil Nadu History", "Public Admin"],
                    "avatar_bg": "from-[#10B981] to-[#059669]",
                    "session_price": "Free",
                    "bio": "Top-rank officer offering one-on-one strategy sessions for TNPSC state civil service and public administration aspirants.",
                },
                {
                    "custom_id": "m3",
                    "name": "Ananya Rao",
                    "role": "Lead UI/UX Engineer",
                    "company": "Swiggy",
                    "email": "ananya.rao@mentors.pathly.io",
                    "experience": "7+ Years",
                    "rating": 4.85,
                    "sessions_count": 110,
                    "specialty": ["Portfolio Review", "Design Systems", "Career Growth"],
                    "skills": ["Figma", "UI/UX", "Design Systems", "User Research"],
                    "avatar_bg": "from-[#F59E0B] to-[#D97706]",
                    "session_price": "Free",
                    "bio": "Design leader dedicated to helping UI/UX designers refine portfolios, master Figma design systems, and pass design critiques.",
                },
            ]
            mentors_to_insert = [
                MentorModel.create(
                    custom_id=m["custom_id"],
                    name=m["name"],
                    role=m["role"],
                    company=m["company"],
                    email=m["email"],
                    experience=m["experience"],
                    rating=m["rating"],
                    sessions_count=m["sessions_count"],
                    specialty=m["specialty"],
                    skills=m["skills"],
                    avatar_bg=m["avatar_bg"],
                    session_price=m["session_price"],
                    bio=m["bio"],
                    status="active",
                )
                for m in initial_mentors
            ]
            await db.mentors.insert_many(mentors_to_insert)
            logger.info(f"Seeded {len(mentors_to_insert)} initial mentors into MongoDB mentors collection.")

    # --------------------------------------------------------------------------
    # ADMIN AUTHENTICATION
    # --------------------------------------------------------------------------
    @staticmethod
    async def authenticate_admin(payload: AdminLoginRequest) -> Tuple[Dict[str, Any], str]:
        """Authenticate admin user and issue JWT with role=admin claim."""
        db = get_database()
        email_clean = payload.email.strip().lower()

        # Check admin_users collection
        admin = await db.admin_users.find_one({"email": email_clean})

        # Also support users with role="admin" or "super_admin" in users collection
        if not admin:
            user = await db.users.find_one({"email": email_clean, "role": {"$in": ["admin", "super_admin"]}})
            if user:
                admin = user

        if not admin:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin credentials. Access restricted to authorized administrators.",
            )

        if not admin.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This admin account has been suspended.",
            )

        if not verify_password(payload.password, admin.get("hashed_password", "")):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin credentials. Access restricted to authorized administrators.",
            )

        # Update last login
        now = datetime.utcnow()
        await db.admin_users.update_one(
            {"_id": admin["_id"]},
            {"$set": {"last_login": now, "updated_at": now}},
        )

        admin_id = str(admin.get("id") or admin.get("_id"))
        role = admin.get("role", "admin")
        token = create_access_token(
            subject=admin_id,
            extra_claims={"role": role, "email": email_clean, "is_admin": True},
        )

        return AdminUserModel.to_response(admin), token

    @staticmethod
    async def get_admin_by_id(admin_id: str) -> Optional[Dict[str, Any]]:
        db = get_database()
        admin = await db.admin_users.find_one({
            "$or": [{"id": admin_id}, {"_id": admin_id}, {"_id": to_mongo_id(admin_id)}]
        })
        if not admin:
            admin = await db.users.find_one({
                "$or": [{"id": admin_id}, {"_id": admin_id}, {"_id": to_mongo_id(admin_id)}],
                "role": {"$in": ["admin", "super_admin"]},
            })
        if admin:
            return AdminUserModel.to_response(admin)
        return None

    # --------------------------------------------------------------------------
    # DASHBOARD STATISTICS
    # --------------------------------------------------------------------------
    @staticmethod
    async def get_dashboard_stats() -> Dict[str, Any]:
        """Fetch real-time platform statistics from MongoDB."""
        db = get_database()

        total_users = await db.users.count_documents({})
        active_users = await db.users.count_documents({"is_active": {"$ne": False}})

        total_courses = await db.courses.count_documents({})
        active_courses = await db.courses.count_documents({"status": "published"})

        total_mentors = await db.mentors.count_documents({})
        active_mentors = await db.mentors.count_documents({"status": "active"})

        course_enrollments = await db.learning_progress.count_documents({})
        completed_courses = await db.learning_progress.count_documents({"status": "completed"})

        mentorship_bookings = await db.mentorship_bookings.count_documents({})

        # Recent activities (recent 6 enrollments or bookings)
        recent_activity: List[Dict[str, Any]] = []

        recent_enrollments = await db.learning_progress.find({}).sort("enrolled_at", -1).limit(4).to_list(4)
        for e in recent_enrollments:
            user_doc = await db.users.find_one({"$or": [{"_id": to_mongo_id(e["user_id"])}, {"id": e["user_id"]}]})
            course_doc = await db.courses.find_one({"$or": [{"_id": e["course_id"]}, {"id": e["course_id"]}]})
            recent_activity.append({
                "type": "enrollment",
                "title": f"{user_doc.get('full_name', 'Student') if user_doc else 'Student'} enrolled in {course_doc.get('title', e['course_id']) if course_doc else e['course_id']}",
                "timestamp": e.get("enrolled_at", datetime.utcnow()).isoformat() if isinstance(e.get("enrolled_at"), datetime) else str(e.get("enrolled_at")),
                "badge": "Enrollment",
            })

        recent_books = await db.mentorship_bookings.find({}).sort("created_at", -1).limit(4).to_list(4)
        for b in recent_books:
            recent_activity.append({
                "type": "mentorship",
                "title": f"{b.get('user_name', 'Student')} booked 1:1 session with {b.get('mentor_name', 'Mentor')}",
                "timestamp": b.get("created_at", datetime.utcnow()).isoformat() if isinstance(b.get("created_at"), datetime) else str(b.get("created_at")),
                "badge": "Booking",
            })

        # Sort combined activity by timestamp descending
        recent_activity.sort(key=lambda x: x["timestamp"], reverse=True)

        return {
            "total_users": total_users,
            "active_users": active_users,
            "total_courses": total_courses,
            "active_courses": active_courses,
            "total_mentors": total_mentors,
            "active_mentors": active_mentors,
            "course_enrollments": course_enrollments,
            "completed_courses": completed_courses,
            "mentorship_bookings": mentorship_bookings,
            "recent_activity": recent_activity[:8],
        }

    # --------------------------------------------------------------------------
    # COURSE MANAGEMENT
    # --------------------------------------------------------------------------
    @staticmethod
    async def list_courses(status_filter: Optional[str] = None, category_filter: Optional[str] = None, search: Optional[str] = None) -> List[Dict[str, Any]]:
        db = get_database()
        query: Dict[str, Any] = {}
        if status_filter and status_filter != "all":
            query["status"] = status_filter
        if category_filter and category_filter != "all":
            query["category"] = category_filter.lower()
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
                {"skills": {"$in": [search]}},
            ]

        cursor = db.courses.find(query).sort("created_at", -1)
        docs = await cursor.to_list(length=200)
        return [CourseModel.to_response(d) for d in docs]

    @staticmethod
    async def create_course(data: CourseCreateRequest) -> Dict[str, Any]:
        db = get_database()
        doc = CourseModel.create(
            title=data.title,
            category=data.category,
            description=data.description,
            skills=data.skills,
            duration=data.duration,
            level=data.level,
            price=data.price,
            provider=data.provider,
            instructor=data.instructor,
            thumbnail=data.thumbnail or "",
            what_you_learn=data.what_you_learn,
            modules=data.modules,
            status=data.status,
        )
        await db.courses.insert_one(doc)
        return CourseModel.to_response(doc)

    @staticmethod
    async def get_course_by_id(course_id: str) -> Optional[Dict[str, Any]]:
        db = get_database()
        doc = await db.courses.find_one({"$or": [{"_id": course_id}, {"id": course_id}]})
        if doc:
            return CourseModel.to_response(doc)
        return None

    @staticmethod
    async def update_course(course_id: str, data: CourseUpdateRequest) -> Dict[str, Any]:
        db = get_database()
        update_fields: Dict[str, Any] = {"updated_at": datetime.utcnow()}

        data_dict = data.model_dump(exclude_unset=True)
        for key, val in data_dict.items():
            if val is not None:
                if key == "what_you_learn":
                    update_fields["whatYouLearn"] = val
                else:
                    update_fields[key] = val

        result = await db.courses.update_one(
            {"$or": [{"_id": course_id}, {"id": course_id}]},
            {"$set": update_fields},
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Course not found")

        updated = await db.courses.find_one({"$or": [{"_id": course_id}, {"id": course_id}]})
        return CourseModel.to_response(updated)

    @staticmethod
    async def update_course_status(course_id: str, new_status: str) -> Dict[str, Any]:
        db = get_database()
        result = await db.courses.update_one(
            {"$or": [{"_id": course_id}, {"id": course_id}]},
            {"$set": {"status": new_status, "updated_at": datetime.utcnow()}},
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Course not found")
        doc = await db.courses.find_one({"$or": [{"_id": course_id}, {"id": course_id}]})
        return CourseModel.to_response(doc)

    @staticmethod
    async def delete_course(course_id: str) -> bool:
        db = get_database()
        res = await db.courses.delete_one({"$or": [{"_id": course_id}, {"id": course_id}]})
        return res.deleted_count > 0

    # --------------------------------------------------------------------------
    # MENTOR MANAGEMENT
    # --------------------------------------------------------------------------
    @staticmethod
    async def list_mentors(status_filter: Optional[str] = None, search: Optional[str] = None) -> List[Dict[str, Any]]:
        db = get_database()
        query: Dict[str, Any] = {}
        if status_filter and status_filter != "all":
            query["status"] = status_filter
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"role": {"$regex": search, "$options": "i"}},
                {"company": {"$regex": search, "$options": "i"}},
                {"skills": {"$in": [search]}},
            ]

        cursor = db.mentors.find(query).sort("created_at", -1)
        docs = await cursor.to_list(length=200)
        return [MentorModel.to_response(d) for d in docs]

    @staticmethod
    async def create_mentor(data: MentorCreateRequest) -> Dict[str, Any]:
        db = get_database()
        doc = MentorModel.create(
            name=data.name,
            role=data.role,
            company=data.company,
            email=data.email,
            mobile=data.mobile,
            skills=data.skills,
            specialty=data.specialty,
            bio=data.bio or "",
            experience=data.experience,
            languages=data.languages,
            session_duration=data.session_duration,
            session_price=data.session_price,
            availability=data.availability,
            meeting_link=data.meeting_link or "https://meet.google.com/pat-hly-pro",
            avatar_bg=data.avatar_bg or "from-[#635BFF] to-[#8B5CF6]",
            photo_url=data.photo_url or "",
            status=data.status,
        )
        await db.mentors.insert_one(doc)
        return MentorModel.to_response(doc)

    @staticmethod
    async def get_mentor_by_id(mentor_id: str) -> Optional[Dict[str, Any]]:
        db = get_database()
        doc = await db.mentors.find_one({"$or": [{"_id": mentor_id}, {"id": mentor_id}]})
        if doc:
            return MentorModel.to_response(doc)
        return None

    @staticmethod
    async def update_mentor(mentor_id: str, data: MentorUpdateRequest) -> Dict[str, Any]:
        db = get_database()
        update_fields: Dict[str, Any] = {"updated_at": datetime.utcnow()}

        data_dict = data.model_dump(exclude_unset=True)
        for key, val in data_dict.items():
            if val is not None:
                if key == "avatar_bg":
                    update_fields["avatarBg"] = val
                else:
                    update_fields[key] = val

        result = await db.mentors.update_one(
            {"$or": [{"_id": mentor_id}, {"id": mentor_id}]},
            {"$set": update_fields},
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Mentor not found")

        updated = await db.mentors.find_one({"$or": [{"_id": mentor_id}, {"id": mentor_id}]})
        return MentorModel.to_response(updated)

    @staticmethod
    async def delete_mentor(mentor_id: str) -> bool:
        db = get_database()
        res = await db.mentors.delete_one({"$or": [{"_id": mentor_id}, {"id": mentor_id}]})
        return res.deleted_count > 0

    # --------------------------------------------------------------------------
    # MENTORSHIP BOOKINGS
    # --------------------------------------------------------------------------
    @staticmethod
    async def book_session(user_id: str, mentor_id: str, data: BookMentorshipRequest) -> Dict[str, Any]:
        db = get_database()

        # Find user
        user = await db.users.find_one({"$or": [{"_id": to_mongo_id(user_id)}, {"id": user_id}]})
        user_name = user.get("full_name", "Student") if user else "Student"
        user_email = user.get("email", "") if user else ""

        # Find mentor
        mentor = await db.mentors.find_one({"$or": [{"_id": mentor_id}, {"id": mentor_id}]})
        if not mentor:
            raise HTTPException(status_code=404, detail="Mentor not found")

        # Double-booking check: verify slot isn't already taken
        conflict = await db.mentorship_bookings.find_one({
            "mentor_id": mentor_id,
            "date": data.date,
            "time_slot": data.time_slot,
            "status": "confirmed",
        })
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"This time slot ({data.date} at {data.time_slot}) is already booked for this mentor. Please choose another available time slot.",
            )

        booking_doc = MentorshipBookingModel.create(
            user_id=user_id,
            user_name=user_name,
            user_email=user_email,
            mentor_id=mentor_id,
            mentor_name=mentor.get("name", "Expert Mentor"),
            date=data.date,
            time_slot=data.time_slot,
            topic=data.topic or "Career Guidance & Resume Review",
            meeting_link=mentor.get("meeting_link", "https://meet.google.com/pat-hly-pro"),
            status="confirmed",
        )
        await db.mentorship_bookings.insert_one(booking_doc)

        # Increment mentor sessions count
        await db.mentors.update_one(
            {"$or": [{"_id": mentor_id}, {"id": mentor_id}]},
            {"$inc": {"sessionsCount": 1}},
        )

        return MentorshipBookingModel.to_response(booking_doc)

    @staticmethod
    async def list_mentorship_bookings() -> List[Dict[str, Any]]:
        db = get_database()
        cursor = db.mentorship_bookings.find({}).sort("created_at", -1)
        docs = await cursor.to_list(length=200)
        return [MentorshipBookingModel.to_response(d) for d in docs]

    @staticmethod
    async def get_user_bookings(user_id: str) -> List[Dict[str, Any]]:
        db = get_database()
        cursor = db.mentorship_bookings.find({"user_id": str(user_id)}).sort("created_at", -1)
        docs = await cursor.to_list(length=50)
        return [MentorshipBookingModel.to_response(d) for d in docs]

    # --------------------------------------------------------------------------
    # REGISTERED USER ADMINISTRATION
    # --------------------------------------------------------------------------
    @staticmethod
    async def list_registered_users(
        search: Optional[str] = None,
        status_filter: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> Dict[str, Any]:
        """Fetch registered users with their candidate profile details, avoiding passwords."""
        db = get_database()
        query: Dict[str, Any] = {}

        if status_filter == "active":
            query["is_active"] = {"$ne": False}
        elif status_filter == "inactive":
            query["is_active"] = False

        if search:
            query["$or"] = [
                {"full_name": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}},
                {"mobile": {"$regex": search, "$options": "i"}},
            ]

        total_count = await db.users.count_documents(query)
        skip = (page - 1) * page_size
        cursor = db.users.find(query).sort("created_at", -1).skip(skip).limit(page_size)
        user_docs = await cursor.to_list(length=page_size)

        user_ids = [str(u["_id"]) for u in user_docs]

        # Fetch candidate profiles for these users
        profile_cursor = db.candidate_profiles.find({"user_id": {"$in": user_ids}})
        profile_docs = await profile_cursor.to_list(length=page_size)
        profile_map = {p["user_id"]: p for p in profile_docs}

        # Fetch enrollment counts
        enroll_cursor = db.learning_progress.find({"user_id": {"$in": user_ids}})
        enroll_docs = await enroll_cursor.to_list(length=100)
        enroll_count_map: Dict[str, int] = {}
        for ed in enroll_docs:
            uid = ed["user_id"]
            enroll_count_map[uid] = enroll_count_map.get(uid, 0) + 1

        users_list = []
        for u in user_docs:
            uid = str(u["_id"])
            p = profile_map.get(uid, {})
            created = u.get("created_at", datetime.utcnow())

            raw_skills = p.get("skills", [])
            skills_names = [s.get("name") if isinstance(s, dict) else str(s) for s in raw_skills]

            users_list.append({
                "id": uid,
                "name": u.get("full_name", ""),
                "email": u.get("email", ""),
                "mobile": u.get("mobile", ""),
                "career_status": u.get("career_status", "fresher"),
                "target_role": p.get("target_role", "Not Specified"),
                "career_goal": p.get("career_goal", "Not Specified"),
                "education": p.get("education", {}).get("highest_level") if isinstance(p.get("education"), dict) else "Graduate",
                "skills": skills_names,
                "enrollments_count": enroll_count_map.get(uid, 0),
                "is_active": u.get("is_active", True),
                "registered_at": created.isoformat() if isinstance(created, datetime) else str(created),
            })

        return {
            "users": users_list,
            "total": total_count,
            "page": page,
            "page_size": page_size,
            "total_pages": max(1, (total_count + page_size - 1) // page_size),
        }

    @staticmethod
    async def get_user_full_detail(user_id: str) -> Dict[str, Any]:
        """Fetch comprehensive details for an individual user: profile, roadmap, enrollments, bookings."""
        db = get_database()
        user = await db.users.find_one({"$or": [{"_id": to_mongo_id(user_id)}, {"id": user_id}]})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        uid = str(user["_id"])
        profile = await db.candidate_profiles.find_one({"user_id": uid}) or {}
        roadmap = await db.user_roadmaps.find_one({"user_id": uid})

        # Enrollments
        enrollments = await db.learning_progress.find({"user_id": uid}).to_list(50)
        enriched_enrollments = []
        for e in enrollments:
            course = await db.courses.find_one({"$or": [{"_id": e["course_id"]}, {"id": e["course_id"]}]})
            enriched_enrollments.append({
                "id": str(e.get("_id", "")),
                "course_id": e["course_id"],
                "course_title": course.get("title", e["course_id"]) if course else e["course_id"],
                "progress_percentage": e.get("progress_percentage", 0),
                "status": e.get("status", "enrolled"),
                "enrolled_at": str(e.get("enrolled_at", "")),
            })

        # Bookings
        bookings = await db.mentorship_bookings.find({"user_id": uid}).to_list(50)
        formatted_bookings = [MentorshipBookingModel.to_response(b) for b in bookings]

        created = user.get("created_at", datetime.utcnow())
        return {
            "id": uid,
            "name": user.get("full_name", ""),
            "email": user.get("email", ""),
            "mobile": user.get("mobile", ""),
            "career_status": user.get("career_status", "fresher"),
            "is_active": user.get("is_active", True),
            "registered_at": created.isoformat() if isinstance(created, datetime) else str(created),
            "profile": {
                "target_role": profile.get("target_role", "Not Specified"),
                "career_goal": profile.get("career_goal", "Not Specified"),
                "skills": profile.get("skills", []),
                "education": profile.get("education", {}),
                "experience": profile.get("experience", []),
                "interests": profile.get("interests", []),
            },
            "roadmap": {
                "title": roadmap.get("title") if roadmap else "No active roadmap",
                "overall_progress": roadmap.get("overall_progress", 0) if roadmap else 0,
                "milestones_count": len(roadmap.get("milestones", [])) if roadmap else 0,
            } if roadmap else None,
            "enrollments": enriched_enrollments,
            "bookings": formatted_bookings,
        }

    @staticmethod
    async def update_user_status(user_id: str, is_active: bool) -> Dict[str, Any]:
        db = get_database()
        res = await db.users.update_one(
            {"$or": [{"_id": to_mongo_id(user_id)}, {"id": user_id}]},
            {"$set": {"is_active": is_active, "updated_at": datetime.utcnow()}},
        )
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        return {"success": True, "user_id": user_id, "is_active": is_active}

    # --------------------------------------------------------------------------
    # ENROLLMENTS LISTING
    # --------------------------------------------------------------------------
    @staticmethod
    async def list_all_enrollments() -> List[Dict[str, Any]]:
        db = get_database()
        cursor = db.learning_progress.find({}).sort("enrolled_at", -1)
        enroll_docs = await cursor.to_list(length=200)

        results = []
        for e in enroll_docs:
            user = await db.users.find_one({"$or": [{"_id": to_mongo_id(e["user_id"])}, {"id": e["user_id"]}]})
            course = await db.courses.find_one({"$or": [{"_id": e["course_id"]}, {"id": e["course_id"]}]})
            enrolled = e.get("enrolled_at", datetime.utcnow())
            results.append({
                "id": str(e.get("_id")),
                "user_id": e["user_id"],
                "user_name": user.get("full_name", "Student") if user else "Student",
                "user_email": user.get("email", "") if user else "",
                "course_id": e["course_id"],
                "course_title": course.get("title", e["course_id"]) if course else e["course_id"],
                "progress_percentage": e.get("progress_percentage", 0),
                "status": e.get("status", "enrolled"),
                "enrolled_at": enrolled.isoformat() if isinstance(enrolled, datetime) else str(enrolled),
            })
        return results

    # --------------------------------------------------------------------------
    # REPORTS & ANALYTICS
    # --------------------------------------------------------------------------
    @staticmethod
    async def get_reports() -> Dict[str, Any]:
        db = get_database()

        # Breakdown by category
        pipeline_category = [
            {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        ]
        cat_counts = await db.courses.aggregate(pipeline_category).to_list(20)

        # Breakdown by course difficulty level
        pipeline_level = [
            {"$group": {"_id": "$level", "count": {"$sum": 1}}},
        ]
        lvl_counts = await db.courses.aggregate(pipeline_level).to_list(10)

        # User career statuses
        pipeline_status = [
            {"$group": {"_id": "$career_status", "count": {"$sum": 1}}},
        ]
        status_counts = await db.users.aggregate(pipeline_status).to_list(10)

        total_users = await db.users.count_documents({})
        total_enrollments = await db.learning_progress.count_documents({})
        total_completed = await db.learning_progress.count_documents({"status": "completed"})

        avg_completion = round((total_completed / max(total_enrollments, 1)) * 100, 1)

        return {
            "courses_by_category": [{"category": c["_id"] or "General", "count": c["count"]} for c in cat_counts],
            "courses_by_level": [{"level": l["_id"] or "Beginner", "count": l["count"]} for l in lvl_counts],
            "users_by_career_status": [{"status": s["_id"] or "Fresher", "count": s["count"]} for s in status_counts],
            "enrollment_metrics": {
                "total_users": total_users,
                "total_enrollments": total_enrollments,
                "completed_courses": total_completed,
                "completion_rate_percentage": avg_completion,
            },
        }

    # --------------------------------------------------------------------------
    # BUSINESS INTELLIGENCE (BI) ANALYTICS
    # --------------------------------------------------------------------------
    @staticmethod
    async def get_bi_analytics(days: str = "30") -> Dict[str, Any]:
        """
        Aggregate interactive business intelligence analytics across MongoDB
        collections (users, courses, learning_progress, mentorship_bookings).
        Returns KPIs and datasets for 8 interactive charts with date-filtering.
        """
        db = get_database()
        now = datetime.utcnow()

        days_clean = str(days).lower().replace("d", "")
        if days_clean == "7":
            num_days = 7
        elif days_clean == "90":
            num_days = 90
        elif days_clean in ("365", "year", "1y"):
            num_days = 365
        elif days_clean in ("all", "all_time"):
            num_days = 365 * 3
        else:
            num_days = 30

        start_date = now - timedelta(days=num_days)

        # 1. Total KPI metrics
        total_users = await db.users.count_documents({})
        total_courses = await db.courses.count_documents({})
        total_mentors = await db.mentors.count_documents({})
        total_enrollments = await db.learning_progress.count_documents({})
        completed_enrollments = await db.learning_progress.count_documents({"status": "completed"})
        total_bookings = await db.mentorship_bookings.count_documents({})

        new_users_count = await db.users.count_documents({"created_at": {"$gte": start_date}})
        completion_rate = round((completed_enrollments / max(total_enrollments, 1)) * 100, 1)

        # 2. Time series bucket generation (Daily for <=30 days, 3-day or bi-weekly for longer)
        step_days = 1 if num_days <= 30 else (3 if num_days <= 90 else 14)
        curr = start_date
        buckets = []
        while curr <= now + timedelta(days=1):
            buckets.append(curr.date())
            curr += timedelta(days=step_days)

        # 3. User Registration Growth
        users_cursor = db.users.find({}, {"created_at": 1, "_id": 1}).sort("created_at", 1)
        all_users = await users_cursor.to_list(5000)

        reg_map = {b: 0 for b in buckets}
        cumulative_before = 0
        for u in all_users:
            u_date = u.get("created_at")
            if isinstance(u_date, str):
                try:
                    u_date = datetime.fromisoformat(u_date.replace("Z", "+00:00"))
                except Exception:
                    u_date = now
            if not isinstance(u_date, datetime):
                u_date = now

            if u_date < start_date:
                cumulative_before += 1
            else:
                u_d = u_date.date()
                closest = min(buckets, key=lambda b: abs((b - u_d).days))
                reg_map[closest] = reg_map.get(closest, 0) + 1

        running_reg = cumulative_before
        growth_series = []
        for b in buckets:
            reg_count = reg_map.get(b, 0)
            running_reg += reg_count
            growth_series.append({
                "date": b.strftime("%b %d"),
                "registrations": reg_count,
                "cumulative": running_reg,
            })

        # 4. Courses by Category (Horizontal Bar Chart)
        cat_pipeline = [
            {"$group": {"_id": "$category", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
        ]
        cat_agg = await db.courses.aggregate(cat_pipeline).to_list(30)
        CATEGORY_LABELS = {
            "webdev": "Web Development",
            "datascience": "Data Science & AI",
            "data": "Data Science & AI",
            "design": "UI/UX Design",
            "softskills": "Soft Skills & Leadership",
            "mobile": "Mobile App Dev",
            "govt": "Government & Civil",
            "government": "Government & Civil",
            "cloud": "Cloud & DevOps",
            "security": "Cybersecurity",
        }
        courses_by_category = [
            {
                "category": CATEGORY_LABELS.get(c["_id"], str(c["_id"]).title() if c["_id"] else "General"),
                "raw_category": c["_id"] or "other",
                "count": c["count"],
            }
            for c in cat_agg
        ]

        # 5. Courses by Difficulty Level (Donut/Pie Chart)
        lvl_pipeline = [
            {"$group": {"_id": "$level", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
        ]
        lvl_agg = await db.courses.aggregate(lvl_pipeline).to_list(10)
        courses_by_difficulty = []
        for l in lvl_agg:
            lvl_name = (l["_id"] or "Beginner").capitalize()
            cnt = l["count"]
            pct = round((cnt / max(total_courses, 1)) * 100, 1)
            courses_by_difficulty.append({
                "name": lvl_name,
                "value": cnt,
                "percentage": pct,
            })

        # 6. Course Enrollment Trends (Time Series)
        enroll_cursor = db.learning_progress.find({}).sort("enrolled_at", 1)
        all_enrolls = await enroll_cursor.to_list(5000)
        enroll_map = {b: 0 for b in buckets}
        for e in all_enrolls:
            e_date = e.get("enrolled_at")
            if isinstance(e_date, str):
                try:
                    e_date = datetime.fromisoformat(e_date.replace("Z", "+00:00"))
                except Exception:
                    e_date = now
            if not isinstance(e_date, datetime):
                e_date = now

            if e_date >= start_date:
                e_d = e_date.date()
                closest = min(buckets, key=lambda b: abs((b - e_d).days))
                enroll_map[closest] = enroll_map.get(closest, 0) + 1

        enrollment_trends = [
            {
                "date": b.strftime("%b %d"),
                "enrollments": enroll_map.get(b, 0),
            }
            for b in buckets
        ]

        # 7. Enrollment Status Distribution (Donut Chart)
        status_pipeline = [
            {"$group": {"_id": "$status", "count": {"$sum": 1}}},
        ]
        status_agg = await db.learning_progress.aggregate(status_pipeline).to_list(10)
        STATUS_LABELS = {
            "enrolled": "Not Started",
            "not_started": "Not Started",
            "in_progress": "In Progress",
            "completed": "Completed",
        }
        status_counts = {"Not Started": 0, "In Progress": 0, "Completed": 0}
        for s in status_agg:
            label = STATUS_LABELS.get(s["_id"], "In Progress")
            status_counts[label] = status_counts.get(label, 0) + s["count"]

        enrollment_status_distribution = [
            {
                "name": k,
                "value": v,
                "percentage": round((v / max(total_enrollments, 1)) * 100, 1),
            }
            for k, v in status_counts.items()
        ]

        # 8. Top Performing Courses (Horizontal Bar Chart with metric switcher)
        top_courses_pipeline = [
            {
                "$group": {
                    "_id": "$course_id",
                    "enrollments": {"$sum": 1},
                    "completions": {
                        "$sum": {
                            "$cond": [{"$eq": ["$status", "completed"]}, 1, 0]
                        }
                    },
                }
            },
            {"$sort": {"enrollments": -1}},
            {"$limit": 8},
        ]
        top_agg = await db.learning_progress.aggregate(top_courses_pipeline).to_list(10)

        courses_dict = {}
        async for c in db.courses.find({}):
            courses_dict[c.get("id") or str(c.get("_id"))] = c.get("title", "Course")
            if "_id" in c:
                courses_dict[str(c["_id"])] = c.get("title", "Course")

        top_performing_courses = []
        for t in top_agg:
            cid = t["_id"]
            title = courses_dict.get(cid, cid)
            enr = t["enrollments"]
            comp = t["completions"]
            top_performing_courses.append({
                "id": cid,
                "title": title,
                "enrollments": enr,
                "completions": comp,
                "completion_rate": round((comp / max(enr, 1)) * 100, 1),
            })

        # Ensure at least 4 courses are displayed
        if len(top_performing_courses) < 4:
            async for c in db.courses.find({"status": "published"}).limit(5):
                cid = c.get("id") or str(c.get("_id"))
                if not any(x["id"] == cid for x in top_performing_courses):
                    top_performing_courses.append({
                        "id": cid,
                        "title": c.get("title", "Course"),
                        "enrollments": 0,
                        "completions": 0,
                        "completion_rate": 0.0,
                    })
                if len(top_performing_courses) >= 5:
                    break

        # 9. Mentorship Analytics (Status Breakdown)
        booking_status_pipeline = [
            {"$group": {"_id": "$status", "count": {"$sum": 1}}},
        ]
        booking_agg = await db.mentorship_bookings.aggregate(booking_status_pipeline).to_list(10)
        booking_map = {"Confirmed": 0, "Pending": 0, "Completed": 0, "Cancelled": 0}
        for b in booking_agg:
            st = str(b["_id"]).capitalize() if b["_id"] else "Pending"
            booking_map[st] = booking_map.get(st, 0) + b["count"]

        mentorship_analytics = [
            {"status": k, "count": v} for k, v in booking_map.items()
        ]

        # 10. Learner Engagement (Active learners over time from last_accessed_at or enrolled_at)
        active_map = {b: 0 for b in buckets}
        for e in all_enrolls:
            acc_date = e.get("last_accessed_at") or e.get("enrolled_at")
            if isinstance(acc_date, str):
                try:
                    acc_date = datetime.fromisoformat(acc_date.replace("Z", "+00:00"))
                except Exception:
                    acc_date = now
            if not isinstance(acc_date, datetime):
                acc_date = now

            if acc_date >= start_date:
                a_d = acc_date.date()
                closest = min(buckets, key=lambda b: abs((b - a_d).days))
                active_map[closest] = active_map.get(closest, 0) + 1

        learner_engagement = [
            {
                "date": b.strftime("%b %d"),
                "active_learners": active_map.get(b, 0),
            }
            for b in buckets
        ]

        return {
            "period": days,
            "kpis": {
                "total_users": total_users,
                "new_registrations": new_users_count,
                "total_courses": total_courses,
                "total_enrollments": total_enrollments,
                "completion_rate": completion_rate,
                "total_mentors": total_mentors,
                "mentor_bookings": total_bookings,
            },
            "user_registration_growth": growth_series,
            "courses_by_category": courses_by_category,
            "courses_by_difficulty": courses_by_difficulty,
            "course_enrollment_trends": enrollment_trends,
            "enrollment_status_distribution": enrollment_status_distribution,
            "top_performing_courses": top_performing_courses,
            "mentorship_analytics": mentorship_analytics,
            "learner_engagement": learner_engagement,
        }
