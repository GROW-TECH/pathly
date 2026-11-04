"""
Pathly Skills Roadmap & Learning Business Logic Service.
Handles personalized 3-stage roadmaps (Beginner, Intermediate, Advanced),
course progress tracking, completion calculations, and dashboard summaries in MongoDB.
"""

import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.db.mongodb import get_database
from app.core.courses_catalog import PATHLY_COURSES, get_course_by_id, find_courses_for_skills_or_query
from app.models.learning import LearningProgressModel, SavedCourseModel, UserRoadmapModel

logger = logging.getLogger("pathly.learning_service")

class LearningService:
    @staticmethod
    async def get_user_profile(user_id: str) -> Dict[str, Any]:
        """Fetch candidate profile from MongoDB or return default."""
        db = get_database()
        profile = await db.candidate_profiles.find_one({"user_id": str(user_id)})
        if not profile:
            from app.models.profile import CandidateProfileModel
            profile = CandidateProfileModel.create_default(user_id)
        return profile

    @staticmethod
    def build_dynamic_career_roadmap(
        target_role: str,
        user_skills: List[str],
        completed_titles_or_ids: Optional[set] = None,
    ) -> Dict[str, Any]:
        """
        Builds a realistic, personalized career roadmap based on target role and user profile.
        Statuses:
          - 'completed': ONLY if genuinely marked completed by user
          - 'current': the next incomplete milestone
          - 'upcoming': all future milestones
        Zero fake progress; progress is strictly (completed / total) * 100.
        """
        completed_set = completed_titles_or_ids or set()
        role_lower = target_role.lower()

        raw_milestones: List[Dict[str, Any]] = []
        icon_type = "tech"
        primary_course_id = "course-1"
        primary_course_title = "Web Development Bootcamp"
        title = f"{target_role} Career Track"
        description = f"Curated sequence of lessons and projects tailored to your target {target_role} role."

        if "frontend" in role_lower or "web" in role_lower:
            icon_type = "tech"
            primary_course_id = "course-1"
            primary_course_title = "Web Development Bootcamp"
            title = "Frontend Engineer Career Track"
            raw_milestones = [
                {
                    "id": "m1",
                    "title": "HTML/CSS & Responsive Design",
                    "skills": ["HTML5", "CSS3", "Flexbox", "Grid"],
                    "course_id": "course-1",
                    "project": "Responsive Portfolio Website",
                },
                {
                    "id": "m2",
                    "title": "JavaScript ES6+ & DOM Mastery",
                    "skills": ["JavaScript", "ES6+", "DOM", "Async/Await"],
                    "course_id": "course-1",
                    "project": "Interactive Task Management Web App",
                },
                {
                    "id": "m3",
                    "title": "React 18 & State Management",
                    "skills": ["React", "Custom Hooks", "Context API", "Tailwind CSS"],
                    "course_id": "course-4",
                    "project": "Full-Featured Dynamic E-Commerce App",
                },
                {
                    "id": "m4",
                    "title": "Next.js 14 App Router & SSR",
                    "skills": ["Next.js", "Server Components", "MongoDB", "REST APIs"],
                    "course_id": "course-4",
                    "project": "Full-Stack SaaS Platform with Database Integration",
                },
                {
                    "id": "m5",
                    "title": "Testing (Jest/RTL) & Production CI",
                    "skills": ["Jest", "Testing Library", "CI/CD", "Vercel Deployment"],
                    "course_id": "course-4",
                    "project": "Production-Ready Deployment with Automated Tests",
                },
            ]
        elif "data" in role_lower or "python" in role_lower or "analyst" in role_lower:
            icon_type = "data"
            primary_course_id = "course-2"
            primary_course_title = "Python for Data Analysis"
            title = "Data Analyst Career Track"
            raw_milestones = [
                {
                    "id": "m1",
                    "title": "Python Programming & Core Data Structures",
                    "skills": ["Python", "Control Flow", "Functions", "OOP"],
                    "course_id": "course-2",
                    "project": "Automated Data Extraction & File Processing Script",
                },
                {
                    "id": "m2",
                    "title": "Data Wrangling with Pandas & NumPy",
                    "skills": ["Pandas", "NumPy", "Data Cleaning", "Aggregations"],
                    "course_id": "course-2",
                    "project": "Customer Churn & Retention Cleaning Pipeline",
                },
                {
                    "id": "m3",
                    "title": "Exploratory Data Analysis & Visualization",
                    "skills": ["Matplotlib", "Seaborn", "Statistical Analysis"],
                    "course_id": "course-2",
                    "project": "Global E-Commerce Sales Trend Analysis & Report",
                },
                {
                    "id": "m4",
                    "title": "SQL Queries & Relational Database Design",
                    "skills": ["SQL", "PostgreSQL", "Joins", "Subqueries"],
                    "course_id": "course-2",
                    "project": "Relational Business Intelligence Analytics Schema",
                },
                {
                    "id": "m5",
                    "title": "Interactive Dashboards & Business Insights",
                    "skills": ["Dashboarding", "Streamlit", "KPI Metrics", "Storytelling"],
                    "course_id": "course-2",
                    "project": "Executive Business KPI & Insights Dashboard",
                },
            ]
        elif "design" in role_lower or "ui" in role_lower or "ux" in role_lower:
            icon_type = "design"
            primary_course_id = "course-3"
            primary_course_title = "UX/UI Design Fundamentals"
            title = "UI/UX Designer Career Track"
            raw_milestones = [
                {
                    "id": "m1",
                    "title": "UX Research Methods & Empathy Personas",
                    "skills": ["User Research", "Empathy Maps", "Personas", "Surveys"],
                    "course_id": "course-3",
                    "project": "User Pain Points Analysis & Research Case Study",
                },
                {
                    "id": "m2",
                    "title": "Wireframing & Information Architecture",
                    "skills": ["Wireframing", "User Flows", "Site Mapping"],
                    "course_id": "course-3",
                    "project": "Mobile Banking Application Wireframe Blueprint",
                },
                {
                    "id": "m3",
                    "title": "High-Fidelity Interface Design in Figma",
                    "skills": ["Figma", "Auto-Layout", "Design Tokens", "Typography"],
                    "course_id": "course-3",
                    "project": "Pixel-Perfect Responsive SaaS Web Interface",
                },
                {
                    "id": "m4",
                    "title": "Interactive Prototyping & Micro-interactions",
                    "skills": ["Prototyping", "Smart Animate", "Interactive Components"],
                    "course_id": "course-3",
                    "project": "High-Fidelity Clickable Mobile App Experience",
                },
                {
                    "id": "m5",
                    "title": "Design Systems & Usability Testing",
                    "skills": ["Design Systems", "Usability Testing", "Accessibility"],
                    "course_id": "course-3",
                    "project": "Multi-Brand Design System & Component Library",
                },
            ]
        elif "tnpsc" in role_lower or "govt" in role_lower or "government" in role_lower:
            icon_type = "govt"
            primary_course_id = "course-7"
            primary_course_title = "TNPSC Group 4 Complete Preparation"
            title = "TNPSC Group & State Service Track"
            raw_milestones = [
                {
                    "id": "m1",
                    "title": "General Studies & Tamil Nadu History",
                    "skills": ["History", "Tamil Literature", "Culture"],
                    "course_id": "course-7",
                    "project": "Comprehensive Historical Timeline & Fact Revision",
                },
                {
                    "id": "m2",
                    "title": "Aptitude & Mental Ability Problem Solving",
                    "skills": ["Aptitude", "Mental Ability", "Reasoning"],
                    "course_id": "course-7",
                    "project": "Quantitative Speed Drills & Formula Mastery",
                },
                {
                    "id": "m3",
                    "title": "Indian Polity & Constitution Analysis",
                    "skills": ["Polity", "Constitution", "Amendments"],
                    "course_id": "course-7",
                    "project": "Constitutional Articles & Landmark Judgments Review",
                },
                {
                    "id": "m4",
                    "title": "Current Affairs & Mock Test Series",
                    "skills": ["Current Affairs", "Exam Strategy", "Speed Tests"],
                    "course_id": "course-7",
                    "project": "Timed Mock Examination Simulation & Analysis",
                },
            ]
        else:
            icon_type = "tech"
            primary_course_id = "course-1"
            primary_course_title = "Web Development Bootcamp"
            title = f"{target_role} Career Track"
            raw_milestones = [
                {
                    "id": "m1",
                    "title": f"Core Technical Foundations for {target_role}",
                    "skills": ["Core Fundamentals", "Tooling", "Syntax"],
                    "course_id": "course-1",
                    "project": "Foundational Implementation Project",
                },
                {
                    "id": "m2",
                    "title": "Practical Architecture & Applied Development",
                    "skills": ["Frameworks", "Data Structures", "Architecture"],
                    "course_id": "course-4",
                    "project": "Applied Domain Solution Application",
                },
                {
                    "id": "m3",
                    "title": "System Integration & Data Persistence",
                    "skills": ["Database", "APIs", "Authentication"],
                    "course_id": "course-4",
                    "project": "Connected Multi-Tier Application",
                },
                {
                    "id": "m4",
                    "title": "Testing, Optimization & Code Quality",
                    "skills": ["Unit Testing", "Debugging", "Optimization"],
                    "course_id": "course-4",
                    "project": "Comprehensive Test Suite & Performance Tuning",
                },
                {
                    "id": "m5",
                    "title": "Production Deployment & Capstone Portfolio",
                    "skills": ["CI/CD", "Cloud Deployment", "Documentation"],
                    "course_id": "course-5",
                    "project": "Production-Ready Industry Capstone Project",
                },
            ]

        # Determine statuses sequentially:
        # 1. Done: genuinely marked completed
        # 2. Current: the FIRST incomplete milestone
        # 3. Upcoming: all subsequent incomplete milestones
        final_milestones: List[Dict[str, Any]] = []
        found_current = False

        for m in raw_milestones:
            m_copy = dict(m)
            is_done = m["id"] in completed_set or m["title"] in completed_set

            if is_done:
                m_copy["status"] = "completed"
            elif not found_current:
                m_copy["status"] = "current"
                found_current = True
            else:
                m_copy["status"] = "upcoming"

            final_milestones.append(m_copy)

        # Real calculated progress
        completed_count = sum(1 for m in final_milestones if m["status"] == "completed")
        overall_progress = int((completed_count / max(len(final_milestones), 1)) * 100) if final_milestones else 0

        # Synthesize 3-stage structure (Beginner, Intermediate, Advanced) for backward and test compatibility
        split_b = max(1, len(final_milestones) // 3)
        split_i = max(split_b + 1, (2 * len(final_milestones)) // 3)
        b_ms = final_milestones[:split_b]
        i_ms = final_milestones[split_b:split_i]
        a_ms = final_milestones[split_i:]

        stages = [
            {
                "stage_id": "stage-beginner",
                "level": "Beginner",
                "title": f"Stage 1: Core {target_role} Foundations",
                "description": "Master core concepts, fundamentals, and build foundational domain projects.",
                "estimated_duration": "4 Weeks",
                "focus_skills": [s for m in b_ms for s in m.get("skills", [])][:4],
                "milestones": b_ms,
            },
            {
                "stage_id": "stage-intermediate",
                "level": "Intermediate",
                "title": f"Stage 2: Practical Application & Integration",
                "description": "Deepen practical abilities with real-world architectures and integrated projects.",
                "estimated_duration": "5 Weeks",
                "focus_skills": [s for m in i_ms for s in m.get("skills", [])][:4],
                "milestones": i_ms,
            },
            {
                "stage_id": "stage-advanced",
                "level": "Advanced",
                "title": f"Stage 3: Production & Industry Readiness",
                "description": "Deliver high-impact capstone implementations, testing, and portfolio showcases.",
                "estimated_duration": "6 Weeks",
                "focus_skills": [s for m in a_ms for s in m.get("skills", [])][:4],
                "milestones": a_ms,
            },
        ]

        return {
            "title": title,
            "description": description,
            "target_role": target_role,
            "icon_type": icon_type,
            "course_id": primary_course_id,
            "course_title": primary_course_title,
            "milestones": final_milestones,
            "stages": stages,
            "overall_progress": overall_progress,
            "progress": overall_progress,
        }

    @staticmethod
    async def get_or_create_user_roadmap(user_id: str) -> Dict[str, Any]:
        """Retrieve existing roadmap from MongoDB or generate fresh personalized roadmap."""
        db = get_database()
        existing = await db.user_roadmaps.find_one({"user_id": str(user_id)})
        if existing:
            return UserRoadmapModel.to_response(existing)

        # Generate fresh roadmap based on user's real profile
        return await LearningService.generate_ai_roadmap(user_id)

    @staticmethod
    async def generate_ai_roadmap(user_id: str) -> Dict[str, Any]:
        """
        Generates or refreshes a personalized career roadmap using candidate profile.
        Preserves previously completed milestones where they remain relevant.
        """
        db = get_database()
        profile = await LearningService.get_user_profile(user_id)
        target_role = profile.get("target_role", "Frontend Engineer")
        
        # Check existing roadmap to preserve completed milestones
        existing = await db.user_roadmaps.find_one({"user_id": str(user_id)})
        completed_set = set()
        if existing:
            for m in existing.get("milestones", []):
                if m.get("status") == "completed":
                    completed_set.add(m.get("id"))
                    completed_set.add(m.get("title"))
            for s in existing.get("stages", []):
                for m in s.get("milestones", []):
                    if m.get("status") == "completed":
                        completed_set.add(m.get("id"))
                        completed_set.add(m.get("title"))

        raw_skills = profile.get("skills", [])
        user_skills = [
            s.get("name") if isinstance(s, dict) else str(s)
            for s in raw_skills
        ]

        roadmap_data = LearningService.build_dynamic_career_roadmap(
            target_role=target_role,
            user_skills=user_skills,
            completed_titles_or_ids=completed_set,
        )

        doc = UserRoadmapModel.create(
            user_id=user_id,
            target_role=target_role,
            title=roadmap_data["title"],
            description=roadmap_data["description"],
            milestones=roadmap_data["milestones"],
            course_id=roadmap_data.get("course_id", "course-1"),
            course_title=roadmap_data.get("course_title", "Recommended Course"),
            icon_type=roadmap_data.get("icon_type", "tech"),
            stages=roadmap_data.get("stages", []),
        )

        # Upsert single active roadmap per user in MongoDB (prevent duplicates, preserve _id)
        doc_data = {k: v for k, v in doc.items() if k != "_id"}
        if existing and "_id" in existing:
            doc["_id"] = existing["_id"]

        await db.user_roadmaps.update_one(
            {"user_id": str(user_id)},
            {
                "$set": doc_data,
                "$setOnInsert": {"_id": doc["_id"]},
            },
            upsert=True,
        )

        return UserRoadmapModel.to_response(doc)

    @staticmethod
    async def toggle_roadmap_milestone(
        user_id: str, milestone_id: str, completed: bool, stage_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Toggle a milestone completion status and recalculate real overall progress.
        Maintains sequential status:
          - Completed milestones: 'completed'
          - First incomplete milestone: 'current'
          - Remaining incomplete milestones: 'upcoming'
        """
        db = get_database()
        roadmap = await db.user_roadmaps.find_one({"user_id": str(user_id)})
        if not roadmap:
            roadmap = await LearningService.generate_ai_roadmap(user_id)
            roadmap = await db.user_roadmaps.find_one({"user_id": str(user_id)})

        milestones = roadmap.get("milestones", [])
        
        # If legacy doc only has stages, extract milestones
        if not milestones and roadmap.get("stages"):
            for s in roadmap.get("stages", []):
                for m in s.get("milestones", []):
                    milestones.append(m)

        # Update target milestone
        for m in milestones:
            if m.get("id") == milestone_id or m.get("title") == milestone_id:
                m["status"] = "completed" if completed else "upcoming"
                m["completed_at"] = datetime.utcnow().isoformat() if completed else None

        # Re-evaluate statuses sequentially:
        # All completed stay 'completed'
        # The FIRST incomplete becomes 'current'
        # The rest become 'upcoming'
        found_current = False
        completed_count = 0

        for m in milestones:
            if m.get("status") == "completed":
                completed_count += 1
            elif not found_current:
                m["status"] = "current"
                found_current = True
            else:
                m["status"] = "upcoming"

        total_milestones = len(milestones)
        overall_progress = int((completed_count / max(total_milestones, 1)) * 100) if total_milestones > 0 else 0

        updated_data = {
            "milestones": milestones,
            "overall_progress": overall_progress,
            "progress": overall_progress,
            "total_milestones": total_milestones,
            "completed_milestones": completed_count,
            "updated_at": datetime.utcnow(),
        }

        await db.user_roadmaps.update_one({"user_id": str(user_id)}, {"$set": updated_data})
        roadmap.update(updated_data)
        return UserRoadmapModel.to_response(roadmap)

    # --------------------------------------------------------------------------
    # COURSE ENROLLMENT & PROGRESS TRACKING
    # --------------------------------------------------------------------------

    @staticmethod
    async def enroll_course(user_id: str, course_id: str) -> Dict[str, Any]:
        """Enroll the user in a course if not already enrolled."""
        db = get_database()
        existing = await db.learning_progress.find_one({"user_id": str(user_id), "course_id": course_id})
        if existing:
            return LearningProgressModel.to_response(existing)

        course = await db.courses.find_one({"$or": [{"_id": course_id}, {"id": course_id}]})
        if not course:
            course = get_course_by_id(course_id)
        total_lessons = sum(m.get("lessons", 0) for m in course.get("modules", [])) if course else 10
        total_lessons = max(total_lessons, 5)

        doc = LearningProgressModel.create(
            user_id=user_id,
            course_id=course_id,
            total_lessons=total_lessons,
        )
        await db.learning_progress.insert_one(doc)
        return LearningProgressModel.to_response(doc)

    @staticmethod
    async def update_course_progress(
        user_id: str,
        course_id: str,
        module_id: Optional[str] = None,
        lesson_id: Optional[str] = None,
        completed: bool = True,
    ) -> Dict[str, Any]:
        """Mark a lesson or module as completed/incompleted and recalculate actual percentage."""
        db = get_database()
        existing = await db.learning_progress.find_one({"user_id": str(user_id), "course_id": course_id})

        course = await db.courses.find_one({"$or": [{"_id": course_id}, {"id": course_id}]})
        if not course:
            course = get_course_by_id(course_id)
        total_lessons = sum(m.get("lessons", 0) for m in course.get("modules", [])) if course else 10
        total_lessons = max(total_lessons, 5)

        if not existing:
            existing = LearningProgressModel.create(user_id=user_id, course_id=course_id, total_lessons=total_lessons)
            await db.learning_progress.insert_one(existing)

        completed_modules = set(existing.get("completed_modules", []))
        completed_lessons = set(existing.get("completed_lessons", []))

        # Update lesson if provided
        if lesson_id:
            if completed:
                completed_lessons.add(lesson_id)
            else:
                completed_lessons.discard(lesson_id)

        # Update module if provided
        if module_id:
            if completed:
                completed_modules.add(module_id)
            else:
                completed_modules.discard(module_id)

        # If a module was marked complete without explicit lessons, add synthetic lessons
        if module_id and completed and course:
            for m in course.get("modules", []):
                if m.get("id") == module_id:
                    for i in range(1, m.get("lessons", 1) + 1):
                        completed_lessons.add(f"{module_id}-l{i}")

        progress_pct = min(100, int((len(completed_lessons) / total_lessons) * 100))
        status = "completed" if progress_pct >= 100 else ("in_progress" if progress_pct > 0 else "enrolled")
        now = datetime.utcnow()

        updated_fields = {
            "completed_modules": list(completed_modules),
            "completed_lessons": list(completed_lessons),
            "progress_percentage": progress_pct,
            "status": status,
            "last_accessed_at": now,
            "updated_at": now,
        }
        if status == "completed" and not existing.get("completed_at"):
            updated_fields["completed_at"] = now

        await db.learning_progress.update_one(
            {"user_id": str(user_id), "course_id": course_id},
            {"$set": updated_fields},
        )
        existing.update(updated_fields)
        return LearningProgressModel.to_response(existing)

    @staticmethod
    async def get_all_courses_enriched(user_id: str) -> List[Dict[str, Any]]:
        """
        Returns all Pathly courses with real user enrollment progress and saved status from MongoDB.
        """
        db = get_database()
        # Fetch user progress records
        progress_cursor = db.learning_progress.find({"user_id": str(user_id)})
        progress_docs = await progress_cursor.to_list(length=100)
        progress_map = {p["course_id"]: p for p in progress_docs}

        # Fetch user saved courses
        saved_cursor = db.saved_courses.find({"user_id": str(user_id)})
        saved_docs = await saved_cursor.to_list(length=100)
        saved_ids = {s["course_id"] for s in saved_docs}

        # Fetch published courses from MongoDB (falls back to PATHLY_COURSES if empty)
        db_courses = await db.courses.find({"status": "published"}).to_list(length=200)
        source_courses = db_courses if db_courses else PATHLY_COURSES

        enriched_courses = []
        for c in source_courses:
            c_copy = dict(c)
            cid = str(c_copy.get("id") or c_copy.get("_id"))
            c_copy["id"] = cid
            prog = progress_map.get(cid)
            if prog:
                c_copy["isEnrolled"] = True
                c_copy["progress"] = prog.get("progress_percentage", 0)
                c_copy["status"] = prog.get("status", "enrolled")
                c_copy["completed_lessons"] = prog.get("completed_lessons", [])
                c_copy["completed_modules"] = prog.get("completed_modules", [])
            else:
                c_copy["isEnrolled"] = False
                c_copy["progress"] = 0
                c_copy["status"] = "not_enrolled"
                c_copy["completed_lessons"] = []
                c_copy["completed_modules"] = []

            c_copy["isSaved"] = cid in saved_ids
            # Direct link for course view
            c_copy["link"] = f"/courses/{cid}"
            enriched_courses.append(c_copy)

        return enriched_courses

    # --------------------------------------------------------------------------
    # SAVED COURSES
    # --------------------------------------------------------------------------

    @staticmethod
    async def toggle_save_course(user_id: str, course_id: str) -> Dict[str, Any]:
        """Bookmark or un-bookmark a course in MongoDB."""
        db = get_database()
        existing = await db.saved_courses.find_one({"user_id": str(user_id), "course_id": course_id})
        if existing:
            await db.saved_courses.delete_one({"_id": existing["_id"]})
            return {"course_id": course_id, "is_saved": False, "message": "Course removed from saved"}
        else:
            doc = SavedCourseModel.create(user_id=user_id, course_id=course_id)
            await db.saved_courses.insert_one(doc)
            return {"course_id": course_id, "is_saved": True, "message": "Course saved successfully"}

    @staticmethod
    async def get_saved_courses(user_id: str) -> List[Dict[str, Any]]:
        """Return all saved courses with full course details."""
        db = get_database()
        cursor = db.saved_courses.find({"user_id": str(user_id)}).sort("saved_at", -1)
        docs = await cursor.to_list(length=100)
        
        results = []
        for d in docs:
            resp = SavedCourseModel.to_response(d)
            course = get_course_by_id(d["course_id"])
            resp["course_details"] = course
            results.append(resp)
        return results

    # --------------------------------------------------------------------------
    # LEARNING DASHBOARD SUMMARY
    # --------------------------------------------------------------------------

    @staticmethod
    async def get_dashboard_summary(user_id: str) -> Dict[str, Any]:
        """
        Calculates summary metrics:
        - Active Courses, Completed Courses, Skills Improved, Overall Progress %
        - Next learning milestone
        """
        courses = await LearningService.get_all_courses_enriched(user_id)
        active_courses = [c for c in courses if c.get("isEnrolled") and c.get("status") != "completed"]
        completed_courses = [c for c in courses if c.get("status") == "completed"]

        # Skills improved
        skills_set = set()
        for c in completed_courses + active_courses:
            for s in c.get("skills", []):
                skills_set.add(s)

        # Calculate overall progress across enrolled courses
        enrolled = [c for c in courses if c.get("isEnrolled")]
        if enrolled:
            total_prog = sum(c.get("progress", 0) for c in enrolled)
            overall_pct = int(total_prog / len(enrolled))
        else:
            overall_pct = 0

        # Retrieve next milestone from roadmap
        roadmap = await LearningService.get_or_create_user_roadmap(user_id)
        upcoming_milestone = None
        for s in roadmap.get("stages", []):
            for m in s.get("milestones", []):
                if m.get("status") in ("in-progress", "locked"):
                    upcoming_milestone = {
                        "stage_title": s.get("title"),
                        "stage_level": s.get("level"),
                        "milestone_title": m.get("title"),
                        "skills": m.get("skills", []),
                        "course_id": m.get("course_id") or s.get("matched_course_id"),
                    }
                    break
            if upcoming_milestone:
                break

        return {
            "active_courses_count": len(active_courses),
            "completed_courses_count": len(completed_courses),
            "skills_improved_count": len(skills_set),
            "overall_progress_percentage": overall_pct,
            "active_courses": active_courses,
            "completed_courses": completed_courses,
            "skills_improved": sorted(list(skills_set)),
            "upcoming_milestone": upcoming_milestone,
        }

    # --------------------------------------------------------------------------
    # GAP-BASED COURSE RECOMMENDATIONS
    # --------------------------------------------------------------------------

    @staticmethod
    async def get_gap_recommendations(user_id: str) -> List[Dict[str, Any]]:
        """
        Recommends courses addressing user's skill gaps and prioritizes free courses.
        """
        profile = await LearningService.get_user_profile(user_id)
        raw_skills = profile.get("skills", [])
        current_skills = [s.get("name") if isinstance(s, dict) else str(s) for s in raw_skills]
        target_role = profile.get("target_role", "Frontend Engineer")

        # Find skill gap
        from app.services.ai_service import AIService
        gap_analysis = await AIService.analyze_skill_gap(user_id=user_id, target_role=target_role)
        missing_skills = gap_analysis.get("missing_skills", [])

        # Match courses
        matched = find_courses_for_skills_or_query(missing_skills + [target_role])

        # Prioritize free courses
        sorted_courses = sorted(
            matched,
            key=lambda c: (0 if c.get("price", "").lower() == "free" else 1, -c.get("rating", 0))
        )

        results = []
        for c in sorted_courses:
            c_copy = dict(c)
            c_copy["why_recommended"] = f"Targets missing skills: {', '.join(set(c['skills']).intersection(set(missing_skills))) or target_role}"
            c_copy["link"] = f"/courses/{c['id']}"
            results.append(c_copy)

        return results
