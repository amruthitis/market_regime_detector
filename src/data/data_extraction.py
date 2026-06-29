from pathlib import Path

import pandas as pd
import yfinance as yf

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "market_data.csv"

if not DATA_FILE.exists():
    tickers = ["^GSPC", "^VIX", "^TNX", "^IRX"]
    df = yf.download(tickers, start="2010-01-01", end="2026-01-01", interval="1d", auto_adjust=True)
    df.to_csv(DATA_FILE)



