from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field


class ExpenseCreate(BaseModel):
    amount: float = Field(..., gt=0, description="Expense amount", json_schema_extra={"example": 350.0})
    category: Optional[str] = Field(default=None, description="Category (auto-inferred from notes if omitted)", json_schema_extra={"example": "fuel"})
    notes: Optional[str] = Field(default=None, description="Optional expense note or vendor name", json_schema_extra={"example": "Petrol HP Bunk"})
    date: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc), description="Date of expense")


class ExpenseResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    amount: float
    category: str
    notes: Optional[str] = None
    date: datetime


class CategoryBreakdownItem(BaseModel):
    category: str
    total_amount: float
    percentage_of_total: float
    is_over_threshold: bool = False
    warning_message: Optional[str] = None


class ExpenseSummaryResponse(BaseModel):
    total_monthly_expenses: float
    currency_symbol: str = "₹"
    period_days: int = 30
    total_entries_count: int
    category_breakdown: List[CategoryBreakdownItem]
    alerts: List[str]
