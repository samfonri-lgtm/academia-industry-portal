from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import sqlite3

router = APIRouter(prefix="/opportunities", tags=["Opportunities"])

DB_PATH = "database/portal.db"


class OpportunityCreate(BaseModel):
    title: str
    company: str
    description: str
    location: Optional[str] = None
    opportunity_type: Optional[str] = None
    skills: Optional[str] = None
    stipend: Optional[str] = None
    deadline: Optional[str] = None


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


@router.get("/")
def get_opportunities(db=Depends(get_db)):
    cursor = db.cursor()

    cursor.execute("""
        SELECT *
        FROM opportunities
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    return [dict(row) for row in rows]


@router.get("/{opportunity_id}")
def get_opportunity(opportunity_id: int, db=Depends(get_db)):
    cursor = db.cursor()

    cursor.execute(
        """
        SELECT *
        FROM opportunities
        WHERE id = ?
        """,
        (opportunity_id,),
    )

    row = cursor.fetchone()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found"
        )

    return dict(row)


@router.post("/")
def create_opportunity(
    opportunity: OpportunityCreate,
    db=Depends(get_db)
):
    cursor = db.cursor()

    cursor.execute(
        """
        INSERT INTO opportunities
        (
            title,
            company,
            description,
            location,
            opportunity_type,
            skills,
            stipend,
            deadline
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            opportunity.title,
            opportunity.company,
            opportunity.description,
            opportunity.location,
            opportunity.opportunity_type,
            opportunity.skills,
            opportunity.stipend,
            opportunity.deadline,
        ),
    )

    db.commit()

    return {
        "message": "Opportunity created successfully",
        "id": cursor.lastrowid,
    }


@router.delete("/{opportunity_id}")
def delete_opportunity(
    opportunity_id: int,
    db=Depends(get_db)
):
    cursor = db.cursor()

    cursor.execute(
        """
        DELETE FROM opportunities
        WHERE id = ?
        """,
        (opportunity_id,),
    )

    db.commit()

    if cursor.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found"
        )

    return {
        "message": "Opportunity deleted successfully"
    }