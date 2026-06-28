import pandas as pd
from datetime import date, timedelta
import redis
import json
from src.services.feature_engineering import feature_engineer

def get_by_date(date: date):
    
    r = redis.Redis(host="localhost", port=6379, db=0)
    cache_key = f"{date.isoformat()}_market_data"
    cached_data = r.get(cache_key)

    if cached_data:
        return json.loads(cached_data.decode("utf-8"))
    
    input_date = pd.Timestamp(date)
    df = pd.read_csv("src/data/market_data.csv")
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
    
    filtered_data = df[df["Date"] <= input_date].tail(21)
    filtered_data = feature_engineer(filtered_data)
    filtered_data = filtered_data.iloc[-1]
    r.setex(cache_key, timedelta(hours=24), json.dumps(filtered_data.to_dict()))
    
    return filtered_data.to_dict()






