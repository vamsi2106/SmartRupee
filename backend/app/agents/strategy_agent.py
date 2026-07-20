from typing import Dict, Any, List
from app.schemas.analyze import Debt
from app.services.gemini_client import GeminiClient
from app.core.exceptions import AgentExecutionError


class StrategyAgent:
    """Stage 2 Agent: Decides between Debt Avalanche and Debt Snowball based on financial compute data."""

    def __init__(self, gemini_client: GeminiClient):
        self.client = gemini_client

    async def decide_strategy(
        self,
        avg_income: float,
        volatility_pct: float,
        surplus: float,
        risk_level: str,
        debts: List[Debt]
    ) -> Dict[str, Any]:

        debt_summary = [
            f"- {d.name}: Balance ₹{d.amount}, Rate {d.rate}%, Type: {d.lender_type or 'formal'}"
            for d in debts
        ]
        debts_formatted = "\n".join(debt_summary)

        prompt = f"""
You are a senior financial advisor specializing in micro-finance and gig-economy income stability in India.
Analyze the following financial metrics for a user:

- Average Monthly Income: ₹{avg_income}
- Income Volatility (Coefficient of Variation): {volatility_pct}%
- Monthly Surplus: ₹{surplus}
- Calculated Risk Profile: {risk_level}
- Active Debts:
{debts_formatted}

Determine which debt repayment strategy is better suited:
1. "AVALANCHE" (Target highest interest rate first — ideal when income is stable and user wants maximum interest savings).
2. "SNOWBALL" (Target smallest balance first — ideal when income is volatile, surplus is low, or user needs quick emotional wins).

Respond STRICTLY in valid JSON matching this structure:
{{
  "chosen_strategy": "AVALANCHE" or "SNOWBALL",
  "reasoning": "A concise 2-3 sentence explanation explaining why this strategy fits their specific income volatility and debt breakdown."
}}
"""

        try:
            res = await self.client.generate_json(prompt)
            strategy = res.get("chosen_strategy", "").upper()
            if strategy not in ["AVALANCHE", "SNOWBALL"]:
                # Fallback rule: High volatility prefers Snowball for quick wins
                strategy = "SNOWBALL" if volatility_pct > 20.0 else "AVALANCHE"

            return {
                "chosen_strategy": strategy,
                "reasoning": res.get("reasoning", "Strategy chosen based on volatility and interest optimization.")
            }
        except AgentExecutionError:
            # Deterministic Fallback if AI fails or API key missing
            fallback_strategy = "SNOWBALL" if (volatility_pct > 20.0 or surplus < 5000) else "AVALANCHE"
            return {
                "chosen_strategy": fallback_strategy,
                "reasoning": f"Strategy defaulted to {fallback_strategy} based on deterministic rules (Volatility: {volatility_pct}%, Surplus: ₹{surplus})."
            }
