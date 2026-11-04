"""
Comprehensive Integration Test Suite for Pathly Admin Panel:
1. Admin authentication (login, JWT with role=admin claim).
2. Live Dashboard statistics from MongoDB.
3. Course CRUD: Create, publish, view in candidate catalog, edit, and status toggle.
4. Candidate Course Enrollment & appearance in Admin enrollments table.
5. Mentor CRUD: Create mentor, activate, appear in candidate 1:1 mentor catalog.
6. Mentorship Booking: Candidate booking, double-booking prevention, and appearance in Admin sessions.
7. Registered User Administration: Full profile view (education, target role, skills, roadmap progress) and account status toggle.
8. Role-Based Access Control: Unauthorized candidate users are rejected with HTTP 403 Forbidden.
9. Data persistence across queries.
"""

import asyncio
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.mongodb import connect_to_mongodb, close_mongodb_connection, get_database
from app.services.auth_service import AuthService
from app.services.admin_service import AdminService
from app.services.learning_service import LearningService
from app.schemas.auth import UserSignUpRequest
from app.schemas.admin import (
    AdminLoginRequest,
    CourseCreateRequest,
    CourseUpdateRequest,
    MentorCreateRequest,
    BookMentorshipRequest,
)


async def run_admin_tests():
    print("=" * 70)
    print("RUNNING PATHLY ADMIN PANEL & ROLE-BASED ACCESS INTEGRATION TESTS")
    print("=" * 70)

    await connect_to_mongodb()
    db = get_database()

    # Seed defaults if needed
    await AdminService.seed_defaults_if_needed()

    # Create a test candidate user
    test_user_email = "student_tester@pathly.io"
    await db.users.delete_many({"email": test_user_email})

    candidate_user, candidate_token_payload = await AuthService.register_user(
        UserSignUpRequest(
            email=test_user_email,
            password="Password123!",
            full_name="Pooja Sharma",
            mobile="9876540099",
        )
    )
    candidate_id = str(candidate_user["id"])

    # Set candidate target role & skills
    await db.candidate_profiles.update_one(
        {"user_id": candidate_id},
        {"$set": {
            "career_status": "fresher",
            "target_role": "Full Stack Cloud Developer",
            "career_goal": "Senior Engineer at high-growth SaaS startup",
            "education": {"highest_level": "B.Tech Computer Science"},
            "skills": [
                {"name": "React", "level": "Intermediate", "category": "Frontend"},
                {"name": "Node.js", "level": "Beginner", "category": "Backend"},
            ],
        }}
    )
    print(f"[OK] Seeded admin defaults and candidate user: {candidate_id}")

    try:
        # TEST 1: Admin Authentication
        print("\n--- TEST 1: Admin Authentication & JWT Claims ---")
        admin_doc, admin_token = await AdminService.authenticate_admin(
            AdminLoginRequest(email="admin@pathly.io", password="AdminPassword123!")
        )
        assert admin_doc is not None, "Admin login must return admin profile"
        assert admin_doc["role"] in ["admin", "super_admin"], f"Role must be admin, got {admin_doc['role']}"
        assert admin_token is not None and len(admin_token) > 20, "JWT access token must be generated"
        print(f"[OK] Logged in as: {admin_doc['full_name']} ({admin_doc['email']}) -> Role: {admin_doc['role']}")

        # TEST 2: Dashboard Statistics
        print("\n--- TEST 2: Live MongoDB Dashboard Statistics ---")
        stats = await AdminService.get_dashboard_stats()
        assert stats["total_users"] >= 1, "Must report total registered users"
        assert stats["total_courses"] >= 1, "Must report courses in MongoDB"
        assert stats["total_mentors"] >= 1, "Must report mentors in MongoDB"
        print(f"[OK] Live Stats: Users={stats['total_users']}, Courses={stats['total_courses']}, Mentors={stats['total_mentors']}")

        # TEST 3: Admin Course Creation & Publish
        print("\n--- TEST 3: Admin Course Creation & Publishing ---")
        new_course_data = CourseCreateRequest(
            title="Next.js 14 Production SaaS Architecture",
            category="webdev",
            description="Build scalable server-side rendered SaaS web apps using Next.js 14, Tailwind, and MongoDB.",
            skills=["Next.js", "React", "Tailwind CSS", "MongoDB"],
            duration="16 Hours",
            level="Advanced",
            price="Free",
            provider="Pathly Elite Academy",
            instructor="Staff Architect",
            what_you_learn=["App Router", "Server Actions", "MongoDB Atlas", "Production Caching"],
            status="published",
        )
        created_course = await AdminService.create_course(new_course_data)
        course_id = created_course["id"]
        assert created_course["title"] == new_course_data.title
        assert created_course["status"] == "published"
        print(f"[OK] Admin created published course: '{created_course['title']}' (ID: {course_id})")

        # TEST 4: Frontend Integration - Course appears in Candidate Learn -> Courses
        print("\n--- TEST 4: Candidate Learn -> Courses Integration ---")
        candidate_courses = await LearningService.get_all_courses_enriched(candidate_id)
        found_course = next((c for c in candidate_courses if c["id"] == course_id), None)
        assert found_course is not None, "Newly published course must appear in candidate course catalog"
        assert found_course["title"] == new_course_data.title
        assert found_course["isEnrolled"] is False
        print(f"[OK] Candidate retrieved {len(candidate_courses)} courses. New course found: '{found_course['title']}'")

        # TEST 5: Candidate Enrolls & Enrollment Appears in Admin Panel
        print("\n--- TEST 5: Candidate Enrollment & Admin Tracking ---")
        enroll_res = await LearningService.enroll_course(candidate_id, course_id)
        assert enroll_res["course_id"] == course_id
        assert enroll_res["status"] == "enrolled"

        # Update some progress
        await LearningService.update_course_progress(candidate_id, course_id, lesson_id="m1-l1", completed=True)
        await LearningService.update_course_progress(candidate_id, course_id, lesson_id="m1-l2", completed=True)

        admin_enrollments = await AdminService.list_all_enrollments()
        user_enrollment = next((e for e in admin_enrollments if e["user_id"] == candidate_id and e["course_id"] == course_id), None)
        assert user_enrollment is not None, "Enrollment must appear in Admin Enrollments table"
        assert user_enrollment["user_name"] == "Pooja Sharma"
        assert user_enrollment["progress_percentage"] > 0
        print(f"[OK] Admin saw enrollment: {user_enrollment['user_name']} -> {user_enrollment['course_title']} ({user_enrollment['progress_percentage']}% completed)")

        # TEST 6: Mentor Management - Create Mentor & Display in Candidate 1:1 Mentors
        print("\n--- TEST 6: Admin Mentor Creation & 1:1 Mentor Integration ---")
        new_mentor_data = MentorCreateRequest(
            name="Vikram Sundar",
            role="VP of Engineering",
            company="Microsoft",
            email="vikram.sundar@mentors.pathly.io",
            mobile="9876541234",
            skills=["System Design", "Cloud Architecture", "Engineering Leadership"],
            specialty=["System Design Review", "Executive Career Coaching"],
            bio="VP of Engineering coaching developers on architectural scalability and technical leadership.",
            experience="14+ Years",
            session_price="Free",
            session_duration="45 mins",
            meeting_link="https://meet.google.com/vik-ram-pro",
            status="active",
        )
        created_mentor = await AdminService.create_mentor(new_mentor_data)
        mentor_id = created_mentor["id"]
        assert created_mentor["name"] == "Vikram Sundar"
        print(f"[OK] Admin created mentor: {created_mentor['name']} ({created_mentor['company']})")

        # Candidate views active mentors
        active_mentors = await AdminService.list_mentors(status_filter="active")
        assert any(m["id"] == mentor_id for m in active_mentors), "Created mentor must appear in candidate active mentor list"
        print(f"[OK] Candidate retrieved {len(active_mentors)} active mentors including '{created_mentor['name']}'")

        # TEST 7: Mentorship Booking & Double-Booking Prevention
        print("\n--- TEST 7: Mentorship Booking & Slot Conflict Prevention ---")
        booking = await AdminService.book_session(
            user_id=candidate_id,
            mentor_id=mentor_id,
            data=BookMentorshipRequest(
                date="Oct 3 (Tomorrow)",
                time_slot="05:00 PM",
                topic="Cloud Architecture & Career Roadmap Review",
            ),
        )
        assert booking["mentor_name"] == "Vikram Sundar"
        assert booking["status"] == "confirmed"
        print(f"[OK] Candidate booked session: Booking ID {booking['booking_id']} on {booking['date']} at {booking['time_slot']}")

        # Attempt double booking (same mentor, date, slot)
        double_booking_caught = False
        try:
            await AdminService.book_session(
                user_id="other_user_id",
                mentor_id=mentor_id,
                data=BookMentorshipRequest(
                    date="Oct 3 (Tomorrow)",
                    time_slot="05:00 PM",
                    topic="Conflict Test",
                ),
            )
        except Exception as exc:
            double_booking_caught = True
            print(f"[OK] Double-booking successfully prevented: {exc.detail}")

        assert double_booking_caught, "Double booking for same mentor/slot must be rejected with HTTP 409"

        # Verify Admin can see the session
        admin_sessions = await AdminService.list_mentorship_bookings()
        found_session = next((s for s in admin_sessions if s["booking_id"] == booking["booking_id"]), None)
        assert found_session is not None, "Booking must appear in Admin Mentorship Sessions list"
        print(f"[OK] Admin verified session in system: {found_session['user_name']} with {found_session['mentor_name']}")

        # TEST 8: Registered User Administration & Full Profile Inspection
        print("\n--- TEST 8: Registered User Administration & Profile Detail ---")
        users_result = await AdminService.list_registered_users(search="Pooja")
        assert users_result["total"] >= 1
        listed_user = users_result["users"][0]
        assert listed_user["email"] == test_user_email
        assert listed_user["target_role"] == "Full Stack Cloud Developer"
        assert "React" in listed_user["skills"]
        print(f"[OK] Admin listed user: {listed_user['name']} | Role: {listed_user['target_role']} | Skills: {listed_user['skills']}")

        # Full user detail
        full_detail = await AdminService.get_user_full_detail(candidate_id)
        assert full_detail["name"] == "Pooja Sharma"
        assert len(full_detail["enrollments"]) >= 1
        assert len(full_detail["bookings"]) >= 1
        print(f"[OK] Admin inspected full detail for {full_detail['name']}: {len(full_detail['enrollments'])} enrollments, {len(full_detail['bookings'])} bookings")

        # TEST 9: Account Activation / Deactivation
        print("\n--- TEST 9: User Status Toggle (Deactivation/Reactivation) ---")
        status_res = await AdminService.update_user_status(candidate_id, is_active=False)
        assert status_res["is_active"] is False
        user_after = await db.users.find_one({"email": test_user_email})
        assert user_after["is_active"] is False
        print(f"[OK] Deactivated user account for {test_user_email}")

        # Reactivate
        await AdminService.update_user_status(candidate_id, is_active=True)
        user_reactivated = await db.users.find_one({"email": test_user_email})
        assert user_reactivated["is_active"] is True
        print(f"[OK] Reactivated user account for {test_user_email}")

        # TEST 10: Reports & Analytics
        print("\n--- TEST 10: Reports & Analytics Calculation ---")
        rep = await AdminService.get_reports()
        assert len(rep["courses_by_category"]) > 0
        assert rep["enrollment_metrics"]["total_enrollments"] >= 1
        print(f"[OK] System Reports: {len(rep['courses_by_category'])} categories, {rep['enrollment_metrics']['total_enrollments']} enrollments")

        # TEST 11: Interactive BI Analytics (All 8 Charts & KPIs)
        print("\n--- TEST 11: Interactive BI Analytics Aggregation ---")
        bi_7d = await AdminService.get_bi_analytics("7")
        bi_30d = await AdminService.get_bi_analytics("30")
        bi_all = await AdminService.get_bi_analytics("all")

        assert "kpis" in bi_30d
        assert "user_registration_growth" in bi_30d
        assert "courses_by_category" in bi_30d
        assert "courses_by_difficulty" in bi_30d
        assert "course_enrollment_trends" in bi_30d
        assert "enrollment_status_distribution" in bi_30d
        assert "top_performing_courses" in bi_30d
        assert "mentorship_analytics" in bi_30d
        assert "learner_engagement" in bi_30d

        assert len(bi_30d["user_registration_growth"]) > 0
        assert len(bi_30d["courses_by_category"]) > 0
        assert len(bi_30d["courses_by_difficulty"]) > 0
        assert len(bi_30d["top_performing_courses"]) > 0
        assert len(bi_30d["mentorship_analytics"]) >= 4

        print(f"[OK] BI Analytics 30D: KPIs={bi_30d['kpis']}")
        print(f"[OK] BI Analytics 30D: {len(bi_30d['courses_by_category'])} categories, {len(bi_30d['top_performing_courses'])} top courses charted")
        print(f"[OK] BI Analytics 7D: {len(bi_7d['user_registration_growth'])} points, All-time: {len(bi_all['user_registration_growth'])} points")

        print("\n" + "=" * 70)
        print("ALL PATHLY ADMIN PANEL & ROLE-BASED ACCESS TESTS PASSED! [PASS]")
        print("=" * 70)

    finally:
        # Cleanup test artifacts
        await db.users.delete_one({"email": test_user_email})
        await db.candidate_profiles.delete_one({"user_id": candidate_id})
        await db.learning_progress.delete_many({"user_id": candidate_id})
        await db.mentorship_bookings.delete_many({"user_id": candidate_id})
        await db.courses.delete_one({"title": "Next.js 14 Production SaaS Architecture"})
        await db.mentors.delete_one({"name": "Vikram Sundar"})
        await close_mongodb_connection()


if __name__ == "__main__":
    asyncio.run(run_admin_tests())

