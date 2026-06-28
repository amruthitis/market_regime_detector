""" Routes and Endpoints for Backend Services"""

from fastapi import FastAPI, Path, HTTPException
import datetime
from services.predictor import predict
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger =  logging.getLogger(__name__)

app = FastAPI(title= "S&P500 Market Regime Detector")

@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"Welcome to S&P500 Market Regime detector"}

@app.post("/predict/{date}")
def predict_(date: datetime.date = Path(..., description="Date for the Market Regime")):
    logger.info(f"User has request for the prediction on the date {date}")
    prediction = predict(date)
    if prediction == None:
        raise HTTPException(status_code=404, detail="Could not generate a response")
    
    return prediction

