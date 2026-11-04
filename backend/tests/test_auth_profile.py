import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.db.mongodb import connect_to_mongodb, close_mongodb_connection

async def run_integration_tests():
    await connect_to_mongodb()
    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://testserver") as client:
            print("\n--- 1. Testing Health Endpoint ---")
            health_resp = await client.get("/health")
            print("Health status code:", health_resp.status_code, health_resp.json())
            assert health_resp.status_code == 200

            print("\n--- 2. Testing User Signup ---")
            signup_payload = {
                "full_name": "Antigravity Candidate",
                "email": "candidate@pathly.ai",
                "mobile": "9876543210",
                "password": "Password123!",
                "career_status": "fresher"
            }
            signup_resp = await client.post("/api/v1/auth/signup", json=signup_payload)
            print("Signup status code:", signup_resp.status_code)
            assert signup_resp.status_code == 201, f"Signup failed: {signup_resp.text}"
            signup_data = signup_resp.json()
            print("Signup user ID:", signup_data["user"]["id"])
            print("Cookies set:", signup_resp.cookies)
            assert "pathly_access_token" in signup_resp.cookies
            assert "pathly_refresh_token" in signup_resp.cookies

            print("\n--- 3. Testing Duplicate Registration (Email & Mobile) ---")
            dup_email_resp = await client.post("/api/v1/auth/signup", json=signup_payload)
            print("Duplicate signup status code:", dup_email_resp.status_code, dup_email_resp.json())
            assert dup_email_resp.status_code == 409

            print("\n--- 4. Testing Get Authenticated User (/auth/me) with Cookie ---")
            me_resp = await client.get("/api/v1/auth/me")
            print("Me status code:", me_resp.status_code)
            assert me_resp.status_code == 200
            me_data = me_resp.json()
            assert me_data["user"]["email"] == "candidate@pathly.ai"
            assert me_data["profile"]["career_status"] == "fresher"
            print("Current User Full Name:", me_data["user"]["full_name"])

            print("\n--- 5. Testing Profile Get & Update (/user/profile) ---")
            profile_update = {
                "career_status": "experienced",
                "target_role": "Senior Full Stack Engineer",
                "experience_years": "3",
                "preferred_locations": ["Chennai", "Bangalore", "Hyderabad"],
                "preferred_work_modes": ["remote", "hybrid"],
                "interests": ["technology", "design", "business"],
                "skills": [
                    {"name": "React 18", "level": "Advanced", "category": "Frontend"},
                    {"name": "FastAPI", "level": "Intermediate", "category": "Backend"},
                    {"name": "MongoDB", "level": "Intermediate", "category": "Database"},
                ],
                "bio": "Full-stack engineer passionate about scalable cloud architectures."
            }
            update_resp = await client.put("/api/v1/user/profile", json=profile_update)
            print("Profile update status code:", update_resp.status_code)
            assert update_resp.status_code == 200
            updated_data = update_resp.json()
            print("Updated target role:", updated_data["target_role"])
            print("Updated completion percentage:", updated_data["profile_completion_percentage"], "%")
            assert updated_data["target_role"] == "Senior Full Stack Engineer"
            assert updated_data["profile_completion_percentage"] >= 80

            print("\n--- 6. Testing Token Refresh (/auth/refresh) ---")
            refresh_resp = await client.post("/api/v1/auth/refresh")
            print("Refresh status code:", refresh_resp.status_code)
            assert refresh_resp.status_code == 200
            assert "access_token" in refresh_resp.json()

            print("\n--- 7. Testing User Login (Valid & Invalid Credentials) ---")
            # Invalid password
            bad_login = await client.post("/api/v1/auth/login", json={
                "email": "candidate@pathly.ai",
                "password": "WrongPassword!"
            })
            print("Bad login status code:", bad_login.status_code)
            assert bad_login.status_code == 401

            # Valid login with email
            good_login = await client.post("/api/v1/auth/login", json={
                "email": "candidate@pathly.ai",
                "password": "Password123!"
            })
            print("Good login status code:", good_login.status_code)
            assert good_login.status_code == 200
            assert good_login.json()["user"]["email"] == "candidate@pathly.ai"

            # Valid login with mobile
            mobile_login = await client.post("/api/v1/auth/login", json={
                "email": "9876543210",
                "password": "Password123!"
            })
            print("Mobile login status code:", mobile_login.status_code)
            assert mobile_login.status_code == 200

            print("\n--- 8. Testing Logout (/auth/logout) & Protected Route Access ---")
            logout_resp = await client.post("/api/v1/auth/logout")
            print("Logout status code:", logout_resp.status_code, logout_resp.json())
            assert logout_resp.status_code == 200

            # Attempting to access protected route after logout should return 401
            post_logout_me = await client.get("/api/v1/auth/me")
            print("Post-logout /auth/me status code:", post_logout_me.status_code)
            assert post_logout_me.status_code == 401

            print("\nALL BACKEND INTEGRATION TESTS PASSED SUCCESSFULLY! [SUCCESS]\n")
    finally:
        await close_mongodb_connection()

if __name__ == "__main__":
    asyncio.run(run_integration_tests())
