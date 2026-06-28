""" Response Schema for the Model"""

from pydantic import BaseModel
import datetime

class PredictionResponse(BaseModel):
    date: datetime.date
    regime: str
    confidence: float
    source: str

 
