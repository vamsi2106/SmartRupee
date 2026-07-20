from typing import Optional
from fastapi import APIRouter, Depends
from app.core.db import get_database
from app.api.routes.auth import get_current_user

router = APIRouter()


@router.get("/history", summary="Fetch past debt analysis records for current user")
async def get_analysis_history(user: Optional[dict] = Depends(get_current_user)):
    """Retrieves recent saved analysis records for the logged-in user from MongoDB."""
    db = get_database()
    if db is None:
        return {"status": "MongoDB not configured", "records": []}

    try:
        query = {}
        if user and isinstance(user, dict) and "id" in user:
            query["user_id"] = user["id"]

        cursor = db["analyses"].find(query).sort("created_at", -1).limit(10)
        records = await cursor.to_list(length=10)
        for r in records:
            r["_id"] = str(r["_id"])
            if "created_at" in r and r["created_at"]:
                r["created_at"] = r["created_at"].isoformat()
        return {"status": "success", "records": records}
    except Exception as e:
        return {"status": "error", "message": str(e), "records": []}
