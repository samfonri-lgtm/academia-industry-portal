from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.database import get_connection


router = APIRouter(
    prefix="/student/skill-gap",
    tags=["Student Skill Gap"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class SkillGapRequest(BaseModel):
    target_role: str


# =========================================================
# ROLE REQUIREMENTS
# =========================================================

ROLE_SKILLS = {
    "backend developer": [
        "Python",
        "FastAPI",
        "SQL",
        "REST API",
        "Git",
        "Database Management",
    ],

    "frontend developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Git",
        "UI Design",
    ],

    "full stack developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Node.js",
        "Express.js",
        "SQL",
        "Git",
        "REST API",
    ],

    "data scientist": [
        "Python",
        "SQL",
        "Machine Learning",
        "Artificial Intelligence",
        "Data Structures",
        "Algorithms",
    ],

    "java developer": [
        "Java",
        "Object Oriented Programming",
        "SQL",
        "REST API",
        "Git",
        "Database Management",
    ],

    "software developer": [
        "Programming",
        "Data Structures",
        "Algorithms",
        "Object Oriented Programming",
        "Git",
        "Database Management",
    ],
}


# =========================================================
# STUDENT CHECK
# =========================================================

def check_student(user_id: int):

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id, name, email, role
            FROM users
            WHERE id = ?
            """,
            (user_id,),
        )

        user = cursor.fetchone()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found.",
            )

        if user["role"].lower() != "student":
            raise HTTPException(
                status_code=403,
                detail="Only student accounts can use skill gap analysis.",
            )

        return user

    finally:
        connection.close()


# =========================================================
# STUDENT PROFILE
# =========================================================

def get_student_profile_id(user_id: int):

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id
            FROM student_profiles
            WHERE user_id = ?
            """,
            (user_id,),
        )

        profile = cursor.fetchone()

        if not profile:
            raise HTTPException(
                status_code=404,
                detail="Student profile not found.",
            )

        return profile["id"]

    finally:
        connection.close()


# =========================================================
# SKILL GAP ANALYSIS
# =========================================================

@router.post("/{user_id}")
def analyze_skill_gap(
    user_id: int,
    request: SkillGapRequest,
):

    # -----------------------------------------------------
    # Validate student
    # -----------------------------------------------------

    check_student(user_id)

    student_id = get_student_profile_id(user_id)

    target_role = request.target_role.strip()

    if not target_role:
        raise HTTPException(
            status_code=400,
            detail="Target role is required.",
        )

    role_key = target_role.lower()

    # -----------------------------------------------------
    # Check role
    # -----------------------------------------------------

    required_skill_names = ROLE_SKILLS.get(role_key)

    if not required_skill_names:

        available_roles = [
            role.title()
            for role in ROLE_SKILLS.keys()
        ]

        raise HTTPException(
            status_code=400,
            detail={
                "message": "Unsupported target role.",
                "available_roles": available_roles,
            },
        )

    connection = get_connection()

    try:

        cursor = connection.cursor()

        # =================================================
        # GET STUDENT SKILLS
        # =================================================

        cursor.execute(
            """
            SELECT
                s.id,
                s.name,
                s.category,
                ss.level
            FROM student_skills ss
            JOIN skills s
                ON ss.skill_id = s.id
            WHERE ss.student_id = ?
            ORDER BY s.name
            """,
            (student_id,),
        )

        student_skills = cursor.fetchall()

        # Case-insensitive lookup
        student_skill_map = {
            row["name"].strip().lower(): {
                "id": row["id"],
                "name": row["name"],
                "category": row["category"],
                "level": row["level"],
            }
            for row in student_skills
        }

        # =================================================
        # COMPARE SKILLS
        # =================================================

        matched_skills = []
        missing_skills = []

        for required_name in required_skill_names:

            key = required_name.lower()

            if key in student_skill_map:

                skill = student_skill_map[key]

                matched_skills.append(
                    {
                        "id": skill["id"],
                        "name": skill["name"],
                        "category": skill["category"],
                        "level": skill["level"],
                    }
                )

            else:

                # Find the skill in the global library
                cursor.execute(
                    """
                    SELECT
                        id,
                        name,
                        category
                    FROM skills
                    WHERE LOWER(name) = LOWER(?)
                    """,
                    (required_name,),
                )

                skill = cursor.fetchone()

                missing_skills.append(
                    {
                        "skill_id": skill["id"] if skill else None,
                        "name": required_name,
                        "category": (
                            skill["category"]
                            if skill
                            else "Other"
                        ),
                        "required_level": "Intermediate",
                    }
                )

        # =================================================
        # MATCH PERCENTAGE
        # =================================================

        total_required = len(required_skill_names)
        total_matched = len(matched_skills)

        if total_required > 0:
            match_percentage = round(
                (total_matched / total_required) * 100,
                2,
            )
        else:
            match_percentage = 0

        # =================================================
        # SAVE ANALYSIS
        # =================================================

        import json

        cursor.execute(
            """
            INSERT INTO skill_analysis
            (
                student_id,
                target_role,
                matched_skills,
                missing_skills,
                match_percentage
            )
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                student_id,
                target_role,
                json.dumps(matched_skills),
                json.dumps(missing_skills),
                match_percentage,
            ),
        )

        analysis_id = cursor.lastrowid

        connection.commit()

        # =================================================
        # RESPONSE
        # =================================================

        return {
            "status": "success",
            "message": "Skill gap analysis completed.",
            "analysis_id": analysis_id,
            "student_id": student_id,
            "target_role": target_role,
            "match_percentage": match_percentage,
            "summary": {
                "total_required_skills": total_required,
                "matched_skills": total_matched,
                "missing_skills": len(missing_skills),
            },
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:

        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Skill gap analysis failed: {str(error)}",
        )

    finally:
        connection.close()


# =========================================================
# GET PREVIOUS ANALYSES
# =========================================================

@router.get("/{user_id}/history")
def get_skill_gap_history(user_id: int):

    check_student(user_id)

    student_id = get_student_profile_id(user_id)

    connection = get_connection()

    try:

        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                id,
                target_role,
                matched_skills,
                missing_skills,
                match_percentage,
                created_at
            FROM skill_analysis
            WHERE student_id = ?
            ORDER BY created_at DESC, id DESC
            """,
            (student_id,),
        )

        analyses = []

        import json

        for row in cursor.fetchall():

            try:
                matched = json.loads(
                    row["matched_skills"] or "[]"
                )
            except Exception:
                matched = []

            try:
                missing = json.loads(
                    row["missing_skills"] or "[]"
                )
            except Exception:
                missing = []

            analyses.append(
                {
                    "id": row["id"],
                    "target_role": row["target_role"],
                    "match_percentage": row["match_percentage"],
                    "matched_skills": matched,
                    "missing_skills": missing,
                    "created_at": row["created_at"],
                }
            )

        return {
            "status": "success",
            "student_id": student_id,
            "count": len(analyses),
            "analyses": analyses,
        }

    finally:
        connection.close()