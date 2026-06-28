import pandas as pd
from datetime import date, timedelta
import yfinance as yf
import redis
import json
from src.services.feature_engineering import feature_engineer

def get_for_exceptional_date(date: date):
    
    r = redis.Redis(host="localhost", port=6379, db=0)
    cache_key = f"latest_market_data_{date.isoformat()}"
    cached_data = r.get(cache_key)

    if cached_data:
        return json.loads(cached_data.decode("utf-8"))
    input_date = pd.Timestamp(date)
    start_date = input_date - timedelta(days=45)
    end_date = input_date

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
    
    filtered_data = df[(df["Date"] >= start_date) & (df["Date"] <= end_date)]
    filtered_data = feature_engineer(filtered_data).tail(21)
    filtered_data = filtered_data.iloc[-1]
    r.setex(cache_key, timedelta(hours=24), json.dumps(filtered_data.to_dict()))

    return filtered_data.to_dict()
    


    

        
    


