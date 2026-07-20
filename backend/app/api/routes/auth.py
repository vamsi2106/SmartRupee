from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.schemas.auth import UserRegister, UserLogin, UserResponse, TokenResponse
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token
from app.core.db import get_database

router = APIRouter()
security_scheme = HTTPBearer(auto_error=False)


async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)) -> Optional[dict]:
    """Dependency that decodes JWT token and returns current authenticated user from MongoDB (if provided)."""
    if not credentials or not credentials.credentials:
        return None

    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user_email = payload["sub"]
    db = get_database()
    if db is None:
        return {"id": "mock_id", "email": user_email, "name": "Gig Worker", "gig_platform": "freelance"}

    user = await db["users"].find_one({"email": user_email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User associated with token not found.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    user["id"] = str(user["_id"])
    return user


async def require_current_user(user: Optional[dict] = Depends(get_current_user)) -> dict:
    """Dependency enforcing that a valid authenticated user token must be provided."""
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return user


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED, summary="Register a new gig worker account")
async def register(payload: UserRegister) -> TokenResponse:
    """Registers a new user and returns a signed JWT access token."""
    db = get_database()
    
    # Check if user already exists
    if db is not None:
        existing = await db["users"].find_one({"email": payload.email.lower()})
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email is already registered.")

    now = datetime.now(timezone.utc)
    hashed_pwd = hash_password(payload.password)

    user_doc = {
        "name": payload.name,
        "email": payload.email.lower(),
        "password": hashed_pwd,
        "gig_platform": payload.gig_platform or "freelance",
        "city": payload.city,
        "created_at": now
    }

    user_id = "temp_id"
    if db is not None:
        res = await db["users"].insert_one(user_doc)
        user_id = str(res.inserted_id)

    user_resp = UserResponse(
        id=user_id,
        name=payload.name,
        email=payload.email.lower(),
        gig_platform=payload.gig_platform or "freelance",
        city=payload.city,
        created_at=now
    )

    token = create_access_token(data={"sub": payload.email.lower(), "user_id": user_id})
    return TokenResponse(access_token=token, user=user_resp)


@router.post("/login", response_model=TokenResponse, summary="Authenticate user & get access token")
async def login(payload: UserLogin) -> TokenResponse:
    """Authenticates credentials and returns a signed JWT access token."""
    db = get_database()
    if db is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database not configured.")

    user = await db["users"].find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user.get("password", "")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")

    user_id = str(user["_id"])
    created_at = user.get("created_at", datetime.now(timezone.utc))

    user_resp = UserResponse(
        id=user_id,
        name=user.get("name", "User"),
        email=user["email"],
        gig_platform=user.get("gig_platform", "freelance"),
        city=user.get("city"),
        created_at=created_at
    )

    token = create_access_token(data={"sub": user["email"], "user_id": user_id})
    return TokenResponse(access_token=token, user=user_resp)


@router.get("/me", response_model=UserResponse, summary="Fetch authenticated user profile")
async def get_me(user: dict = Depends(require_current_user)) -> UserResponse:
    """Returns profile information for the currently authenticated user."""
    created_at = user.get("created_at")
    if not isinstance(created_at, datetime):
        created_at = datetime.now(timezone.utc)

    return UserResponse(
        id=user["id"],
        name=user.get("name", "Gig Worker"),
        email=user["email"],
        gig_platform=user.get("gig_platform", "freelance"),
        city=user.get("city"),
        created_at=created_at
    )
