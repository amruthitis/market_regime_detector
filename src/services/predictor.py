import  torch
import numpy as np
import csv_service, market_service
from schemas.features import PredictionRequest, PredictionFeatures
from model_loader import ModelLoader
from schemas.response import PredictionResponse

model = ModelLoader()

def predict(request: PredictionRequest):
    if request.date == None:
        raw_data = market_service.get_latest()
    else:
        raw_data = csv_service.get_by_date(request.date)
    
    features = PredictionFeatures(**raw_data)
    X = features.model_input()

    scaler = model.scaler
    encoder = model.encoder
    kmeans = model.kmeans

    X = scaler.transform(X)

    with torch.no_grad():
        latent = encoder(torch.tensor(X, dtype=torch.float32))
        prediction = kmeans.predict(latent.numpy())[0]
        prediction = PredictionResponse(**prediction)

    result = prediction.response()
    return result










    


    



    
    


    


