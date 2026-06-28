""" Response Schema for the Model"""

from pydantic import BaseModel
import datetime

class PredictionResponse(BaseModel):
    date: datetime.date
    regime : str

    def response(self):
        regime_classification = {0:"Bullish", 1:"Crisis", 2:"Bearish", 3:"Sideways", -1:"Unclassified"}
        return {"Date" : self.date,
                "Regime" : regime_classification[self.regime]}
    

