from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# -------------------------------------------------------------
# Brand Schemas
# -------------------------------------------------------------
class SocialHandles(BaseModel):
    twitter: Optional[str] = None
    instagram: Optional[str] = None
    facebook: Optional[str] = None
    linkedin: Optional[str] = None
    telegram: Optional[str] = None

class BrandRegisterRequest(BaseModel):
    brand_name: str
    official_website: str
    official_social_handles: Optional[SocialHandles] = None
    official_logo: Optional[str] = None
    official_app_package: Optional[str] = "com.apexpay.wallet"
    security_contact: Optional[str] = "security-abuse@apexpay.io"

class BrandResponse(BrandRegisterRequest):
    id: str
    created_at: str

# -------------------------------------------------------------
# Analysis Input Schemas
# -------------------------------------------------------------
class SocialProfileInput(BaseModel):
    username: str
    display_name: str
    bio: str
    followers: int = 0
    following: int = 0
    post_count: int = 0
    account_age_days: int = 365
    verified: bool = False
    external_url: Optional[str] = None
    profile_image_url: Optional[str] = None
    target_brand: Optional[str] = "ApexPay"

class ScamContentInput(BaseModel):
    text: str
    url: Optional[str] = None
    channel: Optional[str] = "Social Feed"
    target_brand: Optional[str] = "ApexPay"

class UrlInput(BaseModel):
    url: str
    target_brand: Optional[str] = "ApexPay"

class AppInput(BaseModel):
    app_name: str
    package_name: str
    developer_name: Optional[str] = None
    permissions: List[str] = []
    target_brand: Optional[str] = "ApexPay"
    extracted_urls: List[str] = []

# -------------------------------------------------------------
# Threat Response & Incident Model
# -------------------------------------------------------------
class RelatedThreatResponse(BaseModel):
    id: str
    entity: str
    threat_type: str
    relationship: str
    risk_score: int

class ThreatResponse(BaseModel):
    id: str
    threat_type: str
    entity: str
    target_brand: str
    risk_score: int
    risk_level: str  # LOW | MEDIUM | HIGH | CRITICAL
    confidence: int
    reasons: List[str] = []
    recommendations: List[str] = []
    related_threats: List[RelatedThreatResponse] = []
    status: str = "ACTIVE"
    campaign_id: Optional[str] = None
    campaign_name: Optional[str] = None
    evidence: Optional[Dict[str, Any]] = None
    created_at: str

class ThreatStatusUpdate(BaseModel):
    status: str
    feedback: Optional[str] = None

# -------------------------------------------------------------
# Campaign & Graph Models
# -------------------------------------------------------------
class CampaignNode(BaseModel):
    id: str
    type: str  # BRAND | SOCIAL | URL | APP
    label: str
    sublabel: str
    threat_id: Optional[str] = None
    risk_score: int
    risk_level: str
    status: str
    x: int
    y: int

class CampaignEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str
    relationship_type: str

class CampaignResponse(BaseModel):
    id: str
    name: str
    threat_actor: str
    target_brand: str
    status: str
    severity: str
    total_threats: int
    discovered_at: str
    description: str
    attack_narrative: str
    nodes: List[CampaignNode]
    edges: List[CampaignEdge]

# -------------------------------------------------------------
# Dashboard & Reports
# -------------------------------------------------------------
class DashboardTrendPoint(BaseModel):
    date: str
    critical: int
    high: int
    medium: int
    low: int
    total: int

class ThreatDistributionPoint(BaseModel):
    name: str
    count: int
    color: str

class DashboardResponse(BaseModel):
    total_threats: int
    critical_threats: int
    high_threats: int
    medium_threats: int
    low_threats: int
    social_threats: int
    suspicious_apps: int
    suspicious_urls: int
    scam_content_threats: int
    takedowns_active: int
    resolved_threats: int
    average_risk_score: int
    recent_incidents: List[ThreatResponse]
    risk_trend: List[DashboardTrendPoint]
    threat_distribution: List[ThreatDistributionPoint]

class ReportRequest(BaseModel):
    period: Optional[str] = "Last 30 Days"
    includeTakedowns: Optional[bool] = True

class ReportSummary(BaseModel):
    total_incidents: int
    critical_risk_incidents: int
    active_campaigns: int
    takedowns_executed: int
    mean_time_to_detect_hours: float

class ReportResponse(BaseModel):
    report_id: str
    generated_at: str
    brand_name: str
    reporting_period: str
    summary: ReportSummary
    threat_breakdown: Dict[str, int]
    executive_narrative: str
    top_incidents: List[ThreatResponse]
    recommended_security_postures: List[str]
