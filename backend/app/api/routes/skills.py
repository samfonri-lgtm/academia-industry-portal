from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import sqlite3

router = APIRouter(prefix="/skills", tags=["Skills"])

DB_PATH = "database/portal.db"


class SkillCreate(BaseModel):
    user_id: int
    skill_name: str
    proficiency: Optional[str] = "Beginner"
    score: Optional[int] = 0


class SkillUpdate(BaseModel):
    proficiency: Optional[str] = None
    score: Optional[int] = None


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    try:
        yield conn
    finally:
        conn.close()


@router.get("/user/{user_id}")
def get_user_skills(
    user_id: int,
    db=Depends(get_db)
):
    cursor = db.cursor()

    cursor.execute(
        """
        SELECT *
        FROM skills
        WHERE user_id = ?
        ORDER BY id DESC
        """,
        (user_id,)
    )

    rows = cursor.fetchall()

    return [dict(row) for row in rows]


@router.post("/")
def create_skill(
    data: SkillCreate,
    db=Depends(get_db)
):
    cursor = db.cursor()

    cursor.execute(
        """
        SELECT id
        FROM skills
        WHERE user_id = ?
        AND skill_name = ?
        """,
        (
            data.user_id,
            data.skill_name,
        )
    )

    if cursor.fetchone():
        raise HTTPException(
            status_code=400,
            detail="Skill already exists for this user"
        )

    cursor.execute(
        """
        INSERT INTO skills
        (
            user_id,
            skill_name,
            proficiency,
            score
        )
        VALUES (?, ?, ?, ?)
        """,
        (
            data.user_id,
            data.skill_name,
            data.proficiency,
            data.score,
        )
    )

    db.commit()

    return {
        "message": "Skill added successfully",
        "skill_id": cursor.lastrowid,
    }


@router.patch("/{skill_id}")
def update_skill(
    skill_id: int,
    data: SkillUpdate,
    db=Depends(get_db)
):
    cursor = db.cursor()

    updates = []
    values = []

    for field, value in data.model_dump(
        exclude_unset=True
    ).items():

        if value is not None:
            updates.append(f"{field} = ?")
            values.append(value)

    if not updates:
        return {
            "message": "No changes provided"
        }

    values.append(skill_id)

    cursor.execute(
        f"""
        UPDATE skills
        SET {", ".join(updates)}
        WHERE id = ?
        """,
        values
    )

    db.commit()

    if cursor.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Skill not found"
        )

    return {
        "message": "Skill updated successfully"
    }


@router.delete("/{skill_id}")
def delete_skill(
    skill_id: int,
    db=Depends(get_db)
):
    cursor = db.cursor()

    cursor.execute(
        """
        DELETE FROM skills
        WHERE id = ?
        """,
        (skill_id,)
    )

    db.commit()

    if cursor.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Skill not found"
        )

    return {
        "message": "Skill deleted successfully"
    }


@router.get("/gap/{user_id}")
def get_skill_gap(
    user_id: int,
    db=Depends(get_db)
):
    cursor = db.cursor()

    cursor.execute(
        """
        SELECT skill_name, proficiency, score
        FROM skills
        WHERE user_id = ?
        ORDER BY score ASC
        """,
        (user_id,)
    )

    rows = cursor.fetchall()

    skills = [dict(row) for row in rows]

    gaps = [
        skill for skill in skills
        if (skill.get("score") or 0) < 60
    ]

    return {
        "user_id": user_id,
        "total_skills": len(skills),
        "skill_gaps": gaps,
    }