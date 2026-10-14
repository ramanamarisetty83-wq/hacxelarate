import React, { useState } from 'react';
import { Threat, SocialProfileInput, ScamContentInput } from '../types/threat';
import { RiskScore } from '../components/RiskScore';
import { RiskBadge } from '../components/RiskBadge';
import { EvidencePanel } from '../components/EvidencePanel';
import { 
  UserX, 
  MessageSquareWarning, 
  Search, 
  Sparkles, 
  Send, 
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

interface SocialMonitoringProps {
  brandName: string;
  onAnalyzeProfile: (input: SocialProfileInput) => Promise<Threat>;
  onAnalyzeContent: (input: ScamContentInput) => Promise<Threat>;
  onSelectThreat: (threat: Threat) => void;
}

export const SocialMonitoring: React.FC<SocialMonitoringProps> = ({
  brandName,
  onAnalyzeProfile,
  onAnalyzeContent,
  onSelectThreat,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'content'>('profile');

  // Profile Form State
  const [username, setUsername] = useState('@ApexPay_Support_Desk');
  const [displayName, setDisplayName] = useState('ApexPay Official Helpdesk');
  const [bio, setBio] = useState('Official 24/7 ApexPay customer dispute assistance. Send direct message with your registered phone number and wallet recovery OTP to unfreeze account.');
  const [followers, setFollowers] = useState(14);
  const [following, setFollowing] = useState(980);
  const [accountAge, setAccountAge] = useState(4);
  const [isVerified, setIsVerified] = useState(false);
  const [externalUrl, setExternalUrl] = useState('https://apexpay-resolve-dispute.cc');

  // Scam Content State
  const [scamText, setScamText] = useState('URGENT NOTICE: Your ApexPay wallet has been flagged for non-compliance. You must verify your identity within 30 minutes to avoid total forfeiture. Submit your verification OTP code immediately here: https://apexpay-security-verify.cc');
  const [scamUrl, setScamUrl] = useState('https://apexpay-security-verify.cc');

  // Loading & Result State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultThreat, setResultThreat] = useState<Threat | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setResultThreat(null);
    try {
      const threat = await onAnalyzeProfile({
        username,
        display_name: displayName,
        bio,
        followers: Number(followers),
        following: Number(following),
        post_count: 5,
        account_age_days: Number(accountAge),
        verified: isVerified,
        external_url: externalUrl,
        target_brand: brandName,
      });
      setResultThreat(threat);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setResultThreat(null);
    try {
      const threat = await onAnalyzeContent({
        text: scamText,
        url: scamUrl,
        channel: 'Telegram Broadcast Channel',
        target_brand: brandName,
      });
      setResultThreat(threat);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadPresetProfile = (preset: 'impersonator' | 'fan_club') => {
    if (preset === 'impersonator') {
      setUsername('@ApexPay_Support_Live');
      setDisplayName('ApexPay Emergency Support');
      setBio('Official 24/7 Resolution center. If your transaction is pending, DM your wallet address and one-time password.');
      setFollowers(8);
      setFollowing(1450);
      setAccountAge(2);
      setIsVerified(false);
      setExternalUrl('https://apexpay-claims.top');
    } else {
      setUsername('@ApexPayCommunityTalk');
      setDisplayName('ApexPay Unofficial Community');
      setBio('Fan discussion, fintech news and tips about ApexPay products. We are not customer support and will never ask for keys.');
      setFollowers(2400);
      setFollowing(120);
      setAccountAge(320);
      setIsVerified(false);
      setExternalUrl('https://reddit.com/r/apexpay');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Social Media Impersonation & Scam Detection
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Heuristic and NLP analysis examining username similarity, follower-following anomalies, urgency language, and credential requests.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => {
            setActiveTab('profile');
            setResultThreat(null);
          }}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-rose-500 text-white bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserX className="w-4 h-4 text-amber-400" />
          <span>Profile Impersonation Analyzer</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('content');
            setResultThreat(null);
          }}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'content'
              ? 'border-rose-500 text-white bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquareWarning className="w-4 h-4 text-sky-400" />
          <span>Scam Text & Urgency NLP Analyzer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-7 space-y-4">
          {activeTab === 'profile' ? (
            <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/60">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                  Account Forensic Attributes
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Presets:</span>
                  <button
                    type="button"
                    onClick={() => loadPresetProfile('impersonator')}
                    className="text-[11px] font-mono text-rose-400 hover:underline"
                  >
                    High-Risk Impersonator
                  </button>
                  <span className="text-slate-700">·</span>
                  <button
                    type="button"
                    onClick={() => loadPresetProfile('fan_club')}
                    className="text-[11px] font-mono text-emerald-400 hover:underline"
                  >
                    Benign Fan Club
                  </button>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Handle / Username *
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                      placeholder="@ApexPay_Help"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Profile Display Name *
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                      placeholder="ApexPay Support"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Profile Bio / Description *
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    required
                    className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                    placeholder="Enter biography text..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Followers
                    </label>
                    <input
                      type="number"
                      value={followers}
                      onChange={(e) => setFollowers(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Following
                    </label>
                    <input
                      type="number"
                      value={following}
                      onChange={(e) => setFollowing(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Account Age (Days)
                    </label>
                    <input
                      type="number"
                      value={accountAge}
                      onChange={(e) => setAccountAge(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      External Bio Link
                    </label>
                    <input
                      type="text"
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={isVerified}
                        onChange={(e) => setIsVerified(e.target.checked)}
                        className="rounded border-slate-800 bg-slate-950 text-rose-500 focus:ring-0"
                      />
                      <span>Verified Organization Badge</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="w-full py-2.5 px-4 rounded bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white font-medium text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Search className="w-4 h-4" />
                    <span>{isAnalyzing ? 'Running Social Model...' : 'Calculate Profile Risk Score'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/60">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                  Scam Text NLP Analysis
                </span>
              </div>

              <form onSubmit={handleContentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Suspected Scam Message Text *
                  </label>
                  <textarea
                    value={scamText}
                    onChange={(e) => setScamText(e.target.value)}
                    rows={5}
                    required
                    className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                    placeholder="Paste message, tweet, or phishing text..."
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Evaluates urgency indicators, OTP harvesting, seed phrase requests, and financial threats.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Embedded Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={scamUrl}
                    onChange={(e) => setScamUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                    placeholder="https://..."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="w-full py-2.5 px-4 rounded bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white font-medium text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Search className="w-4 h-4" />
                    <span>{isAnalyzing ? 'Evaluating Language Model...' : 'Analyze Message Content'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Real-Time Result Column */}
        <div className="lg:col-span-5">
          {resultThreat ? (
            <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/80 space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono uppercase text-slate-400">Analysis Verdict</span>
                <RiskBadge level={resultThreat.risk_level} />
              </div>

              {/* Gauge Score */}
              <div className="flex justify-center py-2">
                <RiskScore score={resultThreat.risk_score} level={resultThreat.risk_level} size="lg" />
              </div>

              <div className="p-3 rounded border border-slate-800 bg-slate-950/60 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Analyzed Entity:</span>
                  <span className="font-mono text-white font-semibold truncate max-w-[200px]">{resultThreat.entity}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Model Confidence:</span>
                  <span className="font-mono text-emerald-400 font-bold tabular-nums">{resultThreat.confidence}%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Threat Reference:</span>
                  <span className="font-mono text-rose-400 font-bold">{resultThreat.id}</span>
                </div>
              </div>

              {/* Detection Reasons */}
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Detection Rationale ({resultThreat.reasons.length})
                </span>
                <div className="space-y-1.5">
                  {resultThreat.reasons.map((r, i) => (
                    <div key={i} className="p-2 rounded bg-slate-950/40 border border-slate-800 text-xs text-slate-300">
                      • {r}
                    </div>
                  ))}
                </div>
              </div>

              {/* Inspect Button */}
              <button
                onClick={() => onSelectThreat(resultThreat)}
                className="w-full py-2 px-3 text-xs font-medium rounded border border-rose-800 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Full Threat Forensics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="h-full min-h-[360px] p-8 rounded-lg border border-dashed border-slate-800 bg-slate-900/20 flex flex-col items-center justify-center text-center">
              <ShieldAlert className="w-10 h-10 text-slate-600 mb-3" />
              <h4 className="text-sm font-semibold text-slate-300">Awaiting Signal Ingestion</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Fill in social profile attributes or message text on the left and submit to view the explainable risk engine results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
