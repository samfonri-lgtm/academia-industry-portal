from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.database import get_connection

router = APIRouter(
    prefix="/opportunities",
    tags=["Opportunities"],
)


# =========================================================
# CREATE OPPORTUNITY
# =========================================================

class OpportunityCreate(BaseModel):
    company_id: int
    title: str
    type: str
    description: Optional[str] = ""
    location: Optional[str] = ""
    stipend: Optional[str] = ""
    deadline: Optional[str] = None


@router.post("/")
def create_opportunity(data: OpportunityCreate):

    connection = get_connection()

    try:
        cursor = connection.cursor()

        # Check company
        cursor.execute(
            """
            SELECT id
            FROM companies
            WHERE id = ?
            """,
            (data.company_id,),
        )

        company = cursor.fetchone()

        if not company:
            raise HTTPException(
                status_code=404,
                detail="Company not found.",
            )

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
                data.company_id,
                data.title,
                data.type,
                data.description,
                data.location,
                data.stipend,
                data.deadline,
            ),
        )

        opportunity_id = cursor.lastrowid

        connection.commit()

        return {
            "status": "success",
            "message": "Opportunity created successfully.",
            "opportunity_id": opportunity_id,
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to create opportunity: {str(error)}",
        )

    finally:
        connection.close()


# =========================================================
# GET ALL OPPORTUNITIES
# =========================================================

@router.get("/")
def get_opportunities():

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                o.id,
                o.company_id,
                c.name AS company_name,
                o.title,
                o.type,
                o.description,
                o.location,
                o.stipend,
                o.deadline,
                o.created_at
            FROM opportunities o
            JOIN companies c
                ON c.id = o.company_id
            ORDER BY o.created_at DESC
            LIMIT 200
            """
        )

        opportunities = [
            dict(row)
            for row in cursor.fetchall()
        ]

        return {
            "status": "success",
            "count": len(opportunities),
            "opportunities": opportunities,
        }

    finally:
        connection.close()


# =========================================================
# GET SINGLE OPPORTUNITY
# =========================================================

@router.get("/{opportunity_id}")
def get_opportunity(opportunity_id: int):

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                o.id,
                o.company_id,
                c.name AS company_name,
                o.title,
                o.type,
                o.description,
                o.location,
                o.stipend,
                o.deadline,
                o.created_at
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

        return {
            "status": "success",
            "opportunity": dict(opportunity),
        }

    finally:
        connection.close()


# =========================================================
# DELETE OPPORTUNITY
# =========================================================

@router.delete("/{opportunity_id}")
def delete_opportunity(opportunity_id: int):

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id
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

        cursor.execute(
            """
            DELETE FROM opportunities
            WHERE id = ?
            """,
            (opportunity_id,),
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