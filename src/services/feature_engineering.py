import pandas as pd


def feature_engineer(df: pd.DataFrame) -> pd.DataFrame:
    
    df["Yield_Spread"] = df["TNX"] - df["IRX"]
    df["Returns"] = df["SP500"].pct_change()
    df["Volatility"] = df["SP500"].pct_change().rolling(window=20).std()
    df = df.iloc[:, 4:]

    return df