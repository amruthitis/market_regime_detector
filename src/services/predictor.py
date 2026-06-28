import joblib, torch
import numpy as np
from datetime import date
from src.services import csv_service, market_service, exception_service
from src.schemas.features import PredictionRequest, PredictionFeatures
from src.services.model_loader import ModelLoader
from src.schemas.response import PredictionResponse

model = ModelLoader()

def predict(request: PredictionRequest):
    training_start_date = date(2010, 1, 1)
    training_end_date = date(2026, 1, 1)
    today = date.today()
    
    if request.date is None:
    
        raw_data = market_service.get_latest()
    elif request.date < training_start_date:
        
        raise ValueError(f"Date {request.date} is before training data start date {training_start_date}")
    elif request.date <= training_end_date:
        
        raw_data = csv_service.get_by_date(request.date)
    elif request.date < today:
        
        raw_data = exception_service.get_for_exceptional_date(request.date)
    elif request.date == today:
        
        raw_data = market_service.get_latest()
    else:
      
        raise ValueError(f"Date {request.date} is in the future")
    
    features = PredictionFeatures(**raw_data)
    X = features.model_input()

    scaler = model.scaler
    encoder = model.encoder
    kmeans = model.kmeans

    X = scaler.transform(X)

    with torch.no_grad():
        latent = encoder(torch.tensor(X, dtype=torch.float32))
        prediction = int(kmeans.predict(latent.numpy())[0])
        
    regime_classification = {0:"Bullish", 1:"Crisis", 2:"Bearish", 3:"Sideways", -1:"Unclassified"}
    response = PredictionResponse(
        date = request.date if request.date else today,
        regime = regime_classification.get(prediction,"Unclassified")
    )

    return response










    


    



    
    


    


