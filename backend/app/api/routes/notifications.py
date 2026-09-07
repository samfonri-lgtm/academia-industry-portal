from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.database import get_connection


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class NotificationCreate(BaseModel):
    user_id: int
    title: str
    message: str
    notification_type: Optional[str] = "info"


# =========================================================
# GET USER NOTIFICATIONS
# =========================================================

@router.get("/user/{user_id}")
def get_user_notifications(user_id: int):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        # Verify user
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

        # NOTE:
        # notifications table is not currently present
        # in database.py schema.
        #
        # This endpoint will work after the notifications
        # table is added to the database schema.

        cursor.execute(
            """
            SELECT
                id,
                user_id,
                title,
                message,
                notification_type,
                is_read,
                created_at
            FROM notifications
            WHERE user_id = ?
            ORDER BY id DESC
            """,
            (user_id,),
        )

        rows = cursor.fetchall()

        return {
            "status": "success",
            "count": len(rows),
            "notifications": [
                dict(row)
                for row in rows
            ],
        }

    finally:
        connection.close()


# =========================================================
# CREATE NOTIFICATION
# =========================================================

@router.post("/")
def create_notification(data: NotificationCreate):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        # ---------------------------------------------
        # Verify user
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE id = ?
            """,
            (data.user_id,),
        )

        user = cursor.fetchone()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found.",
            )

        # ---------------------------------------------
        # Validate title
        # ---------------------------------------------

        title = data.title.strip()
        message = data.message.strip()
        notification_type = (
            data.notification_type.strip()
            if data.notification_type
            else "info"
        )

        if not title:
            raise HTTPException(
                status_code=400,
                detail="Notification title is required.",
            )

        if not message:
            raise HTTPException(
                status_code=400,
                detail="Notification message is required.",
            )

        # ---------------------------------------------
        # Insert notification
        # ---------------------------------------------

        cursor.execute(
            """
            INSERT INTO notifications
            (
                user_id,
                title,
                message,
                notification_type,
                is_read
            )
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                data.user_id,
                title,
                message,
                notification_type,
                0,
            ),
        )

        notification_id = cursor.lastrowid

        connection.commit()

        return {
            "status": "success",
            "message": "Notification created successfully.",
            "notification": {
                "id": notification_id,
                "user_id": data.user_id,
                "title": title,
                "message": message,
                "notification_type": notification_type,
                "is_read": 0,
            },
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to create notification: {str(error)}",
        )

    finally:
        connection.close()


# =========================================================
# MARK NOTIFICATION AS READ
# =========================================================

@router.patch("/{notification_id}/read")
def mark_notification_read(notification_id: int):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id
            FROM notifications
            WHERE id = ?
            """,
            (notification_id,),
        )

        notification = cursor.fetchone()

        if not notification:
            raise HTTPException(
                status_code=404,
                detail="Notification not found.",
            )

        cursor.execute(
            """
            UPDATE notifications
            SET is_read = 1
            WHERE id = ?
            """,
            (notification_id,),
        )

        connection.commit()

        return {
            "status": "success",
            "message": "Notification marked as read.",
            "notification_id": notification_id,
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to update notification: {str(error)}",
        )

    finally:
        connection.close()


# =========================================================
# DELETE NOTIFICATION
# =========================================================

@router.delete("/{notification_id}")
def delete_notification(notification_id: int):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id
            FROM notifications
            WHERE id = ?
            """,
            (notification_id,),
        )

        notification = cursor.fetchone()

        if not notification:
            raise HTTPException(
                status_code=404,
                detail="Notification not found.",
            )

        cursor.execute(
            """
            DELETE FROM notifications
            WHERE id = ?
            """,
            (notification_id,),
        )

        connection.commit()

        return {
            "status": "success",
            "message": "Notification deleted successfully.",
            "notification_id": notification_id,
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete notification: {str(error)}",
        )

    finally:
        connection.close()