import joblib, torch
import torch.nn as nn
import numpy as np


class Autoencoder(nn.Module):
    def __init__(self):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(5,4),
            nn.ReLU(),
            nn.Linear(4,3),
            nn.ReLU(),
            nn.Linear(3,2),
            nn.ReLU()
        )

        self.decoder = nn.Sequential(
            nn.Linear(2,3),
            nn.ReLU(),
            nn.Linear(3,4),
            nn.ReLU(),
            nn.Linear(4,5)
        )

    def forward(self,x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded


class RegimePredictor:
    def __init__(self):
        self.scaler = joblib.load("models/scaler.pkl")
        self.kmeans = joblib.load("models/kmeans_model.pkl")
        self.model = Autoencoder()

        self.model.load_state_dict(torch.load("models/market_autoencoder.pth", map_location="cpu"))
        self.model.eval()

        self.regime_map = {
            0: "Bullish",
            1: "Crisis",
            2: "Bearish",
            3: "Sideways"
        }

   




    

