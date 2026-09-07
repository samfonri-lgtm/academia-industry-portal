# AcademiaConnect Backend — Deployment (Vercel)

Root directory of the Vercel project: `backend/`

Files Vercel uses:
- `vercel.json` — rewrites every request to the serverless function
- `api/index.py` — imports `app` from `app/main.py`
- `requirements.txt` — pinned dependencies

Environment variables to set in Vercel (Project → Settings → Environment Variables):

| Name           | Required | Notes |
|----------------|----------|-------|
| `SECRET_KEY`   | yes      | Long random string used to sign session tokens. Without it sessions break on every cold start. |
| `GROQ_API_KEY` | optional | Enables AI resume skill extraction. If missing, the endpoint returns 503 with a clear message; everything else works. |
| `CORS_ORIGINS` | optional | Comma-separated extra frontend origins. `https://academia-industry-portal-sandy.vercel.app` and `*.vercel.app` previews of this project are already allowed. |

Database: SQLite. On Vercel the filesystem is read-only, so the DB is created in `/tmp/academiaconnect/` (ephemeral — it resets on cold start). On first start the bundled `database/academiaconnect.db` is copied there as the starting data.

Local run:
```
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
python seed_demo.py   # optional demo accounts, password demo123
```
