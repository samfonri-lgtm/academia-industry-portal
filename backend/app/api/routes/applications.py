from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import sqlite3

router = APIRouter(prefix="/applications", tags=["Applications"])

DB_PATH = "database/portal.db"


class ApplicationCreate(BaseModel):
    opportunity_id: int
    student_id: int
    resume_url: Optional[str] = None
    cover_letter: Optional[str] = None


class ApplicationStatusUpdate(BaseModel):
    status: str


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    try:
        yield conn
    finally:
        conn.close()


@router.get("/")
def get_applications(db=Depends(get_db)):
    cursor = db.cursor()

    cursor.execute("""
        SELECT *
        FROM applications
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    return [dict(row) for row in rows]


@router.get("/student/{student_id}")
def get_student_applications(
    student_id: int,
    db=Depends(get_db)
):
    cursor = db.cursor()

    cursor.execute(
        """
        SELECT *
        FROM applications
        WHERE student_id = ?
        ORDER BY id DESC
        """,
        (student_id,),
    )

    rows = cursor.fetchall()

    return [dict(row) for row in rows]


@router.get("/opportunity/{opportunity_id}")
def get_opportunity_applications(
    opportunity_id: int,
    db=Depends(get_db)
):
    cursor = db.cursor()

    cursor.execute(
        """
        SELECT *
        FROM applications
        WHERE opportunity_id = ?
        ORDER BY id DESC
        """,
        (opportunity_id,),
    )

    rows = cursor.fetchall()

    return [dict(row) for row in rows]


@router.post("/")
def create_application(
    application: ApplicationCreate,
    db=Depends(get_db)
):
    cursor = db.cursor()

    cursor.execute(
        """
        SELECT id
        FROM applications
        WHERE opportunity_id = ?
        AND student_id = ?
        """,
        (
            application.opportunity_id,
            application.student_id,
        ),
    )

    existing = cursor.fetchone()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Student has already applied for this opportunity"
        )

    cursor.execute(
        """
        INSERT INTO applications
        (
            opportunity_id,
            student_id,
            resume_url,
            cover_letter,
            status
        )
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            application.opportunity_id,
            application.student_id,
            application.resume_url,
            application.cover_letter,
            "Pending",
        ),
    )

    db.commit()

    return {
        "message": "Application submitted successfully",
        "id": cursor.lastrowid,
        "status": "Pending",
    }


@router.patch("/{application_id}/status")
def update_application_status(
    application_id: int,
    data: ApplicationStatusUpdate,
    db=Depends(get_db)
):
    cursor = db.cursor()

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

    db.commit()

    if cursor.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    return {
        "message": "Application status updated successfully",
        "status": data.status,
    }


@router.delete("/{application_id}")
def delete_application(
    application_id: int,
    db=Depends(get_db)
):
    cursor = db.cursor()

    cursor.execute(
        """
        DELETE FROM applications
        WHERE id = ?
        """,
        (application_id,),
    )

    db.commit()

    if cursor.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    return {
        "message": "Application deleted successfully"
    }