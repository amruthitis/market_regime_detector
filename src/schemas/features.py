"""Feature schema definitions for market regime detection."""
from typing import List, Annotated, Optional
from pydantic import BaseModel, Field, computed_field
import datetime
import numpy as np
import pandas as pd

class PredictionRequest(BaseModel):
    date: Optional[Annotated[datetime.date, Field(title="Date for the required market regime", description="Gives the market regime on the given date")]] = None


class MarketFeatures(BaseModel):
    Date: datetime.date
    SP500: np.float64
    IRX : np.float64
    TNX : np.float64
    VIX : np.float64
    Volume_SP500 : np.int64

    @computed_field
    @property
    def yield_spread(self):
        self.yield_spread = self.TNX - self.IRX
        return self.yield_spread
    

    



