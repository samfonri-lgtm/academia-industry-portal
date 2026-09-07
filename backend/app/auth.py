import hashlib
import hmac
import os
import secrets
import time
from typing import Optional

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel, EmailStr

from app.database import get_connection


load_dotenv()

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# =========================================================
# CONFIGURATION
# =========================================================

ALLOWED_ROLES = {
    "student",
    "academician",
    "company",
    "institution",
}

SESSION_EXPIRY_SECONDS = 60 * 60 * 24 * 7  # 7 days

# Tokens are signed with SECRET_KEY. Set it in the deployment environment
# (Vercel -> Project Settings -> Environment Variables). Without it a random
# per-process key is used and sessions will not survive a serverless cold start.
SECRET_KEY = os.getenv("SECRET_KEY") or secrets.token_hex(32)


# =========================================================
# REQUEST MODELS
# =========================================================

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: str


# =========================================================
# PASSWORD HASHING
# =========================================================

def hash_password(password: str) -> str:
    """
    Password hashing using PBKDF2-HMAC-SHA256.

    Format:
        iterations$salt$hash
    """

    salt = secrets.token_bytes(16)

    iterations = 310_000

    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        iterations,
    )

    return (
        f"{iterations}$"
        f"{salt.hex()}$"
        f"{password_hash.hex()}"
    )


def verify_password(password: str, stored_hash: str) -> bool:
    """
    Verify a password against a stored PBKDF2 hash.
    """

    try:
        iterations_text, salt_hex, hash_hex = stored_hash.split("$")

        iterations = int(iterations_text)
        salt = bytes.fromhex(salt_hex)
        expected_hash = bytes.fromhex(hash_hex)

        actual_hash = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt,
            iterations,
        )

        return hmac.compare_digest(
            actual_hash,
            expected_hash,
        )

    except (ValueError, TypeError):
        return False


# =========================================================
# SESSION TOKEN
# =========================================================

def _sign(payload: str) -> str:
    return hmac.new(
        SECRET_KEY.encode("utf-8"),
        payload.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def create_session_token(user_id: int) -> str:
    """
    Creates a signed session token: user_id:expires_at:nonce:signature
    """

    expires_at = str(int(time.time()) + SESSION_EXPIRY_SECONDS)

    nonce = secrets.token_urlsafe(16)

    payload = f"{user_id}:{expires_at}:{nonce}"

    return f"{payload}:{_sign(payload)}"


def verify_session_token(token: str) -> Optional[int]:
    """
    Returns the user_id for a valid, unexpired token, otherwise None.
    """

    try:
        user_id, expires_at, nonce, signature = token.split(":")
        payload = f"{user_id}:{expires_at}:{nonce}"

        if not hmac.compare_digest(_sign(payload), signature):
            return None

        if int(expires_at) < int(time.time()):
            return None

        return int(user_id)

    except (ValueError, AttributeError):
        return None


def get_current_user(authorization: Optional[str] = Header(default=None)):
    """
    FastAPI dependency: resolves the user from an `Authorization: Bearer` header.
    """

    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=401,
            detail="Authentication required. Please log in again.",
        )

    user_id = verify_session_token(authorization.split(" ", 1)[1].strip())

    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Your session is invalid or has expired. Please log in again.",
        )

    connection = get_connection()

    try:
        user = connection.execute(
            "SELECT id, name, email, role FROM users WHERE id = ?",
            (user_id,),
        ).fetchone()

    finally:
        connection.close()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="This account no longer exists. Please log in again.",
        )

    return dict(user)


# =========================================================
# REGISTER
# =========================================================

@router.post("/register")
def register(request: RegisterRequest):

    # -----------------------------------------------------
    # Clean input
    # -----------------------------------------------------

    name = request.name.strip()
    email = request.email.lower().strip()
    password = request.password
    role = request.role.lower().strip()

    # -----------------------------------------------------
    # Validate name
    # -----------------------------------------------------

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Name is required.",
        )

    if len(name) < 2:
        raise HTTPException(
            status_code=400,
            detail="Name must contain at least 2 characters.",
        )

    # -----------------------------------------------------
    # Validate password
    # -----------------------------------------------------

    if len(password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters.",
        )

    # -----------------------------------------------------
    # Validate role
    # -----------------------------------------------------

    if role not in ALLOWED_ROLES:
        raise HTTPException(
            status_code=400,
            detail="Invalid role.",
        )

    connection = get_connection()

    try:
        cursor = connection.cursor()

        # -------------------------------------------------
        # Check existing email
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE email = ?
            """,
            (email,),
        )

        existing_user = cursor.fetchone()

        if existing_user:
            raise HTTPException(
                status_code=409,
                detail="An account with this email already exists.",
            )

        # -------------------------------------------------
        # Create user
        # -------------------------------------------------

        password_hash = hash_password(password)

        cursor.execute(
            """
            INSERT INTO users
            (
                name,
                email,
                password,
                role
            )
            VALUES (?, ?, ?, ?)
            """,
            (
                name,
                email,
                password_hash,
                role,
            ),
        )

        user_id = cursor.lastrowid

        # -------------------------------------------------
        # Student profile
        # -------------------------------------------------

        if role == "student":

            cursor.execute(
                """
                INSERT INTO student_profiles
                (
                    user_id
                )
                VALUES (?)
                """,
                (user_id,),
            )

        # -------------------------------------------------
        # Company profile
        # -------------------------------------------------

        if role == "company":

            cursor.execute(
                """
                INSERT INTO companies
                (
                    user_id,
                    name
                )
                VALUES (?, ?)
                """,
                (
                    user_id,
                    name,
                ),
            )

        connection.commit()

        # -------------------------------------------------
        # Create session token
        # -------------------------------------------------

        token = create_session_token(user_id)

        # -------------------------------------------------
        # Response
        # -------------------------------------------------

        return {
            "message": "Registration successful.",
            "token": token,
            "expires_in": SESSION_EXPIRY_SECONDS,
            "user": {
                "id": user_id,
                "name": name,
                "email": email,
                "role": role,
            },
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(error)}",
        )

    finally:
        connection.close()


# =========================================================
# LOGIN
# =========================================================

@router.post("/login")
def login(request: LoginRequest):

    # -----------------------------------------------------
    # Clean input
    # -----------------------------------------------------

    email = request.email.lower().strip()
    password = request.password
    role = request.role.lower().strip()

    # -----------------------------------------------------
    # Validate role
    # -----------------------------------------------------

    if role not in ALLOWED_ROLES:
        raise HTTPException(
            status_code=400,
            detail="Invalid role.",
        )

    connection = get_connection()

    try:
        cursor = connection.cursor()

        # -------------------------------------------------
        # Find user
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                id,
                name,
                email,
                password,
                role
            FROM users
            WHERE email = ?
            """,
            (email,),
        )

        user = cursor.fetchone()

        # -------------------------------------------------
        # User not found
        # -------------------------------------------------

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password.",
            )

        # -------------------------------------------------
        # Verify password
        # -------------------------------------------------

        if not verify_password(
            password,
            user["password"],
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password.",
            )

        # -------------------------------------------------
        # Verify role
        # -------------------------------------------------

        if user["role"] != role:
            raise HTTPException(
                status_code=403,
                detail=(
                    "This account is registered "
                    "with a different role."
                ),
            )

        # -------------------------------------------------
        # Create session token
        # -------------------------------------------------

        token = create_session_token(
            user["id"]
        )

        # -------------------------------------------------
        # Response
        # -------------------------------------------------

        return {
            "message": "Login successful.",
            "token": token,
            "expires_in": SESSION_EXPIRY_SECONDS,
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": user["role"],
            },
        }

    finally:
        connection.close()

# =========================================================
# CURRENT USER
# =========================================================

@router.get("/me")
def me(user: dict = Depends(get_current_user)):
    return {
        "status": "success",
        "user": user,
    }
