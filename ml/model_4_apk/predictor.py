import os
import joblib
import numpy as np

MODEL_PATH = "backend/models/model_suspicious_apk.joblib"

class ApkPredictor:
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
        is_typo, _, dang_count, has_sms, has_overlay, _, _ = features
        score = (0.35 if is_typo else 0.0) + (0.30 if has_sms else 0.0) + (0.20 if has_overlay else 0.0) + min(0.15, dang_count * 0.05)
        return min(1.0, max(0.0, score))
