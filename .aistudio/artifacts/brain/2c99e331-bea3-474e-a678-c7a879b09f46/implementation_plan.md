# Digital Risk Protection Platform (DRPP)

A multi-vector brand protection and cyber fraud defense platform that detects, explains, correlates, and neutralizes fake profiles, credential-harvesting phishing URLs, scam social content, and malicious mobile apps (APKs) targeting enterprise brands.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural parameters have been established based on your selections:

- **Deployment Architecture**: React frontend running with a resilient API client service layer that communicates with the REST backend (`VITE_API_URL`) with an automatic, zero-latency local fallback mock engine. Standalone production-grade Python FastAPI backend and scikit-learn/joblib ML training pipelines are provided in `/backend` and `/ml` directories.
- **Demo Seed Profile**: **ApexPay** (High-profile FinTech and digital banking entity subject to an active multi-stage credential theft and trojanized APK attack campaign).
- **Campaign Graph Presentation**: Interactive Node Graph (Brand -> Impersonation Profiles -> Phishing Domains -> Trojanized Mobile Apps) featuring visual node statuses, animated edge correlation lines, pan/zoom canvas, and an interactive drilldown side drawer showing entity telemetry, risk breakdown, and one-click takedown actions.

---

### 1. Overview & Core Concept

- **What It Does**: Digital Risk Protection Platform (DRPP) empowers Brand Trust & Safety and SOC teams to proactively discover and dismantle unauthorized digital brand assets. Instead of treating phishing links, fake social handles, scam campaigns, and rogue mobile APKs as disjointed alerts, DRPP continuously ingests entity signals, calculates an explainable risk score (0–100), and correlates them into unified **Attack Campaigns**.
- **Target Audience / Persona**: Information Security Officers (CISOs), Brand Protection Analysts, Fraud Operations Teams, and Threat Intelligence Engineers defending fintech, banking, and SaaS brands.
- **Key Value**:
  1. **Detect**: Multi-channel analysis across social profiles, content, URLs, and static APK attributes.
  2. **Explain**: Transparent reason attribution (e.g. "Levenshtein distance 0.91 on ApexPay username", "Urgency scam NLP score 0.88", "Dangerous SMS read permission").
  3. **Prioritize**: 0–100 risk score mapped to actionable severity (Low, Medium, High, Critical).
  4. **Connect**: Graph-based correlation exposing entire threat syndicates.
  5. **Recommend**: Concrete remediation (Takedown request generation, registrar abuse dispatch, Google Play / APK mirror DMCA, domain sinkholing).

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Authentication & Session**: Clean login view with demo quick-login credentials (analyst role) and instant state hydration.
2. **Executive & Operational Dashboard**:
   - High-level KPIs: Total Threats, Critical/High/Medium/Low counts, Social vs App vs URL threat split.
   - 30-Day Risk & Incident Trend area chart (Recharts) and Threat Vector Distribution breakdown.
   - Recent Incident table with quick triage filters (Status, Severity, Channel) and one-click drilldown into Threat Details.
3. **Brand Profile Setup (`/brand-setup`)**:
   - Register or inspect brand identity parameters: Brand name (`ApexPay`), official domains, official verified social handles (`@ApexPayOfficial`), official logo, and security contacts.
4. **Multi-Vector Threat Ingestion & On-Demand Analyzers**:
   - **Social Monitoring (`/social-monitoring`)**: Live profile analyzer (username, display name, bio, follower ratio, verified badge) and scam content analyzer (phishing text, OTP requests, fake giveaways).
   - **App Monitoring (`/app-monitoring`)**: Safe static APK inspector (package name, developer certificate, dangerous permissions, extracted URLs, impersonated assets) without executing binaries.
   - **URL Monitoring (`/url-monitoring`)**: Phishing URL heuristic analyzer (length, entropy, brand typo-squatting, suspicious TLDs, shortened URLs).
5. **Threat Details (`/threats/:id`)**:
   - Deep-dive entity header with explainable risk score ring (0–100).
   - Confidence metric, detection reason timeline, evidence panel (raw JSON/headers, screenshot simulation, lexical breakdown).
   - Recommended actions & takedown workflow, false-positive feedback trigger, and linked campaign view.
6. **Campaign Graph Exploration (`/campaigns`)**:
   - Node-edge canvas connecting Brand -> Fake Social Accounts -> Phishing URLs -> Malicious Android Apps.
   - Selection triggers an animated side drawer with threat timeline, IOC export, and coordinated takedown generator.
7. **Incident Reporting & Export (`/reports`)**:
   - Filterable executive threat reports, exportable PDF/HTML/JSON executive briefing, and backend report generation trigger (`POST /api/reports/generate`).

#### Visual Identity & Theme
- **Aesthetic Direction**: High-trust, dark-mode cybersecurity command center with crisp tabular alignment, subtle borders, and intentional accent contrast.
- **Color Palette & Discipline**:
  - Neutral Canvas (60%): Deep obsidian slate (`#0B0F19`, `#0F172A`).
  - Structural Surfaces (30%): Elevated dark card surfaces (`#1E293B` / `bg-slate-900/80`), hairline borders (`border-slate-800`), clean typography (`text-slate-100`, `text-slate-400`).
  - Accent Budget (10%): High-intent severity tokens:
    - Critical: Crimson / Rose (`#F43F5E`)
    - High: Vivid Amber (`#F59E0B`)
    - Medium: Electric Cyan / Sky (`#0EA5E9`)
    - Low / Nominal: Emerald (`#10B981`)
- **Typography & Tabular Discipline**:
  - Primary UI & Headers: `Plus Jakarta Sans` / `Outfit` neo-grotesque sans.
  - Metrics, Timestamps, Hashes & IOCs: `JetBrains Mono` / `tabular-nums` for rock-solid tabular vertical alignment.
  - Zero-Pill Enforcement: Metadata displayed with typographic separators (`·` or `/`) instead of clunky pill capsules; buttons styled as clean interactive controls.
- **Top Bar & Workspace Structure**:
  - Full-height sidebar navigation (250px) with clean icon + label nav items and brand switcher.
  - Top bar following the 3-zone contract: Contextual breadcrumbs (`Dashboard / Threats / TH-8021`), quick demo brand switcher, and primary action ("Trigger Brand Scan").

---

### 3. Key Product Decisions & Trade-Offs

- **Hybrid Resilience Architecture**: The frontend uses an Axios-based API client layer configured with `VITE_API_URL` (defaulting to `http://localhost:8000`). If the FastAPI backend is running, real network requests are executed; if the backend is offline or starting up, the service immediately falls back to high-fidelity in-memory demo data with clear visual indicators so that judges and reviewers can test all 9 pages and analyzers without encountering network errors or white screens.
- **Safe Static APK Analysis**: In accordance with cybersecurity best practices, mobile app inspection is strictly static: APK metadata (manifest permissions, package name typosquatting, extracted domain strings) is parsed without ever executing untrusted binaries.
- **Multi-Signal Risk Aggregator**: The risk engine aggregates 4 distinct signal pipelines (Lexical/Levenshtein similarity, TF-IDF NLP scam score, URL structural entropy, and Android permission risk weights) into a normalized 0–100 integer with clear categorization (0-39 Low, 40-59 Medium, 60-79 High, 80-100 Critical).
- **Interactive Campaign Graph**: Built as a responsive interactive graph canvas with custom SVG and CSS transformation rendering (nodes, directed bezier curves, status rings, interactive selection) alongside React Flow compatibility, avoiding heavy external bundle crashes while delivering fluid pan, zoom, and instant node inspection.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DRPP APPLICATION ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────────────┘

 ┌───────────────────────────────────────────────────────────────────────────────┐
 │                            REACT FRONTEND (Vite + TS)                         │
 │                                                                               │
 │  ┌─────────────────────────────────────────────────────────────────────────┐  │
 │  │ Navigation & Layout: Sidebar (250px) + Top Header (Breadcrumb & Action) │  │
 │  └──────────────────────────────────┬──────────────────────────────────────┘  │
 │                                     │                                         │
 │  ┌──────────────────────────────────▼──────────────────────────────────────┐  │
 │  │ Views & Routers:                                                        │  │
 │  │  • /dashboard          • /brand-setup          • /social-monitoring     │  │
 │  │  • /app-monitoring     • /url-monitoring       • /threats/:id           │  │
 │  │  • /campaigns          • /reports              • /login                 │  │
 │  └──────────────────────────────────┬──────────────────────────────────────┘  │
 │                                     │                                         │
 │  ┌──────────────────────────────────▼──────────────────────────────────────┐  │
 │  │ API Service Layer (src/services/api.ts)                                 │  │
 │  │  • Axios Client (VITE_API_URL || fallback)                              │  │
 │  │  • Graceful Demo Mode Engine & Seed Storage                             │  │
 │  └───────────────────┬───────────────────────────────────┬─────────────────┘  │
 └──────────────────────┼───────────────────────────────────┼────────────────────┘
                        │ Real HTTP (when backend active)   │ Local Demo Mode
                        ▼                                   ▼
 ┌───────────────────────────────────────────┐  ┌────────────────────────────────┐
 │       PYTHON FASTAPI BACKEND (/backend)   │  │   IN-MEMORY DEMO ENGINE        │
 │  • main.py (FastAPI App + CORS + Routers) │  │   • ApexPay Seed Dataset       │
 │  • schemas.py (Pydantic Models)           │  │   • Live Threat Storage        │
 │  • database.py (SQLAlchemy SQLite)        │  │   • Immediate Client-Side Risk │
 │  • risk_engine.py (Signal Aggregator)     │  │     Calculation & Reasoning    │
 └──────────────────────┬────────────────────┘  └────────────────────────────────┘
                        │ Inference
                        ▼
 ┌───────────────────────────────────────────┐
 │          ML PIPELINES (/ml)               │
 │  • Model 1: Social Profile (RF/Similarity)│
 │  • Model 2: Scam NLP (TF-IDF + LogReg)    │
 │  • Model 3: Suspicious URL (Feature Extr) │
 │  • Model 4: Static APK Permission Risk    │
 └───────────────────────────────────────────┘
```

#### Core Data Entities
- **Brand**: `id`, `name`, `official_website`, `official_handles`, `logo_url`, `created_at`.
- **Threat**: `id`, `threat_type` (`SOCIAL_IMPERSONATION`, `SCAM_CONTENT`, `PHISHING_URL`, `ROGUE_APP`), `entity_name`, `target_brand`, `risk_score` (0-100), `risk_level` (`LOW` | `MEDIUM` | `HIGH` | `CRITICAL`), `confidence`, `reasons[]`, `recommendations[]`, `evidence`, `status` (`ACTIVE`, `INVESTIGATING`, `TAKEDOWN_REQUESTED`, `RESOLVED`, `FALSE_POSITIVE`), `created_at`.
- **Campaign**: `id`, `name`, `target_brand`, `threat_actor`, `nodes[]`, `edges[]`, `status`, `impact_score`.

---

### Implementation Sequence
1. **Package Management**: Install required dependencies (`axios`, `react-router-dom`, `recharts`).
2. **Types & Data Layer**: Build comprehensive TypeScript definitions (`src/types/threat.ts`) and realistic ApexPay seed fixtures.
3. **API & Service Layer**: Implement `src/services/api.ts` with Axios, environment-driven endpoints, error handling, and robust demo fallback.
4. **Reusable UI Components**:
   - `Navbar` & `Sidebar` (WCAG-compliant navigation, single-line labels).
   - `StatCard`, `RiskScore` (circular and bar score visuals), `RiskBadge`, `ThreatTable`.
   - `EvidencePanel`, `CampaignGraph` (with interactive drilldown drawer), `LoadingSpinner`.
5. **Page Implementations**:
   - `DashboardView`: KPI stats, distribution charts, trend graph, recent incidents.
   - `BrandSetupView`: Brand identity configuration, monitored assets, and discovery rules.
   - `SocialMonitoringView`: Live profile audit and scam text NLP evaluation.
   - `AppMonitoringView`: Static APK permission inspection and package similarity analyzer.
   - `UrlMonitoringView`: URL structure, brand typo-squatting, and entropy analyzer.
   - `ThreatDetailsView`: Deep evidence forensics, reason explanation, takedown triggers.
   - `CampaignView`: Correlated multi-vector attack graph with node inspector drawer.
   - `ReportsView`: Executive summary, incident timeline, PDF/JSON export generation.
   - `LoginView`: Clean security portal with quick analyst sign-in.
6. **Backend & ML Pipeline Files**:
   - `/backend`: FastAPI `main.py`, `schemas.py`, `database.py`, `risk_engine.py`, `requirements.txt`.
   - `/ml`: Model training scripts and predictors for all 4 detection pipelines.
7. **Verification**: Run `compile_applet`, verify all routes, interactive handlers, and error states.
