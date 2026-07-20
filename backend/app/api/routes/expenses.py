from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseResponse,
    ExpenseSummaryResponse,
    CategoryBreakdownItem
)
from app.api.routes.auth import get_current_user
from app.config import get_settings
from app.core.db import get_database

router = APIRouter()
settings = get_settings()


import re

def infer_expense_category(notes: Optional[str] = None, provided_category: Optional[str] = None) -> str:
    """Config-driven category inference from keywords or user input."""
    valid_categories = [c.lower() for c in settings.expense_categories]
    
    if provided_category and provided_category.strip().lower() in valid_categories:
        return provided_category.strip().lower()

    if notes:
        notes_lower = notes.lower()
        for cat, keywords in settings.category_keyword_rules.items():
            for kw in keywords:
                if re.search(r'\b' + re.escape(kw) + r'\b', notes_lower):
                    return cat

    return "other"


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED, summary="Log a new expense entry")
async def create_expense(
    payload: ExpenseCreate,
    user: Optional[dict] = Depends(get_current_user)
) -> ExpenseResponse:
    """Logs a new daily expense with smart config-driven category auto-tagging."""
    db = get_database()
    category = infer_expense_category(payload.notes, payload.category)
    expense_date = payload.date or datetime.now(timezone.utc)
    user_id = user["id"] if (user and isinstance(user, dict) and "id" in user) else None

    doc = {
        "user_id": user_id,
        "amount": round(payload.amount, 2),
        "category": category,
        "notes": payload.notes,
        "date": expense_date
    }

    doc_id = "temp_expense_id"
    if db is not None:
        res = await db["expenses"].insert_one(doc)
        doc_id = str(res.inserted_id)

    return ExpenseResponse(
        id=doc_id,
        user_id=user_id,
        amount=round(payload.amount, 2),
        category=category,
        notes=payload.notes,
        date=expense_date
    )


@router.get("", response_model=List[ExpenseResponse], summary="List recent expense logs")
async def list_expenses(
    limit: int = Query(20, ge=1, le=100),
    user: Optional[dict] = Depends(get_current_user)
) -> List[ExpenseResponse]:
    """Retrieves recent logged expenses."""
    db = get_database()
    if db is None:
        return []

    query = {}
    if user:
        query["user_id"] = user["id"]

    cursor = db["expenses"].find(query).sort("date", -1).limit(limit)
    records = await cursor.to_list(length=limit)

    return [
        ExpenseResponse(
            id=str(r["_id"]),
            user_id=r.get("user_id"),
            amount=r["amount"],
            category=r["category"],
            notes=r.get("notes"),
            date=r.get("date", datetime.now(timezone.utc))
        )
        for r in records
    ]


@router.get("/summary", response_model=ExpenseSummaryResponse, summary="Get expense summary & budget alerts")
async def get_expense_summary(
    days: int = Query(30, ge=1, le=90),
    user: Optional[dict] = Depends(get_current_user)
) -> ExpenseSummaryResponse:
    """Calculates category breakdowns, total monthly expenses, and threshold spending alerts."""
    db = get_database()
    since_date = datetime.now(timezone.utc) - timedelta(days=days)

    query = {"date": {"$gte": since_date}}
    if user and isinstance(user, dict) and "id" in user:
        query["user_id"] = user["id"]

    expenses = []
    if db is not None:
        cursor = db["expenses"].find(query)
        expenses = await cursor.to_list(length=500)

    total_amount = sum(e["amount"] for e in expenses)
    category_totals = {}
    for e in expenses:
        cat = e.get("category", "other")
        category_totals[cat] = category_totals.get(cat, 0.0) + e["amount"]

    category_breakdown = []
    alerts = []

    for cat in settings.expense_categories:
        cat_total = round(category_totals.get(cat, 0.0), 2)
        pct = round((cat_total / total_amount * 100.0), 1) if total_amount > 0 else 0.0
        
        warning_limit = settings.category_warning_thresholds.get(cat)
        is_over = False
        warning_msg = None

        if warning_limit and pct > warning_limit and cat_total > 0:
            is_over = True
            warning_msg = f"Spending on '{cat.capitalize()}' ({pct}%) exceeds recommended threshold of {warning_limit}%!"
            alerts.append(warning_msg)

        category_breakdown.append(
            CategoryBreakdownItem(
                category=cat,
                total_amount=cat_total,
                percentage_of_total=pct,
                is_over_threshold=is_over,
                warning_message=warning_msg
            )
        )

    return ExpenseSummaryResponse(
        total_monthly_expenses=round(total_amount, 2),
        currency_symbol=settings.currency_symbol,
        period_days=days,
        total_entries_count=len(expenses),
        category_breakdown=category_breakdown,
        alerts=alerts
    )


@router.delete("/{expense_id}", status_code=status.HTTP_200_OK, summary="Delete expense entry")
async def delete_expense(
    expense_id: str,
    user: Optional[dict] = Depends(get_current_user)
):
    """Deletes an expense item by ID."""
    db = get_database()
    if db is None:
        return {"status": "success", "deleted": expense_id}

    from bson import ObjectId
    try:
        query = {"_id": ObjectId(expense_id)}
        if user:
            query["user_id"] = user["id"]
        res = await db["expenses"].delete_one(query)
        if res.deleted_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense entry not found.")
        return {"status": "success", "deleted_id": expense_id}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
