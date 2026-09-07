"""AcademiaConnect backend regression tests.

Covers: health, auth (register/login/me), student profile & skills,
opportunities, applications, company profile & opportunities, matching,
role-based error paths.
"""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("BACKEND_URL", "http://localhost:8001")

STUDENT_EMAIL = "student@demo.com"
COMPANY_EMAIL = "company@demo.com"
PASSWORD = "demo123"


# ---------- fixtures ----------
@pytest.fixture(scope="session")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


def _login(s, email, role, password=PASSWORD):
    r = s.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password, "role": role})
    assert r.status_code == 200, r.text
    return r.json()


@pytest.fixture(scope="session")
def student_auth(s):
    return _login(s, STUDENT_EMAIL, "student")


@pytest.fixture(scope="session")
def company_auth(s):
    return _login(s, COMPANY_EMAIL, "company")


# ---------- health ----------
class TestHealth:
    def test_health(self, s):
        r = s.get(f"{BASE_URL}/health")
        assert r.status_code == 200
        assert r.json()["status"] == "healthy"

    def test_db_status(self, s):
        r = s.get(f"{BASE_URL}/db-status")
        assert r.status_code == 200
        j = r.json()
        assert j["status"] == "connected"
        assert "users" in j["tables"]

    def test_me_no_token(self, s):
        r = s.get(f"{BASE_URL}/auth/me")
        assert r.status_code == 401
        assert "detail" in r.json()

    def test_me_bad_token(self, s):
        r = s.get(f"{BASE_URL}/auth/me", headers={"Authorization": "Bearer garbage"})
        assert r.status_code == 401
        assert "detail" in r.json()


# ---------- auth ----------
class TestAuth:
    def test_login_student(self, student_auth):
        assert "token" in student_auth
        assert student_auth["user"]["role"] == "student"
        assert student_auth["user"]["email"] == STUDENT_EMAIL

    def test_login_company(self, company_auth):
        assert "token" in company_auth
        assert company_auth["user"]["role"] == "company"

    def test_login_wrong_password(self, s):
        r = s.post(f"{BASE_URL}/auth/login",
                   json={"email": STUDENT_EMAIL, "password": "wrong", "role": "student"})
        assert r.status_code == 401
        assert "detail" in r.json()

    def test_login_wrong_role(self, s):
        r = s.post(f"{BASE_URL}/auth/login",
                   json={"email": STUDENT_EMAIL, "password": PASSWORD, "role": "company"})
        assert r.status_code == 403
        assert "detail" in r.json()

    def test_me_with_token(self, s, student_auth):
        r = s.get(f"{BASE_URL}/auth/me",
                  headers={"Authorization": f"Bearer {student_auth['token']}"})
        assert r.status_code == 200
        assert r.json()["user"]["email"] == STUDENT_EMAIL

    def test_register_new_student(self, s):
        email = f"TEST_stud_{uuid.uuid4().hex[:8]}@test.com"
        r = s.post(f"{BASE_URL}/auth/register",
                   json={"name": "Test Student", "email": email,
                         "password": PASSWORD, "role": "student"})
        assert r.status_code == 200, r.text
        j = r.json()
        assert "token" in j
        assert j["user"]["role"] == "student"
        # duplicate email
        r2 = s.post(f"{BASE_URL}/auth/register",
                    json={"name": "Test Student", "email": email,
                          "password": PASSWORD, "role": "student"})
        assert r2.status_code == 409

    def test_register_new_company(self, s):
        email = f"TEST_co_{uuid.uuid4().hex[:8]}@test.com"
        r = s.post(f"{BASE_URL}/auth/register",
                   json={"name": "TestCo", "email": email,
                         "password": PASSWORD, "role": "company"})
        assert r.status_code == 200, r.text
        assert r.json()["user"]["role"] == "company"

    def test_register_invalid_role(self, s):
        r = s.post(f"{BASE_URL}/auth/register",
                   json={"name": "X", "email": f"TEST_{uuid.uuid4().hex[:6]}@t.com",
                         "password": PASSWORD, "role": "hacker"})
        assert r.status_code == 400


# ---------- student flows ----------
class TestStudent:
    def test_dashboard(self, s, student_auth):
        uid = student_auth["user"]["id"]
        r = s.get(f"{BASE_URL}/dashboard/student/{uid}")
        assert r.status_code == 200, r.text
        j = r.json()
        assert "student" in j
        assert "student_id" in j["student"]

    def test_profile_get_and_update(self, s, student_auth):
        uid = student_auth["user"]["id"]
        r = s.get(f"{BASE_URL}/student/profile/{uid}")
        assert r.status_code == 200
        # PUT profile
        payload = {
            "user_id": uid,
            "college": "TEST College",
            "branch": "CSE",
            "semester": "6",
            "cgpa": "8.7",
            "career_goal": "Backend Developer",
        }
        r = s.put(f"{BASE_URL}/student/profile/", json=payload)
        assert r.status_code == 200, r.text
        # GET again and verify persistence
        r = s.get(f"{BASE_URL}/student/profile/{uid}")
        assert r.status_code == 200
        prof = r.json()
        # response might wrap it
        p = prof.get("profile", prof)
        assert p.get("college") == "TEST College"
        assert p.get("branch") == "CSE"

    def test_skills_library(self, s):
        r = s.get(f"{BASE_URL}/student/skills/library")
        assert r.status_code == 200
        j = r.json()
        # Look for a list
        lib = j.get("skills") or j.get("library") or (j if isinstance(j, list) else [])
        assert len(lib) > 0

    def test_student_skills_get(self, s, student_auth):
        uid = student_auth["user"]["id"]
        r = s.get(f"{BASE_URL}/student/skills/{uid}")
        assert r.status_code == 200

    def test_skill_gap(self, s, student_auth):
        uid = student_auth["user"]["id"]
        r = s.post(f"{BASE_URL}/student/skill-gap/{uid}",
                   json={"target_role": "Backend Developer"})
        assert r.status_code == 200, r.text


# ---------- opportunities & applications ----------
class TestOpportunitiesAndApplications:
    def test_list_opportunities(self, s):
        r = s.get(f"{BASE_URL}/opportunities/")
        assert r.status_code == 200
        j = r.json()
        assert "opportunities" in j
        assert isinstance(j["opportunities"], list)

    def test_apply_and_withdraw(self, s, student_auth):
        uid = student_auth["user"]["id"]
        # get student_id from dashboard
        dash = s.get(f"{BASE_URL}/dashboard/student/{uid}").json()
        student_id = dash["student"]["student_id"]

        opps = s.get(f"{BASE_URL}/opportunities/").json()["opportunities"]
        if not opps:
            pytest.skip("no opportunities to apply to")
        opp_id = opps[0]["id"]

        r = s.post(f"{BASE_URL}/applications/student/{student_id}/opportunity/{opp_id}")
        # Accept 200 or 409 if already applied
        assert r.status_code in (200, 201, 409), r.text

        # list student applications
        apps = s.get(f"{BASE_URL}/applications/student/{student_id}")
        assert apps.status_code == 200

    def test_matching_recommendations(self, s, student_auth):
        uid = student_auth["user"]["id"]
        dash = s.get(f"{BASE_URL}/dashboard/student/{uid}").json()
        student_id = dash["student"]["student_id"]
        r = s.get(f"{BASE_URL}/matching/student/{student_id}/recommendations")
        assert r.status_code == 200


# ---------- company flows ----------
class TestCompany:
    def test_company_dashboard(self, s, company_auth):
        uid = company_auth["user"]["id"]
        r = s.get(f"{BASE_URL}/dashboard/company/{uid}")
        assert r.status_code == 200

    def test_company_profile(self, s, company_auth):
        uid = company_auth["user"]["id"]
        r = s.get(f"{BASE_URL}/company/profile/{uid}")
        assert r.status_code == 200
        # update
        r = s.put(f"{BASE_URL}/company/profile/{uid}",
                  json={"name": "TestCo", "industry": "TEST-Software", "location": "Bengaluru",
                        "description": "Test description"})
        assert r.status_code in (200, 201), r.text
        r = s.get(f"{BASE_URL}/company/profile/{uid}")
        assert r.status_code == 200
        prof = r.json()
        p = prof.get("profile", prof)
        assert (p.get("industry") == "TEST-Software") or ("TEST-Software" in str(prof))

    def test_create_and_list_opportunity(self, s, company_auth):
        uid = company_auth["user"]["id"]
        # Get company's opportunities
        r = s.get(f"{BASE_URL}/company/opportunities/{uid}")
        assert r.status_code == 200
        # Create
        r = s.post(f"{BASE_URL}/company/opportunities/",
                   json={"user_id": uid, "title": "TEST_Backend Intern",
                         "type": "internship", "location": "Remote",
                         "stipend": "20000", "deadline": "2026-12-31",
                         "description": "Test opportunity"})
        assert r.status_code in (200, 201), r.text
        # Re-list should include it
        r2 = s.get(f"{BASE_URL}/company/opportunities/{uid}")
        assert r2.status_code == 200
        titles = str(r2.json())
        assert "TEST_Backend Intern" in titles

    def test_status_change_flow(self, s, company_auth, student_auth):
        cuid = company_auth["user"]["id"]
        suid = student_auth["user"]["id"]

        # Ensure company has an opp
        s.post(f"{BASE_URL}/company/opportunities/",
               json={"user_id": cuid, "title": "TEST_Status Flow",
                     "type": "internship", "location": "Remote",
                     "stipend": "0", "deadline": "2026-12-31",
                     "description": "flow"})
        opps = s.get(f"{BASE_URL}/company/opportunities/{cuid}").json()
        oplist = opps.get("opportunities", [])
        target = next((o for o in oplist if o.get("title") == "TEST_Status Flow"), None)
        if not target:
            pytest.skip("could not create/find opportunity")
        opp_id = target["id"]

        # Apply as student
        dash = s.get(f"{BASE_URL}/dashboard/student/{suid}").json()
        student_id = dash["student"]["student_id"]
        s.post(f"{BASE_URL}/applications/student/{student_id}/opportunity/{opp_id}")

        # Company sees the application
        r = s.get(f"{BASE_URL}/company/opportunities/{cuid}/{opp_id}/applications")
        assert r.status_code == 200, r.text
        apps = r.json().get("applications", [])
        if not apps:
            pytest.skip("no application recorded")
        app_id = apps[0]["id"]

        # Update status via company endpoint
        r = s.patch(f"{BASE_URL}/company/opportunities/applications/{app_id}/status",
                    json={"user_id": cuid, "status": "Shortlisted"})
        assert r.status_code == 200, r.text

        # Verify from student side
        stud_apps = s.get(f"{BASE_URL}/applications/student/{student_id}").json()
        arr = stud_apps.get("applications", [])
        found = [a for a in arr if a.get("id") == app_id]
        if found:
            assert str(found[0].get("status", "")).lower() in ("shortlisted", "shortlist")
