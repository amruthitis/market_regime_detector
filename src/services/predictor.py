import joblib, torch
import torch.nn as nn
import numpy as np
import csv_service, market_service
from schemas.features import PredictionRequest


def predict(request: PredictionRequest):
    if request.date == None:
        raw_data = market_service.get_latest()
    else:
        raw_data = csv_service.get_by_date(request.date)
    
    

    


