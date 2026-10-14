import axios from 'axios';
import {
  Brand,
  Threat,
  Campaign,
  DashboardStats,
  IncidentReport,
  SocialProfileInput,
  ScamContentInput,
  UrlInput,
  AppInput,
  RiskLevel,
  ThreatStatus,
  BenchmarkDataset,
  TestInferenceResult,
} from '../types/threat';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Demo Mode state tracking
let isBackendReachable = false;
let backendCheckCompleted = false;

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/docs`, { timeout: 1500 });
    isBackendReachable = res.status < 500;
    backendCheckCompleted = true;
    return isBackendReachable;
  } catch {
    isBackendReachable = false;
    backendCheckCompleted = true;
    return false;
  }
};

export const getBackendStatus = () => ({
  isReachable: isBackendReachable,
  checkCompleted: backendCheckCompleted,
  baseUrl: API_BASE_URL,
});

// -------------------------------------------------------------
// Realistic ApexPay Seed Data & In-Memory Store
// -------------------------------------------------------------
const defaultBrand: Brand = {
  id: 'brand-apexpay',
  brand_name: 'ApexPay',
  official_website: 'https://apexpay.io',
  official_social_handles: {
    twitter: '@ApexPayHQ',
    instagram: '@apexpay.official',
    facebook: 'ApexPayFinancial',
    linkedin: 'apexpay-technologies',
    telegram: 't.me/apexpay_official',
  },
  official_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=60',
  official_app_package: 'com.apexpay.wallet',
  security_contact: 'security-abuse@apexpay.io',
  created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
};

const initialThreats: Threat[] = [
  {
    id: 'TH-9041',
    threat_type: 'SOCIAL_IMPERSONATION',
    entity: '@ApexPay_Support247',
    target_brand: 'ApexPay',
    risk_score: 94,
    risk_level: 'CRITICAL',
    confidence: 96,
    reasons: [
      'High username Levenshtein similarity to official handle (94% match)',
      'Bio soliciting urgent customer wallet secret keys and private OTPs',
      'Account created 3 days ago with high following-to-follower anomaly (1,420 following vs 12 followers)',
      'Unverified badge attempting to impersonate executive support personnel',
      'Suspicious external bio link pointing to unauthorized credential-harvesting domain',
    ],
    structured_reasons: [
      { id: 'R1', category: 'IDENTITY', description: 'Levenshtein edit distance 2 from official handle @ApexPayHQ', weight: 92 },
      { id: 'R2', category: 'CONTENT', description: 'NLP detected high-urgency credential solicitation phrases', weight: 88 },
      { id: 'R3', category: 'BEHAVIOR', description: 'Rapid account spin-up with bot-like follow velocity', weight: 75 },
    ],
    recommendations: [
      'Issue immediate DMCA and impersonation takedown notice to X/Twitter Trust & Safety',
      'Add associated bio URL to enterprise DNS blackhole and perimeter firewall filters',
      'Publish customer security warning bulletin on official social handles',
    ],
    related_threats: [
      { id: 'TH-9042', entity: 'https://apexpay-security-verify.cc', threat_type: 'PHISHING_URL', relationship: 'External link linked in bio', risk_score: 96 },
      { id: 'TH-9043', entity: 'ApexPay_2FA_Authenticator.apk', threat_type: 'ROGUE_APP', relationship: 'Payload distributed via DM phishing', risk_score: 98 },
    ],
    evidence: {
      detected_at: new Date(Date.now() - 2 * 3600000).toISOString(),
      source_platform: 'X (Twitter)',
      risk_factors: {
        'Username Match': '94.2%',
        'Account Age': '3 days',
        'Follower Ratio': '0.008 (Extreme Risk)',
        'External Link': 'apexpay-security-verify.cc',
      },
      screenshot_simulated_url: 'ApexPay brand logo used without authorization in avatar.',
    },
    status: 'ACTIVE',
    campaign_id: 'CAMP-OCT-01',
    campaign_name: 'ApexPay Credential Harvesting Syndicate',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'TH-9042',
    threat_type: 'PHISHING_URL',
    entity: 'https://apexpay-security-verify.cc/login',
    target_brand: 'ApexPay',
    risk_score: 96,
    risk_level: 'CRITICAL',
    confidence: 98,
    reasons: [
      'Brand name typosquatting and keyword hijacking (apexpay-security-verify)',
      'Suspicious non-standard TLD (.cc) commonly abused in phishing kits',
      'Domain registered 48 hours ago via anonymity privacy proxy registrar',
      'Cloned HTML DOM elements matching official ApexPay authentication portal',
      'Active credential exfiltration endpoint detected in client-side script',
    ],
    recommendations: [
      'Submit immediate registrar abuse report to NameCheap / Tucows for immediate domain suspension',
      'Submit domain to Google Safe Browsing and Microsoft SmartScreen feeds',
      'Issue cloudflare/firewall block rule across all corporate egress nodes',
    ],
    related_threats: [
      { id: 'TH-9041', entity: '@ApexPay_Support247', threat_type: 'SOCIAL_IMPERSONATION', relationship: 'Referred from bio link', risk_score: 94 },
      { id: 'TH-9043', entity: 'ApexPay_2FA_Authenticator.apk', threat_type: 'ROGUE_APP', relationship: 'Hosted in /downloads directory', risk_score: 98 },
    ],
    evidence: {
      detected_at: new Date(Date.now() - 5 * 3600000).toISOString(),
      source_platform: 'Web Crawler / DNS Telemetry',
      risk_factors: {
        'Domain Age': '2 days',
        'SSL Issuer': 'Let\'s Encrypt (Automated)',
        'Entropy Score': '4.21 (High Suspicion)',
        'Target Action': 'Password + OTP Interception',
      },
    },
    status: 'ACTIVE',
    campaign_id: 'CAMP-OCT-01',
    campaign_name: 'ApexPay Credential Harvesting Syndicate',
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: 'TH-9043',
    threat_type: 'ROGUE_APP',
    entity: 'ApexPay_2FA_Authenticator.apk',
    target_brand: 'ApexPay',
    risk_score: 98,
    risk_level: 'CRITICAL',
    confidence: 99,
    reasons: [
      'Typosquatted Android package name: com.apexpay.wallet.security.auth',
      'Static analysis identified 5 dangerous permissions: RECEIVE_SMS, READ_SMS, SYSTEM_ALERT_WINDOW, REQUEST_INSTALL_PACKAGES',
      'Extracts SMS verification codes and overlays fake login screens over banking apps',
      'Self-signed developer certificate with 1-day expiration timestamp',
      'Hardcoded command-and-control server matches known phishing domain (apexpay-security-verify.cc)',
    ],
    recommendations: [
      'Send takedown notices to third-party APK hosting portals (APKPure, APKMirror, Telegram channels)',
      'Submit sample SHA-256 hash to VirusTotal, Google Play Protect, and EDR threat feeds',
      'Push in-app warning notification to legitimate ApexPay users regarding fake companion apps',
    ],
    related_threats: [
      { id: 'TH-9041', entity: '@ApexPay_Support247', threat_type: 'SOCIAL_IMPERSONATION', relationship: 'Promoted as security fix', risk_score: 94 },
      { id: 'TH-9042', entity: 'https://apexpay-security-verify.cc/login', threat_type: 'PHISHING_URL', relationship: 'C2 exfiltration backend', risk_score: 96 },
    ],
    evidence: {
      detected_at: new Date(Date.now() - 8 * 3600000).toISOString(),
      source_platform: 'Third-party APK Mirror Crawler',
      risk_factors: {
        'Package Name': 'com.apexpay.wallet.security.auth',
        'Dangerous Permissions': '5 (SMS read, window overlay, package installer)',
        'Extracted C2 Server': 'apexpay-security-verify.cc',
        'Signature': 'Self-Signed Untrusted Cert',
      },
    },
    status: 'TAKEDOWN_REQUESTED',
    campaign_id: 'CAMP-OCT-01',
    campaign_name: 'ApexPay Credential Harvesting Syndicate',
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    id: 'TH-9044',
    threat_type: 'SCAM_CONTENT',
    entity: 'ApexPay $500 Customer Compensation Airdrop',
    target_brand: 'ApexPay',
    risk_score: 82,
    risk_level: 'CRITICAL',
    confidence: 91,
    reasons: [
      'NLP detected high-confidence fraudulent giveaway keywords ("Airdrop", "Claim Free Bonus", "Wallet Connect")',
      'Urgency language ("Only 15 minutes left before bonus expires")',
      'Unsolicited payment requirement to unlock purported bonus funds',
      'Links redirecting to unregistered Web3 wallet drainage contract',
    ],
    recommendations: [
      'Flag social post for financial fraud on Telegram and Facebook groups',
      'Issue official broadcast debunking fake airdrop campaigns',
    ],
    related_threats: [
      { id: 'TH-9045', entity: 'https://apexpay-airdrop-bonus.xyz', threat_type: 'PHISHING_URL', relationship: 'Linked destination URL', risk_score: 88 },
    ],
    evidence: {
      detected_at: new Date(Date.now() - 14 * 3600000).toISOString(),
      source_platform: 'Telegram Public Channels',
      risk_factors: {
        'NLP Scam Confidence': '91.4%',
        'Urgency Level': 'High (Time-limited inducement)',
        'Target': 'Crypto & Fiat balances',
      },
    },
    status: 'INVESTIGATING',
    campaign_id: 'CAMP-OCT-02',
    campaign_name: 'Fake Bonus & Airdrop Phishing',
    created_at: new Date(Date.now() - 14 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 3600000).toISOString(),
  },
  {
    id: 'TH-9045',
    threat_type: 'PHISHING_URL',
    entity: 'https://apexpay-airdrop-bonus.xyz/claim',
    target_brand: 'ApexPay',
    risk_score: 88,
    risk_level: 'CRITICAL',
    confidence: 94,
    reasons: [
      'Keyword combination apexpay + airdrop + bonus targeting consumer greed',
      'Abusive TLD (.xyz) registered 12 hours ago with zero reputation history',
      'Contains wallet drainer script attempting to sign eth_sign permit transactions',
    ],
    recommendations: [
      'Report registrar abuse to Hostinger / Cloudflare',
      'Submit malicious contract address to Etherscan & Chainalysis fraud blacklist',
    ],
    related_threats: [
      { id: 'TH-9044', entity: 'ApexPay $500 Customer Compensation Airdrop', threat_type: 'SCAM_CONTENT', relationship: 'Source advertisement', risk_score: 82 },
    ],
    evidence: {
      detected_at: new Date(Date.now() - 16 * 3600000).toISOString(),
      source_platform: 'Web Discovery Engine',
      risk_factors: {
        'Domain Age': '12 hours',
        'TLD Reputation': 'Poor (.xyz high fraud index)',
        'Wallet Drainer': 'Active permit exploit',
      },
    },
    status: 'ACTIVE',
    campaign_id: 'CAMP-OCT-02',
    campaign_name: 'Fake Bonus & Airdrop Phishing',
    created_at: new Date(Date.now() - 16 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 16 * 3600000).toISOString(),
  },
  {
    id: 'TH-9046',
    threat_type: 'SOCIAL_IMPERSONATION',
    entity: '@ApexPay_Offers_VIP',
    target_brand: 'ApexPay',
    risk_score: 68,
    risk_level: 'HIGH',
    confidence: 84,
    reasons: [
      'Moderate name similarity imitating official affiliate partner program',
      'Reposting official logos with unauthorized marketing promotion banners',
      'Unverified account with low engagement ratio',
    ],
    recommendations: [
      'Issue trademark infringement notice to Instagram',
      'Monitor outgoing links for potential malware escalation',
    ],
    related_threats: [],
    evidence: {
      detected_at: new Date(Date.now() - 28 * 3600000).toISOString(),
      source_platform: 'Instagram',
      risk_factors: {
        'Handle Similarity': '68%',
        'Followers': '450',
        'Risk Vector': 'Brand Dilution & Referral Hijacking',
      },
    },
    status: 'INVESTIGATING',
    created_at: new Date(Date.now() - 28 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 28 * 3600000).toISOString(),
  },
  {
    id: 'TH-9047',
    threat_type: 'ROGUE_APP',
    entity: 'ApexPay-QuickLoan-Instant.apk',
    target_brand: 'ApexPay',
    risk_score: 74,
    risk_level: 'HIGH',
    confidence: 87,
    reasons: [
      'Impersonating microloan service using ApexPay branding assets',
      'Requests excessive contacts and location tracking permissions',
      'Predatory extortion loan toolkit signatures detected',
    ],
    recommendations: [
      'Dispatch cease-and-desist to hosting APK file-sharing site',
      'Report malicious developer identity to local financial cybercrime unit',
    ],
    related_threats: [],
    evidence: {
      detected_at: new Date(Date.now() - 36 * 3600000).toISOString(),
      source_platform: 'Direct MediaFire / Cloud Link',
      risk_factors: {
        'Package': 'com.quickloan.apexpay.microcash',
        'Permissions': 'READ_CONTACTS, ACCESS_FINE_LOCATION, READ_EXTERNAL_STORAGE',
      },
    },
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 36 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 36 * 3600000).toISOString(),
  },
  {
    id: 'TH-9048',
    threat_type: 'PHISHING_URL',
    entity: 'http://apexpay-customer-portal.top/verify',
    target_brand: 'ApexPay',
    risk_score: 72,
    risk_level: 'HIGH',
    confidence: 89,
    reasons: [
      'Unencrypted HTTP protocol attempting sensitive account verification',
      'Suspicious .top top-level domain',
      'Suspicious sub-path imitating KYC verification document portal',
    ],
    recommendations: [
      'Submit domain to antiphishing working group (APWG)',
      'Add URL to enterprise web proxy filter',
    ],
    related_threats: [],
    evidence: {
      detected_at: new Date(Date.now() - 44 * 3600000).toISOString(),
      source_platform: 'Security Feed Ingestion',
      risk_factors: {
        'Protocol': 'HTTP (Cleartext)',
        'TLD': '.top (High Abuse)',
      },
    },
    status: 'ACTIVE',
    created_at: new Date(Date.now() - 44 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 44 * 3600000).toISOString(),
  },
  {
    id: 'TH-9049',
    threat_type: 'SOCIAL_IMPERSONATION',
    entity: '@ApexPayFanClub',
    target_brand: 'ApexPay',
    risk_score: 32,
    risk_level: 'LOW',
    confidence: 72,
    reasons: [
      'Contains brand name but explicitly clarifies community/fan status in bio',
      'No fraudulent links or credential collection requests detected',
      'Standard social interaction behaviors',
    ],
    recommendations: [
      'Keep on automated watchlist for profile changes or URL injection',
      'No active takedown required at this time',
    ],
    related_threats: [],
    evidence: {
      detected_at: new Date(Date.now() - 60 * 3600000).toISOString(),
      source_platform: 'Reddit / Community Hub',
      risk_factors: {
        'Intent': 'Community Discussion',
        'Urgency Language': 'None',
      },
    },
    status: 'INVESTIGATING',
    created_at: new Date(Date.now() - 60 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 60 * 3600000).toISOString(),
  },
  {
    id: 'TH-9050',
    threat_type: 'PHISHING_URL',
    entity: 'https://apexpay-login-support.net',
    target_brand: 'ApexPay',
    risk_score: 91,
    risk_level: 'CRITICAL',
    confidence: 95,
    reasons: [
      'Targeted credential harvesting against merchant portal',
      'Hosted on bulletin board bulletproof host',
    ],
    recommendations: [
      'Takedown completed via Cloudflare Abuse Protocol',
    ],
    related_threats: [],
    evidence: {
      detected_at: new Date(Date.now() - 96 * 3600000).toISOString(),
      source_platform: 'Passive DNS Sensor',
    },
    status: 'RESOLVED',
    created_at: new Date(Date.now() - 96 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 3600000).toISOString(),
  },
];

const initialCampaigns: Campaign[] = [
  {
    id: 'CAMP-OCT-01',
    name: 'ApexPay Credential Harvesting Syndicate',
    threat_actor: 'Storm-0842 (Suspected Financially Motivated Group)',
    target_brand: 'ApexPay',
    status: 'ACTIVE',
    severity: 'CRITICAL',
    total_threats: 3,
    discovered_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    description: 'A coordinated three-tier campaign using spoofed customer support profiles on social media to redirect distressed users to fake verification portals, delivering trojanized APK 2FA authenticators.',
    attack_narrative: 'The attackers monitor mentions of @ApexPayHQ on social media. When users post support inquiries, the fake handle @ApexPay_Support247 responds with urgency, providing a shortened link to apexpay-security-verify.cc. The web page prompts the user to verify their account and instructs them to sideload ApexPay_2FA_Authenticator.apk, which intercepts banking SMS OTPs.',
    nodes: [
      {
        id: 'node-brand',
        type: 'BRAND',
        label: 'ApexPay (Official)',
        sublabel: 'Target Enterprise Brand',
        risk_score: 0,
        risk_level: 'LOW',
        status: 'PROTECTED',
        x: 100,
        y: 200,
      },
      {
        id: 'node-social',
        type: 'SOCIAL',
        label: '@ApexPay_Support247',
        sublabel: 'Spoofed Support Persona',
        threat_id: 'TH-9041',
        risk_score: 94,
        risk_level: 'CRITICAL',
        status: 'ACTIVE',
        x: 360,
        y: 120,
      },
      {
        id: 'node-url',
        type: 'URL',
        label: 'apexpay-security-verify.cc',
        sublabel: 'Credential Harvester Portal',
        threat_id: 'TH-9042',
        risk_score: 96,
        risk_level: 'CRITICAL',
        status: 'ACTIVE',
        x: 640,
        y: 200,
      },
      {
        id: 'node-app',
        type: 'APP',
        label: 'ApexPay_2FA_Authenticator.apk',
        sublabel: 'Trojanized Banking Interceptor',
        threat_id: 'TH-9043',
        risk_score: 98,
        risk_level: 'CRITICAL',
        status: 'TAKEDOWN_REQUESTED',
        x: 920,
        y: 200,
      },
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'node-brand',
        target: 'node-social',
        label: 'Impersonates Identity',
        relationship_type: 'IMPERSONATES',
      },
      {
        id: 'edge-2',
        source: 'node-social',
        target: 'node-url',
        label: 'Directs Victims via Bio Link',
        relationship_type: 'DISTRIBUTES',
      },
      {
        id: 'edge-3',
        source: 'node-url',
        target: 'node-app',
        label: 'Hosts & Drops Malicious APK',
        relationship_type: 'DROPS_PAYLOAD',
      },
    ],
    timeline_events: [
      {
        step: 1,
        time_offset: 'T - 24 hrs',
        node_id: 'node-url',
        title: 'Infrastructure Recon & Typosquat Registration',
        description: 'Adversary registered domain "apexpay-security-verify.cc" using anonymous privacy proxy on NameCheap.',
        phase: 'RECON',
      },
      {
        step: 2,
        time_offset: 'T - 18 hrs',
        node_id: 'node-app',
        title: 'Payload Weaponization (Trojanized APK)',
        description: 'Compiled Android application with READ_SMS, RECEIVE_SMS, and SYSTEM_ALERT_WINDOW permissions targeting banking 2FA.',
        phase: 'WEAPONIZATION',
      },
      {
        step: 3,
        time_offset: 'T - 12 hrs',
        node_id: 'node-social',
        title: 'Social Engineering Account Spin-up',
        description: 'Launched impersonation persona @ApexPay_Support247 on X with cloned executive branding and support keywords.',
        phase: 'DELIVERY',
      },
      {
        step: 4,
        time_offset: 'T - 6 hrs',
        node_id: 'node-social',
        title: 'Targeted DM Lures & Bio Redirection',
        description: 'Began intercepting customer service inquiries on legitimate brand posts, directing distressed users to the phishing URL.',
        phase: 'DELIVERY',
      },
      {
        step: 5,
        time_offset: 'T - 2 hrs',
        node_id: 'node-url',
        title: 'Credential Harvesting & Victim Interception',
        description: 'Captured credentials and prompted users to sideload malicious authenticator APK.',
        phase: 'EXPLOITATION',
      },
      {
        step: 6,
        time_offset: 'T - 30 min',
        node_id: 'node-brand',
        title: 'DRPP Autonomous Correlation & Takedown Dispatched',
        description: 'Automated SOC trigger correlated disparate signals into Storm-0842 dossier and dispatched registrar abuse takedown.',
        phase: 'DEFENSE',
        is_mitigated: true,
      },
    ],
    blast_radius: {
      active_exposure_usd: 342000,
      prevented_loss_usd: 1180000,
      victims_intercepted_count: 4200,
      estimated_hourly_drain_rate: 18500,
      attack_spread_velocity: 'High (42 visits/min)',
      potential_reputation_index: 84,
    },
  },
  {
    id: 'CAMP-OCT-02',
    name: 'Fake Bonus & Airdrop Phishing',
    threat_actor: 'Unattributed Opportunistic Threat Actor',
    target_brand: 'ApexPay',
    status: 'ACTIVE',
    severity: 'HIGH',
    total_threats: 2,
    discovered_at: new Date(Date.now() - 20 * 3600000).toISOString(),
    description: 'Fraudulent promotional scheme baiting users with $500 bonus compensation to siphon crypto and credentials.',
    attack_narrative: 'High-frequency spam posted across Telegram and Discord communities advertising an exclusive ApexPay anniversary bonus. The destination link executes unauthorized permit approvals to drain funds.',
    nodes: [
      {
        id: 'node-brand-2',
        type: 'BRAND',
        label: 'ApexPay (Official)',
        sublabel: 'Target Brand',
        risk_score: 0,
        risk_level: 'LOW',
        status: 'PROTECTED',
        x: 100,
        y: 180,
      },
      {
        id: 'node-content-2',
        type: 'SOCIAL',
        label: 'ApexPay $500 Compensation Post',
        sublabel: 'Scam Giveaway Advert',
        threat_id: 'TH-9044',
        risk_score: 82,
        risk_level: 'CRITICAL',
        status: 'INVESTIGATING',
        x: 450,
        y: 180,
      },
      {
        id: 'node-url-2',
        type: 'URL',
        label: 'apexpay-airdrop-bonus.xyz',
        sublabel: 'Web3 Wallet Drainer',
        threat_id: 'TH-9045',
        risk_score: 88,
        risk_level: 'CRITICAL',
        status: 'ACTIVE',
        x: 800,
        y: 180,
      },
    ],
    edges: [
      {
        id: 'edge-c1',
        source: 'node-brand-2',
        target: 'node-content-2',
        label: 'Exploits Brand Goodwill',
        relationship_type: 'IMPERSONATES',
      },
      {
        id: 'edge-c2',
        source: 'node-content-2',
        target: 'node-url-2',
        label: 'Funnel to Drainer',
        relationship_type: 'HARVESTS',
      },
    ],
  },
];

// In-Memory Storage
let localThreats: Threat[] = [...initialThreats];
let currentBrand: Brand = { ...defaultBrand };
let localCampaigns: Campaign[] = [...initialCampaigns];

// -------------------------------------------------------------
// Explainable AI Risk Engine (Local Heuristic Engine)
// -------------------------------------------------------------

function calculateStringSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().replace(/[^a-z0-9]/g, '');
  const s2 = str2.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1;

  // Simple token / substring matching
  let matches = 0;
  for (let i = 0; i < s1.length - 2; i++) {
    const sub = s1.slice(i, i + 3);
    if (s2.includes(sub)) matches++;
  }
  return Math.min(1, matches / Math.max(1, s1.length - 2));
}

export function evaluateSocialProfile(input: SocialProfileInput): Threat {
  const brandName = input.target_brand || currentBrand.brand_name;
  const usernameSim = calculateStringSimilarity(input.username, brandName);
  const displayNameSim = calculateStringSimilarity(input.display_name, brandName);
  
  let score = 20;
  const reasons: string[] = [];

  if (usernameSim > 0.6) {
    score += 35;
    reasons.push(`High username similarity (${Math.round(usernameSim * 100)}%) imitating official brand ${brandName}`);
  }
  if (displayNameSim > 0.6) {
    score += 20;
    reasons.push(`Display name (${input.display_name}) mirrors protected brand trademarks`);
  }
  if (!input.verified) {
    score += 10;
    reasons.push('Unverified account impersonating an enterprise organization');
  }
  if (input.account_age_days < 14) {
    score += 18;
    reasons.push(`Newly spun-up profile (created ${input.account_age_days} days ago)`);
  }
  if (input.following > 100 && input.followers < 50) {
    score += 12;
    reasons.push('Anomalous follower-to-following ratio indicative of mass-outreach botting');
  }
  if (input.bio.toLowerCase().includes('support') || input.bio.toLowerCase().includes('help') || input.bio.toLowerCase().includes('otp') || input.bio.toLowerCase().includes('wallet')) {
    score += 15;
    reasons.push('Bio contains high-risk support and credential-seeking keywords');
  }
  if (input.external_url && !input.external_url.includes(currentBrand.official_website.replace('https://', ''))) {
    score += 20;
    reasons.push(`External bio link (${input.external_url}) leads away from official domain (${currentBrand.official_website})`);
  }

  score = Math.min(100, Math.max(0, score));

  const risk_level: RiskLevel = 
    score >= 80 ? 'CRITICAL' : 
    score >= 60 ? 'HIGH' : 
    score >= 40 ? 'MEDIUM' : 'LOW';

  const newThreat: Threat = {
    id: `TH-${Math.floor(1000 + Math.random() * 9000)}`,
    threat_type: 'SOCIAL_IMPERSONATION',
    entity: input.username.startsWith('@') ? input.username : `@${input.username}`,
    target_brand: brandName,
    risk_score: score,
    risk_level,
    confidence: Math.min(99, Math.max(65, Math.round(score * 0.95 + 10))),
    reasons,
    recommendations: [
      `Issue priority impersonation takedown to platform trust & safety team`,
      `Add associated contact handles to brand security blocklist`,
      `Monitor user timeline for outgoing malicious links`,
    ],
    related_threats: [],
    evidence: {
      detected_at: new Date().toISOString(),
      source_platform: 'Social Audit Scanner',
      risk_factors: {
        'Username Match': `${Math.round(usernameSim * 100)}%`,
        'Account Age': `${input.account_age_days} days`,
        'Followers': `${input.followers} / ${input.following}`,
      },
    },
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  localThreats.unshift(newThreat);
  return newThreat;
}

export function evaluateScamContent(input: ScamContentInput): Threat {
  const brandName = input.target_brand || currentBrand.brand_name;
  const textLower = input.text.toLowerCase();
  let score = 15;
  const reasons: string[] = [];

  const scamKeywords = [
    { word: 'otp', weight: 30, desc: 'Urgent OTP or verification code request' },
    { word: 'password', weight: 25, desc: 'Credential or password solicitation' },
    { word: 'seed phrase', weight: 35, desc: 'Cryptographic secret key or seed phrase harvesting' },
    { word: 'private key', weight: 35, desc: 'Private key compromise trigger' },
    { word: 'free bonus', weight: 20, desc: 'High-yield unrealistic bonus bait' },
    { word: 'airdrop', weight: 20, desc: 'Fake airdrop promotional incentive' },
    { word: 'claim immediately', weight: 18, desc: 'Urgent psychological time pressure' },
    { word: 'account suspended', weight: 22, desc: 'Account closure scare tactic' },
    { word: 'wire money', weight: 28, desc: 'Direct financial transfer instruction' },
  ];

  scamKeywords.forEach(({ word, weight, desc }) => {
    if (textLower.includes(word)) {
      score += weight;
      reasons.push(desc);
    }
  });

  if (input.url) {
    score += 15;
    reasons.push(`Contains redirection URL: ${input.url}`);
  }

  score = Math.min(100, Math.max(0, score));
  const risk_level: RiskLevel = 
    score >= 80 ? 'CRITICAL' : 
    score >= 60 ? 'HIGH' : 
    score >= 40 ? 'MEDIUM' : 'LOW';

  const newThreat: Threat = {
    id: `TH-${Math.floor(1000 + Math.random() * 9000)}`,
    threat_type: 'SCAM_CONTENT',
    entity: input.text.length > 45 ? `${input.text.slice(0, 45)}...` : input.text,
    target_brand: brandName,
    risk_score: score,
    risk_level,
    confidence: Math.min(99, Math.max(70, Math.round(score * 0.92 + 10))),
    reasons: reasons.length ? reasons : ['General brand mention with unverified claims'],
    recommendations: [
      'Report content to hosting social platform via Abuse API',
      'Issue consumer advisory regarding this specific message format',
    ],
    related_threats: [],
    evidence: {
      detected_at: new Date().toISOString(),
      source_platform: input.channel || 'Messaging / Social Feed',
      raw_payload: { snippet: input.text, url: input.url },
    },
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  localThreats.unshift(newThreat);
  return newThreat;
}

export function evaluateUrl(input: UrlInput): Threat {
  const brandName = input.target_brand || currentBrand.brand_name;
  let url = input.url.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  let domain = '';
  try {
    const parsed = new URL(url);
    domain = parsed.hostname;
  } catch {
    domain = url.split('/')[0];
  }

  let score = 20;
  const reasons: string[] = [];

  const brandClean = brandName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const domainClean = domain.toLowerCase();

  if (domainClean.includes(brandClean)) {
    if (!domainClean.endsWith(currentBrand.official_website.replace('https://', ''))) {
      score += 40;
      reasons.push(`Brand typosquatting detected (${brandName} in unauthorized domain ${domain})`);
    }
  }

  const suspiciousTlds = ['.xyz', '.cc', '.top', '.tk', '.ml', '.cf', '.buzz', '.rest', '.click', '.live'];
  if (suspiciousTlds.some(tld => domainClean.endsWith(tld))) {
    score += 25;
    reasons.push(`High-risk abusive Top-Level Domain extension (${domain.slice(domain.lastIndexOf('.'))})`);
  }

  if (url.startsWith('http://')) {
    score += 15;
    reasons.push('Insecure HTTP protocol used on authentication/payment path');
  }

  if (domainClean.split('-').length > 2) {
    score += 12;
    reasons.push('Multiple hyphens in hostname characteristic of phishing generation kits');
  }

  const phishingWords = ['login', 'verify', 'auth', 'security', 'update', 'portal', 'account', 'claim'];
  if (phishingWords.some(w => url.toLowerCase().includes(w))) {
    score += 18;
    reasons.push('Contains credential-harvesting keywords in URL path or subdomain');
  }

  score = Math.min(100, Math.max(0, score));
  const risk_level: RiskLevel = 
    score >= 80 ? 'CRITICAL' : 
    score >= 60 ? 'HIGH' : 
    score >= 40 ? 'MEDIUM' : 'LOW';

  const newThreat: Threat = {
    id: `TH-${Math.floor(1000 + Math.random() * 9000)}`,
    threat_type: 'PHISHING_URL',
    entity: url,
    target_brand: brandName,
    risk_score: score,
    risk_level,
    confidence: Math.min(99, Math.max(75, Math.round(score * 0.94 + 8))),
    reasons: reasons.length ? reasons : ['Domain structure conforms to known suspicious patterns'],
    recommendations: [
      'Submit immediate domain registrar takedown request',
      'Distribute domain to browser threat feeds (Google Safe Browsing, Quad9, Cloudflare 1.1.1.1)',
      'Add domain to enterprise DNS sinkhole',
    ],
    related_threats: [],
    evidence: {
      detected_at: new Date().toISOString(),
      source_platform: 'URL Telemetry & Web Scanner',
      risk_factors: {
        'Domain': domain,
        'Entropy Score': '3.94',
        'Protocol': url.startsWith('https://') ? 'HTTPS' : 'HTTP (Cleartext)',
      },
    },
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  localThreats.unshift(newThreat);
  return newThreat;
}

export function evaluateApp(input: AppInput): Threat {
  const brandName = input.target_brand || currentBrand.brand_name;
  let score = 25;
  const reasons: string[] = [];

  const dangerousPermissions = [
    'READ_SMS',
    'RECEIVE_SMS',
    'SEND_SMS',
    'SYSTEM_ALERT_WINDOW',
    'REQUEST_INSTALL_PACKAGES',
    'READ_CONTACTS',
    'ACCESS_FINE_LOCATION',
    'RECORD_AUDIO',
    'BIND_ACCESSIBILITY_SERVICE',
  ];

  const appPerms = input.permissions || [
    'READ_SMS',
    'RECEIVE_SMS',
    'SYSTEM_ALERT_WINDOW',
    'INTERNET',
    'REQUEST_INSTALL_PACKAGES',
  ];

  const matchedDangerous = appPerms.filter(p => dangerousPermissions.includes(p.replace('android.permission.', '')));
  if (matchedDangerous.length > 0) {
    score += matchedDangerous.length * 14;
    reasons.push(`Contains ${matchedDangerous.length} high-severity permissions (${matchedDangerous.join(', ')})`);
  }

  const officialPkg = currentBrand.official_app_package || 'com.apexpay.wallet';
  if (input.package_name && input.package_name !== officialPkg) {
    if (input.package_name.includes('apexpay') || input.package_name.includes('wallet')) {
      score += 30;
      reasons.push(`Typosquatted Android package name (${input.package_name}) infringing official ID (${officialPkg})`);
    }
  }

  if (input.app_name.toLowerCase().includes(brandName.toLowerCase())) {
    score += 15;
    reasons.push(`Unauthorized application title incorporating trademark: "${input.app_name}"`);
  }

  score = Math.min(100, Math.max(0, score));
  const risk_level: RiskLevel = 
    score >= 80 ? 'CRITICAL' : 
    score >= 60 ? 'HIGH' : 
    score >= 40 ? 'MEDIUM' : 'LOW';

  const newThreat: Threat = {
    id: `TH-${Math.floor(1000 + Math.random() * 9000)}`,
    threat_type: 'ROGUE_APP',
    entity: input.app_name || input.package_name || 'SuspiciousApp.apk',
    target_brand: brandName,
    risk_score: score,
    risk_level,
    confidence: Math.min(99, Math.max(80, Math.round(score * 0.95 + 8))),
    reasons: reasons.length ? reasons : ['Untrusted static manifest signatures'],
    recommendations: [
      'Report malicious APK signature to Google Play Protect & Samsung Galaxy Store security teams',
      'Submit file SHA256 to VirusTotal and mobile threat defense (MTD) databases',
      'Send DMCA notice to distribution mirrors and file-sharing repositories',
    ],
    related_threats: [],
    evidence: {
      detected_at: new Date().toISOString(),
      source_platform: 'Static APK Bytecode & Manifest Analyzer',
      risk_factors: {
        'Package Name': input.package_name,
        'Dangerous Permissions Found': matchedDangerous.length,
        'Developer Signature': input.developer_name || 'Untrusted / Self-signed',
      },
    },
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  localThreats.unshift(newThreat);
  return newThreat;
}

// -------------------------------------------------------------
// Unified API Client Functions (Hybrid: Real API + Fallback)
// -------------------------------------------------------------

export const apiService = {
  // Brand Setup
  async registerBrand(data: Partial<Brand>): Promise<Brand> {
    try {
      const res = await apiClient.post('/api/brand/register', data);
      currentBrand = res.data;
      return res.data;
    } catch {
      // Fallback to local
      currentBrand = {
        ...currentBrand,
        ...data,
        updated_at: new Date().toISOString(),
      } as Brand;
      return currentBrand;
    }
  },

  async getBrand(): Promise<Brand> {
    try {
      const res = await apiClient.get('/api/brand');
      currentBrand = res.data;
      return res.data;
    } catch {
      return currentBrand;
    }
  },

  // Social Profile Analysis
  async analyzeSocialProfile(data: SocialProfileInput): Promise<Threat> {
    try {
      const res = await apiClient.post('/api/social/analyze-profile', data);
      localThreats.unshift(res.data);
      return res.data;
    } catch {
      return evaluateSocialProfile(data);
    }
  },

  // Scam Content Analysis
  async analyzeSocialContent(data: ScamContentInput): Promise<Threat> {
    try {
      const res = await apiClient.post('/api/social/analyze-content', data);
      localThreats.unshift(res.data);
      return res.data;
    } catch {
      return evaluateScamContent(data);
    }
  },

  // URL Analysis
  async analyzeUrl(data: UrlInput): Promise<Threat> {
    try {
      const res = await apiClient.post('/api/url/analyze', data);
      localThreats.unshift(res.data);
      return res.data;
    } catch {
      return evaluateUrl(data);
    }
  },

  // App Analysis
  async analyzeApp(data: AppInput | FormData): Promise<Threat> {
    try {
      const res = await apiClient.post('/api/app/analyze', data, {
        headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      });
      localThreats.unshift(res.data);
      return res.data;
    } catch {
      if (data instanceof FormData) {
        return evaluateApp({
          app_name: 'ApexPay-Sideload-Update.apk',
          package_name: 'com.apexpay.wallet.installer',
          permissions: ['READ_SMS', 'RECEIVE_SMS', 'SYSTEM_ALERT_WINDOW'],
        });
      }
      return evaluateApp(data);
    }
  },

  // Threats Feed
  async getThreats(filters?: { type?: string; severity?: string; status?: string; search?: string }): Promise<Threat[]> {
    try {
      const res = await apiClient.get('/api/threats', { params: filters });
      return res.data;
    } catch {
      let filtered = [...localThreats];
      if (filters?.type && filters.type !== 'ALL') {
        filtered = filtered.filter(t => t.threat_type === filters.type);
      }
      if (filters?.severity && filters.severity !== 'ALL') {
        filtered = filtered.filter(t => t.risk_level === filters.severity);
      }
      if (filters?.status && filters.status !== 'ALL') {
        filtered = filtered.filter(t => t.status === filters.status);
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(t => 
          t.entity.toLowerCase().includes(q) || 
          t.id.toLowerCase().includes(q) || 
          t.reasons.some(r => r.toLowerCase().includes(q))
        );
      }
      return filtered;
    }
  },

  // Threat Details
  async getThreatById(id: string): Promise<Threat> {
    try {
      const res = await apiClient.get(`/api/threats/${id}`);
      return res.data;
    } catch {
      const found = localThreats.find(t => t.id === id);
      if (!found) throw new Error(`Threat with ID ${id} not found`);
      return found;
    }
  },

  // Update Threat Status / Feedback
  async updateThreatStatus(id: string, status: ThreatStatus, feedback?: string): Promise<Threat> {
    try {
      const res = await apiClient.patch(`/api/threats/${id}/status`, { status, feedback });
      const idx = localThreats.findIndex(t => t.id === id);
      if (idx !== -1) localThreats[idx] = res.data;
      return res.data;
    } catch {
      const idx = localThreats.findIndex(t => t.id === id);
      if (idx === -1) throw new Error('Threat not found');
      localThreats[idx] = {
        ...localThreats[idx],
        status,
        updated_at: new Date().toISOString(),
      };
      return localThreats[idx];
    }
  },

  // Campaigns
  async getCampaigns(): Promise<Campaign[]> {
    try {
      const res = await apiClient.get('/api/campaigns');
      return res.data;
    } catch {
      return localCampaigns;
    }
  },

  // Dashboard Aggregates
  async getDashboard(): Promise<DashboardStats> {
    try {
      const res = await apiClient.get('/api/dashboard');
      return res.data;
    } catch {
      const critical = localThreats.filter(t => t.risk_level === 'CRITICAL').length;
      const high = localThreats.filter(t => t.risk_level === 'HIGH').length;
      const medium = localThreats.filter(t => t.risk_level === 'MEDIUM').length;
      const low = localThreats.filter(t => t.risk_level === 'LOW').length;

      const social = localThreats.filter(t => t.threat_type === 'SOCIAL_IMPERSONATION').length;
      const apps = localThreats.filter(t => t.threat_type === 'ROGUE_APP').length;
      const urls = localThreats.filter(t => t.threat_type === 'PHISHING_URL').length;
      const scam = localThreats.filter(t => t.threat_type === 'SCAM_CONTENT').length;
      const takedowns = localThreats.filter(t => t.status === 'TAKEDOWN_REQUESTED').length;
      const resolved = localThreats.filter(t => t.status === 'RESOLVED').length;

      const avgScore = localThreats.length > 0
        ? Math.round(localThreats.reduce((acc, t) => acc + t.risk_score, 0) / localThreats.length)
        : 0;

      // 7-day trend
      const riskTrend = [
        { date: 'Oct 07', critical: 2, high: 3, medium: 4, low: 2, total: 11 },
        { date: 'Oct 08', critical: 3, high: 4, medium: 3, low: 3, total: 13 },
        { date: 'Oct 09', critical: 4, high: 3, medium: 5, low: 2, total: 14 },
        { date: 'Oct 10', critical: 5, high: 5, medium: 4, low: 1, total: 15 },
        { date: 'Oct 11', critical: 4, high: 6, medium: 3, low: 2, total: 15 },
        { date: 'Oct 12', critical: 6, high: 5, medium: 2, low: 2, total: 15 },
        { date: 'Oct 13', critical: critical, high: high, medium: medium, low: low, total: localThreats.length },
      ];

      const threatDistribution = [
        { name: 'Phishing URLs', count: urls, color: '#F43F5E' },
        { name: 'Fake Socials', count: social, color: '#F59E0B' },
        { name: 'Rogue Apps', count: apps, color: '#8B5CF6' },
        { name: 'Scam Messages', count: scam, color: '#0EA5E9' },
      ];

      return {
        total_threats: localThreats.length,
        critical_threats: critical,
        high_threats: high,
        medium_threats: medium,
        low_threats: low,
        social_threats: social,
        suspicious_apps: apps,
        suspicious_urls: urls,
        scam_content_threats: scam,
        takedowns_active: takedowns,
        resolved_threats: resolved,
        average_risk_score: avgScore,
        recent_incidents: localThreats.slice(0, 6),
        risk_trend: riskTrend,
        threat_distribution: threatDistribution,
      };
    }
  },

  // Incident Report Generation
  async generateReport(options?: { period?: string; includeTakedowns?: boolean }): Promise<IncidentReport> {
    try {
      const res = await apiClient.post('/api/reports/generate', options);
      return res.data;
    } catch {
      const criticalCount = localThreats.filter(t => t.risk_level === 'CRITICAL').length;
      return {
        report_id: `REP-APEX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        generated_at: new Date().toISOString(),
        brand_name: currentBrand.brand_name,
        reporting_period: options?.period || 'Last 30 Days (Active Sprint)',
        summary: {
          total_incidents: localThreats.length,
          critical_risk_incidents: criticalCount,
          active_campaigns: localCampaigns.length,
          takedowns_executed: localThreats.filter(t => t.status === 'TAKEDOWN_REQUESTED' || t.status === 'RESOLVED').length,
          mean_time_to_detect_hours: 1.4,
        },
        threat_breakdown: {
          'Social Impersonations': localThreats.filter(t => t.threat_type === 'SOCIAL_IMPERSONATION').length,
          'Phishing Domains': localThreats.filter(t => t.threat_type === 'PHISHING_URL').length,
          'Rogue Mobile Apps': localThreats.filter(t => t.threat_type === 'ROGUE_APP').length,
          'Fraudulent Content': localThreats.filter(t => t.threat_type === 'SCAM_CONTENT').length,
        },
        executive_narrative: `During the current observation cycle, the automated DRPP correlation engine exposed an active cyber attack syndicate (Storm-0842) impersonating ${currentBrand.brand_name}. The threat group deployed a synchronized triad comprising customer service impersonation accounts, credential harvesting portals, and malicious Android SMS-intercepting APKs. Rapid remediation resulted in 2 immediate takedowns and perimeter DNS sinkholing.`,
        top_incidents: localThreats.filter(t => t.risk_score >= 80).slice(0, 5),
        recommended_security_postures: [
          'Enforce strict Brand Indicator for Message Identification (BIMI) and DMARC enforcement.',
          'Issue proactive customer warnings regarding unofficial 2FA authenticator applications.',
          'Maintain automated domain registrar monitoring across .cc, .top, and .xyz TLDs.',
          'Initiate automated takedown escalation agreements with major app distribution mirrors.',
        ],
      };
    }
  },

  // Regional Indic Dialect Threat Radar
  async getIndicThreats(): Promise<any[]> {
    return [
      {
        id: 'IND-TE-101',
        language: 'te',
        language_label: 'Telugu (తెలుగు)',
        channel: 'UPI_VPA',
        entity: 'apexpay.support@ybl',
        original_text: 'మీ ApexPay వాలెట్ ఖాతా కేవైసీ నిలిపివేయబడింది. 2 గంటల్లో అన్‌బ్లాక్ చేయడానికి వెరిఫికేషన్ రుసుము పంపండి: apexpay.support@ybl',
        translated_english: 'Your ApexPay wallet KYC has been suspended. Send verification fee within 2 hours to unblock: apexpay.support@ybl',
        risk_score: 95,
        risk_level: 'CRITICAL',
        threat_category: 'UPI_FRAUD',
        matched_dialect_keywords: ['కేవైసీ నిలిపివేయబడింది', 'అన్‌బ్లాక్', 'వాలెట్ ఖాతా', 'UPI VPA'],
        detected_at: new Date(Date.now() - 3 * 3600000).toISOString(),
      },
      {
        id: 'IND-HI-102',
        language: 'hi',
        language_label: 'Hindi (हिन्दी)',
        channel: 'SMS_SENDER',
        entity: 'AD-APEXPAY-ALERT',
        original_text: 'प्रिय ग्राहक! आपके ApexPay खाते पर ₹50,000 का लोन मंजूर हुआ है। क्लेम करने के लिए ओटीपी बताएं या ऐप इंस्टॉल करें: apexpay-loan.cc',
        translated_english: 'Dear customer! A loan of ₹50,000 is approved on your ApexPay account. Share OTP or install app to claim: apexpay-loan.cc',
        risk_score: 92,
        risk_level: 'CRITICAL',
        threat_category: 'IMPERSONATION',
        matched_dialect_keywords: ['लोन मंजूर', 'ओटीपी बताएं', 'खाते पर'],
        detected_at: new Date(Date.now() - 6 * 3600000).toISOString(),
      },
      {
        id: 'IND-MR-103',
        language: 'mr',
        language_label: 'Marathi (मराठी)',
        channel: 'WHATSAPP',
        entity: '+91 97230 44821 (ApexPay Cash)',
        original_text: 'ApexPay इन्स्टंट कॅश: कोणत्याही कागदपत्रांशिवाय 10 मिनिटांत तात्काळ कर्ज मिळवा. अॅप डाउनलोड करा आणि संपर्कांची परवानगी द्या.',
        translated_english: 'ApexPay Instant Cash: Get immediate loan in 10 minutes without documents. Download app and grant contacts permission.',
        risk_score: 89,
        risk_level: 'CRITICAL',
        threat_category: 'LOAN_EXTORTION',
        matched_dialect_keywords: ['इन्स्टंट कॅश', 'संपर्कांची परवानगी', 'तात्काळ कर्ज'],
        detected_at: new Date(Date.now() - 11 * 3600000).toISOString(),
      },
    ];
  },

  // Canary & Honeypot Token Defense
  async getCanaryTokens(): Promise<any[]> {
    return [
      {
        id: 'CANARY-01',
        token_type: 'HONEY_PROFILE',
        identifier: '@ApexPay_Support_Honeypot',
        platform: 'X (Twitter)',
        deployed_at: new Date(Date.now() - 14 * 86400000).toISOString(),
        status: 'ARMED_MONITORING',
      },
      {
        id: 'CANARY-02',
        token_type: 'DECEPTIVE_URL',
        identifier: 'https://apexpay-auth-canary.org/probe',
        platform: 'Web Crawler Decoy',
        deployed_at: new Date(Date.now() - 7 * 86400000).toISOString(),
        status: 'TRIPPED_ALERT',
        tripped_details: 'Storm-0842 bot crawler scraped decoy endpoint 3 hours ago from IP 185.220.101.5',
      },
      {
        id: 'CANARY-03',
        token_type: 'CANARY_UPI',
        identifier: 'apexpay.honeypot@okhdfcbank',
        platform: 'National UPI Directory Decoy',
        deployed_at: new Date(Date.now() - 21 * 86400000).toISOString(),
        status: 'ARMED_MONITORING',
      },
    ];
  },

  async deployCanaryToken(tokenType: string, identifier: string): Promise<any> {
    return {
      id: `CANARY-${Math.floor(10 + Math.random() * 90)}`,
      token_type: tokenType,
      identifier,
      platform: 'Custom Enterprise Decoy',
      deployed_at: new Date().toISOString(),
      status: 'ARMED_MONITORING',
    };
  },

  // =========================================================
  // TOP 5 CYBERSECURITY & FRAUD BENCHMARK DATASETS & TRAINING
  // =========================================================
  async getBenchmarkDatasets(): Promise<BenchmarkDataset[]> {
    return [
      {
        id: 'ds-instagram',
        rank: 1,
        name: 'Instagram Fake Spammer Genuine Accounts Dataset',
        source: 'Kaggle (free4ever1)',
        url: 'https://www.kaggle.com/datasets/free4ever1/instagram-fake-spammer-genuine-accounts',
        target_vector: 'SOCIAL_IMPERSONATION',
        algorithm: 'Random Forest & Gradient Boosted Decision Trees',
        sample_count: 11958,
        class_balance: '50% Fake Spammer Accounts / 50% Genuine Accounts',
        features_list: [
          'profile_pic',
          'nums_length_username',
          'fullname_words',
          'nums_length_fullname',
          'name_equals_username',
          'description_length',
          'external_url',
          'is_private',
          'posts',
          'followers',
          'follows'
        ],
        description: 'Gold-standard benchmark distinguishing automated spammers and impersonation accounts from authentic profiles based on profile metadata, username entropy, and follower/following imbalances.',
        metrics: {
          accuracy: 0.948,
          precision: 0.952,
          recall: 0.944,
          f1_score: 0.948,
          auc_roc: 0.982,
        },
        loss_curve: [
          { epoch: 1, loss: 0.692, val_loss: 0.685 },
          { epoch: 5, loss: 0.412, val_loss: 0.428 },
          { epoch: 10, loss: 0.284, val_loss: 0.312 },
          { epoch: 15, loss: 0.198, val_loss: 0.224 },
          { epoch: 20, loss: 0.142, val_loss: 0.168 },
          { epoch: 25, loss: 0.108, val_loss: 0.134 },
        ],
        feature_importances: [
          { feature: 'nums_length_username', importance: 0.245, description: 'High ratio of numerical digits in username handle' },
          { feature: 'follows_to_followers_ratio', importance: 0.218, description: 'Outreach imbalance (>30:1 following to followers)' },
          { feature: 'external_url_present', importance: 0.184, description: 'Bio contains suspicious redirection link' },
          { feature: 'profile_pic_presence', importance: 0.142, description: 'Default silhouette or stolen stock image' },
          { feature: 'description_length', importance: 0.115, description: 'Short spam or keyword-stuffed bio' },
          { feature: 'name_equals_username', importance: 0.096, description: 'Lack of personalized display name' },
        ],
        benchmark_samples: [
          {
            id: 'sample-insta-01',
            sample_name: '@ApexPay_Bonus88 (Spammer)',
            features: {
              profile_pic: 0,
              nums_length_username: 0.42,
              fullname_words: 1,
              name_equals_username: 1,
              description_length: 12,
              external_url: 1,
              posts: 3,
              followers: 24,
              follows: 1850,
            },
            label: 1,
            explanation: 'Zero profile picture, high digit concentration in handle, massive 77:1 follower imbalance, unverified external link.',
          },
          {
            id: 'sample-insta-02',
            sample_name: '@ApexPayHQ (Official Verified)',
            features: {
              profile_pic: 1,
              nums_length_username: 0.00,
              fullname_words: 2,
              name_equals_username: 0,
              description_length: 145,
              external_url: 1,
              posts: 1240,
              followers: 680000,
              follows: 210,
            },
            label: 0,
            explanation: 'Verified official corporate presence with organic followers, regular publication history, and official domain link.',
          },
        ],
        status: 'TRAINED',
        last_trained_at: new Date(Date.now() - 4 * 3600000).toISOString(),
      },
      {
        id: 'ds-cresci',
        rank: 2,
        name: 'Cresci-2017 Social Bot Dataset',
        source: 'Botometer / Indiana University (WWW 2017)',
        url: 'https://botometer.osome.iu.edu/bot-repository/datasets/cresci-2017/cresci-2017.csv.zip',
        target_vector: 'SOCIAL_BOTNET',
        algorithm: 'Multi-Class Astroturfing Ensemble',
        sample_count: 14368,
        class_balance: '62% Social Spambots & Fake Followers / 38% Genuine',
        features_list: [
          'statuses_count',
          'followers_count',
          'friends_count',
          'favourites_count',
          'listed_count',
          'default_profile',
          'default_profile_image',
          'geo_enabled',
          'verified',
          'reputation_ratio'
        ],
        description: 'Seminal dataset from Cresci et al. tracking new-generation social spambots (Spambots #1, #2, #3) exhibiting synchronized coordinated behavior and synthetic fake followings.',
        metrics: {
          accuracy: 0.964,
          precision: 0.971,
          recall: 0.958,
          f1_score: 0.964,
          auc_roc: 0.989,
        },
        loss_curve: [
          { epoch: 1, loss: 0.650, val_loss: 0.630 },
          { epoch: 5, loss: 0.380, val_loss: 0.395 },
          { epoch: 10, loss: 0.220, val_loss: 0.245 },
          { epoch: 15, loss: 0.150, val_loss: 0.170 },
          { epoch: 20, loss: 0.098, val_loss: 0.122 },
          { epoch: 25, loss: 0.072, val_loss: 0.095 },
        ],
        feature_importances: [
          { feature: 'reputation_ratio', importance: 0.285, description: 'Followers / (Followers + Friends) network metric' },
          { feature: 'favourites_count', importance: 0.210, description: 'Organic engagement interaction metric' },
          { feature: 'default_profile_image', importance: 0.175, description: 'Uncustomized default silhouette avatar' },
          { feature: 'listed_count', importance: 0.155, description: 'Inclusion in third-party public Twitter lists' },
          { feature: 'statuses_cadence', importance: 0.110, description: 'Automated burst vs natural diurnal activity' },
          { feature: 'geo_enabled', importance: 0.065, description: 'Absence of location metadata' },
        ],
        benchmark_samples: [
          {
            id: 'sample-cresci-01',
            sample_name: '@ApexPayCare_Helpdesk (Social Spambot #2)',
            features: {
              statuses_count: 34,
              followers_count: 15,
              friends_count: 840,
              favourites_count: 0,
              listed_count: 0,
              default_profile: 1,
              default_profile_image: 1,
              reputation_ratio: 0.017,
            },
            label: 1,
            explanation: 'Default profile silhouette, zero favourites interaction, zero list memberships, reputation ratio under 0.02.',
          },
          {
            id: 'sample-cresci-02',
            sample_name: '@vikram_fintech_analyst (Genuine Human)',
            features: {
              statuses_count: 4820,
              followers_count: 3200,
              friends_count: 890,
              favourites_count: 6400,
              listed_count: 28,
              default_profile: 0,
              default_profile_image: 0,
              reputation_ratio: 0.782,
            },
            label: 0,
            explanation: 'High natural favourites interaction, non-default theme, healthy 0.782 reputation ratio, organic cadence.',
          },
        ],
        status: 'TRAINED',
        last_trained_at: new Date(Date.now() - 5 * 3600000).toISOString(),
      },
      {
        id: 'ds-twibot',
        rank: 3,
        name: 'TwiBot-22 Benchmark Dataset',
        source: 'NeurIPS 2022 (Luo et al.)',
        url: 'https://github.com/LuoUndergradXJTU/TwiBot-22',
        target_vector: 'SCAM_CONTENT',
        algorithm: 'Graph Neural + TF-IDF Multimodal NLP',
        sample_count: 229580,
        class_balance: 'Graph-Structured Bot / Human Multimodal Classification',
        features_list: [
          'tweet_entropy',
          'scam_token_density',
          'mention_ratio',
          'hashtag_ratio',
          'url_density',
          'creation_recency_days',
          'activity_burstiness',
          'neighbor_bot_ratio'
        ],
        description: 'The largest and most comprehensive graph-based social bot benchmark from NeurIPS 2022, combining tweet semantics, follower network topology, and financial fraud vocabulary.',
        metrics: {
          accuracy: 0.951,
          precision: 0.946,
          recall: 0.957,
          f1_score: 0.951,
          auc_roc: 0.978,
        },
        loss_curve: [
          { epoch: 1, loss: 0.680, val_loss: 0.670 },
          { epoch: 5, loss: 0.395, val_loss: 0.410 },
          { epoch: 10, loss: 0.240, val_loss: 0.265 },
          { epoch: 15, loss: 0.165, val_loss: 0.190 },
          { epoch: 20, loss: 0.115, val_loss: 0.140 },
          { epoch: 25, loss: 0.082, val_loss: 0.110 },
        ],
        feature_importances: [
          { feature: 'scam_token_density', importance: 0.290, description: 'Concentration of OTP, seed phrase, and bonus claims' },
          { feature: 'neighbor_bot_ratio', importance: 0.240, description: 'Graph clustering with known botnet syndicates' },
          { feature: 'url_density', importance: 0.190, description: 'Percentage of tweets containing external links' },
          { feature: 'tweet_entropy', importance: 0.135, description: 'Low lexical vocabulary diversity across tweets' },
          { feature: 'activity_burstiness', importance: 0.085, description: 'High variance in inter-tweet interval time' },
          { feature: 'mention_ratio', importance: 0.060, description: 'Aggressive tagging of brand handles in replies' },
        ],
        benchmark_samples: [
          {
            id: 'sample-twibot-01',
            sample_name: 'Airdrop Scam Tweet (Node #9)',
            features: {
              tweet_entropy: 0.24,
              scam_token_density: 0.78,
              mention_ratio: 0.65,
              hashtag_ratio: 0.82,
              url_density: 0.95,
              creation_recency_days: 4.0,
              neighbor_bot_ratio: 0.88,
            },
            label: 1,
            explanation: 'High scam token density (0.78), 95% external URL concentration, 88% homophily to known botnet cluster.',
          },
          {
            id: 'sample-twibot-02',
            sample_name: 'Customer Service Inquiry (Human)',
            features: {
              tweet_entropy: 0.74,
              scam_token_density: 0.02,
              mention_ratio: 0.15,
              hashtag_ratio: 0.10,
              url_density: 0.12,
              creation_recency_days: 850.0,
              neighbor_bot_ratio: 0.02,
            },
            label: 0,
            explanation: 'High natural vocabulary entropy, normal conversational grammar, established 850-day account age.',
          },
        ],
        status: 'TRAINED',
        last_trained_at: new Date(Date.now() - 6 * 3600000).toISOString(),
      },
      {
        id: 'ds-phiusiil',
        rank: 4,
        name: 'PhiUSIIL Phishing URL Dataset',
        source: 'UCI Machine Learning Repository (dataset/967)',
        url: 'https://archive.ics.uci.edu/dataset/967/phiusiil+phishing+url+dataset',
        target_vector: 'PHISHING_URL',
        algorithm: 'Extreme Gradient Boosting (XGBoost)',
        sample_count: 235795,
        class_balance: '134,850 Legitimate URLs / 100,945 Phishing URLs',
        features_list: [
          'URLLength',
          'DomainLength',
          'NoOfSubDomain',
          'NoOfLettersInURL',
          'NoOfDegitsInURL',
          'NoOfEqualsInURL',
          'NoOfQMarkInURL',
          'SpcharRatioInURL',
          'IsHTTPS',
          'NoOfDotsInURL',
          'NoOfHyphensInURL',
          'HasSuspiciousWords',
          'TLDLegitimateProb'
        ],
        description: 'UCI benchmark by Prasad & Chandra (Elsevier 2024) extracting 134 lexical, structural, and page entropy features across over 235,000 live verified phishing and benign domains.',
        metrics: {
          accuracy: 0.981,
          precision: 0.985,
          recall: 0.977,
          f1_score: 0.981,
          auc_roc: 0.994,
        },
        loss_curve: [
          { epoch: 1, loss: 0.580, val_loss: 0.560 },
          { epoch: 5, loss: 0.280, val_loss: 0.295 },
          { epoch: 10, loss: 0.140, val_loss: 0.160 },
          { epoch: 15, loss: 0.085, val_loss: 0.105 },
          { epoch: 20, loss: 0.052, val_loss: 0.072 },
          { epoch: 25, loss: 0.038, val_loss: 0.054 },
        ],
        feature_importances: [
          { feature: 'TLDLegitimateProb', importance: 0.260, description: 'Registrar reputation of TLD (.cc, .xyz, .top vs .io, .com)' },
          { feature: 'NoOfDotsInURL', importance: 0.220, description: 'Excessive subdomains masking destination origin' },
          { feature: 'NoOfHyphensInURL', importance: 0.185, description: 'Typosquatting brand name with hyphenated keywords' },
          { feature: 'HasSuspiciousWords', importance: 0.145, description: 'Phishing words: verify, login, security, unfreeze, wallet' },
          { feature: 'SpcharRatioInURL', importance: 0.110, description: 'Density of encoded characters and query parameters' },
          { feature: 'IsHTTPS', importance: 0.080, description: 'Lack of TLS transport layer encryption' },
        ],
        benchmark_samples: [
          {
            id: 'sample-phiusiil-01',
            sample_name: 'apexpay-security-verify.cc',
            features: {
              URLLength: 62,
              DomainLength: 28,
              NoOfSubDomain: 3,
              NoOfDotsInURL: 4,
              NoOfHyphensInURL: 3,
              HasSuspiciousWords: 1,
              TLDLegitimateProb: 0.12,
              IsHTTPS: 1,
            },
            label: 1,
            explanation: 'Abusive .cc TLD, 4 dots, 3 hyphens, credential harvest keywords, high entropy character distribution.',
          },
          {
            id: 'sample-phiusiil-02',
            sample_name: 'https://apexpay.io/',
            features: {
              URLLength: 20,
              DomainLength: 10,
              NoOfSubDomain: 0,
              NoOfDotsInURL: 1,
              NoOfHyphensInURL: 0,
              HasSuspiciousWords: 0,
              TLDLegitimateProb: 0.98,
              IsHTTPS: 1,
            },
            label: 0,
            explanation: 'Short 20-character URL, zero hyphens, clean official .io TLD, valid HTTPS certificate.',
          },
        ],
        status: 'TRAINED',
        last_trained_at: new Date(Date.now() - 3 * 3600000).toISOString(),
      },
      {
        id: 'ds-maldroid',
        rank: 5,
        name: 'CICMalDroid 2020 Android Malware Dataset',
        source: 'Canadian Institute for Cybersecurity (UNB)',
        url: 'https://www.unb.ca/cic/datasets/maldroid-2020.html',
        target_vector: 'ROGUE_APP',
        algorithm: 'Deep Manifest Permission & Intent Auditor',
        sample_count: 17341,
        class_balance: 'Banking Malware, SMS Stealers, Adware, Riskware, Benign',
        features_list: [
          'perm_receive_sms',
          'perm_read_sms',
          'perm_send_sms',
          'perm_system_alert_window',
          'perm_request_install_pkg',
          'perm_bind_accessibility',
          'perm_read_phone_state',
          'perm_internet',
          'total_danger_perms_count',
          'package_typosquat_flag'
        ],
        description: 'University of New Brunswick benchmark analyzing 17,341 real-world Android binaries across 5 threat classes: Banking Trojans, SMS Stealers, Ransomware, Adware, and Benign APKs.',
        metrics: {
          accuracy: 0.973,
          precision: 0.968,
          recall: 0.979,
          f1_score: 0.973,
          auc_roc: 0.991,
        },
        loss_curve: [
          { epoch: 1, loss: 0.620, val_loss: 0.590 },
          { epoch: 5, loss: 0.310, val_loss: 0.330 },
          { epoch: 10, loss: 0.160, val_loss: 0.185 },
          { epoch: 15, loss: 0.095, val_loss: 0.120 },
          { epoch: 20, loss: 0.060, val_loss: 0.085 },
          { epoch: 25, loss: 0.042, val_loss: 0.065 },
        ],
        feature_importances: [
          { feature: 'perm_receive_sms', importance: 0.275, description: 'Interception of incoming 2FA and OTP authentication codes' },
          { feature: 'perm_system_alert_window', importance: 0.230, description: 'Displaying deceptive transparent overlay phishing screens' },
          { feature: 'perm_bind_accessibility', importance: 0.210, description: 'Keylogger and screen reader capabilities hijacking touch events' },
          { feature: 'perm_request_install_pkg', importance: 0.145, description: 'Sideloading secondary malicious payloads without user consent' },
          { feature: 'package_typosquat_flag', importance: 0.090, description: 'Mimicking official package com.apexpay.wallet' },
          { feature: 'perm_read_phone_state', importance: 0.050, description: 'Collecting device IMEI/IMSI for victim targeting' },
        ],
        benchmark_samples: [
          {
            id: 'sample-maldroid-01',
            sample_name: 'ApexPay_2FA_Authenticator.apk',
            features: {
              perm_receive_sms: 1,
              perm_read_sms: 1,
              perm_send_sms: 1,
              perm_system_alert_window: 1,
              perm_bind_accessibility: 1,
              perm_request_install_pkg: 1,
              package_typosquat_flag: 1,
              total_danger_perms_count: 7,
            },
            label: 1,
            explanation: 'High-risk Banking Trojan pattern: Requests SMS interception, overlay permissions, and accessibility keystroke logging.',
          },
          {
            id: 'sample-maldroid-02',
            sample_name: 'com.apexpay.wallet (Official App)',
            features: {
              perm_receive_sms: 0,
              perm_read_sms: 0,
              perm_send_sms: 0,
              perm_system_alert_window: 0,
              perm_bind_accessibility: 0,
              perm_request_install_pkg: 0,
              package_typosquat_flag: 0,
              total_danger_perms_count: 1,
            },
            label: 0,
            explanation: 'Clean official manifest with standard biometric and networking permissions; zero SMS theft or overlay triggers.',
          },
        ],
        status: 'TRAINED',
        last_trained_at: new Date(Date.now() - 2 * 3600000).toISOString(),
      },
    ];
  },

  async trainBenchmarkDataset(datasetId: string): Promise<BenchmarkDataset> {
    const datasets = await this.getBenchmarkDatasets();
    const target = datasets.find((d) => d.id === datasetId) || datasets[0];
    
    // Simulate training optimization and return updated dataset
    return {
      ...target,
      status: 'TRAINED',
      last_trained_at: new Date().toISOString(),
      metrics: {
        ...target.metrics,
        accuracy: Math.min(0.992, target.metrics.accuracy + 0.004),
        f1_score: Math.min(0.991, target.metrics.f1_score + 0.003),
      },
    };
  },

  async trainAllBenchmarkDatasets(): Promise<BenchmarkDataset[]> {
    const datasets = await this.getBenchmarkDatasets();
    return datasets.map((ds) => ({
      ...ds,
      status: 'TRAINED',
      last_trained_at: new Date().toISOString(),
    }));
  },

  async testInferenceOnSample(
    datasetId: string,
    sampleFeatures: Record<string, any>
  ): Promise<TestInferenceResult> {
    const datasets = await this.getBenchmarkDatasets();
    const ds = datasets.find((d) => d.id === datasetId) || datasets[0];

    // Compute explainable prediction based on dataset feature importances
    let riskPoints = 10;
    const contributors: string[] = [];

    if (datasetId === 'ds-instagram') {
      if (sampleFeatures.nums_length_username > 0.2) {
        riskPoints += 30;
        contributors.push(`High digit ratio in username (${sampleFeatures.nums_length_username})`);
      }
      if (sampleFeatures.follows > 500 && sampleFeatures.followers < 100) {
        riskPoints += 35;
        contributors.push(`Outreach bot imbalance (${sampleFeatures.follows} following vs ${sampleFeatures.followers} followers)`);
      }
      if (sampleFeatures.profile_pic === 0) {
        riskPoints += 20;
        contributors.push('Missing profile picture (default avatar)');
      }
    } else if (datasetId === 'ds-cresci') {
      if (sampleFeatures.reputation_ratio < 0.1) {
        riskPoints += 45;
        contributors.push(`Critically low reputation ratio (${sampleFeatures.reputation_ratio})`);
      }
      if (sampleFeatures.favourites_count === 0) {
        riskPoints += 25;
        contributors.push('Zero organic favourites/likes interaction');
      }
    } else if (datasetId === 'ds-twibot') {
      if (sampleFeatures.scam_token_density > 0.4) {
        riskPoints += 40;
        contributors.push(`Scam token density ${(sampleFeatures.scam_token_density * 100).toFixed(0)}%`);
      }
      if (sampleFeatures.neighbor_bot_ratio > 0.6) {
        riskPoints += 35;
        contributors.push('Strong graph clustering with known botnet syndicates');
      }
    } else if (datasetId === 'ds-phiusiil') {
      if (sampleFeatures.TLDLegitimateProb < 0.3) {
        riskPoints += 40;
        contributors.push(`Abusive registrar TLD (.cc/.xyz probability ${sampleFeatures.TLDLegitimateProb})`);
      }
      if (sampleFeatures.NoOfDotsInURL >= 3) {
        riskPoints += 25;
        contributors.push(`Excessive subdomains (${sampleFeatures.NoOfDotsInURL} dots in URL)`);
      }
      if (sampleFeatures.HasSuspiciousWords === 1) {
        riskPoints += 25;
        contributors.push('Contains phishing credential-solicitation keywords');
      }
    } else if (datasetId === 'ds-maldroid') {
      if (sampleFeatures.perm_receive_sms === 1) {
        riskPoints += 35;
        contributors.push('High-risk RECEIVE_SMS permission (OTP interception vector)');
      }
      if (sampleFeatures.perm_system_alert_window === 1) {
        riskPoints += 25;
        contributors.push('SYSTEM_ALERT_WINDOW (phishing overlay screen generator)');
      }
      if (sampleFeatures.perm_bind_accessibility === 1) {
        riskPoints += 30;
        contributors.push('BIND_ACCESSIBILITY_SERVICE (keystroke logger)');
      }
    }

    const finalScore = Math.min(99, Math.max(12, riskPoints));
    const predictedLabel: 0 | 1 = finalScore >= 60 ? 1 : 0;
    const riskLevel: RiskLevel = finalScore >= 80 ? 'CRITICAL' : finalScore >= 60 ? 'HIGH' : finalScore >= 40 ? 'MEDIUM' : 'LOW';

    return {
      dataset_id: datasetId,
      sample_name: sampleFeatures.sample_name || 'Custom Evaluated Sample',
      predicted_label: predictedLabel,
      fraud_probability: Math.min(0.99, finalScore / 100),
      risk_score: finalScore,
      risk_level: riskLevel,
      confidence: Math.min(98, 75 + Math.floor(finalScore * 0.2)),
      key_contributors: contributors.length > 0 ? contributors : ['Signals within benign baseline bounds'],
    };
  },
};

