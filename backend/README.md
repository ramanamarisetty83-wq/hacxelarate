# Digital Risk Protection Platform (DRPP) - Backend & ML Engine

## Tech Stack
- Python 3.10+
- FastAPI & Pydantic v2
- SQLite & SQLAlchemy ORM
- Scikit-learn, Joblib, NumPy, Pandas
- Uvicorn ASGI

## Installation
```bash
cd backend
pip install -r requirements.txt
```

## Running Backend
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive Swagger API docs available at:
`http://localhost:8000/docs`

## Training ML Pipelines
```bash
python -m ml.model_1_social.train
python -m ml.model_2_text.train
python -m ml.model_3_url.train
python -m ml.model_4_apk.train
```

## Seeded Scenario
Pre-seeded for **ApexPay** enterprise fintech impersonation campaign (Storm-0842).
Correlates:
- Fake support profile: `@ApexPay_Support247`
- Credential harvest URL: `https://apexpay-security-verify.cc`
- Sideloaded trojan: `ApexPay_2FA_Authenticator.apk`
