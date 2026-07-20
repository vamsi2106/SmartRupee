from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, description="User's full name", json_schema_extra={"example": "Ramesh Kumar"})
    email: EmailStr = Field(..., description="User's email address", json_schema_extra={"example": "ramesh@example.com"})
    password: str = Field(..., min_length=6, description="Password (min 6 chars)", json_schema_extra={"example": "Secret123!"})
    gig_platform: Optional[str] = Field(default="freelance", description="Gig platform e.g. Zomato, Swiggy, Uber, Ola, Freelance", json_schema_extra={"example": "Zomato"})
    city: Optional[str] = Field(default=None, description="User's city", json_schema_extra={"example": "Bengaluru"})


class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    gig_platform: Optional[str] = "freelance"
    city: Optional[str] = None
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
