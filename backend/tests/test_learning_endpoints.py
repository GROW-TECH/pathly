"""
Integration test suite for Pathly Skills Roadmap & Learning module.
Tests 3-stage roadmap generation, milestone completion, course progress tracking,
saved courses bookmarking, learning dashboard metrics, and authorization isolation.
"""

import asyncio
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.mongodb import connect_to_mongodb, close_mongodb_connection, get_database
from app.services.auth_service import AuthService
from app.services.learning_service import LearningService
from app.schemas.auth import UserSignUpRequest

async def run_learning_tests():
    print("=" * 65)
    print("RUNNING PATHLY PHASE 3: SKILLS ROADMAP & LEARNING MODULE TESTS")
    print("=" * 65)

    await connect_to_mongodb()
    db = get_database()

    email_a = "learn_user_a@pathly.io"
    email_b = "learn_user_b@pathly.io"

    # Cleanup any previous test data
    await db.users.delete_many({"email": {"$in": [email_a, email_b]}})

    user_a, _ = await AuthService.register_user(
        UserSignUpRequest(email=email_a, password="Password123!", full_name="Sarah Learner", mobile="9876543301"),
    )
    user_b, _ = await AuthService.register_user(
        UserSignUpRequest(email=email_b, password="Password123!", full_name="David Student", mobile="9876543302"),
    )
    user_a_id = str(user_a["id"])
    user_b_id = str(user_b["id"])

    # Set user A target role and current skills
    await db.candidate_profiles.update_one(
        {"user_id": user_a_id},
        {"$set": {
            "career_status": "fresher",
            "target_role": "Frontend Engineer",
            "skills": [
                {"name": "HTML", "level": "Intermediate", "category": "Frontend"},
                {"name": "CSS", "level": "Intermediate", "category": "Frontend"},
            ],
        }}
    )
    print(f"[OK] Created users and initialized profile for {user_a_id}")

    # TEST 1: Generate & Retrieve 3-Stage Personalized Roadmap
    print("\n--- TEST 1: Personalized 3-Stage Skills Roadmap (Beginner/Intermediate/Advanced) ---")
    roadmap = await LearningService.get_or_create_user_roadmap(user_a_id)
    assert roadmap["target_role"] == "Frontend Engineer"
    assert len(roadmap["stages"]) == 3, f"Expected 3 stages, got {len(roadmap['stages'])}"
    levels = [s["level"] for s in roadmap["stages"]]
    assert levels == ["Beginner", "Intermediate", "Advanced"], f"Stages must be Beginner, Intermediate, Advanced, got {levels}"
    print(f"[OK] Roadmap Title: {roadmap['title']}")
    print(f"[OK] Total Milestones: {roadmap['total_milestones']}, Completed: {roadmap['completed_milestones']}")
    for s in roadmap["stages"]:
        print(f"  - [{s['level']}] {s['title']} ({s['estimated_duration']}) - {len(s['milestones'])} milestones")

    # TEST 2: Toggle Roadmap Milestone
    print("\n--- TEST 2: Toggle Milestone Completion & Progress Calculation ---")
    first_stage = roadmap["stages"][0]
    first_milestone = first_stage["milestones"][0]
    updated_roadmap = await LearningService.toggle_roadmap_milestone(
        user_id=user_a_id,
        stage_id=first_stage["stage_id"],
        milestone_id=first_milestone["id"],
        completed=True,
    )
    assert updated_roadmap["completed_milestones"] >= 1, "Completed milestones should be incremented"
    print(f"[OK] Milestone '{first_milestone['title']}' marked complete.")
    print(f"[OK] Updated Overall Progress: {updated_roadmap['overall_progress']}%")

    # TEST 3: Course Enrollment
    print("\n--- TEST 3: Course Enrollment & MongoDB Persistence ---")
    course_id = "course-1"
    enroll_resp = await LearningService.enroll_course(user_a_id, course_id)
    assert enroll_resp["course_id"] == course_id
    assert enroll_resp["status"] == "enrolled"
    print(f"[OK] Enrolled in course {course_id}. Total lessons: {enroll_resp['total_lessons']}")

    # TEST 4: Lesson Progress Completion & Percentage Calculation
    print("\n--- TEST 4: Lesson Progress Completion & Percentage Calculation ---")
    # Complete 3 lessons
    await LearningService.update_course_progress(user_a_id, course_id, lesson_id="m1-l1", completed=True)
    await LearningService.update_course_progress(user_a_id, course_id, lesson_id="m1-l2", completed=True)
    prog_resp = await LearningService.update_course_progress(user_a_id, course_id, lesson_id="m1-l3", completed=True)
    assert len(prog_resp["completed_lessons"]) == 3
    assert prog_resp["progress_percentage"] > 0
    assert prog_resp["status"] == "in_progress"
    print(f"[OK] Completed 3 lessons. Actual calculated progress: {prog_resp['progress_percentage']}% (status: {prog_resp['status']})")

    # Complete entire module
    mod_prog = await LearningService.update_course_progress(user_a_id, course_id, module_id="m1", completed=True)
    assert "m1" in mod_prog["completed_modules"]
    print(f"[OK] Module m1 marked completed. Progress now: {mod_prog['progress_percentage']}%")

    # TEST 5: Saved Courses (Bookmarking)
    print("\n--- TEST 5: Save/Bookmark Courses ---")
    save_res = await LearningService.toggle_save_course(user_a_id, "course-4")
    assert save_res["is_saved"] is True
    print(f"[OK] Bookmarked course-4: {save_res['message']}")

    saved_list = await LearningService.get_saved_courses(user_a_id)
    assert len(saved_list) == 1
    assert saved_list[0]["course_id"] == "course-4"
    print(f"[OK] Saved courses verified: {[s['course_id'] for s in saved_list]}")

    # TEST 6: Learning Dashboard Metrics Calculation
    print("\n--- TEST 6: Learning Dashboard Summary & Real Metrics ---")
    dashboard = await LearningService.get_dashboard_summary(user_a_id)
    assert dashboard["active_courses_count"] >= 1
    assert dashboard["overall_progress_percentage"] > 0
    assert len(dashboard["skills_improved"]) > 0
    print(f"[OK] Active Courses: {dashboard['active_courses_count']}")
    print(f"[OK] Completed Courses: {dashboard['completed_courses_count']}")
    print(f"[OK] Skills Improved: {dashboard['skills_improved_count']} ({dashboard['skills_improved'][:4]})")
    print(f"[OK] Overall Progress: {dashboard['overall_progress_percentage']}%")
    if dashboard.get("upcoming_milestone"):
        print(f"[OK] Next Milestone: {dashboard['upcoming_milestone']['milestone_title']}")

    # TEST 7: Gap-Based Recommendations (Free First)
    print("\n--- TEST 7: Gap-Based Course Recommendations Prioritizing Free ---")
    recs = await LearningService.get_gap_recommendations(user_a_id)
    assert len(recs) > 0
    print(f"[OK] Recommended {len(recs)} courses.")
    print(f"  Top recommended: {recs[0]['title']} ({recs[0]['price']}) - {recs[0]['why_recommended']}")
    # Verify free is prioritized
    if any(c["price"].lower() == "free" for c in recs):
        assert recs[0]["price"].lower() == "free", "Free courses must be prioritized first"
        print("[OK] Verified free course is prioritized at the top of recommendations.")

    # TEST 8: Cross-User Authorization & Isolation
    print("\n--- TEST 8: Cross-User Isolation ---")
    b_dashboard = await LearningService.get_dashboard_summary(user_b_id)
    assert b_dashboard["active_courses_count"] == 0, "User B must not have User A's active courses"
    b_saved = await LearningService.get_saved_courses(user_b_id)
    assert len(b_saved) == 0, "User B must not have User A's saved courses"
    print("[OK] Authorization isolation verified: User B data is completely isolated.")

    # Cleanup test data
    await db.users.delete_many({"email": {"$in": [email_a, email_b]}})
    await db.candidate_profiles.delete_many({"user_id": {"$in": [user_a_id, user_b_id]}})
    await db.user_roadmaps.delete_many({"user_id": {"$in": [user_a_id, user_b_id]}})
    await db.learning_progress.delete_many({"user_id": {"$in": [user_a_id, user_b_id]}})
    await db.saved_courses.delete_many({"user_id": {"$in": [user_a_id, user_b_id]}})

    await close_mongodb_connection()
    print("\n" + "=" * 65)
    print("ALL PHASE 3 SKILLS ROADMAP & LEARNING TESTS PASSED! [PASS]")
    print("=" * 65)

if __name__ == "__main__":
    asyncio.run(run_learning_tests())
