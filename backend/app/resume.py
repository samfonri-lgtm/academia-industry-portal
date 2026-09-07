from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.database import get_connection
from app.resume_parser import extract_resume_text
from app.ai.skill_extraction import extract_skills_with_ai


router = APIRouter(
    prefix="/student/resume",
    tags=["Student Resume"],
)


# =========================================================
# CONFIGURATION
# =========================================================

# Resumes are parsed in memory and only the extracted text is stored in
# SQLite (Vercel's filesystem is read-only/ephemeral, so files are never
# written to disk).

MAX_FILE_SIZE = 5 * 1024 * 1024

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".doc",
    ".docx",
}


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
                detail="Only student accounts can use the resume system.",
            )

        return user

    finally:
        connection.close()


# =========================================================
# GET STUDENT PROFILE ID
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
                detail=(
                    "Student profile not found. "
                    "Please complete your profile first."
                ),
            )

        return profile["id"]

    finally:
        connection.close()


# =========================================================
# GET RESUMES
# =========================================================

@router.get("/{user_id}")
def get_student_resumes(user_id: int):

    check_student(user_id)

    student_id = get_student_profile_id(user_id)

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                id,
                student_id,
                file_path,
                uploaded_at
            FROM resumes
            WHERE student_id = ?
            ORDER BY uploaded_at DESC, id DESC
            """,
            (student_id,),
        )

        resumes = [
            dict(row)
            for row in cursor.fetchall()
        ]

        return {
            "status": "success",
            "resumes": resumes,
        }

    finally:
        connection.close()


# =========================================================
# UPLOAD RESUME
# =========================================================

@router.post("/{user_id}/upload")
async def upload_resume(
    user_id: int,
    file: UploadFile = File(...),
):

    check_student(user_id)

    student_id = get_student_profile_id(user_id)

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected.",
        )

    original_name = Path(file.filename).name
    extension = Path(original_name).suffix.lower()

    # -----------------------------------------------------
    # Validate extension
    # -----------------------------------------------------

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOC and DOCX files are allowed.",
        )

    # -----------------------------------------------------
    # Read file
    # -----------------------------------------------------

    file_content = await file.read()

    if not file_content:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty.",
        )

    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Resume must be smaller than 5 MB.",
        )

    # -----------------------------------------------------
    # Create safe filename
    # -----------------------------------------------------

    original_stem = Path(original_name).stem

    safe_stem = "".join(
        character
        if character.isalnum() or character in ("_", "-")
        else "_"
        for character in original_stem
    )

    safe_filename = (
        f"student_{user_id}_{safe_stem}{extension}"
    )

    # -----------------------------------------------------
    # Extract resume text in memory
    # -----------------------------------------------------

    resume_text = extract_resume_text(safe_filename, file_content)

    # -----------------------------------------------------
    # Save database record
    # -----------------------------------------------------

    connection = get_connection()

    try:

        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO resumes
            (
                student_id,
                file_path,
                extracted_text
            )
            VALUES (?, ?, ?)
            """,
            (
                student_id,
                safe_filename,
                resume_text,
            ),
        )

        resume_id = cursor.lastrowid

        connection.commit()

        return {
            "status": "success",
            "message": "Resume uploaded successfully.",
            "resume": {
                "id": resume_id,
                "student_id": student_id,
                "file_path": safe_filename,
                "extracted_text_length": len(resume_text),
            },
        }

    except Exception as error:

        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to save resume information: "
                f"{str(error)}"
            ),
        )

    finally:
        connection.close()


# =========================================================
# ANALYZE RESUME WITH AI + SAVE SKILLS
# =========================================================

@router.post("/{user_id}/{resume_id}/analyze")
def analyze_resume(
    user_id: int,
    resume_id: int,
):

    # -----------------------------------------------------
    # Verify student
    # -----------------------------------------------------

    check_student(user_id)

    student_id = get_student_profile_id(user_id)

    # -----------------------------------------------------
    # Get resume
    # -----------------------------------------------------

    connection = get_connection()

    try:

        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                id,
                student_id,
                file_path,
                extracted_text,
                uploaded_at
            FROM resumes
            WHERE id = ?
              AND student_id = ?
            """,
            (
                resume_id,
                student_id,
            ),
        )

        resume = cursor.fetchone()

    finally:
        connection.close()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found.",
        )

    # -----------------------------------------------------
    # Resume text (extracted at upload time)
    # -----------------------------------------------------

    resume_text = resume["extracted_text"]

    if not resume_text:
        raise HTTPException(
            status_code=404,
            detail=(
                "Resume text is not available on the server. "
                "Please upload the resume again."
            ),
        )

    if not resume_text or not resume_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Could not extract readable text from resume.",
        )

    # -----------------------------------------------------
    # AI skill extraction
    # -----------------------------------------------------

    try:

        result = extract_skills_with_ai(
            resume_text
        )

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"AI skill extraction failed: {str(error)}",
        )

    extracted_skills = result.get(
        "skills",
        []
    )

    # -----------------------------------------------------
    # Save skills into database
    # -----------------------------------------------------

    connection = get_connection()

    saved_skills = []
    skipped_skills = []

    try:

        cursor = connection.cursor()

        for ai_skill in extracted_skills:

            if not isinstance(ai_skill, dict):
                continue

            skill_name = str(
                ai_skill.get("name", "")
            ).strip()

            level = str(
                ai_skill.get("level", "Beginner")
            ).strip()

            if not skill_name:
                continue

            # ---------------------------------------------
            # Find skill in skill library
            # ---------------------------------------------

            cursor.execute(
                """
                SELECT
                    id,
                    name,
                    category
                FROM skills
                WHERE LOWER(name) = LOWER(?)
                """,
                (skill_name,),
            )

            skill = cursor.fetchone()

            # ---------------------------------------------
            # Skill not present in library
            # ---------------------------------------------

            if not skill:

                skipped_skills.append(
                    {
                        "name": skill_name,
                        "reason": "Skill not found in skill library.",
                    }
                )

                continue

            skill_id = skill["id"]

            # ---------------------------------------------
            # Check existing student skill
            # ---------------------------------------------

            cursor.execute(
                """
                SELECT
                    id
                FROM student_skills
                WHERE student_id = ?
                  AND skill_id = ?
                """,
                (
                    student_id,
                    skill_id,
                ),
            )

            existing = cursor.fetchone()

            # ---------------------------------------------
            # Update existing skill
            # ---------------------------------------------

            if existing:

                cursor.execute(
                    """
                    UPDATE student_skills
                    SET level = ?
                    WHERE id = ?
                      AND student_id = ?
                    """,
                    (
                        level,
                        existing["id"],
                        student_id,
                    ),
                )

                saved_skills.append(
                    {
                        "id": existing["id"],
                        "skill_id": skill_id,
                        "name": skill["name"],
                        "category": skill["category"],
                        "level": level,
                        "action": "updated",
                    }
                )

            # ---------------------------------------------
            # Insert new skill
            # ---------------------------------------------

            else:

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
                        skill_id,
                        level,
                    ),
                )

                saved_skills.append(
                    {
                        "id": cursor.lastrowid,
                        "skill_id": skill_id,
                        "name": skill["name"],
                        "category": skill["category"],
                        "level": level,
                        "action": "added",
                    }
                )

        connection.commit()

        return {
            "status": "success",
            "message": "Resume analyzed and skills saved successfully.",
            "resume_id": resume_id,
            "student_id": student_id,
            "extracted_text_length": len(resume_text),
            "ai_skill_count": len(extracted_skills),
            "saved_skill_count": len(saved_skills),
            "skipped_skill_count": len(skipped_skills),
            "skills": saved_skills,
            "skipped_skills": skipped_skills,
        }

    except HTTPException:

        connection.rollback()
        raise

    except Exception as error:

        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to save extracted skills: "
                f"{str(error)}"
            ),
        )

    finally:
        connection.close()


# =========================================================
# DELETE RESUME
# =========================================================

@router.delete("/{user_id}/{resume_id}")
def delete_resume(
    user_id: int,
    resume_id: int,
):

    check_student(user_id)

    student_id = get_student_profile_id(user_id)

    connection = get_connection()

    try:

        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                id,
                file_path
            FROM resumes
            WHERE id = ?
              AND student_id = ?
            """,
            (
                resume_id,
                student_id,
            ),
        )

        resume = cursor.fetchone()

        if not resume:
            raise HTTPException(
                status_code=404,
                detail="Resume not found.",
            )

        # -------------------------------------------------
        # Delete database record
        # -------------------------------------------------

        cursor.execute(
            """
            DELETE FROM resumes
            WHERE id = ?
              AND student_id = ?
            """,
            (
                resume_id,
                student_id,
            ),
        )

        connection.commit()

        return {
            "status": "success",
            "message": "Resume deleted successfully.",
        }

    except HTTPException:

        connection.rollback()
        raise

    except Exception as error:

        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to delete resume: "
                f"{str(error)}"
            ),
        )

    finally:
        connection.close()