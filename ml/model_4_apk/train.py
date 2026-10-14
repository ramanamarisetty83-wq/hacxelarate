import os
import joblib
import numpy as np
from ml.model_4_apk.model import build_apk_model

# Demo training dataset (clearly labeled as demo training)
# Features: [pkg_typosquat_flag, total_permissions, dangerous_permissions, has_sms_perm, has_overlay_perm, has_install_perm, is_untrusted_cert]
X_train = np.array([
    # Rogue / Trojanized APKs (Label 1)
    [1, 14, 5, 1, 1, 1, 1],
    [1, 12, 4, 1, 1, 0, 1],
    [1, 18, 6, 1, 1, 1, 1],
    [0, 22, 5, 1, 1, 1, 1],
    # Legitimate Banking / Utility APKs (Label 0)
    [0, 6, 1, 0, 0, 0, 0],
    [0, 8, 1, 0, 0, 0, 0],
    [0, 5, 0, 0, 0, 0, 0],
    [0, 10, 1, 0, 0, 0, 0],
])
y_train = np.array([1, 1, 1, 1, 0, 0, 0, 0])

def train_and_save():
    model = build_apk_model()
    model.fit(X_train, y_train)
    os.makedirs("backend/models", exist_ok=True)
    joblib.dump(model, "backend/models/model_suspicious_apk.joblib")
    print("Model 4 (APK Detection) trained and saved to backend/models/model_suspicious_apk.joblib")

if __name__ == "__main__":
    train_and_save()
