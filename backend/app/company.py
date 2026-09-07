from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.database import get_connection


router = APIRouter(
    prefix="/company",
    tags=["Company"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class CompanyProfileCreate(BaseModel):
    name: str
    industry: str = ""
    description: str = ""
    location: str = ""


# =========================================================
# CREATE / UPDATE COMPANY PROFILE
# =========================================================

@router.post("/profile/{user_id}")
def create_company_profile(
    user_id: int,
    data: CompanyProfileCreate,
):

    connection = get_connection()

    try:
        cursor = connection.cursor()

        # Check company user
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
                detail="Only company accounts can create company profiles.",
            )

        if not data.name.strip():
            raise HTTPException(
                status_code=400,
                detail="Company name is required.",
            )

        # Check existing profile
        cursor.execute(
            """
            SELECT id
            FROM companies
            WHERE user_id = ?
            """,
            (user_id,),
        )

        existing = cursor.fetchone()

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
                    data.name.strip(),
                    data.industry.strip(),
                    data.description.strip(),
                    data.location.strip(),
                    user_id,
                ),
            )

            company_id = existing["id"]
            action = "updated"

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
                    user_id,
                    data.name.strip(),
                    data.industry.strip(),
                    data.description.strip(),
                    data.location.strip(),
                ),
            )

            company_id = cursor.lastrowid
            action = "created"

        connection.commit()

        return {
            "status": "success",
            "message": f"Company profile {action} successfully.",
            "company": {
                "id": company_id,
                "user_id": user_id,
                "name": data.name.strip(),
                "industry": data.industry.strip(),
                "description": data.description.strip(),
                "location": data.location.strip(),
            },
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


# =========================================================
# GET COMPANY PROFILE
# =========================================================

@router.get("/profile/{user_id}")
def get_company_profile(user_id: int):

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                c.id,
                c.user_id,
                c.name,
                c.industry,
                c.description,
                c.location
            FROM companies c
            JOIN users u
                ON c.user_id = u.id
            WHERE c.user_id = ?
              AND LOWER(u.role) = 'company'
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
            "company": dict(company),
        }

    finally:
        connection.close()


# =========================================================
# UPDATE COMPANY PROFILE
# =========================================================

@router.put("/profile/{user_id}")
def update_company_profile(
    user_id: int,
    data: CompanyProfileCreate,
):

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id
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

        if not data.name.strip():
            raise HTTPException(
                status_code=400,
                detail="Company name is required.",
            )

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
                data.name.strip(),
                data.industry.strip(),
                data.description.strip(),
                data.location.strip(),
                user_id,
            ),
        )

        connection.commit()

        return {
            "status": "success",
            "message": "Company profile updated successfully.",
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:

        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to update company profile: {str(error)}",
        )

    finally:
        connection.close()