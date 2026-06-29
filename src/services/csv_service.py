import json
from datetime import date
from pathlib import Path

import pandas as pd

from src.config import CACHE_TTL
from src.services.feature_engineering import feature_engineer
from src.services.redis_client import redis_client

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
CSV_PATH = DATA_DIR / "market_data.csv"


def get_by_date(date_value: date):
    r = redis_client
    cache_key = f"{date_value.isoformat()}_market_data"

    try:
        cached_data = r.get(cache_key)
    except Exception:
        cached_data = None

    if cached_data:
        return json.loads(cached_data.decode("utf-8"))

    if not CSV_PATH.exists():
        raise FileNotFoundError(f"Historical dataset not found at {CSV_PATH}.")

    input_date = pd.Timestamp(date_value)
    df = pd.read_csv(CSV_PATH)
    df = df.iloc[2:].reset_index(drop=True)
    if "Price" in df.columns:
        df = df[["Price", "Close", "Close.1", "Close.2", "Close.3", "Volume"]]
        df.columns = ["Date", "SP500", "IRX", "TNX", "VIX", "Volume_SP500"]

    df["Date"] = pd.to_datetime(df["Date"])
    for col in df.columns[1:]:
        df[col] = pd.to_numeric(df[col])

    filtered_data = df[df["Date"] <= input_date].tail(60).copy()
    filtered_data.iloc[:, 1:] = filtered_data.iloc[:, 1:].ffill().bfill()

    filtered_data = feature_engineer(filtered_data)
    filtered_data = filtered_data.iloc[-1]

    latest_dict = filtered_data.to_dict()

    try:
        r.setex(cache_key, CACHE_TTL, json.dumps(latest_dict))
    except Exception:
        pass

    return latest_dict






