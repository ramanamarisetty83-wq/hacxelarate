import os
import joblib

MODEL_PATH = "backend/models/model_scam_text.joblib"

class ScamTextPredictor:
    def __init__(self):
        if os.path.exists(MODEL_PATH):
            self.model = joblib.load(MODEL_PATH)
        else:
            self.model = None

    def predict_probability(self, text: str) -> float:
        if self.model is not None:
            return float(self.model.predict_proba([text])[0][1])

        # Rule-based fallback
        text_lower = text.lower()
        keywords = ["otp", "seed phrase", "airdrop", "suspended", "giveaway", "urgent", "password"]
        matches = sum(1 for kw in keywords if kw in text_lower)
        return min(0.95, matches * 0.25)
