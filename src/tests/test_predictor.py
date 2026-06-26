import joblib
import torch

model = torch.load("src/models/market_autoencoder.pth", map_location="cpu")
print(type(model))


