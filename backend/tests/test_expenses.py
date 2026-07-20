import pytest
from app.api.routes.expenses import infer_expense_category
from app.config import get_settings

settings = get_settings()


def test_infer_expense_category_from_keywords():
    assert infer_expense_category(notes="Filled petrol at HP bunk") == "fuel"
    assert infer_expense_category(notes="Bike mechanic puncture repair") == "maintenance"
    assert infer_expense_category(notes="Evening chai and samosa") == "food"
    assert infer_expense_category(notes="Jio monthly data recharge") == "recharge"
    assert infer_expense_category(notes="Random purchase") == "other"


def test_infer_expense_category_explicit_override():
    assert infer_expense_category(notes="Petrol bunk", provided_category="other") == "other"
    assert infer_expense_category(notes="Unknown note", provided_category="healthcare") == "healthcare"


def test_config_expense_categories_loaded():
    assert "fuel" in settings.expense_categories
    assert "maintenance" in settings.expense_categories
    assert "food" in settings.expense_categories
    assert settings.currency_symbol == "₹"
