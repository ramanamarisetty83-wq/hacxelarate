import React from 'react';
import { Threat, ThreatStatus } from '../types/threat';
import { RiskScore } from '../components/RiskScore';
import { RiskBadge } from '../components/RiskBadge';
import { EvidencePanel } from '../components/EvidencePanel';
import { 
  ArrowLeft, 
  Globe, 
  UserX, 
  Smartphone, 
  AlertTriangle, 
  Calendar, 
  ShieldAlert, 
  Send, 
  ExternalLink,
  Share2,
  CheckCircle2,
  Layers
} from 'lucide-react';

interface ThreatDetailsProps {
  threat: Threat;
  onBack: () => void;
  onSelectThreat: (threat: Threat) => void;
  onUpdateStatus: (id: string, status: ThreatStatus, feedback?: string) => void;
  onNavigateToCampaign?: (campaignId?: string) => void;
}

export const ThreatDetails: React.FC<ThreatDetailsProps> = ({
  threat,
  onBack,
  onSelectThreat,
  onUpdateStatus,
  onNavigateToCampaign,
}) => {
  const getIcon = () => {
    switch (threat.threat_type) {
      case 'SOCIAL_IMPERSONATION':
        return <UserX className="w-5 h-5 text-amber-400" />;
      case 'PHISHING_URL':
        return <Globe className="w-5 h-5 text-rose-400" />;
      case 'ROGUE_APP':
        return <Smartphone className="w-5 h-5 text-purple-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-sky-400" />;
    }
  };

  const getTypeName = () => {
    switch (threat.threat_type) {
      case 'SOCIAL_IMPERSONATION':
        return 'Social Profile Impersonation';
      case 'PHISHING_URL':
        return 'Phishing & Credential Harvest Domain';
      case 'ROGUE_APP':
        return 'Trojanized Mobile Application (APK)';
      default:
        return 'Scam Text & Urgency Content';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Strip */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Threat Console</span>
        </button>

        <div className="flex items-center gap-3">
          {threat.campaign_id && onNavigateToCampaign && (
            <button
              onClick={() => onNavigateToCampaign(threat.campaign_id)}
              className="px-3 py-1.5 text-xs font-mono rounded border border-rose-800 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Correlated in Attack Campaign</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span>Status:</span>
            <span className="text-white font-bold">{threat.status}</span>
          </div>
        </div>
      </div>

      {/* Hero Threat Banner */}
      <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg border border-slate-700 bg-slate-800/80 shrink-0 mt-1">
            {getIcon()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">
                {getTypeName()}
              </span>
              <span className="text-slate-600">·</span>
              <RiskBadge level={threat.risk_level} />
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight break-all">
              {threat.entity}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <span>Incident ID: <strong className="text-rose-400">{threat.id}</strong></span>
              <span>·</span>
              <span>Target: <strong className="text-white">{threat.target_brand}</strong></span>
              <span>·</span>
              <span>Detected: <strong className="text-slate-300">{new Date(threat.created_at).toLocaleDateString()}</strong></span>
            </div>
          </div>
        </div>

        {/* Risk Score Pill on Right */}
        <div className="shrink-0 flex items-center gap-6 p-4 rounded-lg border border-slate-800 bg-slate-950/80">
          <RiskScore score={threat.risk_score} level={threat.risk_level} size="md" />
          <div className="text-xs space-y-1 font-mono">
            <div>
              <span className="text-slate-400">Model Confidence:</span>
              <p className="text-base font-bold text-emerald-400 tabular-nums">{threat.confidence}%</p>
            </div>
            <div>
              <span className="text-slate-400">Classification:</span>
              <p className="font-semibold text-rose-400">{threat.risk_level} SEVERITY</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Evidence Panel (Tabs: Reasons, Forensic Artifacts, Recommendations, Raw Payload) */}
      <EvidencePanel threat={threat} onUpdateStatus={onUpdateStatus} />

      {/* Related Threats (Attack Campaign Links) */}
      {threat.related_threats && threat.related_threats.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Correlated Threat Vectors ({threat.related_threats.length})
              </h3>
              <p className="text-xs text-slate-400">
                Connected infrastructure and identities correlated into the same adversary syndicate
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {threat.related_threats.map((rt) => (
              <div
                key={rt.id}
                className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                    <span className="text-rose-400 font-bold">{rt.threat_type}</span>
                    <span>·</span>
                    <span>{rt.relationship}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white truncate max-w-xs">{rt.entity}</h4>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Risk Score: <strong className="text-white tabular-nums">{rt.risk_score}</strong>/100
                  </p>
                </div>

                <span className="px-2.5 py-1 text-xs font-mono text-slate-400 bg-slate-800/80 rounded border border-slate-700">
                  {rt.id}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
