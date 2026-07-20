import pytest
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token


def test_password_hashing():
    raw_password = "SecretPassword123!"
    hashed = hash_password(raw_password)
    
    assert hashed != raw_password
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_token_flow():
    user_payload = {"sub": "worker@example.com", "user_id": "test_user_123"}
    token = create_access_token(user_payload)
    
    assert isinstance(token, str)
    assert len(token) > 20

    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "worker@example.com"
    assert decoded["user_id"] == "test_user_123"


def test_jwt_invalid_token():
    invalid_token = "invalid.jwt.token.string"
    assert decode_access_token(invalid_token) is None
