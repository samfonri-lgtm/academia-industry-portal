from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.database import get_connection


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None


# =========================================================
# GET ALL USERS
# =========================================================

@router.get("/")
def get_users():
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                id,
                name,
                email,
                role,
                created_at
            FROM users
            ORDER BY id DESC
            """
        )

        users = [
            dict(row)
            for row in cursor.fetchall()
        ]

        return {
            "status": "success",
            "count": len(users),
            "users": users,
        }

    finally:
        connection.close()


# =========================================================
# GET SINGLE USER
# =========================================================

@router.get("/{user_id}")
def get_user(user_id: int):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                id,
                name,
                email,
                role,
                created_at
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

        return {
            "status": "success",
            "user": dict(user),
        }

    finally:
        connection.close()


# =========================================================
# UPDATE USER
# =========================================================

@router.patch("/{user_id}")
def update_user(
    user_id: int,
    data: UserUpdate,
):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        # ---------------------------------------------
        # Check user
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT id, email
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

        update_data = data.model_dump(
            exclude_unset=True
        )

        if not update_data:
            return {
                "status": "success",
                "message": "No changes provided.",
            }

        # ---------------------------------------------
        # Clean values
        # ---------------------------------------------

        fields = []
        values = []

        if "name" in update_data:

            name = (
                update_data["name"].strip()
                if update_data["name"]
                else ""
            )

            if not name:
                raise HTTPException(
                    status_code=400,
                    detail="Name cannot be empty.",
                )

            fields.append("name = ?")
            values.append(name)

        if "email" in update_data:

            email = (
                update_data["email"].lower().strip()
                if update_data["email"]
                else ""
            )

            if not email:
                raise HTTPException(
                    status_code=400,
                    detail="Email cannot be empty.",
                )

            # Check duplicate email
            cursor.execute(
                """
                SELECT id
                FROM users
                WHERE email = ?
                  AND id != ?
                """,
                (
                    email,
                    user_id,
                ),
            )

            existing_email = cursor.fetchone()

            if existing_email:
                raise HTTPException(
                    status_code=409,
                    detail="Email is already registered by another user.",
                )

            fields.append("email = ?")
            values.append(email)

        if "role" in update_data:

            role = (
                update_data["role"].lower().strip()
                if update_data["role"]
                else ""
            )

            allowed_roles = {
                "student",
                "company",
                "academician",
                "institution",
                "admin",
            }

            if role not in allowed_roles:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "Invalid role. Allowed roles are: "
                        "student, company, academician, "
                        "institution, admin."
                    ),
                )

            fields.append("role = ?")
            values.append(role)

        if not fields:
            return {
                "status": "success",
                "message": "No valid changes provided.",
            }

        # ---------------------------------------------
        # Update
        # ---------------------------------------------

        values.append(user_id)

        query = f"""
            UPDATE users
            SET {", ".join(fields)}
            WHERE id = ?
        """

        cursor.execute(
            query,
            values,
        )

        connection.commit()

        # ---------------------------------------------
        # Fetch updated user
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT
                id,
                name,
                email,
                role,
                created_at
            FROM users
            WHERE id = ?
            """,
            (user_id,),
        )

        updated_user = cursor.fetchone()

        return {
            "status": "success",
            "message": "User updated successfully.",
            "user": dict(updated_user),
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to update user: {str(error)}",
        )

    finally:
        connection.close()


# =========================================================
# DELETE USER
# =========================================================

@router.delete("/{user_id}")
def delete_user(user_id: int):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id
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

        cursor.execute(
            """
            DELETE FROM users
            WHERE id = ?
            """,
            (user_id,),
        )

        connection.commit()

        return {
            "status": "success",
            "message": "User deleted successfully.",
            "user_id": user_id,
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete user: {str(error)}",
        )

    finally:
        connection.close()