from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.database import get_connection

router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)


ALLOWED_STATUSES = {
    "Applied",
    "Shortlisted",
    "Rejected",
    "Selected",
}


class ApplicationStatusUpdate(BaseModel):
    status: str


# =========================================================
# APPLY FOR OPPORTUNITY
# =========================================================

@router.post("/student/{student_id}/opportunity/{opportunity_id}")
def apply_for_opportunity(
    student_id: int,
    opportunity_id: int,
):

    connection = get_connection()

    try:
        cursor = connection.cursor()

        # Check student
        cursor.execute(
            """
            SELECT id
            FROM student_profiles
            WHERE id = ?
            """,
            (student_id,),
        )

        if not cursor.fetchone():
            raise HTTPException(
                status_code=404,
                detail="Student profile not found.",
            )

        # Check opportunity
        cursor.execute(
            """
            SELECT id, title
            FROM opportunities
            WHERE id = ?
            """,
            (opportunity_id,),
        )

        opportunity = cursor.fetchone()

        if not opportunity:
            raise HTTPException(
                status_code=404,
                detail="Opportunity not found.",
            )

        # Check duplicate application
        cursor.execute(
            """
            SELECT id, status
            FROM applications
            WHERE student_id = ?
              AND opportunity_id = ?
            """,
            (
                student_id,
                opportunity_id,
            ),
        )

        existing = cursor.fetchone()

        if existing:
            raise HTTPException(
                status_code=409,
                detail=(
                    "You have already applied for this opportunity."
                ),
            )

        # Create application
        cursor.execute(
            """
            INSERT INTO applications
            (
                student_id,
                opportunity_id,
                status
            )
            VALUES (?, ?, ?)
            """,
            (
                student_id,
                opportunity_id,
                "Applied",
            ),
        )

        application_id = cursor.lastrowid

        connection.commit()

        return {
            "status": "success",
            "message": "Application submitted successfully.",
            "application": {
                "id": application_id,
                "student_id": student_id,
                "opportunity_id": opportunity_id,
                "opportunity_title": opportunity["title"],
                "status": "Applied",
            },
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to submit application: {str(error)}",
        )

    finally:
        connection.close()


# =========================================================
# GET STUDENT APPLICATIONS
# =========================================================

@router.get("/student/{student_id}")
def get_student_applications(student_id: int):

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id
            FROM student_profiles
            WHERE id = ?
            """,
            (student_id,),
        )

        if not cursor.fetchone():
            raise HTTPException(
                status_code=404,
                detail="Student profile not found.",
            )

        cursor.execute(
            """
            SELECT
                a.id,
                a.student_id,
                a.opportunity_id,
                o.title,
                o.type,
                o.location,
                o.stipend,
                c.name AS company_name,
                a.status,
                a.applied_at
            FROM applications a
            JOIN opportunities o
                ON o.id = a.opportunity_id
            JOIN companies c
                ON c.id = o.company_id
            WHERE a.student_id = ?
            ORDER BY a.applied_at DESC, a.id DESC
            """,
            (student_id,),
        )

        applications = [
            dict(row)
            for row in cursor.fetchall()
        ]

        return {
            "status": "success",
            "student_id": student_id,
            "count": len(applications),
            "applications": applications,
        }

    finally:
        connection.close()


# =========================================================
# GET APPLICATIONS FOR OPPORTUNITY
# =========================================================

@router.get("/opportunity/{opportunity_id}")
def get_opportunity_applications(
    opportunity_id: int,
):

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                o.id,
                o.title,
                c.name AS company_name
            FROM opportunities o
            JOIN companies c
                ON c.id = o.company_id
            WHERE o.id = ?
            """,
            (opportunity_id,),
        )

        opportunity = cursor.fetchone()

        if not opportunity:
            raise HTTPException(
                status_code=404,
                detail="Opportunity not found.",
            )

        cursor.execute(
            """
            SELECT
                a.id,
                a.student_id,
                u.name AS student_name,
                u.email AS student_email,
                a.status,
                a.applied_at
            FROM applications a
            JOIN student_profiles sp
                ON sp.id = a.student_id
            JOIN users u
                ON u.id = sp.user_id
            WHERE a.opportunity_id = ?
            ORDER BY a.applied_at DESC
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

@router.patch("/{application_id}/status")
def update_application_status(
    application_id: int,
    data: ApplicationStatusUpdate,
):

    if data.status not in ALLOWED_STATUSES:
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

        cursor.execute(
            """
            SELECT
                id,
                student_id,
                opportunity_id,
                status
            FROM applications
            WHERE id = ?
            """,
            (application_id,),
        )

        application = cursor.fetchone()

        if not application:
            raise HTTPException(
                status_code=404,
                detail="Application not found.",
            )

        cursor.execute(
            """
            UPDATE applications
            SET status = ?
            WHERE id = ?
            """,
            (
                data.status,
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
                "old_status": application["status"],
                "new_status": data.status,
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


# =========================================================
# WITHDRAW APPLICATION
# =========================================================

@router.delete("/{application_id}")
def withdraw_application(application_id: int):

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id, status
            FROM applications
            WHERE id = ?
            """,
            (application_id,),
        )

        application = cursor.fetchone()

        if not application:
            raise HTTPException(
                status_code=404,
                detail="Application not found.",
            )

        if application["status"] in {
            "Selected",
            "Rejected",
        }:
            raise HTTPException(
                status_code=400,
                detail=(
                    "This application can no longer be withdrawn."
                ),
            )

        cursor.execute(
            """
            DELETE FROM applications
            WHERE id = ?
            """,
            (application_id,),
        )

        connection.commit()

        return {
            "status": "success",
            "message": "Application withdrawn successfully.",
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to withdraw application: "
                f"{str(error)}"
            ),
        )

    finally:
        connection.close()