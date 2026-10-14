import os
import joblib
import numpy as np
from ml.model_3_url.model import build_url_model

# Demo training dataset (clearly labeled as demo training)
# Features: [url_length, num_dots, num_hyphens, is_https, is_suspicious_tld, has_brand_typosquat, has_phish_keyword]
X_train = np.array([
    # Phishing / Malicious URLs (Label 1)
    [48, 3, 3, 1, 1, 1, 1],
    [54, 2, 4, 0, 1, 1, 1],
    [62, 4, 2, 1, 1, 1, 1],
    [38, 2, 2, 0, 1, 1, 0],
    # Legitimate URLs (Label 0)
    [17, 1, 0, 1, 0, 0, 0],
    [24, 1, 0, 1, 0, 0, 0],
    [32, 2, 0, 1, 0, 0, 0],
    [28, 1, 1, 1, 0, 0, 0],
])
y_train = np.array([1, 1, 1, 1, 0, 0, 0, 0])

def train_and_save():
    model = build_url_model()
    model.fit(X_train, y_train)
    os.makedirs("backend/models", exist_ok=True)
    joblib.dump(model, "backend/models/model_phishing_url.joblib")
    print("Model 3 (URL Detection) trained and saved to backend/models/model_phishing_url.joblib")

if __name__ == "__main__":
    train_and_save()
