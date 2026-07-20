from typing import List, Dict, Any
from app.schemas.analyze import DebtStrategyItem
from app.services.gemini_client import GeminiClient
from app.core.exceptions import AgentExecutionError


class ExplainAgent:
    """Stage 3 Agent: Converts mathematical strategy into empathetic, step-by-step plain-language guidance."""

    def __init__(self, gemini_client: GeminiClient):
        self.client = gemini_client

    async def generate_action_plan(
        self,
        avg_income: float,
        volatility_pct: float,
        surplus: float,
        emergency_buffer: float,
        debt_repayment_surplus: float,
        strategy: str,
        ordered_debts: List[DebtStrategyItem]
    ) -> List[str]:

        ordered_list_text = "\n".join([
            f"{d.payoff_order}. {d.name} (Balance: ₹{d.amount}, Rate: {d.rate}%, Lender: {d.lender_type}, Month 1 Focus Payment: ₹{d.recommended_monthly_payment})"
            for d in ordered_debts
        ])

        top_debt = ordered_debts[0] if ordered_debts else None
        top_debt_name = top_debt.name if top_debt else "highest priority debt"
        top_debt_payment = top_debt.recommended_monthly_payment if top_debt else debt_repayment_surplus

        prompt = f"""
You are an empathetic Indian personal finance coach assisting a gig-worker/freelancer.
Generate a 4-step actionable execution plan for debt repayment.

CONTEXT (DETERMINISTIC DATA FROM ENGINE):
- Average Monthly Income: ₹{avg_income}
- Volatility: {volatility_pct}%
- Gross Monthly Surplus: ₹{surplus}
- Deterministic Emergency Buffer: ₹{emergency_buffer}
- Net Surplus Available for Debt Repayment: ₹{debt_repayment_surplus}
- Selected Strategy: {strategy}
- Payoff Sequence & Month 1 Allocations:
{ordered_list_text}

STRICT CONSTRAINTS & GROUNDING RULES:
1. You MUST use the EXACT computed figures: Emergency Buffer (₹{emergency_buffer}), Debt Repayment Surplus (₹{debt_repayment_surplus}), and Month 1 Focus Payment (₹{top_debt_payment} for '{top_debt_name}').
2. DO NOT invent, hallucinate, or calculate any new dollar/rupee figures not present in the input context above.
3. Step 1: Emergency buffer advice using ₹{emergency_buffer} (if ₹0, advise maintaining current buffer).
4. Step 2: Direct ₹{top_debt_payment} towards paying off '{top_debt_name}' using the {strategy} method in Month 1.
5. Step 3: Pay minimum required balances on all other debts to avoid penalty escalation.
6. Step 4: Once '{top_debt_name}' is cleared, roll that payment amount into the next debt in sequence.

Return STRICTLY valid JSON with a single key "action_plan" containing an array of 4 string steps:
{{
  "action_plan": [
    "Step 1 text...",
    "Step 2 text...",
    "Step 3 text...",
    "Step 4 text..."
  ]
}}
"""

        try:
            res = await self.client.generate_json(prompt)
            plan = res.get("action_plan", [])
            if isinstance(plan, list) and len(plan) >= 3:
                return plan
            raise AgentExecutionError("Invalid action plan structure from AI model.")
        except AgentExecutionError:
            # Deterministic Fallback action plan
            return [
                f"1. Reserve ₹{emergency_buffer} into a rainy-day emergency buffer to protect against income fluctuations ({volatility_pct}% volatility)." if emergency_buffer > 0 else "1. Maintain your rainy-day emergency buffer to protect against income fluctuations.",
                f"2. Direct your net repayment surplus of ₹{debt_repayment_surplus} (₹{top_debt_payment} allocated in Month 1) primarily towards paying off '{top_debt_name}' using the {strategy} method.",
                "3. Pay minimum required balances on all other debts to avoid late fees or penalty escalation.",
                f"4. Once '{top_debt_name}' is cleared, roll that payment amount into the next debt in your sequence!"
            ]
