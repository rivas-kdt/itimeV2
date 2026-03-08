# app/main.py
from __future__ import annotations

import os
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

from src.app.routers import digital, health

# Load .env if present (local dev). In prod, env vars are already set.
load_dotenv()


def _parse_origins(raw: str) -> List[str]:
    """
    Supports:
      CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"
    """
    if not raw:
        return []
    return [o.strip() for o in raw.split(",") if o.strip()]


APP_TITLE = os.getenv("APP_TITLE", "iTime EasyOCR API")
APP_VERSION = os.getenv("APP_VERSION", "0.1.0")

DEFAULT_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

CORS_ORIGINS = _parse_origins(os.getenv("CORS_ORIGINS", "")) or DEFAULT_ORIGINS

app = FastAPI(title=APP_TITLE, version=APP_VERSION)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
# Keep health unprefixed.
app.include_router(health.router)

# IMPORTANT:
# If your routers already have prefix="/read" inside them, DO NOT add prefix here.
# If they do NOT, then keep prefix="/read" here.
#
# Your earlier digital router had: APIRouter(prefix="/read", ...)
# So we include without prefix to avoid /read/read/digital.
# app.include_router(analog.router, prefix="/read", tags=["read"])
app.include_router(digital.router, prefix="/read", tags=["read"])

