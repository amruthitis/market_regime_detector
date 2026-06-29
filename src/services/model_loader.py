"""Model loader module for loading pre-trained models."""
import joblib
import torch
import torch.nn as nn
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"
REQUIRED_MODEL_FILES = {
    "scaler": MODEL_DIR / "scaler.pkl",
    "kmeans": MODEL_DIR / "kmeans_model.pkl",
    "encoder_state": MODEL_DIR / "market_encoder.pth",
}


class MarketEncoder(nn.Sequential):
    def __init__(self):
        super().__init__(
            nn.Linear(5, 4),
            nn.ReLU(),
            nn.Linear(4, 3),
            nn.ReLU(),
            nn.Linear(3, 2),
            nn.ReLU(),
        )


class ModelLoader:
    def __init__(self):
        missing_files = [str(path) for path in REQUIRED_MODEL_FILES.values() if not path.exists()]
        if missing_files:
            raise FileNotFoundError(
                "Missing required model files: "
                + ", ".join(missing_files)
                + f". Expected them under {MODEL_DIR}."
            )

        self.scaler = joblib.load(REQUIRED_MODEL_FILES["scaler"])
        self.kmeans = joblib.load(REQUIRED_MODEL_FILES["kmeans"])

        self.encoder = MarketEncoder()
        state = torch.load(REQUIRED_MODEL_FILES["encoder_state"], map_location="cpu")
        self.encoder.load_state_dict(state)
        self.encoder.eval()












        



