import statistics
from typing import List
from app.schemas.analyze import Debt, DebtStrategyItem
from app.core.exceptions import InvalidFinancialDataError


def calculate_avg_income(income_entries: List[float]) -> float:
    """Calculate average income from periodic income entries."""
    if not income_entries:
        raise InvalidFinancialDataError("Income entries list cannot be empty.")
    return round(statistics.mean(income_entries), 2)


def calculate_volatility(income_entries: List[float]) -> float:
    """
    Calculate income volatility as Coefficient of Variation (%):
    (Standard Deviation / Mean) * 100.
    Returns 0.0 if fewer than 2 entries or mean is zero.
    """
    if len(income_entries) < 2:
        return 0.0
    mean = statistics.mean(income_entries)
    if mean == 0:
        return 0.0
    stdev = statistics.stdev(income_entries)
    return round((stdev / mean) * 100, 2)


def calculate_surplus(avg_income: float, monthly_expenses: float) -> float:
    """Calculate net monthly cash surplus."""
    return round(avg_income - monthly_expenses, 2)


def determine_risk_level(volatility_pct: float, surplus: float) -> str:
    """Categorize risk level based on income volatility and surplus margin."""
    if surplus <= 0:
        return "HIGH"
    if volatility_pct > 30.0:
        return "HIGH"
    if volatility_pct > 15.0:
        return "MEDIUM"
    return "LOW"


def infer_lender_type(name: str, explicit_type: Optional[str] = None) -> str:
    """Infer whether a debt is formal or informal based on keywords or explicit input."""
    if explicit_type and explicit_type.strip():
        val = explicit_type.strip().lower()
        if val in ["informal", "friend", "family", "relative", "peer", "local"]:
            return "informal"
        if val in ["formal", "bank", "nbfc", "credit_card"]:
            return "formal"
        return val

    name_lower = name.lower()
    informal_keywords = [
        "friend", "family", "relative", "neighbour", "neighbor",
        "informal", "local", "bhai", "chit", "money lender", "moneylender", "peer"
    ]
    if any(kw in name_lower for kw in informal_keywords):
        return "informal"
    return "formal"


def calculate_emergency_buffer(surplus: float, volatility_pct: float, risk_level: str) -> float:
    """
    Calculate deterministic rainy-day emergency buffer:
    - If surplus <= 0: ₹0.0
    - If volatility > 25% or HIGH risk: 20% of surplus
    - If volatility > 10% or MEDIUM risk: 10% of surplus
    - LOW risk: ₹0.0
    """
    if surplus <= 0:
        return 0.0
    if volatility_pct > 25.0 or risk_level == "HIGH":
        return round(surplus * 0.20, 2)
    if volatility_pct > 10.0 or risk_level == "MEDIUM":
        return round(surplus * 0.10, 2)
    return 0.0


def order_avalanche(debts: List[Debt], debt_repayment_surplus: float = 0.0) -> List[DebtStrategyItem]:
    """
    Order debts by Highest Interest Rate first (Avalanche Method).
    Allocates available cash surplus sequentially according to Month 1 payoff order.
    """
    sorted_debts = sorted(debts, key=lambda d: d.rate, reverse=True)
    remaining_surplus = max(0.0, debt_repayment_surplus)
    result = []
    for idx, d in enumerate(sorted_debts):
        payment = min(remaining_surplus, d.amount)
        remaining_surplus -= payment
        result.append(
            DebtStrategyItem(
                name=d.name,
                amount=d.amount,
                rate=d.rate,
                lender_type=infer_lender_type(d.name, d.lender_type),
                payoff_order=idx + 1,
                recommended_monthly_payment=round(payment, 2)
            )
        )
    return result


def order_snowball(debts: List[Debt], debt_repayment_surplus: float = 0.0) -> List[DebtStrategyItem]:
    """
    Order debts by Smallest Outstanding Balance first (Snowball Method).
    Allocates available cash surplus sequentially according to Month 1 payoff order.
    """
    sorted_debts = sorted(debts, key=lambda d: d.amount)
    remaining_surplus = max(0.0, debt_repayment_surplus)
    result = []
    for idx, d in enumerate(sorted_debts):
        payment = min(remaining_surplus, d.amount)
        remaining_surplus -= payment
        result.append(
            DebtStrategyItem(
                name=d.name,
                amount=d.amount,
                rate=d.rate,
                lender_type=infer_lender_type(d.name, d.lender_type),
                payoff_order=idx + 1,
                recommended_monthly_payment=round(payment, 2)
            )
        )
    return result
