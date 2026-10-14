import json
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime
from backend.database import Base

class BrandORM(Base):
    __tablename__ = "brands"

    id = Column(String, primary_key=True, index=True)
    brand_name = Column(String, nullable=False)
    official_website = Column(String, nullable=False)
    official_social_handles = Column(Text, default="{}")
    official_logo = Column(String, nullable=True)
    official_app_package = Column(String, default="com.apexpay.wallet")
    security_contact = Column(String, default="security-abuse@apexpay.io")
    created_at = Column(DateTime, default=datetime.utcnow)

class ThreatORM(Base):
    __tablename__ = "threats"

    id = Column(String, primary_key=True, index=True)
    threat_type = Column(String, index=True)
    entity = Column(String, nullable=False)
    target_brand = Column(String, default="ApexPay")
    risk_score = Column(Integer, nullable=False)
    risk_level = Column(String, nullable=False)
    confidence = Column(Integer, default=90)
    reasons = Column(Text, default="[]")  # JSON serialized list
    recommendations = Column(Text, default="[]")  # JSON serialized list
    related_threats = Column(Text, default="[]")  # JSON serialized list
    status = Column(String, default="ACTIVE")
    campaign_id = Column(String, nullable=True)
    campaign_name = Column(String, nullable=True)
    evidence = Column(Text, default="{}")  # JSON serialized dict
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
