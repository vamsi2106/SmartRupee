from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    gemini_api_key: str = ""
    gemini_model: str = "gemini-1.5-flash"
    mongo_uri: str = "mongodb://localhost:27017/smartrupee"
    jwt_secret_key: str = "smartrupee_super_secret_jwt_key_2026_change_in_production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    env: str = "development"
    port: int = 8000
    docs_url: str | None = "/docs"
    redoc_url: str | None = "/redoc"

    # Config-Driven Expense Tracking Settings
    currency_symbol: str = "₹"
    currency_code: str = "INR"
    expense_categories: list[str] = [
        "fuel", "maintenance", "food", "recharge", "rent", "utilities", "healthcare", "other"
    ]
    category_warning_thresholds: dict[str, float] = {
        "fuel": 40.0,
        "maintenance": 20.0,
        "food": 25.0
    }
    category_keyword_rules: dict[str, list[str]] = {
        "fuel": ["petrol", "diesel", "ev", "charging", "hp", "iocl", "bpcl", "bunk"],
        "maintenance": ["mechanic", "puncture", "oil", "service", "brake", "tyre", "repair"],
        "food": ["chai", "tea", "lunch", "dinner", "breakfast", "samosa", "thali", "hotel", "canteen"],
        "recharge": ["jio", "airtel", "vi", "data", "recharge", "mobile"],
        "rent": ["rent", "room", "house"],
        "utilities": ["electricity", "water", "gas", "bill"],
        "healthcare": ["doctor", "medicine", "medical", "pharma"]
    }

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


@lru_cache()
def get_settings() -> Settings:
    return Settings()
