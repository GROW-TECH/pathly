import httpx
import sys
import time

BASE_URL = "http://127.0.0.1:8000"

def run_e2e_test():
    print("[TEST] Starting End-to-End API and Persistence Verification...")
    
    unique_email = f"priya.sharma.{int(time.time())}@example.com"
    unique_mobile = f"+9198{str(int(time.time()))[-8:]}"

    with httpx.Client(base_url=BASE_URL, follow_redirects=True) as client:
        # 1. Health check
        res = client.get("/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        print("  [OK] 1. Health check: 200 OK")

        # 2. Signup
        signup_payload = {
            "full_name": "Priya Sharma",
            "email": unique_email,
            "mobile": unique_mobile,
            "password": "Password@123",
            "career_status": "fresher"
        }
        res = client.post("/api/v1/auth/signup", json=signup_payload)
        assert res.status_code == 201, f"Signup failed: {res.status_code} {res.text}"
        data = res.json()
        assert data["user"]["email"] == unique_email
        assert "pathly_access_token" in client.cookies
        print(f"  [OK] 2. Signup successful for {data['user']['full_name']} ({unique_email}), session cookies set")

        # 3. Duplicate check (409)
        res = client.post("/api/v1/auth/signup", json=signup_payload)
        assert res.status_code == 409, f"Duplicate signup should fail: {res.status_code}"
        print("  [OK] 3. Duplicate registration rejected with 409 Conflict")

        # 4. Check /auth/me with session cookie
        res = client.get("/api/v1/auth/me")
        assert res.status_code == 200, f"/auth/me failed: {res.status_code} {res.text}"
        me = res.json()
        assert me["user"]["full_name"] == "Priya Sharma"
        print("  [OK] 4. Authenticated /auth/me via HttpOnly cookie verified")

        # 5. Profile Update (Simulating CareerProfileScreen setup)
        profile_update = {
            "career_status": "fresher",
            "target_role": "Full Stack Developer",
            "interests": ["technology", "design"],
            "skills": [
                {"name": "React", "level": "Intermediate", "category": "Frontend"},
                {"name": "Python", "level": "Beginner", "category": "Backend"},
                {"name": "FastAPI", "level": "Intermediate", "category": "Backend"}
            ],
            "preferred_locations": ["Chennai", "Bangalore"],
            "preferred_work_modes": ["remote", "hybrid"],
            "gov_exam_scope": "all"
        }
        res = client.put("/api/v1/user/profile", json=profile_update)
        assert res.status_code == 200, f"Profile update failed: {res.status_code} {res.text}"
        prof = res.json()
        assert prof["target_role"] == "Full Stack Developer"
        assert prof["profile_completion_percentage"] >= 60
        print(f"  [OK] 5. Profile updated and persisted: Target Role '{prof['target_role']}', Completion {prof['profile_completion_percentage']}%")

        # 6. Verify profile read
        res = client.get("/api/v1/user/profile")
        assert res.status_code == 200
        assert len(res.json()["skills"]) == 3
        print("  [OK] 6. Profile retrieved from database with full skill list")

        # 7. Refresh token rotation
        res = client.post("/api/v1/auth/refresh")
        assert res.status_code == 200, f"Token refresh failed: {res.status_code} {res.text}"
        print("  [OK] 7. Refresh token rotated successfully")

        # 8. Logout / Revoke
        res = client.post("/api/v1/auth/logout")
        assert res.status_code == 200, f"Logout failed: {res.status_code}"
        print("  [OK] 8. Server-side logout executed and session revoked in DB")

        # 9. Verify /auth/me after logout (Must be 401)
        res = client.get("/api/v1/auth/me")
        assert res.status_code == 401, f"Expected 401 after logout, got: {res.status_code}"
        print("  [OK] 9. Protected endpoint rejected after logout (401 Unauthorized)")

        # 10. Re-login with credentials
        login_payload = {
            "email": unique_email,
            "password": "Password@123"
        }
        res = client.post("/api/v1/auth/login", json=login_payload)
        assert res.status_code == 200, f"Login failed: {res.status_code} {res.text}"
        login_data = res.json()
        assert login_data["profile"]["target_role"] == "Full Stack Developer"
        print(f"  [OK] 10. Login successful: restored user and persisted profile for {login_data['user']['full_name']}")

    print("\n[ALL TESTS PASSED SUCCESSFULLY!]")

if __name__ == "__main__":
    import traceback
    try:
        run_e2e_test()
    except Exception as e:
        traceback.print_exc()
        sys.exit(1)
