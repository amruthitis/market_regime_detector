"""Feature schema definitions for market regime detection."""
from typing import List, Annotated, Optional
from pydantic import BaseModel, Field
import datetime

class PredictionRequest(BaseModel):
    date: Optional[Annotated[datetime.date, Field(title="Date for the required market regime", description="Gives the market regime on the given date")]] = None




