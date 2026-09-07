from fastapi import APIRouter, HTTPException

from app.database import get_connection

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


# =========================================================
# STUDENT DASHBOARD
# =========================================================

@router.get("/student/{user_id}")
def student_dashboard(user_id: int):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        # ---------------------------------------------
        # Verify student
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT
                u.id,
                u.name,
                u.email,
                u.role,
                sp.id AS student_id
            FROM users u
            LEFT JOIN student_profiles sp
                ON sp.user_id = u.id
            WHERE u.id = ?
            """,
            (user_id,),
        )

        student = cursor.fetchone()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="User not found.",
            )

        if student["role"].lower() != "student":
            raise HTTPException(
                status_code=403,
                detail="Only student accounts can access this dashboard.",
            )

        student_id = student["student_id"]

        if not student_id:
            raise HTTPException(
                status_code=404,
                detail="Student profile not found.",
            )

        # ---------------------------------------------
        # Applications
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT COUNT(*) AS count
            FROM applications
            WHERE student_id = ?
            """,
            (student_id,),
        )

        total_applications = cursor.fetchone()["count"]

        # ---------------------------------------------
        # Accepted applications
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT COUNT(*) AS count
            FROM applications
            WHERE student_id = ?
              AND LOWER(status) = 'selected'
            """,
            (student_id,),
        )

        accepted = cursor.fetchone()["count"]

        # ---------------------------------------------
        # Rejected applications
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT COUNT(*) AS count
            FROM applications
            WHERE student_id = ?
              AND LOWER(status) = 'rejected'
            """,
            (student_id,),
        )

        rejected = cursor.fetchone()["count"]

        # ---------------------------------------------
        # Pending / Applied applications
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT COUNT(*) AS count
            FROM applications
            WHERE student_id = ?
              AND LOWER(status) NOT IN ('selected', 'rejected')
            """,
            (student_id,),
        )

        pending = cursor.fetchone()["count"]

        # ---------------------------------------------
        # Student skills
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT COUNT(*) AS count
            FROM student_skills
            WHERE student_id = ?
            """,
            (student_id,),
        )

        skill_count = cursor.fetchone()["count"]

        # ---------------------------------------------
        # Available opportunities
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT COUNT(*) AS count
            FROM opportunities
            """
        )

        available_opportunities = cursor.fetchone()["count"]

        return {
            "status": "success",
            "student": {
                "id": student["id"],
                "student_id": student_id,
                "name": student["name"],
                "email": student["email"],
                "role": student["role"],
            },
            "statistics": {
                "applications": total_applications,
                "accepted": accepted,
                "rejected": rejected,
                "pending": pending,
                "skills": skill_count,
                "available_opportunities": available_opportunities,
            },
        }

    finally:
        connection.close()


# =========================================================
# COMPANY DASHBOARD
# =========================================================

@router.get("/company/{user_id}")
def company_dashboard(user_id: int):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        # ---------------------------------------------
        # Verify company
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT
                u.id,
                u.name,
                u.email,
                u.role,
                c.id AS company_id,
                c.name AS company_name
            FROM users u
            LEFT JOIN companies c
                ON c.user_id = u.id
            WHERE u.id = ?
            """,
            (user_id,),
        )

        company = cursor.fetchone()

        if not company:
            raise HTTPException(
                status_code=404,
                detail="User not found.",
            )

        if company["role"].lower() != "company":
            raise HTTPException(
                status_code=403,
                detail="Only company accounts can access this dashboard.",
            )

        company_id = company["company_id"]

        if not company_id:
            raise HTTPException(
                status_code=404,
                detail="Company profile not found.",
            )

        # ---------------------------------------------
        # Opportunities
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT COUNT(*) AS count
            FROM opportunities
            WHERE company_id = ?
            """,
            (company_id,),
        )

        opportunities = cursor.fetchone()["count"]

        # ---------------------------------------------
        # Applications
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT COUNT(*) AS count
            FROM applications a
            INNER JOIN opportunities o
                ON o.id = a.opportunity_id
            WHERE o.company_id = ?
            """,
            (company_id,),
        )

        applications = cursor.fetchone()["count"]

        # ---------------------------------------------
        # Accepted applications
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT COUNT(*) AS count
            FROM applications a
            INNER JOIN opportunities o
                ON o.id = a.opportunity_id
            WHERE o.company_id = ?
             AND LOWER(a.status) = 'selected'
            """,
            (company_id,),
        )

        accepted = cursor.fetchone()["count"]

        # ---------------------------------------------
        # Pending applications
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT COUNT(*) AS count
            FROM applications a
            INNER JOIN opportunities o
                ON o.id = a.opportunity_id
            WHERE o.company_id = ?
              AND LOWER(a.status) NOT IN ('selected', 'rejected')
            """,
            (company_id,),
        )

        pending = cursor.fetchone()["count"]

        return {
            "status": "success",
            "company": {
                "id": company["id"],
                "company_id": company_id,
                "name": company["company_name"],
                "email": company["email"],
                "role": company["role"],
            },
            "statistics": {
                "opportunities": opportunities,
                "applications": applications,
                "accepted_applications": accepted,
                "pending_applications": pending,
            },
        }

    finally:
        connection.close()


# =========================================================
# INSTITUTION DASHBOARD
# =========================================================

@router.get("/institution/{user_id}")
def institution_dashboard(user_id: int):
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

        institution = cursor.fetchone()

        if not institution:
            raise HTTPException(
                status_code=404,
                detail="User not found.",
            )

        if institution["role"].lower() != "institution":
            raise HTTPException(
                status_code=403,
                detail="Only institution accounts can access this dashboard.",
            )

        # ---------------------------------------------
        # Total students
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT COUNT(*) AS count
            FROM users
            WHERE LOWER(role) = 'student'
            """
        )

        students = cursor.fetchone()["count"]

        # ---------------------------------------------
        # Total companies
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT COUNT(*) AS count
            FROM companies
            """
        )

        companies = cursor.fetchone()["count"]

        # ---------------------------------------------
        # Total opportunities
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT COUNT(*) AS count
            FROM opportunities
            """
        )

        opportunities = cursor.fetchone()["count"]

        # ---------------------------------------------
        # Total applications
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT COUNT(*) AS count
            FROM applications
            """
        )

        applications = cursor.fetchone()["count"]

        return {
            "status": "success",
            "institution": {
                "id": institution["id"],
                "name": institution["name"],
                "email": institution["email"],
                "role": institution["role"],
            },
            "statistics": {
                "students": students,
                "companies": companies,
                "opportunities": opportunities,
                "applications": applications,
            },
        }

    finally:
        connection.close()


# =========================================================
# ADMIN DASHBOARD
# =========================================================

@router.get("/admin")
def admin_dashboard():
    connection = get_connection()

    try:
        cursor = connection.cursor()

        # ---------------------------------------------
        # Users
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT COUNT(*) AS count
            FROM users
            """
        )

        users = cursor.fetchone()["count"]

        # ---------------------------------------------
        # Students
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT COUNT(*) AS count
            FROM users
            WHERE LOWER(role) = 'student'
            """
        )

        students = cursor.fetchone()["count"]

        # ---------------------------------------------
        # Companies
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT COUNT(*) AS count
            FROM companies
            """
        )

        companies = cursor.fetchone()["count"]

        # ---------------------------------------------
        # Opportunities
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT COUNT(*) AS count
            FROM opportunities
            """
        )

        opportunities = cursor.fetchone()["count"]

        # ---------------------------------------------
        # Applications
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT COUNT(*) AS count
            FROM applications
            """
        )

        applications = cursor.fetchone()["count"]

        return {
            "status": "success",
            "statistics": {
                "users": users,
                "students": students,
                "companies": companies,
                "opportunities": opportunities,
                "applications": applications,
            },
        }

    finally:
        connection.close()