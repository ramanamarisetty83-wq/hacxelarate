import os
import joblib
import numpy as np

MODEL_PATH = "backend/models/model_social_profile.joblib"

class SocialProfilePredictor:
    def __init__(self):
        if os.path.exists(MODEL_PATH):
            self.model = joblib.load(MODEL_PATH)
        else:
            self.model = None

    def predict_probability(self, features: list) -> float:
        if self.model is not None:
            X = np.array([features])
            return float(self.model.predict_proba(X)[0][1])
        
        # Transparent rule fallback if model file not yet serialized
        u_sim, d_sim, _, followers, following, _, age, verified, has_ext = features
        score = (u_sim * 0.4) + (d_sim * 0.2) + (0.2 if not verified else 0.0) + (0.2 if age < 14 else 0.0)
        return min(1.0, max(0.0, score))
