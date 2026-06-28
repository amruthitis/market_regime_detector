"""Feature schema definitions for market regime detection."""
from pydantic import BaseModel
import datetime
import numpy as np


class PredictionRequest(BaseModel):
    date: datetime.date | None = None


class PredictionFeatures(BaseModel):
    VIX  : float
    Volume_SP500 : int
    Yield_Spread : float
    Returns : float
    Volatility : float

    def model_input(self) -> np.ndarray:
        return np.array([
        self.VIX,
        self.Volume_SP500,
        self.Returns,
        self.Yield_Spread,
        self.Volatility],dtype=np.float32).reshape(1, -1)





    


    



