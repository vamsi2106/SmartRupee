from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class Debt(BaseModel):
    name: str = Field(..., description="Name of the creditor or loan", json_schema_extra={"example": "Credit Card"})
    amount: float = Field(..., gt=0, description="Outstanding balance amount", json_schema_extra={"example": 15000.0})
    rate: float = Field(..., ge=0, description="Annual or informal interest rate percentage", json_schema_extra={"example": 18.5})
    lender_type: Optional[str] = Field(default=None, description="Lender category e.g. formal, informal, friend", json_schema_extra={"example": "informal"})


class IncomeEntry(BaseModel):
    amount: float = Field(..., gt=0, description="Income amount received", json_schema_extra={"example": 8000.0})
    label: Optional[str] = Field(default=None, description="Optional income source or month tag", json_schema_extra={"example": "Week 1 payout"})


class AnalyzeRequest(BaseModel):
    income_entries: List[float] = Field(..., min_length=1, max_length=12, description="List of periodic income amounts")
    monthly_expenses: float = Field(..., ge=0, description="Total monthly essential expenses")
    debts: List[Debt] = Field(..., min_length=1, max_length=10, description="List of active debts")


class DebtStrategyItem(BaseModel):
    name: str
    amount: float
    rate: float
    lender_type: str = "formal"
    payoff_order: int
    recommended_monthly_payment: float = 0.0


class AnalyzeResponse(BaseModel):
    avg_income: float = Field(..., description="Calculated average monthly income")
    volatility_pct: float = Field(..., description="Income coefficient of variation percentage")
    surplus: float = Field(..., description="Net monthly cash surplus (avg_income - expenses)")
    emergency_buffer: float = Field(..., description="Deterministically calculated rainy-day emergency buffer")
    debt_repayment_surplus: float = Field(..., description="Net monthly surplus available for debt repayment after emergency buffer")
    risk_level: str = Field(..., description="Calculated risk level: LOW, MEDIUM, or HIGH")
    chosen_strategy: str = Field(..., description="Selected debt payoff strategy: AVALANCHE or SNOWBALL")
    strategy_reasoning: str = Field(..., description="AI explanation of why this strategy was chosen")
    ordered_debts: List[DebtStrategyItem] = Field(..., description="Prioritized debts list with payoff ordering")
    action_plan: List[str] = Field(..., description="Step-by-step plain-language guidance steps")
    ai_credits_remaining: Optional[int] = Field(default=5, description="Remaining free AI analysis credits for account")


class AnalysisRecord(BaseModel):
    id: Optional[str] = None
    created_at: datetime
    inputs: dict
    avg_income: float
    volatility_pct: float
    surplus: float
    chosen_strategy: str
    action_plan: List[str]
