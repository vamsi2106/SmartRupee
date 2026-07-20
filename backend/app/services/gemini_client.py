import json
import logging
from typing import Any, Dict, Optional
from google import genai
from google.genai import types
from app.config import get_settings
from app.core.exceptions import AgentExecutionError

logger = logging.getLogger(__name__)


class GeminiClient:
    """Wrapper around official Google GenAI SDK (`google-genai`) for structured JSON generation."""

    def __init__(self, model_name: Optional[str] = None):
        settings = get_settings()
        self.api_key = settings.gemini_api_key
        self.model_name = model_name or settings.gemini_model

        if self.api_key:
            self._client = genai.Client(api_key=self.api_key)
        else:
            self._client = None
            logger.warning("GEMINI_API_KEY is not set. Gemini calls will return fallback defaults.")

    async def generate_json(self, prompt: str) -> Dict[str, Any]:
        """Send prompt to Gemini model using official `google.genai` Client expecting JSON response."""
        if not self._client:
            raise AgentExecutionError("GEMINI_API_KEY missing. Please configure your API key.")

        try:
            response = self._client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            raw_text = (response.text or "").strip()

            # Clean possible markdown code fences
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]

            return json.loads(raw_text.strip())
        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            raise AgentExecutionError(f"Failed to generate structured AI response: {str(e)}")
