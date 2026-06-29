import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


def _get_bool_env(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", "")
REDIS_SSL = _get_bool_env("REDIS_SSL", False)
CACHE_TTL = int(os.getenv("CACHE_TTL", "86400"))

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://<my-vercel-domain>.vercel.app")
CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ALLOWED_ORIGINS", f"http://localhost:5173,{FRONTEND_URL}").split(",")
    if origin.strip()
]