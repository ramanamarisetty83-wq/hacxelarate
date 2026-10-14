import React, { useState } from 'react';
import { Threat, UrlInput } from '../types/threat';
import { RiskScore } from '../components/RiskScore';
import { RiskBadge } from '../components/RiskBadge';
import { 
  Globe, 
  Search, 
  ShieldAlert, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Unlock
} from 'lucide-react';

interface UrlMonitoringProps {
  brandName: string;
  onAnalyzeUrl: (input: UrlInput) => Promise<Threat>;
  onSelectThreat: (threat: Threat) => void;
}

export const UrlMonitoring: React.FC<UrlMonitoringProps> = ({
  brandName,
  onAnalyzeUrl,
  onSelectThreat,
}) => {
  const [url, setUrl] = useState('https://apexpay-security-verify.cc/login');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultThreat, setResultThreat] = useState<Threat | null>(null);

  // Live client-side feature extraction for preview
  const getUrlStats = (testUrl: string) => {
    try {
      const u = testUrl.trim();
      const length = u.length;
      const dots = (u.match(/\./g) || []).length;
      const hyphens = (u.match(/-/g) || []).length;
      const isHttps = u.startsWith('https://');
      const hasBrand = u.toLowerCase().includes(brandName.toLowerCase());
      const suspiciousTlds = ['.xyz', '.cc', '.top', '.tk', '.ml', '.buzz', '.rest'];
      const tldMatch = suspiciousTlds.find((t) => u.toLowerCase().includes(t));
      return { length, dots, hyphens, isHttps, hasBrand, tldMatch };
    } catch {
      return { length: 0, dots: 0, hyphens: 0, isHttps: false, hasBrand: false, tldMatch: null };
    }
  };

  const stats = getUrlStats(url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setIsAnalyzing(true);
    setResultThreat(null);
    try {
      const threat = await onAnalyzeUrl({
        url,
        target_brand: brandName,
      });
      setResultThreat(threat);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadPreset = (presetUrl: string) => {
    setUrl(presetUrl);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Phishing & Suspicious URL Feature Extractor
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Analyzes domain entropy, brand typosquatting, abusive registrar TLDs, and structural redirection paths.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* URL Form Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-lg border border-slate-800 bg-slate-900/60">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                Domain Ingestion
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Presets:</span>
                <button
                  type="button"
                  onClick={() => loadPreset('https://apexpay-security-verify.cc/login')}
                  className="text-[11px] font-mono text-rose-400 hover:underline"
                >
                  Phish Portal (.cc)
                </button>
                <span className="text-slate-700">·</span>
                <button
                  type="button"
                  onClick={() => loadPreset('https://apexpay-airdrop-bonus.xyz/claim')}
                  className="text-[11px] font-mono text-amber-400 hover:underline"
                >
                  Drainer (.xyz)
                </button>
                <span className="text-slate-700">·</span>
                <button
                  type="button"
                  onClick={() => loadPreset('https://apexpay.io')}
                  className="text-[11px] font-mono text-emerald-400 hover:underline"
                >
                  Official Legit
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Target URL to Analyze *
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-rose-500 transition-colors"
                    placeholder="https://apexpay-verify-account.cc"
                  />
                </div>
              </div>

              {/* Real-time Feature Metrics Preview Strip */}
              <div className="p-4 rounded border border-slate-800 bg-slate-950/70">
                <span className="text-[11px] font-mono uppercase text-slate-400 block mb-2">
                  Lexical Telemetry (Heuristic Preview)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Length:</span>
                    <span className="font-mono text-white tabular-nums">{stats.length} chars</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Dots count:</span>
                    <span className="font-mono text-white tabular-nums">{stats.dots}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Hyphens:</span>
                    <span className={`font-mono tabular-nums ${stats.hyphens > 1 ? 'text-amber-400' : 'text-white'}`}>
                      {stats.hyphens}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">SSL Protocol:</span>
                    <span className={`font-mono flex items-center gap-1 ${stats.isHttps ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stats.isHttps ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      {stats.isHttps ? 'HTTPS' : 'Insecure HTTP'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Brand match:</span>
                    <span className={`font-mono ${stats.hasBrand ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                      {stats.hasBrand ? 'Typosquat match' : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">TLD Risk:</span>
                    <span className={`font-mono ${stats.tldMatch ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                      {stats.tldMatch ? `Abusive (${stats.tldMatch})` : 'Standard'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full py-2.5 px-4 rounded bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white font-medium text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <Search className="w-4 h-4" />
                  <span>{isAnalyzing ? 'Extracting Heuristics & Verifying Rep...' : 'Analyze Phishing Risk'}</span>
                </button>
              </div>
            </form>
          </div>
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
                  <span className="text-slate-400">Analyzed URL:</span>
                  <span className="font-mono text-white font-semibold truncate max-w-[200px]">{resultThreat.entity}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Model Confidence:</span>
                  <span className="font-mono text-emerald-400 font-bold tabular-nums">{resultThreat.confidence}%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Threat Identifier:</span>
                  <span className="font-mono text-rose-400 font-bold">{resultThreat.id}</span>
                </div>
              </div>

              {/* Detection Reasons */}
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Heuristic Detections ({resultThreat.reasons.length})
                </span>
                <div className="space-y-1.5">
                  {resultThreat.reasons.map((r, i) => (
                    <div key={i} className="p-2 rounded bg-slate-950/40 border border-slate-800 text-xs text-slate-300">
                      • {r}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectThreat(resultThreat)}
                className="w-full py-2 px-3 text-xs font-medium rounded border border-rose-800 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Inspect Forensics & Dispatch Takedown</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="h-full min-h-[360px] p-8 rounded-lg border border-dashed border-slate-800 bg-slate-900/20 flex flex-col items-center justify-center text-center">
              <Globe className="w-10 h-10 text-slate-600 mb-3" />
              <h4 className="text-sm font-semibold text-slate-300">Awaiting URL Submission</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Paste a domain or link to examine brand typosquatting, phishing keywords, and abusive registrar TLD risks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
