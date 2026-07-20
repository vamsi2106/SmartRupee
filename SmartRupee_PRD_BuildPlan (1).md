# SmartRupee — PRD + Build Plan for Antigravity

Goal: production-quality code, clean architecture, proper separation of concerns.
Judges review code — this structure signals real engineering, not hackathon spaghetti.

---

## 1. Architecture

Clean layered structure — same pattern you already use (routers → services → agents/core, dependency injection, pydantic schemas):

```
smartrupee/
├── app/
│   ├── main.py                  # FastAPI app init, CORS, router mounting
│   ├── config.py                # Settings via pydantic-settings (env vars, Gemini key)
│   ├── api/
│   │   └── routes/
│   │       └── analyze.py       # POST /analyze endpoint (thin controller)
│   ├── schemas/
│   │   └── analyze.py           # Pydantic request/response models
│   ├── core/
│   │   ├── finance_engine.py    # Stage 1: pure deterministic compute, no AI
│   │   └── exceptions.py        # Custom exception classes
│   ├── agents/
│   │   ├── strategy_agent.py    # Stage 2: Gemini call — decides avalanche/snowball
│   │   └── explain_agent.py     # Stage 3: Gemini call — plain-language plan
│   ├── services/
│   │   └── gemini_client.py     # Single wrapped Gemini client (DI-friendly, testable)
│   └── graph/
│       └── flow.py              # LangGraph orchestration wiring the 3 nodes
├── static/
│   └── index.html               # Frontend (Tailwind CDN, vanilla JS fetch)
├── tests/
│   └── test_finance_engine.py   # Unit test for pure logic (shows testing discipline)
├── .env.example
├── requirements.txt
├── README.md
└── Dockerfile
```

**Why this structure reads as senior-level:**
- Routes are thin — no business logic in endpoints
- `finance_engine.py` is pure functions, fully unit-testable, zero AI dependency
- Gemini client is wrapped once and injected, not called ad-hoc in three places
- Pydantic schemas validate all I/O — no raw dicts floating around
- Custom exceptions instead of bare `except Exception`
- One `.env.example` — no hardcoded keys anywhere (judges do check this)

---

## 2. PRD Recap (for Antigravity context)

**Problem:** Gig workers have irregular income + informal debts; generic budgeting apps give static advice ignoring income volatility.

**Solution:** 3-stage agentic pipeline — deterministic compute → Gemini strategy decision → Gemini plain-language explanation.

**Core entities:**
- `IncomeEntry`: amount, optional label
- `Debt`: name, amount, rate, lender_type
- `AnalyzeRequest`: income_entries[], expenses, debts[]
- `AnalyzeResponse`: avg_income, volatility_pct, surplus, strategy, reasoning, action_plan

---

## 3. Key Code Patterns to Enforce

**Type hints everywhere, Pydantic for all boundaries:**
```python
# app/schemas/analyze.py
from pydantic import BaseModel, Field

class Debt(BaseModel):
    name: str
    amount: float = Field(gt=0)
    rate: float = Field(ge=0, description="Annual or informal interest rate %")

class AnalyzeRequest(BaseModel):
    income_entries: list[float] = Field(min_length=1, max_length=6)
    monthly_expenses: float = Field(ge=0)
    debts: list[Debt] = Field(min_length=1, max_length=5)
```

**Pure, testable core logic — no side effects, no AI:**
```python
# app/core/finance_engine.py
import statistics
from app.schemas.analyze import Debt

def calculate_volatility(income_entries: list[float]) -> float:
    if len(income_entries) < 2:
        return 0.0
    mean = statistics.mean(income_entries)
    stdev = statistics.stdev(income_entries)
    return round((stdev / mean) * 100, 2) if mean else 0.0

def order_avalanche(debts: list[Debt]) -> list[Debt]:
    return sorted(debts, key=lambda d: d.rate, reverse=True)

def order_snowball(debts: list[Debt]) -> list[Debt]:
    return sorted(debts, key=lambda d: d.amount)
```

**Wrapped, injectable AI client — not called raw in agents:**
```python
# app/services/gemini_client.py
import google.generativeai as genai
from app.config import get_settings

class GeminiClient:
    def __init__(self) -> None:
        settings = get_settings()
        genai.configure(api_key=settings.gemini_api_key)
        self._model = genai.GenerativeModel("gemini-1.5-flash")

    async def generate_json(self, prompt: str) -> str:
        response = self._model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"},
        )
        return response.text
```

**Custom exceptions instead of bare except:**
```python
# app/core/exceptions.py
class SmartRupeeError(Exception):
    """Base exception for domain errors."""

class InvalidFinancialDataError(SmartRupeeError):
    """Raised when computed inputs are invalid or insufficient."""
```

**Thin controller — orchestration lives in the graph/service layer:**
```python
# app/api/routes/analyze.py
from fastapi import APIRouter
from app.schemas.analyze import AnalyzeRequest, AnalyzeResponse
from app.graph.flow import run_analysis_flow

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(payload: AnalyzeRequest) -> AnalyzeResponse:
    return await run_analysis_flow(payload)
```

---

## 4. Build Plan (sequenced for Antigravity, ~90 min)

1. **(10 min)** Scaffold folder structure + `requirements.txt` + `.env.example` + `config.py`
2. **(15 min)** `schemas/analyze.py` — all pydantic models
3. **(15 min)** `core/finance_engine.py` + `tests/test_finance_engine.py` — pure logic first, verify with a quick test run
4. **(20 min)** `services/gemini_client.py` + `agents/strategy_agent.py` + `agents/explain_agent.py`
5. **(15 min)** `graph/flow.py` — wire the 3 stages together (LangGraph if time allows, else plain async sequence)
6. **(10 min)** `api/routes/analyze.py` + `main.py`
7. **(15 min)** `static/index.html` — form + fetch call + render result
8. **(10 min)** README with setup instructions, screenshot, architecture note
9. **(deploy — your call)**

---

## 5. README Checklist (judges read this first)

- One-paragraph problem + solution summary
- Architecture diagram or folder tree (copy from section 1)
- Setup: `pip install -r requirements.txt`, `.env` with `GEMINI_API_KEY`, `uvicorn app.main:app --reload`
- Note the 3-stage pipeline explicitly — this is your differentiator, say it out loud in the README

---

## 6. requirements.txt

```
fastapi
uvicorn[standard]
pydantic
pydantic-settings
google-generativeai
python-dotenv
pytest
```

Tell Antigravity: "Follow this exact structure, thin routes, pure core logic separated from AI agents, pydantic everywhere, no hardcoded secrets." That instruction alone will keep it from generating hackathon-spaghetti.

---

## 7. Dockerfile (for GCP Cloud Run)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

Note: Cloud Run expects the app to listen on `$PORT` (defaults to 8080) — the CMD above hardcodes 8080 to match the ENV, keep them in sync if you change it.

---

## 8. GCP Deployment — Cloud Run

**Prereqs (one-time):**
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com artifactregistry.googleapis.com
```

**Deploy (one command, builds from source, no manual Docker push needed):**
```bash
gcloud run deploy smartrupee \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key_here,MONGO_URI="your_atlas_connection_string"
```

This builds the container via Cloud Build automatically, pushes to Artifact Registry, and deploys — one command, live HTTPS URL in ~2 min.

**Better practice for the key (use if you have 2 extra minutes):**
```bash
echo -n "your_key_here" | gcloud secrets create gemini-api-key --data-file=-
gcloud run deploy smartrupee \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-secrets GEMINI_API_KEY=gemini-api-key:latest
```
This avoids the key sitting in plaintext in deploy history/logs — worth mentioning in your README as a security note even if you skip it under time pressure.

**Redeploy after changes:** same command, Cloud Run just creates a new revision.

**Get your live URL:**
```bash
gcloud run services describe smartrupee --region asia-south1 --format 'value(status.url)'
```

---

## 9. Full Tech Stack Summary

| Layer | Choice |
|---|---|
| Backend framework | FastAPI |
| Language | Python 3.11 |
| Validation | Pydantic v2 |
| AI model | Google Gemini (gemini-1.5-flash) |
| Agent orchestration | LangGraph (or plain async pipeline if time-constrained) |
| Frontend | Single HTML file, Tailwind via CDN, vanilla JS fetch |
| Containerization | Docker |
| Cloud/deploy | Google Cloud Run (asia-south1) |
| Secrets | Google Secret Manager (or env var if short on time) |
| Testing | pytest, unit tests on core logic |

Coherent story for judges: Gemini + Cloud Run + FastAPI is a legitimate production-style Google-native stack, not a hackathon duct-tape job.

---

## 10. Persistence — MongoDB (Atlas free tier)

Better than SQLite here since Cloud Run is stateless — Atlas is external and actually persists across restarts/scale events. Also matches your document-shaped data (nested debts list) more naturally than relational tables.

**Setup (5 min, one-time):**
1. Create free cluster at mongodb.com/cloud/atlas (M0 tier, free forever)
2. Create a DB user + password, allow network access from anywhere (`0.0.0.0/0`) for demo speed
3. Copy connection string → put in `.env` as `MONGO_URI`

**Add to `requirements.txt`:** `motor` (async MongoDB driver, pairs correctly with FastAPI's async routes)

```python
# app/core/db.py
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import get_settings

settings = get_settings()
client = AsyncIOMotorClient(settings.mongo_uri)
db = client["smartrupee"]
analyses_collection = db["analyses"]
```

```python
# app/schemas/analyze.py (add)
from datetime import datetime
from pydantic import BaseModel

class AnalysisRecord(BaseModel):
    created_at: datetime
    inputs: dict
    strategy: str
    plan_text: str
```

Save after Stage 3 completes in `graph/flow.py`:
```python
from app.core.db import analyses_collection
from datetime import datetime, timezone

async def save_analysis(inputs: dict, strategy: str, plan_text: str) -> None:
    await analyses_collection.insert_one({
        "created_at": datetime.now(timezone.utc),
        "inputs": inputs,
        "strategy": strategy,
        "plan_text": plan_text,
    })
```

`GET /history` route:
```python
# app/api/routes/history.py
from fastapi import APIRouter
from app.core.db import analyses_collection

router = APIRouter()

@router.get("/history")
async def get_history():
    cursor = analyses_collection.find().sort("created_at", -1).limit(10)
    records = await cursor.to_list(length=10)
    for r in records:
        r["_id"] = str(r["_id"])
    return records
```

Gives judges a real "past analyses" feature, actually persists across deploys, and shows you know async DB drivers — solid production signal.

---

## 11. Frontend — Vite + React (instead of static HTML)

```bash
npm create vite@latest frontend -- --template react
cd frontend && npm install
```

Structure:
```
frontend/
├── src/
│   ├── App.jsx
│   ├── components/
│   │   ├── AnalyzeForm.jsx     # income/expense/debt inputs
│   │   └── ResultCard.jsx      # strategy + reasoning + plan display
│   └── api/
│       └── client.js           # fetch wrapper for /analyze, /history
```

`src/api/client.js`:
```javascript
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function analyze(payload) {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Analysis failed");
  return res.json();
}
```

**Build + serve options:**
- Fast: `npm run build`, copy `dist/` into FastAPI's static mount, serve from same Cloud Run service — one deploy, one URL.
- Cleaner: deploy `frontend/` to Vercel separately, set `VITE_API_URL` to your Cloud Run backend URL — two URLs but faster iteration.

Given your time, go with the first option — one deploy, no CORS headaches.

---

## Final Checklist Before Submitting

- [ ] `.env` values never committed — `.env.example` only in repo
- [ ] README has problem statement, architecture tree, setup steps, and states the SQLite/Cloud Run persistence caveat
- [ ] `/analyze` and `/history` both working on deployed URL
- [ ] Demo video recorded per script in submission doc
- [ ] GitHub repo set to public
- [ ] All links (repo, deployed URL, video) filled into SmartRupee_Submission_Docs.md before submitting
