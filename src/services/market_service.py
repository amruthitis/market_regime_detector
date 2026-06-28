import pandas as pd
from datetime import date, timedelta
import yfinance as yf
import redis
import json
from src.services.feature_engineering import feature_engineer

def get_latest():
    
    r = redis.Redis(host="localhost", port=6379, db=0)
    cache_key = f"latest_market_data"
    cached_data = r.get(cache_key)

    if cached_data:
        return json.loads(cached_data.decode("utf-8"))


    today_date = date.today()
    start_date = pd.Timestamp(today_date) - timedelta(days=60)
    end_date = pd.Timestamp(today_date)

    tickers = ["^GSPC","^VIX", "^TNX", "^IRX"]
    
    df = yf.download(tickers=tickers, start = start_date, end= end_date, auto_adjust=False)
    df = pd.DataFrame({
        "Date": df.index,
        "SP500": df[("Close", "^GSPC")],
        "IRX": df[("Close", "^IRX")],
        "TNX": df[("Close", "^TNX")],
        "VIX": df[("Close", "^VIX")],
        "Volume_SP500": df[("Volume", "^GSPC")]
    }).reset_index(drop=True)

    if 'Price' in df.columns:
        df = df[["Price","Close",'Close.1',"Close.2", "Close.3", "Volume"]]
        df.columns = [
            "Date",
            "SP500",
            "IRX",
            "TNX",
            "VIX",
            "Volume_SP500"
        ]

    df["Date"] = pd.to_datetime(df["Date"])
    for col in df.columns[1:]:
        df[col] = pd.to_numeric(df[col])
    
    # Fill any missing values first (ffill/bfill) on numeric columns
    df.iloc[:, 1:] = df.iloc[:, 1:].ffill().bfill()
    
    filtered_data = feature_engineer(df)
    filtered_data = filtered_data.iloc[-1]
    
    latest_dict = filtered_data.to_dict()
    r.setex(cache_key, timedelta(hours=24), json.dumps(latest_dict))

    return latest_dict

    


    

        
    


