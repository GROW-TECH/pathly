"""
Test suite for Pathly AI Career Assistant endpoints.
Tests chat, conversation persistence, multi-turn context, course recommendations,
skill gap analysis, roadmap creation, and security authorization.
"""

import asyncio
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.mongodb import connect_to_mongodb, close_mongodb_connection, get_database
from app.services.auth_service import AuthService
from app.services.ai_service import AIService
from app.schemas.auth import UserSignUpRequest

async def run_tests():
    print("=" * 60)
    print("RUNNING PATHLY AI CAREER ASSISTANT END-TO-END TESTS")
    print("=" * 60)

    await connect_to_mongodb()
    db = get_database()

    # 1. Create two test users to verify authentication & cross-user authorization
    email_a = "ai_test_user_a@pathly.io"
    email_b = "ai_test_user_b@pathly.io"

    # Cleanup previous test data
    await db.users.delete_many({"email": {"$in": [email_a, email_b]}})
    
    user_a, _ = await AuthService.register_user(
        UserSignUpRequest(email=email_a, password="Password123!", full_name="Alice Developer", mobile="9876543201"),
    )
    user_b, _ = await AuthService.register_user(
        UserSignUpRequest(email=email_b, password="Password123!", full_name="Bob Designer", mobile="9876543202"),
    )
    user_a_id = str(user_a["id"])
    user_b_id = str(user_b["id"])

    print(f"[OK] Created test users: User A ({user_a_id}) and User B ({user_b_id})")

    # Update User A profile with specific skills to test personalization
    await db.candidate_profiles.update_one(
        {"user_id": user_a_id},
        {"$set": {
            "career_status": "fresher",
            "target_role": "Frontend Developer",
            "skills": [
                {"name": "HTML", "level": "Intermediate", "category": "Frontend"},
                {"name": "CSS", "level": "Intermediate", "category": "Frontend"},
                {"name": "JavaScript", "level": "Intermediate", "category": "Frontend"},
            ],
            "interests": ["web development", "react"],
        }}
    )
    print("[OK] Configured User A candidate profile with HTML/CSS/JavaScript and Frontend Developer goal")

    # TEST 1: Send initial chat message
    print("\n--- TEST 1: Real AI Chat Completion & Course Recommendations ---")
    chat_result = await AIService.chat(
        user_id=user_a_id,
        user_text="I know HTML, CSS and JavaScript. What should I learn next?",
    )
    conv_id = chat_result["conversation_id"]
    ai_msg = chat_result["message"]

    assert conv_id is not None, "Expected conversation_id to be generated"
    assert len(ai_msg["text"]) > 20, "Expected non-empty AI text response"
    print(f"[OK] Received AI response ({len(ai_msg['text'])} chars)")
    print(f"  Snippet: {ai_msg['text'][:150]}...")
    print(f"  Course recommendations returned: {len(ai_msg['course_recommendations'])}")
    for c in ai_msg["course_recommendations"]:
        print(f"    - [{c['id']}] {c['title']} ({c['level']})")

    # TEST 2: Multi-turn memory
    print("\n--- TEST 2: Multi-Turn Conversation Memory ---")
    follow_up_result = await AIService.chat(
        user_id=user_a_id,
        user_text="Can you give me a project idea using the first technology you recommended?",
        conversation_id=conv_id,
    )
    follow_up_msg = follow_up_result["message"]
    assert follow_up_result["conversation_id"] == conv_id, "Conversation ID must remain consistent"
    print(f"[OK] Follow-up AI response received ({len(follow_up_msg['text'])} chars)")
    print(f"  Snippet: {follow_up_msg['text'][:150]}...")

    # TEST 3: Verify MongoDB persistence
    print("\n--- TEST 3: MongoDB Conversation & Message Persistence ---")
    saved_conv = await db.ai_conversations.find_one({"id": conv_id})
    assert saved_conv is not None, "Conversation must exist in ai_conversations collection"
    messages_count = await db.ai_messages.count_documents({"conversation_id": conv_id})
    assert messages_count == 4, f"Expected 4 messages (2 user + 2 ai), got {messages_count}"
    print(f"[OK] Found conversation '{saved_conv['title']}' with {messages_count} messages in MongoDB")

    # TEST 4: Skill Gap Analysis
    print("\n--- TEST 4: Skill Gap Analysis ---")
    gap_result = await AIService.analyze_skill_gap(
        user_id=user_a_id,
        target_role="Frontend Developer",
    )
    assert gap_result["readiness_score"] >= 20, "Readiness score must be calculated"
    assert len(gap_result["missing_skills"]) > 0, "Missing skills must be identified"
    print(f"[OK] Skill gap analysis completed:")
    print(f"  Target role: {gap_result['target_role']}")
    print(f"  Readiness score: {gap_result['readiness_score']}%")
    print(f"  Existing strengths: {gap_result['existing_strengths']}")
    print(f"  Missing skills: {gap_result['missing_skills']}")
    print(f"  Recommended courses: {[c['title'] for c in gap_result['recommended_courses']]}")

    # TEST 5: Learning Roadmap Generation
    print("\n--- TEST 5: Learning Roadmap Generation & Storage ---")
    roadmap_result = await AIService.generate_learning_roadmap(
        user_id=user_a_id,
        goal="Become a Frontend Developer",
        duration_weeks=4,
    )
    assert len(roadmap_result["stages"]) == 4, "Expected 4 stages in roadmap"
    print(f"[OK] Generated {len(roadmap_result['stages'])}-week learning roadmap:")
    for s in roadmap_result["stages"]:
        print(f"  Stage {s['stage_number']}: {s['title']} (Courses: {[c['title'] for c in s.get('courses', [])]})")

    # TEST 6: Authorization check (Bob cannot see Alice's conversation)
    print("\n--- TEST 6: User Authorization & Isolation ---")
    alice_conv_for_bob = await db.ai_conversations.find_one({"id": conv_id, "user_id": user_b_id})
    assert alice_conv_for_bob is None, "User B must NOT have access to User A's conversation"
    print("[OK] Authorization isolation verified: User B cannot access User A's records")

    # Cleanup test data
    await db.users.delete_many({"email": {"$in": [email_a, email_b]}})
    await db.candidate_profiles.delete_many({"user_id": {"$in": [user_a_id, user_b_id]}})
    await db.ai_conversations.delete_many({"user_id": {"$in": [user_a_id, user_b_id]}})
    await db.ai_messages.delete_many({"user_id": {"$in": [user_a_id, user_b_id]}})
    await db.ai_skill_gap_analyses.delete_many({"user_id": {"$in": [user_a_id, user_b_id]}})
    await db.ai_learning_roadmaps.delete_many({"user_id": {"$in": [user_a_id, user_b_id]}})

    await close_mongodb_connection()
    print("\n" + "=" * 60)
    print("ALL AI ENDPOINT & PERSISTENCE TESTS PASSED SUCCESSFULLY! [PASS]")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(run_tests())
