from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import get_connection


router = APIRouter(
    prefix="/student/skills",
    tags=["Student Skills"],
)


# =========================================================
# REQUEST MODELS
# =========================================================

class AddSkillRequest(BaseModel):
    user_id: int
    skill_id: int
    level: str


class UpdateSkillRequest(BaseModel):
    user_id: int
    skill_id: int
    level: str


# =========================================================
# HELPERS
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

        student = cursor.fetchone()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student profile not found. Please complete your profile first.",
            )

        return student["id"]

    finally:
        connection.close()


def validate_level(level: str):
    allowed_levels = {
        "Beginner",
        "Intermediate",
        "Advanced",
        "Expert",
    }

    normalized = level.strip().title()

    if normalized not in allowed_levels:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid skill level. Choose Beginner, "
                "Intermediate, Advanced, or Expert."
            ),
        )

    return normalized


# =========================================================
# GET SKILL LIBRARY
# =========================================================

@router.get("/library")
def get_skill_library():
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                id,
                name,
                category
            FROM skills
            ORDER BY category, name
            """
        )

        skills = [
            dict(row)
            for row in cursor.fetchall()
        ]

        return {
            "count": len(skills),
            "skills": skills,
        }

    finally:
        connection.close()


# =========================================================
# GET STUDENT SKILLS
# =========================================================

@router.get("/{user_id}")
def get_student_skills(user_id: int):

    student_id = get_student_profile_id(user_id)

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                ss.id,
                ss.student_id,
                ss.skill_id,
                s.name AS skill_name,
                s.category,
                ss.level
            FROM student_skills ss
            INNER JOIN skills s
                ON ss.skill_id = s.id
            WHERE ss.student_id = ?
            ORDER BY s.category, s.name
            """,
            (student_id,),
        )

        skills = [
            dict(row)
            for row in cursor.fetchall()
        ]

        return {
            "student_id": student_id,
            "count": len(skills),
            "skills": skills,
        }

    finally:
        connection.close()


# =========================================================
# ADD STUDENT SKILL
# =========================================================

@router.post("/")
def add_student_skill(request: AddSkillRequest):

    student_id = get_student_profile_id(request.user_id)

    level = validate_level(request.level)

    connection = get_connection()

    try:
        cursor = connection.cursor()

        # Check skill exists
        cursor.execute(
            """
            SELECT id, name, category
            FROM skills
            WHERE id = ?
            """,
            (request.skill_id,),
        )

        skill = cursor.fetchone()

        if not skill:
            raise HTTPException(
                status_code=404,
                detail="Skill not found.",
            )

        # Check duplicate
        cursor.execute(
            """
            SELECT id
            FROM student_skills
            WHERE student_id = ?
              AND skill_id = ?
            """,
            (
                student_id,
                request.skill_id,
            ),
        )

        existing = cursor.fetchone()

        if existing:
            raise HTTPException(
                status_code=409,
                detail="This skill is already added to your profile.",
            )

        # Insert skill
        cursor.execute(
            """
            INSERT INTO student_skills
            (
                student_id,
                skill_id,
                level
            )
            VALUES (?, ?, ?)
            """,
            (
                student_id,
                request.skill_id,
                level,
            ),
        )

        connection.commit()

        return {
            "message": "Skill added successfully.",
            "skill": {
                "id": cursor.lastrowid,
                "student_id": student_id,
                "skill_id": skill["id"],
                "skill_name": skill["name"],
                "category": skill["category"],
                "level": level,
            },
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to add skill: {str(error)}",
        )

    finally:
        connection.close()


# =========================================================
# UPDATE STUDENT SKILL
# =========================================================

@router.put("/{skill_id}")
def update_student_skill(
    skill_id: int,
    request: UpdateSkillRequest,
):

    student_id = get_student_profile_id(request.user_id)

    level = validate_level(request.level)

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                ss.id,
                s.name AS skill_name,
                s.category
            FROM student_skills ss
            INNER JOIN skills s
                ON ss.skill_id = s.id
            WHERE ss.id = ?
              AND ss.student_id = ?
            """,
            (
                skill_id,
                student_id,
            ),
        )

        existing = cursor.fetchone()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Student skill not found.",
            )

        cursor.execute(
            """
            UPDATE student_skills
            SET level = ?
            WHERE id = ?
              AND student_id = ?
            """,
            (
                level,
                skill_id,
                student_id,
            ),
        )

        connection.commit()

        return {
            "message": "Skill updated successfully.",
            "skill": {
                "id": skill_id,
                "skill_name": existing["skill_name"],
                "category": existing["category"],
                "level": level,
            },
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to update skill: {str(error)}",
        )

    finally:
        connection.close()


# =========================================================
# DELETE STUDENT SKILL
# =========================================================

@router.delete("/{skill_id}")
def delete_student_skill(
    skill_id: int,
    user_id: int,
):

    student_id = get_student_profile_id(user_id)

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id
            FROM student_skills
            WHERE id = ?
              AND student_id = ?
            """,
            (
                skill_id,
                student_id,
            ),
        )

        existing = cursor.fetchone()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Student skill not found.",
            )

        cursor.execute(
            """
            DELETE FROM student_skills
            WHERE id = ?
              AND student_id = ?
            """,
            (
                skill_id,
                student_id,
            ),
        )

        connection.commit()

        return {
            "message": "Skill removed successfully.",
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to remove skill: {str(error)}",
        )

    finally:
        connection.close()