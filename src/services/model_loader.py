"""Model loader module for loading pre-trained models."""
import joblib
import torch
import torch.nn as nn

class MarketEncoder(nn.Sequential):
    def __init__(self):
        super().__init__(
            nn.Linear(5,4),
            nn.ReLU(),
            nn.Linear(4,3),
            nn.ReLU(),
            nn.Linear(3,2),
            nn.ReLU()
        )

class ModelLoader:
    def __init__(self):
        self.scaler = joblib.load("src/models/scaler.pkl")
        self.kmeans = joblib.load("src/models/kmeans_model.pkl")

        self.encoder = MarketEncoder()

        state = torch.load("src/models/market_encoder.pth", map_location="cpu")
        self.encoder.load_state_dict(state)

        self.encoder.eval()












        



