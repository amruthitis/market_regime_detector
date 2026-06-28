"""Routes and endpoints for backend services."""

import datetime
import logging

from fastapi import APIRouter, HTTPException, Path
from src.services.predictor import predict
from src.schemas.features import PredictionRequest

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"Welcome to S&P500 Market Regime detector"}


@router.post("/predict")
def predict_(request: PredictionRequest):
    logger.info(f"User has request for the prediction on the date {request.date}")
    prediction = predict(request)
    if prediction is None:
        raise HTTPException(status_code=404, detail="Could not generate a response")

    return prediction

