from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.database import get_connection


router = APIRouter(
    prefix="/student/profile",
    tags=["Student Profile"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class StudentProfileRequest(BaseModel):
    user_id: int
    college: str = ""
    branch: str = ""
    semester: str = ""
    cgpa: str = ""
    career_goal: str = ""


# =========================================================
# CHECK STUDENT
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

        if user["role"] != "student":
            raise HTTPException(
                status_code=403,
                detail="Only student accounts can access this profile.",
            )

        return user

    finally:
        connection.close()


# =========================================================
# GET STUDENT PROFILE
# =========================================================

@router.get("/{user_id}")
def get_student_profile(user_id: int):

    user = check_student(user_id)

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                id,
                user_id,
                college,
                branch,
                semester,
                cgpa,
                career_goal
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

        return {
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": user["role"],
            },
            "profile": dict(profile),
        }

    finally:
        connection.close()


# =========================================================
# CREATE / UPDATE STUDENT PROFILE
# =========================================================

@router.put("/")
def update_student_profile(request: StudentProfileRequest):

    # -----------------------------------------------------
    # Verify student
    # -----------------------------------------------------

    check_student(request.user_id)

    # -----------------------------------------------------
    # Clean input
    # -----------------------------------------------------

    college = request.college.strip()
    branch = request.branch.strip()
    semester_text = request.semester.strip()
    cgpa_text = request.cgpa.strip()
    career_goal = request.career_goal.strip()

    # -----------------------------------------------------
    # Validate Semester
    # -----------------------------------------------------

    semester = None

    if semester_text:

        normalized_semester = (
            semester_text
            .lower()
            .replace("semester", "")
            .strip()
        )

        suffixes = ("st", "nd", "rd", "th")

        for suffix in suffixes:
            if normalized_semester.endswith(suffix):
                normalized_semester = normalized_semester[:-len(suffix)]
                break

        try:
            semester = int(normalized_semester)

        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Semester must be a valid number between 1 and 8.",
            )

        if semester < 1 or semester > 8:
            raise HTTPException(
                status_code=400,
                detail="Semester must be between 1 and 8.",
            )

    # -----------------------------------------------------
    # Validate CGPA
    # -----------------------------------------------------

    cgpa = None

    if cgpa_text:

        try:
            cgpa = float(cgpa_text)

        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="CGPA must be a valid number.",
            )

        if cgpa < 0 or cgpa > 10:
            raise HTTPException(
                status_code=400,
                detail="CGPA must be between 0 and 10.",
            )

    # -----------------------------------------------------
    # Database
    # -----------------------------------------------------

    connection = get_connection()

    try:
        cursor = connection.cursor()

        # -------------------------------------------------
        # Check existing profile
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT id
            FROM student_profiles
            WHERE user_id = ?
            """,
            (request.user_id,),
        )

        existing_profile = cursor.fetchone()

        # -------------------------------------------------
        # UPDATE
        # -------------------------------------------------

        if existing_profile:

            cursor.execute(
                """
                UPDATE student_profiles
                SET
                    college = ?,
                    branch = ?,
                    semester = ?,
                    cgpa = ?,
                    career_goal = ?
                WHERE user_id = ?
                """,
                (
                    college,
                    branch,
                    semester,
                    cgpa,
                    career_goal,
                    request.user_id,
                ),
            )

        # -------------------------------------------------
        # CREATE
        # -------------------------------------------------

        else:

            cursor.execute(
                """
                INSERT INTO student_profiles
                (
                    user_id,
                    college,
                    branch,
                    semester,
                    cgpa,
                    career_goal
                )
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    request.user_id,
                    college,
                    branch,
                    semester,
                    cgpa,
                    career_goal,
                ),
            )

        connection.commit()

        # -------------------------------------------------
        # Fetch saved profile
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                id,
                user_id,
                college,
                branch,
                semester,
                cgpa,
                career_goal
            FROM student_profiles
            WHERE user_id = ?
            """,
            (request.user_id,),
        )

        profile = cursor.fetchone()

        if not profile:
            raise HTTPException(
                status_code=500,
                detail="Profile was saved but could not be retrieved.",
            )

        return {
            "message": "Student profile saved successfully.",
            "profile": dict(profile),
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to save student profile: {str(error)}",
        )

    finally:
        connection.close()