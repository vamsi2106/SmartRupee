import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import get_settings

logger = logging.getLogger(__name__)

_mongo_client: Optional[AsyncIOMotorClient] = None


def get_mongo_client() -> Optional[AsyncIOMotorClient]:
    global _mongo_client
    if _mongo_client is None:
        settings = get_settings()
        if settings.mongo_uri and "mongodb" in settings.mongo_uri:
            try:
                _mongo_client = AsyncIOMotorClient(settings.mongo_uri, serverSelectionTimeoutMS=3000)
                logger.info("MongoDB AsyncIOMotorClient initialized.")
            except Exception as e:
                logger.warning(f"Could not connect to MongoDB: {e}")
                _mongo_client = None
    return _mongo_client


def get_database():
    client = get_mongo_client()
    if client:
        return client.get_database("smartrupee")
    return None
