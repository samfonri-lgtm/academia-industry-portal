from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import sqlite3
import hashlib

router = APIRouter(prefix="/auth", tags=["Authentication"])

DB_PATH = "database/portal.db"


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str
    phone: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    try:
        yield conn
    finally:
        conn.close()


def hash_password(password: str) -> str:
    return hashlib.sha256(
        password.encode("utf-8")
    ).hexdigest()


@router.post("/register")
def register(
    data: RegisterRequest,
    db=Depends(get_db)
):
    cursor = db.cursor()

    cursor.execute(
        "SELECT id FROM users WHERE email = ?",
        (data.email,)
    )

    if cursor.fetchone():
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    password_hash = hash_password(data.password)

    cursor.execute(
        """
        INSERT INTO users
        (name, email, password, role, phone)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            data.name,
            data.email,
            password_hash,
            data.role,
            data.phone,
        ),
    )

    db.commit()

    return {
        "message": "Registration successful",
        "user_id": cursor.lastrowid,
        "role": data.role,
    }


@router.post("/login")
def login(
    data: LoginRequest,
    db=Depends(get_db)
):
    cursor = db.cursor()

    cursor.execute(
        """
        SELECT id, name, email, password, role
        FROM users
        WHERE email = ?
        """,
        (data.email,)
    )

    user = cursor.fetchone()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    password_hash = hash_password(data.password)

    if user["password"] != password_hash:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Login successful",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
        },
    }