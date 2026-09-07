"""
Demo data seeder for AcademiaConnect.

Run this ONCE against a running backend to populate realistic demo
accounts so the app isn't empty when presenting to judges.

Usage:
    1. Start the backend:  uvicorn app.main:app --reload
    2. In another terminal, from the backend/ folder, run:
         python seed_demo.py

Safe to re-run: it skips accounts that already exist.
"""

import os
import sys
import requests

BASE_URL = os.getenv("BASE_URL", "http://127.0.0.1:8000")

DEMO_PASSWORD = "demo123"

USERS = [
    {"name": "Aarav Sharma", "email": "student@demo.com", "role": "student"},
    {"name": "TechNova Solutions", "email": "company@demo.com", "role": "company"},
    {"name": "Dr. Priya Sharma", "email": "academician@demo.com", "role": "academician"},
    {"name": "SIRT Bhopal", "email": "institution@demo.com", "role": "institution"},
]

STUDENT_SKILLS = [
    ("Java", "Advanced"),
    ("React", "Intermediate"),
    ("SQL", "Intermediate"),
    ("Git", "Advanced"),
]

OPPORTUNITIES = [
    {
        "title": "Software Development Intern",
        "type": "Internship",
        "description": "Work on real production features alongside our engineering team.",
        "location": "Bhopal / Remote",
        "stipend": "15000",
        "deadline": "2026-12-15",
        "skills": [("Java", "Intermediate"), ("SQL", "Intermediate"), ("Git", "Beginner"), ("Python", "Beginner")],
    },
    {
        "title": "Frontend Developer Intern",
        "type": "Internship",
        "description": "Build and ship UI features using React and Tailwind CSS.",
        "location": "Remote",
        "stipend": "12000",
        "deadline": "2026-12-20",
        "skills": [("React", "Intermediate"), ("JavaScript", "Intermediate"), ("Git", "Beginner")],
    },
]


def register_or_login(user):
    resp = requests.post(
        f"{BASE_URL}/auth/register",
        json={
            "name": user["name"],
            "email": user["email"],
            "password": DEMO_PASSWORD,
            "role": user["role"],
        },
    )

    if resp.status_code == 200:
        print(f"  created: {user['email']} ({user['role']})")
        return resp.json()["user"]

    if resp.status_code == 409:
        login_resp = requests.post(
            f"{BASE_URL}/auth/login",
            json={
                "email": user["email"],
                "password": DEMO_PASSWORD,
                "role": user["role"],
            },
        )
        login_resp.raise_for_status()
        print(f"  already exists: {user['email']} ({user['role']})")
        return login_resp.json()["user"]

    print(f"  FAILED for {user['email']}: {resp.status_code} {resp.text}")
    resp.raise_for_status()


def get_skill_id(name):
    resp = requests.get(f"{BASE_URL}/student/skills/library")
    resp.raise_for_status()
    for skill in resp.json()["skills"]:
        if skill["name"].lower() == name.lower():
            return skill["id"]
    return None


def seed_student_skills(student_user_id):
    for skill_name, level in STUDENT_SKILLS:
        skill_id = get_skill_id(skill_name)
        if not skill_id:
            print(f"  skill '{skill_name}' not found in library, skipping")
            continue

        resp = requests.post(
            f"{BASE_URL}/student/skills/",
            json={"user_id": student_user_id, "skill_id": skill_id, "level": level},
        )
        if resp.status_code == 200:
            print(f"  added skill: {skill_name} ({level})")
        elif resp.status_code == 409:
            print(f"  skill already added: {skill_name}")
        else:
            print(f"  FAILED to add skill {skill_name}: {resp.status_code} {resp.text}")


def seed_opportunities(company_user_id):
    for opp in OPPORTUNITIES:
        payload = {key: value for key, value in opp.items() if key != "skills"}
        resp = requests.post(
            f"{BASE_URL}/company/opportunities/",
            json={"user_id": company_user_id, **payload},
        )
        if resp.status_code != 200:
            print(f"  FAILED to create opportunity {opp['title']}: {resp.status_code} {resp.text}")
            continue

        print(f"  created opportunity: {opp['title']}")
        opportunity_id = resp.json()["opportunity"]["id"]

        for skill_name, level in opp.get("skills", []):
            skill_id = get_skill_id(skill_name)
            if not skill_id:
                print(f"    skill '{skill_name}' not found in library, skipping")
                continue
            skill_resp = requests.post(
                f"{BASE_URL}/matching/opportunity/{opportunity_id}/skill/{skill_id}",
                params={"required_level": level},
            )
            if skill_resp.status_code == 200:
                print(f"    required skill: {skill_name} ({level})")
            else:
                print(f"    FAILED to add required skill {skill_name}: {skill_resp.status_code}")


def main():
    try:
        requests.get(f"{BASE_URL}/health", timeout=3).raise_for_status()
    except Exception:
        print(f"Could not reach backend at {BASE_URL}.")
        print("Start it first with:  uvicorn app.main:app --reload")
        sys.exit(1)

    print("Creating demo accounts...")
    created = {}
    for user in USERS:
        created[user["role"]] = register_or_login(user)

    print("\nSeeding student skills...")
    seed_student_skills(created["student"]["id"])

    print("\nSeeding company opportunities...")
    seed_opportunities(created["company"]["id"])

    print("\nDone. Demo login credentials (password for all: demo123):")
    for user in USERS:
        print(f"  {user['role']:<12} -> {user['email']}")


if __name__ == "__main__":
    main()
