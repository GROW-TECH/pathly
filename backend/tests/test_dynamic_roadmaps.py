"""
Comprehensive Test Suite for Pathly Dynamic AI Career Roadmaps:
1. Multi-role personalization (Frontend Engineer, Data Analyst, UI/UX Designer).
2. Dynamic milestone generation from user profile.
3. Strict sequential progression (Done, Current, Upcoming).
4. Real progress percentage (never fabricated, begins at 0%).
5. Update My Roadmap with preservation of completed milestones.
6. MongoDB single-record persistence and cross-user isolation.
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


async def run_dynamic_roadmap_tests():
    print("=" * 70)
    print("RUNNING PATHLY DYNAMIC AI CAREER ROADMAP VERIFICATION TEST SUITE")
    print("=" * 70)

    await connect_to_mongodb()
    db = get_database()

    users_data = [
        {
            "email": "frontend_dev@pathly.io",
            "mobile": "9876543011",
            "name": "Alex Frontend",
            "role": "Frontend Engineer",
            "skills": [
                {"name": "HTML", "level": "Intermediate", "category": "Frontend"},
                {"name": "CSS", "level": "Intermediate", "category": "Frontend"},
            ],
            "expected_kw": "Frontend",
            "expected_first_milestone": "HTML/CSS & Responsive Design",
        },
        {
            "email": "data_analyst@pathly.io",
            "mobile": "9876543012",
            "name": "Maya Data",
            "role": "Data Analyst",
            "skills": [
                {"name": "Python", "level": "Beginner", "category": "Data"},
                {"name": "Excel", "level": "Intermediate", "category": "Data"},
            ],
            "expected_kw": "Data",
            "expected_first_milestone": "Python Programming & Core Data Structures",
        },
        {
            "email": "uiux_designer@pathly.io",
            "mobile": "9876543013",
            "name": "Leo Designer",
            "role": "UI/UX Designer",
            "skills": [
                {"name": "Figma", "level": "Beginner", "category": "Design"},
            ],
            "expected_kw": "UX",
            "expected_first_milestone": "UX Research Methods & Empathy Personas",
        },
    ]

    emails = [u["email"] for u in users_data]
    mobiles = [u["mobile"] for u in users_data]
    await db.users.delete_many({"$or": [{"email": {"$in": emails}}, {"mobile": {"$in": mobiles}}]})

    created_users = []

    try:
        # STEP 1: Create 3 distinct users with unique roles and profiles
        print("\n[STEP 1] Creating 3 distinct user profiles in MongoDB...")
        for u in users_data:
            user_doc, _ = await AuthService.register_user(
                UserSignUpRequest(
                    email=u["email"],
                    password="Password123!",
                    full_name=u["name"],
                    mobile=u["mobile"],
                )
            )
            uid = str(user_doc["id"])
            await db.candidate_profiles.update_one(
                {"user_id": uid},
                {"$set": {
                    "career_status": "fresher",
                    "target_role": u["role"],
                    "skills": u["skills"],
                }}
            )
            created_users.append({**u, "user_id": uid})
            print(f"  -> Created {u['name']} (UID: {uid[:8]}...) -> Target Role: '{u['role']}'")

        # STEP 2: Verify Roadmaps are personalized to each target role
        print("\n[STEP 2] Verifying personalized roadmap generation & initial progress = 0%...")
        for cu in created_users:
            roadmap = await LearningService.get_or_create_user_roadmap(cu["user_id"])
            assert roadmap is not None, f"Roadmap must be generated for {cu['name']}"
            assert cu["expected_kw"].lower() in roadmap["title"].lower(), (
                f"Expected title to contain '{cu['expected_kw']}', got '{roadmap['title']}'"
            )
            # Ensure milestones exist
            assert len(roadmap["milestones"]) >= 4, f"Expected at least 4 milestones, got {len(roadmap['milestones'])}"
            
            # Progress must be strictly 0% when no milestones are completed (never fake 65%!)
            assert roadmap["overall_progress"] == 0.0 or roadmap["overall_progress"] == 0, (
                f"Initial progress must be 0%, got {roadmap['overall_progress']}%"
            )
            assert roadmap["completed_milestones"] == 0, "Initial completed milestones must be 0"

            # Sequential verification:
            # First milestone MUST be 'current', subsequent MUST be 'upcoming', none should be 'completed'
            first_ms = roadmap["milestones"][0]
            assert first_ms["status"] == "current", f"First milestone must be 'current', got {first_ms['status']}"
            assert first_ms["title"] == cu["expected_first_milestone"], (
                f"Expected first milestone '{cu['expected_first_milestone']}', got '{first_ms['title']}'"
            )

            for ms in roadmap["milestones"][1:]:
                assert ms["status"] == "upcoming", (
                    f"Subsequent milestone '{ms['title']}' should be 'upcoming', got '{ms['status']}'"
                )

            print(f"  [OK] {cu['name']} -> Title: '{roadmap['title']}', Progress: {roadmap['overall_progress']}%, Milestones: {len(roadmap['milestones'])}")
            print(f"       1st Milestone: [{first_ms['status'].upper()}] {first_ms['title']}")
            print(f"       2nd Milestone: [{roadmap['milestones'][1]['status'].upper()}] {roadmap['milestones'][1]['title']}")

        # STEP 3: Complete milestones sequentially for User 1 (Frontend Dev)
        print("\n[STEP 3] Testing Milestone Toggle & Sequential Status Updates (User 1)...")
        u1 = created_users[0]
        u1_roadmap = await LearningService.get_or_create_user_roadmap(u1["user_id"])
        ms0 = u1_roadmap["milestones"][0]
        ms1 = u1_roadmap["milestones"][1]

        # Complete first milestone
        updated_1 = await LearningService.toggle_roadmap_milestone(
            user_id=u1["user_id"],
            milestone_id=ms0["id"],
            completed=True,
        )

        assert updated_1["completed_milestones"] == 1
        expected_pct_1 = round((1 / len(updated_1["milestones"])) * 100, 1)
        assert abs(updated_1["overall_progress"] - expected_pct_1) < 0.2, (
            f"Expected progress ~{expected_pct_1}%, got {updated_1['overall_progress']}%"
        )

        # Check sequential status transition:
        # Milestone 0 is now 'completed' (Done)
        # Milestone 1 is now 'current' (Current)
        # Milestone 2+ remain 'upcoming' (Upcoming)
        ms0_updated = next(m for m in updated_1["milestones"] if m["id"] == ms0["id"])
        ms1_updated = next(m for m in updated_1["milestones"] if m["id"] == ms1["id"])
        assert ms0_updated["status"] == "completed", f"Milestone 0 should be completed, got {ms0_updated['status']}"
        assert ms1_updated["status"] == "current", f"Milestone 1 should now be current, got {ms1_updated['status']}"
        print(f"  [OK] Completed '{ms0['title']}' -> Overall progress updated to {updated_1['overall_progress']}%")
        print(f"       Milestone 0 status: {ms0_updated['status']} (Done)")
        print(f"       Milestone 1 status: {ms1_updated['status']} (Current)")

        # STEP 4: Test 'Update My Roadmap' and verify completed milestone preservation
        print("\n[STEP 4] Testing 'Update My Roadmap' & Milestone Preservation...")
        regenerated = await LearningService.generate_ai_roadmap(u1["user_id"])
        assert regenerated["user_id"] == u1["user_id"]
        # Milestone 0 title should still be marked completed
        ms0_regen = next((m for m in regenerated["milestones"] if m["title"] == ms0["title"]), None)
        assert ms0_regen is not None, f"Expected milestone '{ms0['title']}' to remain in regenerated roadmap"
        assert ms0_regen["status"] == "completed", (
            f"Expected milestone '{ms0['title']}' to remain completed after update, got {ms0_regen['status']}"
        )
        assert regenerated["completed_milestones"] >= 1, "Completed milestones count preserved"
        print(f"  [OK] 'Update My Roadmap' preserved completed milestone: '{ms0_regen['title']}' ({ms0_regen['status']})")
        print(f"       Progress maintained: {regenerated['overall_progress']}%")

        # STEP 5: Verify MongoDB Document Count (No Duplication)
        print("\n[STEP 5] Verifying MongoDB Persistence and No Duplicate Documents...")
        u1_count = await db.user_roadmaps.count_documents({"user_id": u1["user_id"]})
        assert u1_count == 1, f"Expected exactly 1 roadmap document for user, found {u1_count}"
        print(f"  [OK] User 1 has exactly {u1_count} roadmap document in MongoDB (no duplicates).")

        # STEP 6: Verify Cross-User Isolation
        print("\n[STEP 6] Verifying Cross-User Isolation...")
        u2 = created_users[1]
        u2_roadmap = await LearningService.get_or_create_user_roadmap(u2["user_id"])
        assert u2_roadmap["overall_progress"] == 0, (
            f"User 2 progress must remain 0%, got {u2_roadmap['overall_progress']}%"
        )
        assert u2_roadmap["completed_milestones"] == 0, "User 2 must have 0 completed milestones"
        print(f"  [OK] User 2 (Data Analyst) is completely isolated: 0% progress, {u2_roadmap['title']}.")

        u3 = created_users[2]
        u3_roadmap = await LearningService.get_or_create_user_roadmap(u3["user_id"])
        assert u3_roadmap["overall_progress"] == 0, (
            f"User 3 progress must remain 0%, got {u3_roadmap['overall_progress']}%"
        )
        assert u3_roadmap["completed_milestones"] == 0, "User 3 must have 0 completed milestones"
        print(f"  [OK] User 3 (UI/UX Designer) is completely isolated: 0% progress, {u3_roadmap['title']}.")

        print("\n" + "=" * 70)
        print("ALL DYNAMIC AI CAREER ROADMAP TESTS PASSED SUCCESSFULLY! [PASS]")
        print("=" * 70)

    finally:
        # Cleanup test accounts
        user_ids = [u["user_id"] for u in created_users]
        await db.users.delete_many({"_id": {"$in": user_ids}})
        await db.candidate_profiles.delete_many({"user_id": {"$in": user_ids}})
        await db.user_roadmaps.delete_many({"user_id": {"$in": user_ids}})
        await db.learning_progress.delete_many({"user_id": {"$in": user_ids}})
        await db.saved_courses.delete_many({"user_id": {"$in": user_ids}})
        await close_mongodb_connection()


if __name__ == "__main__":
    asyncio.run(run_dynamic_roadmap_tests())
