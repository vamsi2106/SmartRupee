import logging
from datetime import datetime, timezone
from app.schemas.analyze import AnalyzeRequest, AnalyzeResponse
from app.core.finance_engine import (
    calculate_avg_income,
    calculate_volatility,
    calculate_surplus,
    determine_risk_level,
    calculate_emergency_buffer,
    order_avalanche,
    order_snowball,
)
from app.services.gemini_client import GeminiClient
from app.agents.strategy_agent import StrategyAgent
from app.agents.explain_agent import ExplainAgent
from app.core.db import get_database

logger = logging.getLogger(__name__)


from typing import Optional

async def run_analysis_flow(payload: AnalyzeRequest, user_id: Optional[str] = None) -> AnalyzeResponse:
    """
    3-Stage Agentic Pipeline Execution:
    Stage 1: Deterministic financial compute (pure python).
    Stage 2: Strategy choice (AI agent / Gemini).
    Stage 3: Plain-language action plan (AI agent / Gemini).
    """

    # --- STAGE 1: Pure Deterministic Compute ---
    avg_income = calculate_avg_income(payload.income_entries)
    volatility_pct = calculate_volatility(payload.income_entries)
    surplus = calculate_surplus(avg_income, payload.monthly_expenses)
    risk_level = determine_risk_level(volatility_pct, surplus)
    emergency_buffer = calculate_emergency_buffer(surplus, volatility_pct, risk_level)
    debt_repayment_surplus = round(surplus - emergency_buffer, 2)

    # Initialize Gemini AI Client & Agents
    gemini_client = GeminiClient()
    strategy_agent = StrategyAgent(gemini_client)
    explain_agent = ExplainAgent(gemini_client)

    # --- STAGE 2: Strategy Agent Decision ---
    strategy_decision = await strategy_agent.decide_strategy(
        avg_income=avg_income,
        volatility_pct=volatility_pct,
        surplus=surplus,
        risk_level=risk_level,
        debts=payload.debts
    )

    chosen_strategy = strategy_decision["chosen_strategy"]
    strategy_reasoning = strategy_decision["reasoning"]

    # Apply mathematical debt ordering according to chosen strategy & allocate repayment surplus
    if chosen_strategy == "AVALANCHE":
        ordered_debts = order_avalanche(payload.debts, debt_repayment_surplus=debt_repayment_surplus)
    else:
        ordered_debts = order_snowball(payload.debts, debt_repayment_surplus=debt_repayment_surplus)

    # --- STAGE 3: Explain Agent Output ---
    action_plan = await explain_agent.generate_action_plan(
        avg_income=avg_income,
        volatility_pct=volatility_pct,
        surplus=surplus,
        emergency_buffer=emergency_buffer,
        debt_repayment_surplus=debt_repayment_surplus,
        strategy=chosen_strategy,
        ordered_debts=ordered_debts
    )

    # Build response object
    response = AnalyzeResponse(
        avg_income=avg_income,
        volatility_pct=volatility_pct,
        surplus=surplus,
        emergency_buffer=emergency_buffer,
        debt_repayment_surplus=debt_repayment_surplus,
        risk_level=risk_level,
        chosen_strategy=chosen_strategy,
        strategy_reasoning=strategy_reasoning,
        ordered_debts=ordered_debts,
        action_plan=action_plan
    )

    # --- PERSISTENCE: Save Record to MongoDB Async (if configured) ---
    try:
        db = get_database()
        if db is not None:
            await db["analyses"].insert_one({
                "user_id": user_id,
                "created_at": datetime.now(timezone.utc),
                "inputs": payload.model_dump(),
                "avg_income": avg_income,
                "volatility_pct": volatility_pct,
                "surplus": surplus,
                "emergency_buffer": emergency_buffer,
                "debt_repayment_surplus": debt_repayment_surplus,
                "risk_level": risk_level,
                "chosen_strategy": chosen_strategy,
                "strategy_reasoning": strategy_reasoning,
                "ordered_debts": [item.model_dump() for item in ordered_debts],
                "action_plan": action_plan
            })
            logger.info("Successfully persisted analysis record to MongoDB Atlas.")
    except Exception as e:
        logger.warning(f"Failed to persist record to MongoDB: {e}")

    return response
