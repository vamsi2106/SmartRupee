import pytest
from app.core.finance_engine import (
    calculate_avg_income,
    calculate_volatility,
    calculate_surplus,
    determine_risk_level,
    infer_lender_type,
    calculate_emergency_buffer,
    order_avalanche,
    order_snowball,
)
from app.schemas.analyze import Debt


def test_calculate_avg_income():
    incomes = [10000.0, 12000.0, 8000.0, 14000.0]
    assert calculate_avg_income(incomes) == 11000.0


def test_calculate_volatility_zero_for_single_entry():
    assert calculate_volatility([10000.0]) == 0.0


def test_calculate_volatility():
    incomes = [10000.0, 10000.0, 10000.0]
    assert calculate_volatility(incomes) == 0.0

    variable_incomes = [5000.0, 15000.0]
    vol = calculate_volatility(variable_incomes)
    assert vol > 0.0


def test_calculate_surplus():
    assert calculate_surplus(25000.0, 18000.0) == 7000.0
    assert calculate_surplus(15000.0, 18000.0) == -3000.0


def test_determine_risk_level():
    assert determine_risk_level(5.0, 5000.0) == "LOW"
    assert determine_risk_level(20.0, 3000.0) == "MEDIUM"
    assert determine_risk_level(35.0, 2000.0) == "HIGH"
    assert determine_risk_level(5.0, -1000.0) == "HIGH"


def test_infer_lender_type():
    assert infer_lender_type("Friend Loan") == "informal"
    assert infer_lender_type("Relative Debt") == "informal"
    assert infer_lender_type("Bhaiya Loan") == "informal"
    assert infer_lender_type("Credit Card") == "formal"
    assert infer_lender_type("Personal Loan") == "formal"
    assert infer_lender_type("Friend Loan", explicit_type="formal") == "formal"


def test_calculate_emergency_buffer():
    assert calculate_emergency_buffer(35000.0, 30.0, "HIGH") == 7000.0  # 20% of 35000
    assert calculate_emergency_buffer(35000.0, 0.0, "LOW") == 0.0
    assert calculate_emergency_buffer(-5000.0, 50.0, "HIGH") == 0.0


def test_order_avalanche():
    debts = [
        Debt(name="Personal Loan", amount=50000, rate=12.0),
        Debt(name="Credit Card", amount=12000, rate=24.0),
        Debt(name="Friend Loan", amount=5000, rate=0.0),
    ]
    ordered = order_avalanche(debts, debt_repayment_surplus=35000)
    assert ordered[0].name == "Credit Card"
    assert ordered[0].payoff_order == 1
    assert ordered[0].lender_type == "formal"
    assert ordered[0].recommended_monthly_payment == 12000.0  # min(35000, 12000)

    assert ordered[1].name == "Personal Loan"
    assert ordered[1].lender_type == "formal"
    assert ordered[1].recommended_monthly_payment == 23000.0  # 35000 - 12000 = 23000

    assert ordered[2].name == "Friend Loan"
    assert ordered[2].lender_type == "informal"              # Keywords "Friend" inferred correctly!
    assert ordered[2].recommended_monthly_payment == 0.0      # no surplus remaining


def test_order_snowball():
    debts = [
        Debt(name="Personal Loan", amount=50000, rate=12.0),
        Debt(name="Credit Card", amount=12000, rate=24.0),
        Debt(name="Friend Loan", amount=5000, rate=0.0),
    ]
    ordered = order_snowball(debts, debt_repayment_surplus=10000)
    assert ordered[0].name == "Friend Loan"
    assert ordered[0].payoff_order == 1
    assert ordered[0].lender_type == "informal"              # Inferred as informal!
    assert ordered[0].recommended_monthly_payment == 5000.0   # min(10000, 5000)

    assert ordered[1].name == "Credit Card"
    assert ordered[1].lender_type == "formal"
    assert ordered[1].recommended_monthly_payment == 5000.0   # 10000 - 5000 = 5000

    assert ordered[2].name == "Personal Loan"
    assert ordered[2].recommended_monthly_payment == 0.0
