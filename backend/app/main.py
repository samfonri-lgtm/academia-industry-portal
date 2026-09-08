import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.auth import router as auth_router
from app.api.routes.dashboard import router as dashboard_router
from app.profile import router as profile_router
from app.database import get_connection, DATABASE_PATH
from app.api.routes.company_profile import router as company_profile_router
from app.api.routes.company_opportunities import router as company_opportunities_router

from app.matching import router as matching_router
from app.skill_gap import router as skill_gap_router
from app.skills import router as skills_router
from app.applications import router as applications_router
from app.opportunities import router as opportunities_router
from app.resume import router as resume_router
from app.company import router as company_router
from app.ai.skill_extraction import router as ai_skill_router


load_dotenv()

logger = logging.getLogger("academiaconnect")


app = FastAPI(
    title="AcademiaConnect API",
    description="Backend API for AcademiaConnect SIH 2026",
    version="1.0.0",
)


# =========================================================
# CORS
# =========================================================

DEFAULT_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "https://academia-industry-portal-sandy.vercel.app",
]

EXTRA_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "").split(",")
    if origin.strip()
]

ALLOW_ALL_ORIGINS = "*" in EXTRA_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if ALLOW_ALL_ORIGINS else DEFAULT_ORIGINS + EXTRA_ORIGINS,
    # Vercel preview deployments of the frontend
    allow_origin_regex=None if ALLOW_ALL_ORIGINS else r"https://academia-industry-portal(-[a-z0-9-]+)?\.vercel\.app",
    allow_credentials=not ALLOW_ALL_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# OPTIONAL /api PREFIX
# =========================================================
# Some hosts (e.g. Emergent) route the backend under /api. Routes are
# defined without the prefix (Vercel), so strip it when present.

@app.middleware("http")
async def strip_api_prefix(request: Request, call_next):
    path = request.scope.get("path", "")

    if path == "/api" or path.startswith("/api/"):
        request.scope["path"] = path[4:] or "/"
        request.scope["raw_path"] = request.scope["path"].encode()

    return await call_next(request)


# =========================================================
# ERROR HANDLING
# =========================================================
# Unhandled exceptions become a JSON 500 (with CORS headers) instead of
# an opaque platform error page.

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)

    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {exc.__class__.__name__}"},
    )


# =========================================================
# ROUTERS
# =========================================================

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(skills_router)
app.include_router(resume_router)
app.include_router(applications_router)
app.include_router(company_router)
app.include_router(dashboard_router)
app.include_router(ai_skill_router)
app.include_router(opportunities_router)

app.include_router(company_profile_router)
app.include_router(company_opportunities_router)

app.include_router(skill_gap_router)
app.include_router(matching_router)


# =========================================================
# BASIC ROUTES
# =========================================================

@app.get("/")
def root():
    return {
        "message": "AcademiaConnect API is running",
        "status": "success",
        "version": "1.0.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AcademiaConnect Backend",
    }


@app.get("/api")
def api_info():
    return {
        "project": "AcademiaConnect",
        "purpose": "Academia-Industry Collaboration",
        "modules": [
            "Authentication",
            "Student Profile",
            "Student Skills",
            "AI Skill Extraction",
            "Skill Gap Analysis",
            "Opportunities",
            "Applications",
            "Industry",
            "Academician",
            "Institution",
            "Analytics",
        ],
    }


# =========================================================
# DATABASE STATUS
# =========================================================

@app.get("/db-status")
def database_status():
    connection = None

    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT name
            FROM sqlite_master
            WHERE type = 'table'
            ORDER BY name
            """
        )

        tables = [
            row["name"]
            for row in cursor.fetchall()
        ]

        return {
            "status": "connected",
            "database": "SQLite",
            "path": str(DATABASE_PATH),
            "tables": tables,
            "table_count": len(tables),
        }

    except Exception as error:
        return {
            "status": "error",
            "message": str(error),
        }

    finally:
        if connection:
            connection.close()