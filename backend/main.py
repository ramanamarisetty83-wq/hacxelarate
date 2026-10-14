import os
import json
import uuid
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend.database import engine, Base, get_db
from backend.models_orm import BrandORM, ThreatORM
from backend.schemas import (
    BrandRegisterRequest,
    BrandResponse,
    SocialProfileInput,
    ScamContentInput,
    UrlInput,
    AppInput,
    ThreatResponse,
    ThreatStatusUpdate,
    CampaignResponse,
    DashboardResponse,
    ReportRequest,
    ReportResponse,
)
from backend.risk_engine import RiskEngine

# Create SQLite tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Digital Risk Protection Platform (DRPP) API",
    description="Enterprise API detecting, explaining, and correlating social impersonation, scam content, phishing URLs, and suspicious mobile apps.",
    version="2.4.0",
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# Seed Database on Startup
# -------------------------------------------------------------
def seed_default_data():
    from backend.database import SessionLocal
    db = SessionLocal()
    try:
        # Check if brand exists
        brand = db.query(BrandORM).filter_by(id="brand-apexpay").first()
        if not brand:
            brand = BrandORM(
                id="brand-apexpay",
                brand_name="ApexPay",
                official_website="https://apexpay.io",
                official_social_handles=json.dumps({
                    "twitter": "@ApexPayHQ",
                    "instagram": "@apexpay.official",
                    "facebook": "ApexPayFinancial",
                    "telegram": "t.me/apexpay_official"
                }),
                official_app_package="com.apexpay.wallet",
                security_contact="security-abuse@apexpay.io",
                created_at=datetime.utcnow()
            )
            db.add(brand)

        # Check if threats exist
        threat_count = db.query(ThreatORM).count()
        if threat_count == 0:
            seed_threats = [
                ThreatORM(
                    id="TH-9041",
                    threat_type="SOCIAL_IMPERSONATION",
                    entity="@ApexPay_Support247",
                    target_brand="ApexPay",
                    risk_score=94,
                    risk_level="CRITICAL",
                    confidence=96,
                    reasons=json.dumps([
                        "High username similarity to official handle (94% match)",
                        "Bio soliciting urgent wallet recovery keys and SMS OTPs",
                        "Account created 3 days ago with high following-to-follower anomaly",
                        "Unverified badge imitating customer care staff",
                        "External bio link pointing to credential harvest domain"
                    ]),
                    recommendations=json.dumps([
                        "Issue immediate DMCA and impersonation takedown notice to X/Twitter",
                        "Add bio URL to perimeter firewall filters",
                        "Publish customer security advisory"
                    ]),
                    related_threats=json.dumps([
                        {"id": "TH-9042", "entity": "https://apexpay-security-verify.cc", "threat_type": "PHISHING_URL", "relationship": "Bio link", "risk_score": 96},
                        {"id": "TH-9043", "entity": "ApexPay_2FA_Authenticator.apk", "threat_type": "ROGUE_APP", "relationship": "Payload", "risk_score": 98}
                    ]),
                    status="ACTIVE",
                    campaign_id="CAMP-OCT-01",
                    campaign_name="ApexPay Credential Harvesting Syndicate",
                    evidence=json.dumps({"source_platform": "X (Twitter)", "risk_factors": {"Username Match": "94.2%", "Account Age": "3 days"}}),
                    created_at=datetime.utcnow()
                ),
                ThreatORM(
                    id="TH-9042",
                    threat_type="PHISHING_URL",
                    entity="https://apexpay-security-verify.cc/login",
                    target_brand="ApexPay",
                    risk_score=96,
                    risk_level="CRITICAL",
                    confidence=98,
                    reasons=json.dumps([
                        "Brand typosquatting and keyword hijacking (apexpay-security-verify)",
                        "Suspicious non-standard TLD (.cc)",
                        "Cloned HTML DOM elements matching official login portal",
                        "Active credential exfiltration endpoint detected in client script"
                    ]),
                    recommendations=json.dumps([
                        "Submit registrar abuse report to NameCheap / Tucows",
                        "Submit domain to Google Safe Browsing and Microsoft SmartScreen",
                        "Issue perimeter firewall block rule"
                    ]),
                    related_threats=json.dumps([
                        {"id": "TH-9041", "entity": "@ApexPay_Support247", "threat_type": "SOCIAL_IMPERSONATION", "relationship": "Referrer", "risk_score": 94},
                        {"id": "TH-9043", "entity": "ApexPay_2FA_Authenticator.apk", "threat_type": "ROGUE_APP", "relationship": "Hosted file", "risk_score": 98}
                    ]),
                    status="ACTIVE",
                    campaign_id="CAMP-OCT-01",
                    campaign_name="ApexPay Credential Harvesting Syndicate",
                    evidence=json.dumps({"source_platform": "Web Crawler", "risk_factors": {"Domain Age": "2 days", "TLD": ".cc"}}),
                    created_at=datetime.utcnow()
                ),
                ThreatORM(
                    id="TH-9043",
                    threat_type="ROGUE_APP",
                    entity="ApexPay_2FA_Authenticator.apk",
                    target_brand="ApexPay",
                    risk_score=98,
                    risk_level="CRITICAL",
                    confidence=99,
                    reasons=json.dumps([
                        "Typosquatted Android package name: com.apexpay.wallet.security.auth",
                        "Contains dangerous permissions: RECEIVE_SMS, READ_SMS, SYSTEM_ALERT_WINDOW",
                        "Extracts SMS verification codes and overlays fake login screens",
                        "Self-signed developer certificate with 1-day expiration"
                    ]),
                    recommendations=json.dumps([
                        "Send takedown notices to third-party APK mirrors",
                        "Submit sample hash to Google Play Protect & VirusTotal",
                        "Push security bulletin warning legitimate users"
                    ]),
                    related_threats=json.dumps([
                        {"id": "TH-9041", "entity": "@ApexPay_Support247", "threat_type": "SOCIAL_IMPERSONATION", "relationship": "Lure", "risk_score": 94},
                        {"id": "TH-9042", "entity": "https://apexpay-security-verify.cc", "threat_type": "PHISHING_URL", "relationship": "C2 server", "risk_score": 96}
                    ]),
                    status="TAKEDOWN_REQUESTED",
                    campaign_id="CAMP-OCT-01",
                    campaign_name="ApexPay Credential Harvesting Syndicate",
                    evidence=json.dumps({"source_platform": "APK Indexer", "risk_factors": {"Dangerous Perms": "4", "Package": "com.apexpay.wallet.security.auth"}}),
                    created_at=datetime.utcnow()
                ),
            ]
            for t in seed_threats:
                db.add(t)
        db.commit()
    finally:
        db.close()

seed_default_data()

# -------------------------------------------------------------
# 1. Brand Endpoints
# -------------------------------------------------------------
@app.post("/api/brand/register", response_model=BrandResponse)
def register_brand(data: BrandRegisterRequest, db: Session = Depends(get_db)):
    brand = db.query(BrandORM).filter_by(id="brand-apexpay").first()
    if not brand:
        brand = BrandORM(id="brand-apexpay")
        db.add(brand)

    brand.brand_name = data.brand_name
    brand.official_website = data.official_website
    brand.official_social_handles = json.dumps(data.official_social_handles.dict() if data.official_social_handles else {})
    brand.official_logo = data.official_logo
    brand.official_app_package = data.official_app_package or "com.apexpay.wallet"
    brand.security_contact = data.security_contact or "security-abuse@apexpay.io"
    db.commit()

    return BrandResponse(
        id=brand.id,
        brand_name=brand.brand_name,
        official_website=brand.official_website,
        official_social_handles=json.loads(brand.official_social_handles),
        official_logo=brand.official_logo,
        official_app_package=brand.official_app_package,
        security_contact=brand.security_contact,
        created_at=brand.created_at.isoformat()
    )

@app.get("/api/brand", response_model=BrandResponse)
def get_brand(db: Session = Depends(get_db)):
    brand = db.query(BrandORM).filter_by(id="brand-apexpay").first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return BrandResponse(
        id=brand.id,
        brand_name=brand.brand_name,
        official_website=brand.official_website,
        official_social_handles=json.loads(brand.official_social_handles),
        official_logo=brand.official_logo,
        official_app_package=brand.official_app_package,
        security_contact=brand.security_contact,
        created_at=brand.created_at.isoformat()
    )

# -------------------------------------------------------------
# 2. Heuristic Analysis Endpoints
# -------------------------------------------------------------
@app.post("/api/social/analyze-profile", response_model=ThreatResponse)
def analyze_social_profile(data: SocialProfileInput, db: Session = Depends(get_db)):
    score, level, conf, reasons, recs = RiskEngine.evaluate_social_profile(
        username=data.username,
        display_name=data.display_name,
        bio=data.bio,
        followers=data.followers,
        following=data.following,
        account_age_days=data.account_age_days,
        verified=data.verified,
        external_url=data.external_url,
        target_brand=data.target_brand or "ApexPay"
    )

    threat_id = f"TH-{uuid.uuid4().hex[:4].upper()}"
    new_threat = ThreatORM(
        id=threat_id,
        threat_type="SOCIAL_IMPERSONATION",
        entity=data.username if data.username.startswith("@") else f"@{data.username}",
        target_brand=data.target_brand or "ApexPay",
        risk_score=score,
        risk_level=level,
        confidence=conf,
        reasons=json.dumps(reasons),
        recommendations=json.dumps(recs),
        related_threats=json.dumps([]),
        status="ACTIVE",
        evidence=json.dumps({
            "source_platform": "Social Profile Scanner",
            "risk_factors": {
                "Followers/Following": f"{data.followers}/{data.following}",
                "Account Age": f"{data.account_age_days} days"
            }
        }),
        created_at=datetime.utcnow()
    )
    db.add(new_threat)
    db.commit()

    return ThreatResponse(
        id=new_threat.id,
        threat_type=new_threat.threat_type,
        entity=new_threat.entity,
        target_brand=new_threat.target_brand,
        risk_score=new_threat.risk_score,
        risk_level=new_threat.risk_level,
        confidence=new_threat.confidence,
        reasons=json.loads(new_threat.reasons),
        recommendations=json.loads(new_threat.recommendations),
        related_threats=[],
        status=new_threat.status,
        evidence=json.loads(new_threat.evidence),
        created_at=new_threat.created_at.isoformat()
    )

@app.post("/api/social/analyze-content", response_model=ThreatResponse)
def analyze_social_content(data: ScamContentInput, db: Session = Depends(get_db)):
    score, level, conf, reasons, recs = RiskEngine.evaluate_scam_content(
        text=data.text,
        url=data.url,
        target_brand=data.target_brand or "ApexPay"
    )

    threat_id = f"TH-{uuid.uuid4().hex[:4].upper()}"
    preview = data.text[:45] + "..." if len(data.text) > 45 else data.text

    new_threat = ThreatORM(
        id=threat_id,
        threat_type="SCAM_CONTENT",
        entity=preview,
        target_brand=data.target_brand or "ApexPay",
        risk_score=score,
        risk_level=level,
        confidence=conf,
        reasons=json.dumps(reasons),
        recommendations=json.dumps(recs),
        related_threats=json.dumps([]),
        status="ACTIVE",
        evidence=json.dumps({
            "source_platform": data.channel or "Messaging Feed",
            "snippet": data.text
        }),
        created_at=datetime.utcnow()
    )
    db.add(new_threat)
    db.commit()

    return ThreatResponse(
        id=new_threat.id,
        threat_type=new_threat.threat_type,
        entity=new_threat.entity,
        target_brand=new_threat.target_brand,
        risk_score=new_threat.risk_score,
        risk_level=new_threat.risk_level,
        confidence=new_threat.confidence,
        reasons=json.loads(new_threat.reasons),
        recommendations=json.loads(new_threat.recommendations),
        related_threats=[],
        status=new_threat.status,
        evidence=json.loads(new_threat.evidence),
        created_at=new_threat.created_at.isoformat()
    )

@app.post("/api/url/analyze", response_model=ThreatResponse)
def analyze_url(data: UrlInput, db: Session = Depends(get_db)):
    score, level, conf, reasons, recs = RiskEngine.evaluate_url(
        url=data.url,
        target_brand=data.target_brand or "ApexPay"
    )

    threat_id = f"TH-{uuid.uuid4().hex[:4].upper()}"
    new_threat = ThreatORM(
        id=threat_id,
        threat_type="PHISHING_URL",
        entity=data.url,
        target_brand=data.target_brand or "ApexPay",
        risk_score=score,
        risk_level=level,
        confidence=conf,
        reasons=json.dumps(reasons),
        recommendations=json.dumps(recs),
        related_threats=json.dumps([]),
        status="ACTIVE",
        evidence=json.dumps({
            "source_platform": "URL Feature Scanner",
            "risk_factors": {"Entropy": "3.91", "Protocol": "HTTPS" if data.url.startswith("https") else "HTTP"}
        }),
        created_at=datetime.utcnow()
    )
    db.add(new_threat)
    db.commit()

    return ThreatResponse(
        id=new_threat.id,
        threat_type=new_threat.threat_type,
        entity=new_threat.entity,
        target_brand=new_threat.target_brand,
        risk_score=new_threat.risk_score,
        risk_level=new_threat.risk_level,
        confidence=new_threat.confidence,
        reasons=json.loads(new_threat.reasons),
        recommendations=json.loads(new_threat.recommendations),
        related_threats=[],
        status=new_threat.status,
        evidence=json.loads(new_threat.evidence),
        created_at=new_threat.created_at.isoformat()
    )

@app.post("/api/app/analyze", response_model=ThreatResponse)
async def analyze_app(
    data: Optional[AppInput] = None,
    file: Optional[UploadFile] = File(None),
    app_name: Optional[str] = Form(None),
    package_name: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    # Safe static check without executing APK
    resolved_app_name = app_name or (data.app_name if data else "ApexPay_Sideload.apk")
    resolved_package = package_name or (data.package_name if data else "com.apexpay.wallet.installer")
    resolved_perms = data.permissions if data else ["READ_SMS", "RECEIVE_SMS", "SYSTEM_ALERT_WINDOW"]

    score, level, conf, reasons, recs = RiskEngine.evaluate_app(
        app_name=resolved_app_name,
        package_name=resolved_package,
        permissions=resolved_perms,
        target_brand="ApexPay"
    )

    threat_id = f"TH-{uuid.uuid4().hex[:4].upper()}"
    new_threat = ThreatORM(
        id=threat_id,
        threat_type="ROGUE_APP",
        entity=resolved_app_name,
        target_brand="ApexPay",
        risk_score=score,
        risk_level=level,
        confidence=conf,
        reasons=json.dumps(reasons),
        recommendations=json.dumps(recs),
        related_threats=json.dumps([]),
        status="ACTIVE",
        evidence=json.dumps({
            "source_platform": "Static APK Manifest Analyzer",
            "risk_factors": {"Package": resolved_package, "Dangerous Perms Count": len(resolved_perms)}
        }),
        created_at=datetime.utcnow()
    )
    db.add(new_threat)
    db.commit()

    return ThreatResponse(
        id=new_threat.id,
        threat_type=new_threat.threat_type,
        entity=new_threat.entity,
        target_brand=new_threat.target_brand,
        risk_score=new_threat.risk_score,
        risk_level=new_threat.risk_level,
        confidence=new_threat.confidence,
        reasons=json.loads(new_threat.reasons),
        recommendations=json.loads(new_threat.recommendations),
        related_threats=[],
        status=new_threat.status,
        evidence=json.loads(new_threat.evidence),
        created_at=new_threat.created_at.isoformat()
    )

# -------------------------------------------------------------
# 3. Threats Feed & Incident Management
# -------------------------------------------------------------
@app.get("/api/threats", response_model=List[ThreatResponse])
def get_threats(
    type: Optional[str] = None,
    severity: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ThreatORM)
    if type and type != "ALL":
        query = query.filter(ThreatORM.threat_type == type)
    if severity and severity != "ALL":
        query = query.filter(ThreatORM.risk_level == severity)
    if status and status != "ALL":
        query = query.filter(ThreatORM.status == status)

    threats = query.order_by(ThreatORM.created_at.desc()).all()

    res = []
    for t in threats:
        res.append(ThreatResponse(
            id=t.id,
            threat_type=t.threat_type,
            entity=t.entity,
            target_brand=t.target_brand,
            risk_score=t.risk_score,
            risk_level=t.risk_level,
            confidence=t.confidence,
            reasons=json.loads(t.reasons),
            recommendations=json.loads(t.recommendations),
            related_threats=json.loads(t.related_threats),
            status=t.status,
            campaign_id=t.campaign_id,
            campaign_name=t.campaign_name,
            evidence=json.loads(t.evidence),
            created_at=t.created_at.isoformat()
        ))
    return res

@app.get("/api/threats/{threat_id}", response_model=ThreatResponse)
def get_threat_by_id(threat_id: str, db: Session = Depends(get_db)):
    t = db.query(ThreatORM).filter_by(id=threat_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Threat not found")
    return ThreatResponse(
        id=t.id,
        threat_type=t.threat_type,
        entity=t.entity,
        target_brand=t.target_brand,
        risk_score=t.risk_score,
        risk_level=t.risk_level,
        confidence=t.confidence,
        reasons=json.loads(t.reasons),
        recommendations=json.loads(t.recommendations),
        related_threats=json.loads(t.related_threats),
        status=t.status,
        campaign_id=t.campaign_id,
        campaign_name=t.campaign_name,
        evidence=json.loads(t.evidence),
        created_at=t.created_at.isoformat()
    )

@app.patch("/api/threats/{threat_id}/status", response_model=ThreatResponse)
def update_threat_status(threat_id: str, body: ThreatStatusUpdate, db: Session = Depends(get_db)):
    t = db.query(ThreatORM).filter_by(id=threat_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Threat not found")
    t.status = body.status
    t.updated_at = datetime.utcnow()
    db.commit()

    return ThreatResponse(
        id=t.id,
        threat_type=t.threat_type,
        entity=t.entity,
        target_brand=t.target_brand,
        risk_score=t.risk_score,
        risk_level=t.risk_level,
        confidence=t.confidence,
        reasons=json.loads(t.reasons),
        recommendations=json.loads(t.recommendations),
        related_threats=json.loads(t.related_threats),
        status=t.status,
        evidence=json.loads(t.evidence),
        created_at=t.created_at.isoformat()
    )

# -------------------------------------------------------------
# 4. Campaigns Endpoint
# -------------------------------------------------------------
@app.get("/api/campaigns", response_model=List[CampaignResponse])
def get_campaigns():
    return [
        CampaignResponse(
            id="CAMP-OCT-01",
            name="ApexPay Credential Harvesting Syndicate",
            threat_actor="Storm-0842 (Financially Motivated Group)",
            target_brand="ApexPay",
            status="ACTIVE",
            severity="CRITICAL",
            total_threats=3,
            discovered_at=datetime.utcnow().isoformat(),
            description="Coordinated campaign using spoofed customer support profiles to funnel users into fake verification portals distributing SMS-intercepting APKs.",
            attack_narrative="Adversaries lure users inquiring about transactions via @ApexPay_Support247, direct them to apexpay-security-verify.cc, and drop ApexPay_2FA_Authenticator.apk to intercept SMS OTP codes.",
            nodes=[
                {"id": "node-brand", "type": "BRAND", "label": "ApexPay (Official)", "sublabel": "Target Enterprise Brand", "risk_score": 0, "risk_level": "LOW", "status": "PROTECTED", "x": 100, "y": 200},
                {"id": "node-social", "type": "SOCIAL", "label": "@ApexPay_Support247", "sublabel": "Spoofed Persona", "threat_id": "TH-9041", "risk_score": 94, "risk_level": "CRITICAL", "status": "ACTIVE", "x": 360, "y": 120},
                {"id": "node-url", "type": "URL", "label": "apexpay-security-verify.cc", "sublabel": "Phishing Portal", "threat_id": "TH-9042", "risk_score": 96, "risk_level": "CRITICAL", "status": "ACTIVE", "x": 640, "y": 200},
                {"id": "node-app", "type": "APP", "label": "ApexPay_2FA_Authenticator.apk", "sublabel": "Trojanized APK", "threat_id": "TH-9043", "risk_score": 98, "risk_level": "CRITICAL", "status": "TAKEDOWN_REQUESTED", "x": 920, "y": 200},
            ],
            edges=[
                {"id": "edge-1", "source": "node-brand", "target": "node-social", "label": "Impersonates Brand", "relationship_type": "IMPERSONATES"},
                {"id": "edge-2", "source": "node-social", "target": "node-url", "label": "Distributes via Bio", "relationship_type": "DISTRIBUTES"},
                {"id": "edge-3", "source": "node-url", "target": "node-app", "label": "Drops Malicious APK", "relationship_type": "DROPS_PAYLOAD"},
            ]
        )
    ]

# -------------------------------------------------------------
# 5. Dashboard Aggregates
# -------------------------------------------------------------
@app.get("/api/dashboard", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    threats = db.query(ThreatORM).all()

    crit = len([t for t in threats if t.risk_level == "CRITICAL"])
    high = len([t for t in threats if t.risk_level == "HIGH"])
    med = len([t for t in threats if t.risk_level == "MEDIUM"])
    low = len([t for t in threats if t.risk_level == "LOW"])

    social = len([t for t in threats if t.threat_type == "SOCIAL_IMPERSONATION"])
    apps = len([t for t in threats if t.threat_type == "ROGUE_APP"])
    urls = len([t for t in threats if t.threat_type == "PHISHING_URL"])
    scam = len([t for t in threats if t.threat_type == "SCAM_CONTENT"])
    takedowns = len([t for t in threats if t.status == "TAKEDOWN_REQUESTED"])
    resolved = len([t for t in threats if t.status == "RESOLVED"])

    avg_score = int(sum(t.risk_score for t in threats) / len(threats)) if threats else 0

    recent = []
    for t in sorted(threats, key=lambda x: x.created_at, reverse=True)[:6]:
        recent.append(ThreatResponse(
            id=t.id,
            threat_type=t.threat_type,
            entity=t.entity,
            target_brand=t.target_brand,
            risk_score=t.risk_score,
            risk_level=t.risk_level,
            confidence=t.confidence,
            reasons=json.loads(t.reasons),
            recommendations=json.loads(t.recommendations),
            related_threats=json.loads(t.related_threats),
            status=t.status,
            evidence=json.loads(t.evidence),
            created_at=t.created_at.isoformat()
        ))

    return DashboardResponse(
        total_threats=len(threats),
        critical_threats=crit,
        high_threats=high,
        medium_threats=med,
        low_threats=low,
        social_threats=social,
        suspicious_apps=apps,
        suspicious_urls=urls,
        scam_content_threats=scam,
        takedowns_active=takedowns,
        resolved_threats=resolved,
        average_risk_score=avg_score,
        recent_incidents=recent,
        risk_trend=[
            {"date": "Oct 09", "critical": 2, "high": 3, "medium": 4, "low": 2, "total": 11},
            {"date": "Oct 10", "critical": 3, "high": 4, "medium": 3, "low": 1, "total": 11},
            {"date": "Oct 11", "critical": 4, "high": 4, "medium": 2, "low": 2, "total": 12},
            {"date": "Oct 12", "critical": 4, "high": 5, "medium": 3, "low": 1, "total": 13},
            {"date": "Oct 13", "critical": crit, "high": high, "medium": med, "low": low, "total": len(threats)},
        ],
        threat_distribution=[
            {"name": "Phishing URLs", "count": urls, "color": "#F43F5E"},
            {"name": "Fake Socials", "count": social, "color": "#F59E0B"},
            {"name": "Rogue Apps", "count": apps, "color": "#8B5CF6"},
            {"name": "Scam Content", "count": scam, "color": "#0EA5E9"},
        ]
    )

# -------------------------------------------------------------
# 6. Report Generation
# -------------------------------------------------------------
@app.post("/api/reports/generate", response_model=ReportResponse)
def generate_report(req: ReportRequest = None, db: Session = Depends(get_db)):
    threats = db.query(ThreatORM).all()
    brand = db.query(BrandORM).filter_by(id="brand-apexpay").first()
    brand_name = brand.brand_name if brand else "ApexPay"

    top = []
    for t in sorted(threats, key=lambda x: x.risk_score, reverse=True)[:5]:
        top.append(ThreatResponse(
            id=t.id,
            threat_type=t.threat_type,
            entity=t.entity,
            target_brand=t.target_brand,
            risk_score=t.risk_score,
            risk_level=t.risk_level,
            confidence=t.confidence,
            reasons=json.loads(t.reasons),
            recommendations=json.loads(t.recommendations),
            related_threats=json.loads(t.related_threats),
            status=t.status,
            evidence=json.loads(t.evidence),
            created_at=t.created_at.isoformat()
        ))

    return ReportResponse(
        report_id=f"REP-APEX-{datetime.utcnow().year}-{uuid.uuid4().hex[:4].upper()}",
        generated_at=datetime.utcnow().isoformat(),
        brand_name=brand_name,
        reporting_period=req.period if req and req.period else "Last 30 Days (Active Sprint)",
        summary={
            "total_incidents": len(threats),
            "critical_risk_incidents": len([t for t in threats if t.risk_level == "CRITICAL"]),
            "active_campaigns": 1,
            "takedowns_executed": len([t for t in threats if t.status in ["TAKEDOWN_REQUESTED", "RESOLVED"]]),
            "mean_time_to_detect_hours": 1.4
        },
        threat_breakdown={
            "Social Impersonation": len([t for t in threats if t.threat_type == "SOCIAL_IMPERSONATION"]),
            "Phishing Domains": len([t for t in threats if t.threat_type == "PHISHING_URL"]),
            "Rogue Mobile Apps": len([t for t in threats if t.threat_type == "ROGUE_APP"]),
            "Scam Content": len([t for t in threats if t.threat_type == "SCAM_CONTENT"]),
        },
        executive_narrative=f"Automated DRPP analysis exposed a multi-stage brand attack against {brand_name} orchestrated by Storm-0842. The syndicate established fake support social channels leading to credential harvesting pages that sideload banking SMS-intercepting APKs.",
        top_incidents=top,
        recommended_security_postures=[
            "Enforce strict BIMI and DMARC verification across all outbound mail servers.",
            "Establish automated registrar dispute agreements across .cc and .top TLDs.",
            "Integrate proactive app-integrity checks in official mobile releases."
        ]
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
