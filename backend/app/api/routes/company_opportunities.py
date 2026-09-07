from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.database import get_connection


router = APIRouter(
    prefix="/company/opportunities",
    tags=["Company Opportunities"],
)


# =========================================================
# REQUEST MODELS
# =========================================================

class OpportunityCreate(BaseModel):
    user_id: int
    title: str
    type: str
    description: Optional[str] = ""
    location: Optional[str] = ""
    stipend: Optional[str] = ""
    deadline: Optional[str] = None


class OpportunityUpdate(BaseModel):
    user_id: int
    title: str
    type: str
    description: Optional[str] = ""
    location: Optional[str] = ""
    stipend: Optional[str] = ""
    deadline: Optional[str] = None


class ApplicationStatusUpdate(BaseModel):
    user_id: int
    status: str


ALLOWED_STATUSES = {
    "Applied",
    "Shortlisted",
    "Rejected",
    "Selected",
}


# =========================================================
# CHECK COMPANY
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
                detail="Only company accounts can access this system.",
            )

        return user

    finally:
        connection.close()


# =========================================================
# GET COMPANY ID
# =========================================================

def get_company_id(user_id: int):

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
                detail=(
                    "Company profile not found. "
                    "Please complete your company profile first."
                ),
            )

        return company["id"]

    finally:
        connection.close()


# =========================================================
# CREATE OPPORTUNITY
# =========================================================

@router.post("/")
def create_opportunity(data: OpportunityCreate):

    check_company(data.user_id)

    company_id = get_company_id(data.user_id)

    title = data.title.strip()
    opportunity_type = data.type.strip()
    description = data.description.strip()
    location = data.location.strip()
    stipend = data.stipend.strip()

    if not title:
        raise HTTPException(
            status_code=400,
            detail="Opportunity title is required.",
        )

    if not opportunity_type:
        raise HTTPException(
            status_code=400,
            detail="Opportunity type is required.",
        )

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO opportunities
            (
                company_id,
                title,
                type,
                description,
                location,
                stipend,
                deadline
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                company_id,
                title,
                opportunity_type,
                description,
                location,
                stipend,
                data.deadline,
            ),
        )

        opportunity_id = cursor.lastrowid

        connection.commit()

        return {
            "status": "success",
            "message": "Opportunity created successfully.",
            "opportunity": {
                "id": opportunity_id,
                "company_id": company_id,
                "title": title,
                "type": opportunity_type,
                "description": description,
                "location": location,
                "stipend": stipend,
                "deadline": data.deadline,
            },
        }

    except Exception as error:

        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to create opportunity: {str(error)}",
        )

    finally:
        connection.close()


# =========================================================
# GET COMPANY OPPORTUNITIES
# =========================================================

@router.get("/{user_id}")
def get_company_opportunities(user_id: int):

    check_company(user_id)

    company_id = get_company_id(user_id)

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                o.id,
                o.company_id,
                o.title,
                o.type,
                o.description,
                o.location,
                o.stipend,
                o.deadline,
                o.created_at,
                COUNT(a.id) AS application_count
            FROM opportunities o
            LEFT JOIN applications a
                ON a.opportunity_id = o.id
            WHERE o.company_id = ?
            GROUP BY
                o.id,
                o.company_id,
                o.title,
                o.type,
                o.description,
                o.location,
                o.stipend,
                o.deadline,
                o.created_at
            ORDER BY o.created_at DESC, o.id DESC
            """,
            (company_id,),
        )

        opportunities = [
            dict(row)
            for row in cursor.fetchall()
        ]

        return {
            "status": "success",
            "company_id": company_id,
            "count": len(opportunities),
            "opportunities": opportunities,
        }

    finally:
        connection.close()


# =========================================================
# GET SINGLE COMPANY OPPORTUNITY
# =========================================================

@router.get("/{user_id}/{opportunity_id}")
def get_company_opportunity(
    user_id: int,
    opportunity_id: int,
):

    check_company(user_id)

    company_id = get_company_id(user_id)

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                o.id,
                o.company_id,
                o.title,
                o.type,
                o.description,
                o.location,
                o.stipend,
                o.deadline,
                o.created_at,
                COUNT(a.id) AS application_count
            FROM opportunities o
            LEFT JOIN applications a
                ON a.opportunity_id = o.id
            WHERE o.id = ?
              AND o.company_id = ?
            GROUP BY
                o.id,
                o.company_id,
                o.title,
                o.type,
                o.description,
                o.location,
                o.stipend,
                o.deadline,
                o.created_at
            """,
            (
                opportunity_id,
                company_id,
            ),
        )

        opportunity = cursor.fetchone()

        if not opportunity:
            raise HTTPException(
                status_code=404,
                detail="Opportunity not found.",
            )

        return {
            "status": "success",
            "opportunity": dict(opportunity),
        }

    finally:
        connection.close()


# =========================================================
# UPDATE OPPORTUNITY
# =========================================================

@router.put("/{opportunity_id}")
def update_company_opportunity(
    opportunity_id: int,
    data: OpportunityUpdate,
):

    check_company(data.user_id)

    company_id = get_company_id(data.user_id)

    title = data.title.strip()
    opportunity_type = data.type.strip()
    description = data.description.strip()
    location = data.location.strip()
    stipend = data.stipend.strip()

    if not title:
        raise HTTPException(
            status_code=400,
            detail="Opportunity title is required.",
        )

    if not opportunity_type:
        raise HTTPException(
            status_code=400,
            detail="Opportunity type is required.",
        )

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id
            FROM opportunities
            WHERE id = ?
              AND company_id = ?
            """,
            (
                opportunity_id,
                company_id,
            ),
        )

        existing = cursor.fetchone()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Opportunity not found.",
            )

        cursor.execute(
            """
            UPDATE opportunities
            SET
                title = ?,
                type = ?,
                description = ?,
                location = ?,
                stipend = ?,
                deadline = ?
            WHERE id = ?
              AND company_id = ?
            """,
            (
                title,
                opportunity_type,
                description,
                location,
                stipend,
                data.deadline,
                opportunity_id,
                company_id,
            ),
        )

        connection.commit()

        return {
            "status": "success",
            "message": "Opportunity updated successfully.",
            "opportunity_id": opportunity_id,
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:

        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to update opportunity: {str(error)}",
        )

    finally:
        connection.close()


# =========================================================
# DELETE OPPORTUNITY
# =========================================================

@router.delete("/{opportunity_id}")
def delete_company_opportunity(
    opportunity_id: int,
    user_id: int,
):

    check_company(user_id)

    company_id = get_company_id(user_id)

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id
            FROM opportunities
            WHERE id = ?
              AND company_id = ?
            """,
            (
                opportunity_id,
                company_id,
            ),
        )

        existing = cursor.fetchone()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Opportunity not found.",
            )

        cursor.execute(
            """
            DELETE FROM opportunities
            WHERE id = ?
              AND company_id = ?
            """,
            (
                opportunity_id,
                company_id,
            ),
        )

        connection.commit()

        return {
            "status": "success",
            "message": "Opportunity deleted successfully.",
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:

        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete opportunity: {str(error)}",
        )

    finally:
        connection.close()


# =========================================================
# GET APPLICATIONS FOR COMPANY OPPORTUNITY
# =========================================================

@router.get("/{user_id}/{opportunity_id}/applications")
def get_company_applications(
    user_id: int,
    opportunity_id: int,
):

    check_company(user_id)

    company_id = get_company_id(user_id)

    connection = get_connection()

    try:
        cursor = connection.cursor()

        # -------------------------------------------------
        # Verify opportunity belongs to company
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                o.id,
                o.title
            FROM opportunities o
            WHERE o.id = ?
              AND o.company_id = ?
            """,
            (
                opportunity_id,
                company_id,
            ),
        )

        opportunity = cursor.fetchone()

        if not opportunity:
            raise HTTPException(
                status_code=404,
                detail="Opportunity not found.",
            )

        # -------------------------------------------------
        # Get applications
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                a.id,
                a.student_id,
                u.name AS student_name,
                u.email AS student_email,
                sp.college,
                sp.branch,
                sp.semester,
                sp.cgpa,
                sp.career_goal,
                a.status,
                a.applied_at
            FROM applications a
            JOIN student_profiles sp
                ON sp.id = a.student_id
            JOIN users u
                ON u.id = sp.user_id
            WHERE a.opportunity_id = ?
            ORDER BY a.applied_at DESC, a.id DESC
            """,
            (opportunity_id,),
        )

        applications = [
            dict(row)
            for row in cursor.fetchall()
        ]

        return {
            "status": "success",
            "opportunity": dict(opportunity),
            "count": len(applications),
            "applications": applications,
        }

    finally:
        connection.close()


# =========================================================
# UPDATE APPLICATION STATUS
# =========================================================

@router.patch("/applications/{application_id}/status")
def update_application_status(
    application_id: int,
    data: ApplicationStatusUpdate,
):

    check_company(data.user_id)

    company_id = get_company_id(data.user_id)

    status = data.status.strip().title()

    if status not in ALLOWED_STATUSES:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid status. Allowed values: "
                + ", ".join(sorted(ALLOWED_STATUSES))
            ),
        )

    connection = get_connection()

    try:
        cursor = connection.cursor()

        # -------------------------------------------------
        # Find application and verify company ownership
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                a.id,
                a.student_id,
                a.opportunity_id,
                a.status
            FROM applications a
            JOIN opportunities o
                ON o.id = a.opportunity_id
            WHERE a.id = ?
              AND o.company_id = ?
            """,
            (
                application_id,
                company_id,
            ),
        )

        application = cursor.fetchone()

        if not application:
            raise HTTPException(
                status_code=404,
                detail="Application not found.",
            )

        old_status = application["status"]

        cursor.execute(
            """
            UPDATE applications
            SET status = ?
            WHERE id = ?
            """,
            (
                status,
                application_id,
            ),
        )

        connection.commit()

        return {
            "status": "success",
            "message": "Application status updated successfully.",
            "application": {
                "id": application_id,
                "student_id": application["student_id"],
                "opportunity_id": application["opportunity_id"],
                "old_status": old_status,
                "new_status": status,
            },
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:

        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to update application status: "
                f"{str(error)}"
            ),
        )

    finally:
        connection.close()