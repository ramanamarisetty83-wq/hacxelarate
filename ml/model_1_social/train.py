import os
import joblib
import numpy as np
from ml.model_1_social.model import build_social_model

# Synthetic demo training dataset (clearly labeled as demo training)
# Features: [username_sim, display_name_sim, bio_sim, followers, following, post_count, account_age_days, verified, has_external_url]
X_train = np.array([
    # High-Risk Impersonators (Label 1)
    [0.92, 0.88, 0.80, 12, 1400, 4, 3, 0, 1],
    [0.85, 0.90, 0.75, 45, 980, 8, 7, 0, 1],
    [0.78, 0.65, 0.70, 8, 650, 2, 2, 0, 1],
    [0.95, 0.95, 0.85, 20, 2100, 3, 5, 0, 1],
    # Legitimate / Official accounts (Label 0)
    [1.00, 1.00, 1.00, 500000, 120, 1500, 1800, 1, 1],
    [0.10, 0.15, 0.05, 340, 420, 80, 600, 0, 0],
    [0.20, 0.25, 0.10, 1200, 300, 450, 900, 0, 1],
    [0.05, 0.08, 0.02, 85, 110, 40, 450, 0, 0],
])
y_train = np.array([1, 1, 1, 1, 0, 0, 0, 0])

def train_and_save():
    model = build_social_model()
    model.fit(X_train, y_train)
    os.makedirs("backend/models", exist_ok=True)
    joblib.dump(model, "backend/models/model_social_profile.joblib")
    print("Model 1 (Social Profile Detection) trained and saved to backend/models/model_social_profile.joblib")

if __name__ == "__main__":
    train_and_save()
