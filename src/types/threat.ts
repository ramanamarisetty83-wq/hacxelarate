export type ThreatType = 
  | 'SOCIAL_IMPERSONATION' 
  | 'SCAM_CONTENT' 
  | 'PHISHING_URL' 
  | 'ROGUE_APP'
  | 'UPI_SPOOFING'
  | 'CANARY_TRIPPED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ThreatStatus = 
  | 'ACTIVE' 
  | 'INVESTIGATING' 
  | 'TAKEDOWN_REQUESTED' 
  | 'RESOLVED' 
  | 'FALSE_POSITIVE';

export interface DetectionReason {
  id: string;
  category: 'IDENTITY' | 'CONTENT' | 'NETWORK' | 'PERMISSIONS' | 'BEHAVIOR';
  description: string;
  weight: number; // 0 - 100
}

export interface RecommendedAction {
  id: string;
  action_type: 'TAKEDOWN' | 'SINKHOLE' | 'REPORT_REGISTRAR' | 'BLOCK_FIREWALL' | 'ALERT_USERS';
  title: string;
  description: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM';
}

export interface RelatedThreat {
  id: string;
  entity: string;
  threat_type: ThreatType;
  relationship: string;
  risk_score: number;
}

export interface Threat {
  id: string;
  threat_type: ThreatType;
  entity: string;
  target_brand: string;
  risk_score: number; // 0 - 100
  risk_level: RiskLevel;
  confidence: number; // 0 - 100
  reasons: string[];
  structured_reasons?: DetectionReason[];
  recommendations: string[];
  structured_recommendations?: RecommendedAction[];
  related_threats: RelatedThreat[];
  evidence: {
    raw_payload?: Record<string, unknown>;
    detected_at: string;
    source_platform?: string;
    matched_patterns?: string[];
    risk_factors?: Record<string, number | string>;
    screenshot_simulated_url?: string;
    sha256_forensic_hash?: string;
    chain_of_custody_timestamp?: string;
  };
  status: ThreatStatus;
  campaign_id?: string;
  campaign_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  brand_name: string;
  official_website: string;
  official_social_handles: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    telegram?: string;
  };
  official_logo?: string;
  official_app_package?: string;
  official_upi_vpa?: string[];
  security_contact?: string;
  created_at: string;
}

export interface SocialProfileInput {
  username: string;
  display_name: string;
  bio: string;
  followers: number;
  following: number;
  post_count: number;
  account_age_days: number;
  verified: boolean;
  external_url?: string;
  profile_image_url?: string;
  target_brand?: string;
}

export interface ScamContentInput {
  text: string;
  url?: string;
  channel?: string;
  author_handle?: string;
  target_brand?: string;
}

export interface UrlInput {
  url: string;
  target_brand?: string;
  context?: string;
}

export interface AppInput {
  app_name: string;
  package_name: string;
  version?: string;
  developer_name?: string;
  developer_email?: string;
  permissions?: string[];
  target_brand?: string;
  apk_file_name?: string;
  apk_size_mb?: number;
  extracted_urls?: string[];
}

export interface CampaignNode {
  id: string;
  type: 'BRAND' | 'SOCIAL' | 'URL' | 'APP';
  label: string;
  sublabel: string;
  threat_id?: string;
  risk_score: number;
  risk_level: RiskLevel;
  status: string;
  x: number;
  y: number;
}

export interface CampaignEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  relationship_type: 'IMPERSONATES' | 'DISTRIBUTES' | 'HARVESTS' | 'DROPS_PAYLOAD';
}

export interface AttackTimelineEvent {
  step: number;
  time_offset: string;
  node_id: string;
  title: string;
  description: string;
  phase: 'RECON' | 'WEAPONIZATION' | 'DELIVERY' | 'EXPLOITATION' | 'DEFENSE';
  is_mitigated?: boolean;
}

export interface BlastRadiusMetrics {
  active_exposure_usd: number;
  prevented_loss_usd: number;
  victims_intercepted_count: number;
  estimated_hourly_drain_rate: number;
  attack_spread_velocity: string;
  potential_reputation_index: number;
}

export interface Campaign {
  id: string;
  name: string;
  threat_actor: string;
  target_brand: string;
  status: 'ACTIVE' | 'DISRUPTED' | 'MONITORING';
  severity: RiskLevel;
  total_threats: number;
  discovered_at: string;
  description: string;
  nodes: CampaignNode[];
  edges: CampaignEdge[];
  attack_narrative: string;
  timeline_events?: AttackTimelineEvent[];
  blast_radius?: BlastRadiusMetrics;
}

export interface IndicThreatItem {
  id: string;
  language: 'te' | 'hi' | 'mr';
  language_label: string;
  channel: 'UPI_VPA' | 'WHATSAPP' | 'SMS_SENDER' | 'TELEGRAM';
  entity: string;
  original_text: string;
  translated_english: string;
  risk_score: number;
  risk_level: RiskLevel;
  threat_category: 'UPI_FRAUD' | 'VISHING_SCRIPT' | 'IMPERSONATION' | 'LOAN_EXTORTION';
  matched_dialect_keywords: string[];
  detected_at: string;
}

export interface CanaryToken {
  id: string;
  token_type: 'HONEY_PROFILE' | 'CANARY_UPI' | 'DECEPTIVE_URL';
  identifier: string;
  platform: string;
  deployed_at: string;
  status: 'ARMED_MONITORING' | 'TRIPPED_ALERT';
  tripped_details?: string;
}

export interface DashboardStats {
  total_threats: number;
  critical_threats: number;
  high_threats: number;
  medium_threats: number;
  low_threats: number;
  social_threats: number;
  suspicious_apps: number;
  suspicious_urls: number;
  scam_content_threats: number;
  takedowns_active: number;
  resolved_threats: number;
  average_risk_score: number;
  recent_incidents: Threat[];
  blast_radius_summary?: BlastRadiusMetrics;
  risk_trend: {
    date: string;
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  }[];
  threat_distribution: {
    name: string;
    count: number;
    color: string;
  }[];
}

export interface IncidentReport {
  report_id: string;
  generated_at: string;
  brand_name: string;
  reporting_period: string;
  summary: {
    total_incidents: number;
    critical_risk_incidents: number;
    active_campaigns: number;
    takedowns_executed: number;
    mean_time_to_detect_hours: number;
  };
  threat_breakdown: Record<string, number>;
  executive_narrative: string;
  top_incidents: Threat[];
  recommended_security_postures: string[];
}

export interface BenchmarkSample {
  id: string;
  sample_name: string;
  features: Record<string, any>;
  label: 0 | 1; // 0 = Legitimate/Benign, 1 = Malicious/Fraud
  explanation: string;
}

export interface FeatureImportance {
  feature: string;
  importance: number; // 0.0 - 1.0
  description: string;
}

export interface BenchmarkDataset {
  id: string;
  rank: number;
  name: string;
  source: string;
  url: string;
  target_vector: ThreatType | 'SOCIAL_BOTNET';
  algorithm: string;
  sample_count: number;
  class_balance: string;
  features_list: string[];
  description: string;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    auc_roc: number;
  };
  loss_curve: { epoch: number; loss: number; val_loss: number }[];
  feature_importances: FeatureImportance[];
  benchmark_samples: BenchmarkSample[];
  status: 'IDLE' | 'TRAINING' | 'TRAINED';
  last_trained_at?: string;
}

export interface TestInferenceResult {
  dataset_id: string;
  sample_name: string;
  predicted_label: 0 | 1;
  fraud_probability: number;
  risk_score: number;
  risk_level: RiskLevel;
  confidence: number;
  key_contributors: string[];
}

