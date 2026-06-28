import pandas as pd
from datetime import date, timedelta
import yfinance as yf
import redis
from feature_engineering import feature_engineer

def get_latest():
    
    r = redis.Redis(host="localhost", port=6379, db=0)
    cache_key = "latest_market_data"
    cached_data = r.get(cache_key)

    if cached_data:
        return pd.read_json(cached_data)


    date = date.today()
    start_date = date - timedelta(days=20)
    end_date = date

    tickers = ["^GSPC","^VIX", "^TNX", "^IRX"]
    
    df = yf.download(tickers=tickers, start = start_date, end= end_date)
    df = df.iloc[2:].reset_index(drop=True)

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
    
    filtered_data = df[(df["Date"] >= start_date) & (df["Date"] < end_date)]
    filtered_data = feature_engineer(filtered_data)
    r.setex(cache_key, timedelta(hours=24), filtered_data.to_json())

    return filtered_data
    



    

        
    


