import json
import os

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from groq import Groq
from pydantic import BaseModel


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/ai/skills",
    tags=["AI Skill Extraction"],
)


# =========================================================
# ENVIRONMENT
# =========================================================

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# The client is created lazily so a missing key never crashes startup
# (a startup exception is what produces FUNCTION_INVOCATION_FAILED on Vercel).
_client = None


def get_client() -> Groq:
    global _client

    if not GROQ_API_KEY:
        raise HTTPException(
            status_code=503,
            detail=(
                "AI skill extraction is not configured on the server "
                "(GROQ_API_KEY is missing)."
            ),
        )

    if _client is None:
        _client = Groq(api_key=GROQ_API_KEY)

    return _client


# =========================================================
# MODEL
# =========================================================

MODEL_NAME = "openai/gpt-oss-20b"


# =========================================================
# REQUEST MODEL
# =========================================================

class SkillExtractionRequest(BaseModel):
    resume_text: str


# =========================================================
# SKILL EXTRACTION FUNCTION
# =========================================================

def extract_skills_with_ai(resume_text: str) -> dict:

    if not resume_text or not resume_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Resume text is empty."
        )

    prompt = f"""
You are an AI resume skill extraction system for AcademiaConnect.

Analyze the resume text below and identify skills that are
actually supported by the resume.

Extract:

1. Technical skills
2. Programming languages
3. Frameworks and libraries
4. Databases
5. Developer tools
6. Cloud / DevOps skills
7. Soft skills
8. Other professional skills

Do NOT invent skills.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "skills": [
        {{
            "name": "Python",
            "category": "Programming",
            "level": "Beginner"
        }}
    ]
}}

Allowed categories:

- Programming
- Framework
- Database
- Cloud
- DevOps
- Tools
- Data Science
- AI/ML
- Soft Skills
- Other

Allowed levels:

- Beginner
- Intermediate
- Advanced
- Expert

Estimate the level conservatively from the resume.

If the resume does not provide enough evidence for a high level,
use Beginner or Intermediate.

Do not include duplicate skills.

Resume text:

---BEGIN RESUME---

{resume_text}

---END RESUME---
"""

    try:

        response = get_client().chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a precise resume analysis system. "
                        "Return only valid JSON."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.1,
            max_tokens=2000,
        )

        content = response.choices[0].message.content

        if not content:
            raise HTTPException(
                status_code=500,
                detail="AI returned an empty response."
            )

        content = content.strip()

        # -------------------------------------------------
        # Remove markdown code fences
        # -------------------------------------------------

        if content.startswith("```"):
            content = content.replace("```json", "")
            content = content.replace("```", "")
            content = content.strip()

        # -------------------------------------------------
        # Parse JSON
        # -------------------------------------------------

        try:
            result = json.loads(content)

        except json.JSONDecodeError:
            raise HTTPException(
                status_code=500,
                detail="AI returned invalid JSON."
            )

        # -------------------------------------------------
        # Validate response
        # -------------------------------------------------

        if not isinstance(result, dict):
            raise HTTPException(
                status_code=500,
                detail="AI returned an invalid response format."
            )

        skills = result.get("skills", [])

        if not isinstance(skills, list):
            raise HTTPException(
                status_code=500,
                detail="AI skills response is invalid."
            )

        # -------------------------------------------------
        # Allowed values
        # -------------------------------------------------

        allowed_categories = {
            "Programming",
            "Framework",
            "Database",
            "Cloud",
            "DevOps",
            "Tools",
            "Data Science",
            "AI/ML",
            "Soft Skills",
            "Other",
        }

        allowed_levels = {
            "Beginner",
            "Intermediate",
            "Advanced",
            "Expert",
        }

        # -------------------------------------------------
        # Normalize skills
        # -------------------------------------------------

        cleaned_skills = []
        seen = set()

        for skill in skills:

            if not isinstance(skill, dict):
                continue

            name = str(
                skill.get("name", "")
            ).strip()

            category = str(
                skill.get("category", "Other")
            ).strip()

            level = str(
                skill.get("level", "Beginner")
            ).strip().title()

            if not name:
                continue

            if category not in allowed_categories:
                category = "Other"

            if level not in allowed_levels:
                level = "Beginner"

            normalized_name = name.lower()

            if normalized_name in seen:
                continue

            seen.add(normalized_name)

            cleaned_skills.append(
                {
                    "name": name,
                    "category": category,
                    "level": level,
                }
            )

        return {
            "skills": cleaned_skills,
            "count": len(cleaned_skills),
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"AI skill extraction failed: {str(error)}"
        )


# =========================================================
# TEST / DIRECT AI ENDPOINT
# =========================================================

@router.post("/extract")
def extract_skills(request: SkillExtractionRequest):

    result = extract_skills_with_ai(
        request.resume_text
    )

    return {
        "status": "success",
        **result,
    }


# =========================================================
# AI HEALTH CHECK
# =========================================================

@router.get("/health")
def ai_health():

    return {
        "status": "healthy" if GROQ_API_KEY else "unconfigured",
        "service": "Groq AI Skill Extraction",
        "model": MODEL_NAME,
        "configured": bool(GROQ_API_KEY),
    }