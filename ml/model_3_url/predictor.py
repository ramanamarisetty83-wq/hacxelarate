import os
import joblib
import numpy as np

MODEL_PATH = "backend/models/model_phishing_url.joblib"

class UrlPredictor:
    def __init__(self):
        if os.path.exists(MODEL_PATH):
            self.model = joblib.load(MODEL_PATH)
        else:
            self.model = None

    def predict_probability(self, features: list) -> float:
        if self.model is not None:
            X = np.array([features])
            return float(self.model.predict_proba(X)[0][1])

        # Rule-based fallback
        _, _, hyphens, is_https, is_tld, is_typo, is_kw = features
        score = (0.35 if is_typo else 0.0) + (0.30 if is_tld else 0.0) + (0.20 if is_kw else 0.0) + (0.15 if not is_https else 0.0)
        return min(1.0, max(0.0, score))
