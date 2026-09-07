from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import sqlite3

router = APIRouter(prefix="/profile", tags=["Profile"])

DB_PATH = "database/portal.db"


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    institution: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    location: Optional[str] = None
    profile_image: Optional[str] = None


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    try:
        yield conn
    finally:
        conn.close()


@router.get("/{user_id}")
def get_profile(
    user_id: int,
    db=Depends(get_db)
):
    cursor = db.cursor()

    cursor.execute(
        """
        SELECT
            id,
            name,
            email,
            role,
            phone,
            institution,
            department,
            bio,
            designation,
            location,
            profile_image
        FROM users
        WHERE id = ?
        """,
        (user_id,)
    )

    user = cursor.fetchone()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    return dict(user)


@router.put("/{user_id}")
def update_profile(
    user_id: int,
    data: ProfileUpdate,
    db=Depends(get_db)
):
    cursor = db.cursor()

    cursor.execute(
        "SELECT id FROM users WHERE id = ?",
        (user_id,)
    )

    if not cursor.fetchone():
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    update_data = data.model_dump(exclude_unset=True)

    if not update_data:
        return {
            "message": "No changes provided"
        }

    fields = []
    values = []

    for field, value in update_data.items():
        fields.append(f"{field} = ?")
        values.append(value)

    values.append(user_id)

    cursor.execute(
        f"""
        UPDATE users
        SET {", ".join(fields)}
        WHERE id = ?
        """,
        values
    )

    db.commit()

    return {
        "message": "Profile updated successfully",
        "user_id": user_id
    }


@router.get("/{user_id}/summary")
def get_profile_summary(
    user_id: int,
    db=Depends(get_db)
):
    cursor = db.cursor()

    cursor.execute(
        """
        SELECT id, name, email, role,
               institution, department,
               designation, location
        FROM users
        WHERE id = ?
        """,
        (user_id,)
    )

    user = cursor.fetchone()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    cursor.execute(
        """
        SELECT COUNT(*)
        FROM skills
        WHERE user_id = ?
        """,
        (user_id,)
    )

    skill_count = cursor.fetchone()[0]

    return {
        "profile": dict(user),
        "skill_count": skill_count
    }