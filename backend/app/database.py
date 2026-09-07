import os
import shutil
import sqlite3
from pathlib import Path


# =========================================
# Database Location
# =========================================
# Vercel's filesystem is read-only except /tmp, so on Vercel the SQLite
# file lives in /tmp (ephemeral, reset on cold start) and the bundled
# database/academiaconnect.db is used as the starting copy.

BASE_DIR = Path(__file__).resolve().parent.parent

BUNDLED_DATABASE_PATH = BASE_DIR / "database" / "academiaconnect.db"

IS_VERCEL = bool(os.getenv("VERCEL"))

DATABASE_DIR = Path(
    os.getenv("DATABASE_DIR")
    or ("/tmp/academiaconnect" if IS_VERCEL else BASE_DIR / "database")
)

DATABASE_DIR.mkdir(parents=True, exist_ok=True)

DATABASE_PATH = DATABASE_DIR / "academiaconnect.db"

if (
    not DATABASE_PATH.exists()
    and BUNDLED_DATABASE_PATH.exists()
    and BUNDLED_DATABASE_PATH.resolve() != DATABASE_PATH.resolve()
):
    shutil.copyfile(BUNDLED_DATABASE_PATH, DATABASE_PATH)


# =========================================
# Database Connection
# =========================================

def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)

    # Allows access to columns by name
    connection.row_factory = sqlite3.Row

    # Enable foreign-key relationships
    connection.execute("PRAGMA foreign_keys = ON")

    return connection


# =========================================
# Initialize Database
# =========================================

def init_db():
    connection = get_connection()

    try:
        cursor = connection.cursor()

        # =====================================
        # Users
        # =====================================

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )

        # =====================================
        # Student Profiles
        # =====================================

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS student_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL UNIQUE,
                college TEXT DEFAULT '',
                branch TEXT DEFAULT '',
                semester INTEGER,
                cgpa REAL,
                career_goal TEXT DEFAULT '',
                FOREIGN KEY (user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE
            )
            """
        )

        # =====================================
        # Skills
        # =====================================

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS skills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                category TEXT NOT NULL
            )
            """
        )

        # =====================================
        # Student Skills
        # =====================================

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS student_skills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL,
                skill_id INTEGER NOT NULL,
                level TEXT NOT NULL,
                FOREIGN KEY (student_id)
                    REFERENCES student_profiles(id)
                    ON DELETE CASCADE,
                FOREIGN KEY (skill_id)
                    REFERENCES skills(id)
                    ON DELETE CASCADE,
                UNIQUE(student_id, skill_id)
            )
            """
        )

        # =====================================
        # Companies
        # =====================================

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS companies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL UNIQUE,
                name TEXT NOT NULL,
                industry TEXT DEFAULT '',
                description TEXT DEFAULT '',
                location TEXT DEFAULT '',
                FOREIGN KEY (user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE
            )
            """
        )

        # =====================================
        # Opportunities
        # =====================================

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS opportunities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                type TEXT NOT NULL,
                description TEXT DEFAULT '',
                location TEXT DEFAULT '',
                stipend TEXT DEFAULT '',
                deadline TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (company_id)
                    REFERENCES companies(id)
                    ON DELETE CASCADE
            )
            """
        )

        # =====================================
        # Opportunity Skills
        # =====================================

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS opportunity_skills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                opportunity_id INTEGER NOT NULL,
                skill_id INTEGER NOT NULL,
                required_level TEXT NOT NULL,
                FOREIGN KEY (opportunity_id)
                    REFERENCES opportunities(id)
                    ON DELETE CASCADE,
                FOREIGN KEY (skill_id)
                    REFERENCES skills(id)
                    ON DELETE CASCADE,
                UNIQUE(opportunity_id, skill_id)
            )
            """
        )

        # =====================================
        # Applications
        # =====================================

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL,
                opportunity_id INTEGER NOT NULL,
                status TEXT NOT NULL DEFAULT 'Applied',
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id)
                    REFERENCES student_profiles(id)
                    ON DELETE CASCADE,
                FOREIGN KEY (opportunity_id)
                    REFERENCES opportunities(id)
                    ON DELETE CASCADE,
                UNIQUE(student_id, opportunity_id)
            )
            """
        )

        # =====================================
        # Resumes
        # =====================================

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS resumes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL,
                file_path TEXT,
                extracted_text TEXT,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id)
                    REFERENCES student_profiles(id)
                    ON DELETE CASCADE
            )
            """
        )

        # =====================================
        # Skill Analysis
        # =====================================

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS skill_analysis (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL,
                target_role TEXT NOT NULL,
                matched_skills TEXT,
                missing_skills TEXT,
                match_percentage REAL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id)
                    REFERENCES student_profiles(id)
                    ON DELETE CASCADE
            )
            """
        )

        connection.commit()

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


# =========================================
# Seed Skill Library
# =========================================

def seed_skills():
    connection = get_connection()

    try:
        cursor = connection.cursor()

        skills = [
            # =====================================
            # Technical
            # =====================================

            ("C", "Technical"),
            ("C++", "Technical"),
            ("Java", "Technical"),
            ("Python", "Technical"),
            ("JavaScript", "Technical"),
            ("TypeScript", "Technical"),
            ("SQL", "Technical"),
            ("HTML", "Technical"),
            ("CSS", "Technical"),
            ("React", "Technical"),
            ("Node.js", "Technical"),
            ("Express.js", "Technical"),
            ("FastAPI", "Technical"),
            ("Django", "Technical"),
            ("Git", "Technical"),
            ("GitHub", "Technical"),
            ("REST API", "Technical"),
            ("Data Structures", "Technical"),
            ("Algorithms", "Technical"),
            ("Object Oriented Programming", "Technical"),
            ("Database Management", "Technical"),
            ("MongoDB", "Technical"),
            ("PostgreSQL", "Technical"),
            ("MySQL", "Technical"),
            ("Machine Learning", "Technical"),
            ("Artificial Intelligence", "Technical"),
            ("Computer Networks", "Technical"),
            ("Operating Systems", "Technical"),
            ("Cyber Security", "Technical"),
            ("Cloud Computing", "Technical"),

            # =====================================
            # Design
            # =====================================

            ("UI Design", "Design"),
            ("UX Design", "Design"),
            ("Figma", "Design"),
            ("Adobe XD", "Design"),
            ("Graphic Design", "Design"),
            ("Prototyping", "Design"),
            ("Wireframing", "Design"),

            # =====================================
            # Animation
            # =====================================

            ("2D Animation", "Animation"),
            ("3D Animation", "Animation"),
            ("Blender", "Animation"),
            ("Motion Graphics", "Animation"),

            # =====================================
            # Media
            # =====================================

            ("Video Editing", "Media"),
            ("Photo Editing", "Media"),
            ("DaVinci Resolve", "Media"),
            ("Adobe Premiere Pro", "Media"),
            ("Content Production", "Media"),

            # =====================================
            # Education
            # =====================================

            ("Teaching", "Education"),
            ("Training", "Education"),
            ("Curriculum Development", "Education"),
            ("Mentoring", "Education"),

            # =====================================
            # Marketing
            # =====================================

            ("Digital Marketing", "Marketing"),
            ("SEO", "Marketing"),
            ("Social Media Marketing", "Marketing"),
            ("Market Research", "Marketing"),
            ("Brand Management", "Marketing"),

            # =====================================
            # Writing & Content
            # =====================================

            ("Content Writing", "Writing & Content"),
            ("Technical Writing", "Writing & Content"),
            ("Copywriting", "Writing & Content"),
            ("Blog Writing", "Writing & Content"),
            ("Documentation", "Writing & Content"),

            # =====================================
            # Business
            # =====================================

            ("Business Analysis", "Business"),
            ("Business Development", "Business"),
            ("Entrepreneurship", "Business"),
            ("Market Analysis", "Business"),

            # =====================================
            # Management
            # =====================================

            ("Project Management", "Management"),
            ("Team Management", "Management"),
            ("Leadership", "Management"),
            ("Time Management", "Management"),

            # =====================================
            # Professional / Soft Skills
            # =====================================

            ("Communication", "Professional"),
            ("Problem Solving", "Professional"),
            ("Critical Thinking", "Professional"),
            ("Teamwork", "Professional"),
            ("Presentation", "Professional"),
            ("Adaptability", "Professional"),
            ("Creativity", "Professional"),
            ("Decision Making", "Professional"),
            ("Work Ethic", "Professional"),

            # =====================================
            # Other
            # =====================================

            ("Research", "Other"),
            ("Public Speaking", "Other"),
            ("Entrepreneurial Thinking", "Other"),
        ]

        cursor.executemany(
            """
            INSERT OR IGNORE INTO skills (name, category)
            VALUES (?, ?)
            """,
            skills,
        )

        connection.commit()

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


# =========================================
# Initialize Database on Import
# =========================================

init_db()
seed_skills()