from fastapi import APIRouter, HTTPException

from app.database import get_connection

router = APIRouter(
    prefix="/matching",
    tags=["Skill Matching"],
)


# =========================================================
# ADD REQUIRED SKILL TO OPPORTUNITY
# =========================================================

@router.post("/opportunity/{opportunity_id}/skill/{skill_id}")
def add_opportunity_skill(
    opportunity_id: int,
    skill_id: int,
    required_level: str = "Beginner",
):

    allowed_levels = {
        "Beginner",
        "Intermediate",
        "Advanced",
        "Expert",
    }

    if required_level not in allowed_levels:
        raise HTTPException(
            status_code=400,
            detail="Invalid skill level.",
        )

    connection = get_connection()

    try:
        cursor = connection.cursor()

        # Check opportunity
        cursor.execute(
            """
            SELECT id
            FROM opportunities
            WHERE id = ?
            """,
            (opportunity_id,),
        )

        if not cursor.fetchone():
            raise HTTPException(
                status_code=404,
                detail="Opportunity not found.",
            )

        # Check skill
        cursor.execute(
            """
            SELECT id, name, category
            FROM skills
            WHERE id = ?
            """,
            (skill_id,),
        )

        skill = cursor.fetchone()

        if not skill:
            raise HTTPException(
                status_code=404,
                detail="Skill not found.",
            )

        # Check duplicate
        cursor.execute(
            """
            SELECT id
            FROM opportunity_skills
            WHERE opportunity_id = ?
              AND skill_id = ?
            """,
            (
                opportunity_id,
                skill_id,
            ),
        )

        existing = cursor.fetchone()

        if existing:
            cursor.execute(
                """
                UPDATE opportunity_skills
                SET required_level = ?
                WHERE id = ?
                """,
                (
                    required_level,
                    existing["id"],
                ),
            )

            action = "updated"

        else:
            cursor.execute(
                """
                INSERT INTO opportunity_skills
                (
                    opportunity_id,
                    skill_id,
                    required_level
                )
                VALUES (?, ?, ?)
                """,
                (
                    opportunity_id,
                    skill_id,
                    required_level,
                ),
            )

            action = "added"

        connection.commit()

        return {
            "status": "success",
            "action": action,
            "opportunity_id": opportunity_id,
            "skill": {
                "id": skill["id"],
                "name": skill["name"],
                "category": skill["category"],
                "required_level": required_level,
            },
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to add opportunity skill: {str(error)}",
        )

    finally:
        connection.close()


# =========================================================
# GET OPPORTUNITY REQUIRED SKILLS
# =========================================================

@router.get("/opportunity/{opportunity_id}/skills")
def get_opportunity_skills(opportunity_id: int):

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                os.id,
                os.opportunity_id,
                s.id AS skill_id,
                s.name,
                s.category,
                os.required_level
            FROM opportunity_skills os
            JOIN skills s
                ON s.id = os.skill_id
            WHERE os.opportunity_id = ?
            ORDER BY s.name
            """,
            (opportunity_id,),
        )

        skills = [
            dict(row)
            for row in cursor.fetchall()
        ]

        return {
            "status": "success",
            "opportunity_id": opportunity_id,
            "count": len(skills),
            "skills": skills,
        }

    finally:
        connection.close()


# =========================================================
# REMOVE REQUIRED SKILL
# =========================================================

@router.delete("/opportunity/{opportunity_id}/skill/{skill_id}")
def remove_opportunity_skill(
    opportunity_id: int,
    skill_id: int,
):

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            DELETE FROM opportunity_skills
            WHERE opportunity_id = ?
              AND skill_id = ?
            """,
            (
                opportunity_id,
                skill_id,
            ),
        )

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Opportunity skill not found.",
            )

        connection.commit()

        return {
            "status": "success",
            "message": "Required skill removed successfully.",
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to remove skill: {str(error)}",
        )

    finally:
        connection.close()


# =========================================================
# LEVEL VALUE
# =========================================================

LEVEL_VALUE = {
    "Beginner": 1,
    "Intermediate": 2,
    "Advanced": 3,
    "Expert": 4,
}


# =========================================================
# MATCH STUDENT WITH OPPORTUNITY
# =========================================================

@router.get("/student/{student_id}/opportunity/{opportunity_id}")
def match_student_with_opportunity(
    student_id: int,
    opportunity_id: int,
):

    connection = get_connection()

    try:
        cursor = connection.cursor()

        # -------------------------------------------------
        # Check student
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT id
            FROM student_profiles
            WHERE id = ?
            """,
            (student_id,),
        )

        if not cursor.fetchone():
            raise HTTPException(
                status_code=404,
                detail="Student profile not found.",
            )

        # -------------------------------------------------
        # Check opportunity
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                id,
                title,
                type,
                company_id
            FROM opportunities
            WHERE id = ?
            """,
            (opportunity_id,),
        )

        opportunity = cursor.fetchone()

        if not opportunity:
            raise HTTPException(
                status_code=404,
                detail="Opportunity not found.",
            )

        # -------------------------------------------------
        # Required skills
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                s.id AS skill_id,
                s.name,
                s.category,
                os.required_level
            FROM opportunity_skills os
            JOIN skills s
                ON s.id = os.skill_id
            WHERE os.opportunity_id = ?
            """,
            (opportunity_id,),
        )

        required_skills = cursor.fetchall()

        # -------------------------------------------------
        # Student skills
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                s.id AS skill_id,
                s.name,
                s.category,
                ss.level
            FROM student_skills ss
            JOIN skills s
                ON s.id = ss.skill_id
            WHERE ss.student_id = ?
            """,
            (student_id,),
        )

        student_skills = cursor.fetchall()

        student_skill_map = {
            row["skill_id"]: row
            for row in student_skills
        }

        matched_skills = []
        partial_skills = []
        missing_skills = []

        # -------------------------------------------------
        # Calculate matching
        # -------------------------------------------------

        for required in required_skills:

            student_skill = student_skill_map.get(
                required["skill_id"]
            )

            required_level = required["required_level"]

            required_value = LEVEL_VALUE.get(
                required_level,
                1,
            )

            if not student_skill:

                missing_skills.append(
                    {
                        "skill_id": required["skill_id"],
                        "name": required["name"],
                        "category": required["category"],
                        "required_level": required_level,
                    }
                )

                continue

            student_level = student_skill["level"]

            student_value = LEVEL_VALUE.get(
                student_level,
                1,
            )

            if student_value >= required_value:

                matched_skills.append(
                    {
                        "skill_id": required["skill_id"],
                        "name": required["name"],
                        "category": required["category"],
                        "required_level": required_level,
                        "student_level": student_level,
                    }
                )

            else:

                partial_skills.append(
                    {
                        "skill_id": required["skill_id"],
                        "name": required["name"],
                        "category": required["category"],
                        "required_level": required_level,
                        "student_level": student_level,
                    }
                )

        total_required = len(required_skills)

        if total_required == 0:

            match_percentage = 0

        else:

            # Full match = 1 point
            # Partial match = 0.5 point
            score = (
                len(matched_skills)
                + (len(partial_skills) * 0.5)
            )

            match_percentage = round(
                (score / total_required) * 100,
                2,
            )

        # -------------------------------------------------
        # Recommendation
        # -------------------------------------------------

        if match_percentage >= 80:
            recommendation = "Highly Recommended"

        elif match_percentage >= 60:
            recommendation = "Recommended"

        elif match_percentage >= 40:
            recommendation = "Partially Suitable"

        else:
            recommendation = "Low Match"

        return {
            "status": "success",

            "opportunity": {
                "id": opportunity["id"],
                "title": opportunity["title"],
                "type": opportunity["type"],
                "company_id": opportunity["company_id"],
            },

            "student_id": student_id,

            "match": {
                "percentage": match_percentage,
                "recommendation": recommendation,
                "total_required": total_required,
                "fully_matched": len(matched_skills),
                "partially_matched": len(partial_skills),
                "missing": len(missing_skills),
            },

            "matched_skills": matched_skills,
            "partial_skills": partial_skills,
            "missing_skills": missing_skills,
        }

    finally:
        connection.close()


# =========================================================
# GET ALL RECOMMENDED OPPORTUNITIES
# =========================================================

@router.get("/student/{student_id}/recommendations")
def get_student_recommendations(student_id: int):

    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id
            FROM student_profiles
            WHERE id = ?
            """,
            (student_id,),
        )

        if not cursor.fetchone():
            raise HTTPException(
                status_code=404,
                detail="Student profile not found.",
            )

        cursor.execute(
            """
            SELECT
                o.id,
                o.title,
                o.type,
                o.description,
                o.location,
                o.stipend,
                o.deadline,
                c.name AS company_name
            FROM opportunities o
            JOIN companies c
                ON c.id = o.company_id
            ORDER BY o.created_at DESC
            """
        )

        opportunities = cursor.fetchall()

        recommendations = []

        for opportunity in opportunities:

            opportunity_id = opportunity["id"]

            cursor.execute(
                """
                SELECT
                    s.id AS skill_id,
                    s.name,
                    s.category,
                    os.required_level
                FROM opportunity_skills os
                JOIN skills s
                    ON s.id = os.skill_id
                WHERE os.opportunity_id = ?
                """,
                (opportunity_id,),
            )

            required_skills = cursor.fetchall()

            if not required_skills:
                continue

            required_ids = {
                row["skill_id"]
                for row in required_skills
            }

            cursor.execute(
                """
                SELECT
                    skill_id,
                    level
                FROM student_skills
                WHERE student_id = ?
                """,
                (student_id,),
            )

            student_skills = {
                row["skill_id"]: row["level"]
                for row in cursor.fetchall()
            }

            score = 0

            for required in required_skills:

                student_level = student_skills.get(
                    required["skill_id"]
                )

                if not student_level:
                    continue

                required_value = LEVEL_VALUE.get(
                    required["required_level"],
                    1,
                )

                student_value = LEVEL_VALUE.get(
                    student_level,
                    1,
                )

                if student_value >= required_value:
                    score += 1

                elif student_value > 0:
                    score += 0.5

            percentage = round(
                (score / len(required_ids)) * 100,
                2,
            )

            recommendations.append(
                {
                    "opportunity_id": opportunity_id,
                    "title": opportunity["title"],
                    "type": opportunity["type"],
                    "company_name": opportunity["company_name"],
                    "location": opportunity["location"],
                    "stipend": opportunity["stipend"],
                    "deadline": opportunity["deadline"],
                    "match_percentage": percentage,
                }
            )

        recommendations.sort(
            key=lambda item: item["match_percentage"],
            reverse=True,
        )

        return {
            "status": "success",
            "student_id": student_id,
            "count": len(recommendations),
            "recommendations": recommendations,
        }

    finally:
        connection.close()