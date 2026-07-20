import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.api.routes import analyze, history, auth, expenses
from app.config import get_settings

settings = get_settings()

app = FastAPI(
    title="SmartRupee API",
    description="Agentic 3-Stage Personal Finance Engine for Gig Workers in India",
    version="1.0.0"
)

# Configure CORS for local development and production deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(expenses.router, prefix="/api/expenses", tags=["Expenses"])
app.include_router(analyze.router, prefix="/api", tags=["Analysis"])
app.include_router(history.router, prefix="/api", tags=["History"])

# Serve Static Frontend Dashboard
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

    @app.get("/", include_in_schema=False)
    async def serve_index():
        return FileResponse(os.path.join(static_dir, "index.html"))

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "app": "SmartRupee Backend",
        "env": settings.env
    }
