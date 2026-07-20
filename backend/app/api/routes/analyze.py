from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.analyze import AnalyzeRequest, AnalyzeResponse
from app.graph.flow import run_analysis_flow
from app.core.exceptions import InvalidFinancialDataError, SmartRupeeError
from app.api.routes.auth import get_current_user

from app.core.db import get_database

router = APIRouter()
MAX_FREE_AI_CALLS = 5


@router.post(
    "/analyze",
    response_model=AnalyzeResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze financial situation and generate 3-stage debt strategy"
)
async def analyze_financial_data(
    payload: AnalyzeRequest,
    user: dict = Depends(get_current_user)
) -> AnalyzeResponse:
    """
    3-Stage Agentic Debt Analysis Endpoint (Authenticated Users Only):
    1. Deterministic calculation of income volatility and surplus.
    2. AI strategy selection (Avalanche vs. Snowball).
    3. Plain-language execution steps generation.
    """
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to run AI analysis and protect Gemini API credits."
        )

    user_id = user.get("id")
    db = get_database()

    # Enforce 5 AI calls limit per account
    if db is not None and user_id:
        usage_count = await db["analyses"].count_documents({"user_id": user_id})
        if usage_count >= MAX_FREE_AI_CALLS:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"AI Usage Limit Reached ({usage_count}/{MAX_FREE_AI_CALLS} runs used). To protect API credits, accounts are limited to 5 free AI analysis runs."
            )

    try:
        response = await run_analysis_flow(payload, user_id=user_id)
        if db is not None and user_id:
            new_count = await db["analyses"].count_documents({"user_id": user_id})
            response.ai_credits_remaining = max(0, MAX_FREE_AI_CALLS - new_count)
        else:
            response.ai_credits_remaining = 4
        return response
    except InvalidFinancialDataError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except SmartRupeeError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Unexpected error: {str(e)}")
