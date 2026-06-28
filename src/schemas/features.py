"""Feature schema definitions for market regime detection."""
from typing import List, Annotated, Optional
from pydantic import BaseModel, Field, computed_field, field_validator
import datetime
import numpy as np
import pandas as pd

class PredictionRequest(BaseModel):
    date: Optional[Annotated[datetime.date, Field(title="Date for the required market regime", description="Gives the market regime on the given date")]] = None


class PredictionFeatures(BaseModel):
    VIX  : np.float64
    Volume_SP500 : np.int64
    Yield_Spread : np.float64
    Returns : np.float64
    Volatility : np.float64

    def model_input(self) -> np.ndarray:
        return np.array([
        self.VIX,
        self.Volume_SP500,
        self.Returns,
        self.Yield_Spread,
        self.Volatility],dtype=np.float32).reshape(1, -1)





    


    



