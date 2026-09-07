"""Local dev shim for the Emergent preview environment (supervisor runs `uvicorn server:app`).

Vercel uses api/index.py instead. Both expose the same `app` from app/main.py.
"""

from app.main import app  # noqa: F401
