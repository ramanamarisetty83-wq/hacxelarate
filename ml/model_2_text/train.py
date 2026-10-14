import os
import joblib
from ml.model_2_text.model import build_text_model

# Demo training corpus (clearly labeled as demo training)
texts = [
    "URGENT: Submit your OTP code immediately to avoid wallet freeze",
    "ApexPay Anniversary Airdrop! Claim your free 500 bonus now",
    "Account suspended. Click here to verify your credentials within 15 minutes",
    "Send your private seed phrase to customer support to recover pending funds",
    "Exclusive giveaway: send 0.1 ETH and get 1.0 ETH bonus back immediately",
    "Welcome to ApexPay! Here is our weekly engineering newsletter.",
    "Your standard monthly account statement is now available in the portal.",
    "Thanks for reaching out. Please check our official documentation at apexpay.io",
    "Scheduled server maintenance will occur this Sunday from 2 AM to 3 AM UTC.",
    "How do I update my registered billing address in the mobile app?",
]
labels = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0]

def train_and_save():
    model = build_text_model()
    model.fit(texts, labels)
    os.makedirs("backend/models", exist_ok=True)
    joblib.dump(model, "backend/models/model_scam_text.joblib")
    print("Model 2 (Scam Text Detection) trained and saved to backend/models/model_scam_text.joblib")

if __name__ == "__main__":
    train_and_save()
