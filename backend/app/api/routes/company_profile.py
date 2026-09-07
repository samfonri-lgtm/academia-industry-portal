from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.database import get_connection


router = APIRouter(
    prefix="/company/profile",
    tags=["Company Profile"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class CompanyProfileRequest(BaseModel):
    user_id: int
    name: str = ""
    industry: str = ""
    description: str = ""
    location: str = ""


# =========================================================
# CHECK COMPANY USER
# =========================================================

def check_company(user_id: int):

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

        if user["role"].lower() != "company":
            raise HTTPException(
                status_code=403,
                detail="Only company accounts can access this profile.",
            )

        return user

    finally:
        connection.close()


# =========================================================
# GET COMPANY PROFILE
# =========================================================

@router.get("/{user_id}")
def get_company_profile(user_id: int):

    user = check_company(user_id)

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                id,
                user_id,
                name,
                industry,
                description,
                location
            FROM companies
            WHERE user_id = ?
            """,
            (user_id,),
        )

        company = cursor.fetchone()

        if not company:
            raise HTTPException(
                status_code=404,
                detail="Company profile not found.",
            )

        return {
            "status": "success",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": user["role"],
            },
            "company": dict(company),
        }

    finally:
        connection.close()


# =========================================================
# CREATE / UPDATE COMPANY PROFILE
# =========================================================

@router.put("/")
def update_company_profile(
    request: CompanyProfileRequest,
):

    check_company(request.user_id)

    name = request.name.strip()
    industry = request.industry.strip()
    description = request.description.strip()
    location = request.location.strip()

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Company name is required.",
        )

    connection = get_connection()

    try:
        cursor = connection.cursor()

        # -------------------------------------------------
        # Check existing company profile
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT id
            FROM companies
            WHERE user_id = ?
            """,
            (request.user_id,),
        )

        existing = cursor.fetchone()

        # -------------------------------------------------
        # UPDATE
        # -------------------------------------------------

        if existing:

            cursor.execute(
                """
                UPDATE companies
                SET
                    name = ?,
                    industry = ?,
                    description = ?,
                    location = ?
                WHERE user_id = ?
                """,
                (
                    name,
                    industry,
                    description,
                    location,
                    request.user_id,
                ),
            )

        # -------------------------------------------------
        # CREATE
        # -------------------------------------------------

        else:

            cursor.execute(
                """
                INSERT INTO companies
                (
                    user_id,
                    name,
                    industry,
                    description,
                    location
                )
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    request.user_id,
                    name,
                    industry,
                    description,
                    location,
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
                name,
                industry,
                description,
                location
            FROM companies
            WHERE user_id = ?
            """,
            (request.user_id,),
        )

        company = cursor.fetchone()

        if not company:
            raise HTTPException(
                status_code=500,
                detail="Company profile was saved but could not be retrieved.",
            )

        return {
            "status": "success",
            "message": "Company profile saved successfully.",
            "company": dict(company),
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:

        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to save company profile: {str(error)}",
        )

    finally:
        connection.close()