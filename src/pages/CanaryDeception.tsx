import React, { useState, useEffect } from 'react';
import { CanaryToken } from '../types/threat';
import { apiService } from '../services/api';
import { 
  ShieldAlert, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  ExternalLink,
  Target,
  Sparkles,
  Zap
} from 'lucide-react';
import { Language } from '../i18n/translations';

interface CanaryDeceptionProps {
  brandName: string;
  currentLang: Language;
}

export const CanaryDeception: React.FC<CanaryDeceptionProps> = ({ brandName, currentLang }) => {
  const [tokens, setTokens] = useState<CanaryToken[]>([]);
  const [tokenType, setTokenType] = useState<'HONEY_PROFILE' | 'CANARY_UPI' | 'DECEPTIVE_URL'>('HONEY_PROFILE');
  const [identifier, setIdentifier] = useState('@ApexPay_Rewards_CanaryTrap');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadTokens = async () => {
      const data = await apiService.getCanaryTokens();
      setTokens(data);
    };
    loadTokens();
  }, []);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    const newToken = await apiService.deployCanaryToken(tokenType, identifier);
    setTokens((prev) => [newToken, ...prev]);
    setIsDeploying(false);
    setDeploySuccess(`Deceptive canary ${identifier} armed across search indexes and threat monitors.`);
    setTimeout(() => setDeploySuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
            Active Deception Countermeasure
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-slate-400 font-mono">
            Proactive Adversary Tripwires
          </span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Deceptive Honeypot Profiles & Canary Traps
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Deploy decoy brand assets, honey-profiles, and trap UPI identifiers across search engines and scrapers. When an adversary reconnaissance bot interacts with a canary, DRPP trips a zero-hour takedown trigger before real customers are targeted.
        </p>
      </div>

      {deploySuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{deploySuccess}</span>
        </div>
      )}

      {/* Tripped Alarm Banner */}
      <div className="p-5 rounded-lg border border-rose-900/60 bg-rose-950/30 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-rose-600/20 text-rose-400 border border-rose-500/30 mt-0.5">
            <Radio className="w-5 h-5 text-rose-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase">
                TRIPWIRE ALARM TRIPPED
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-white">Canary Decoy: https://apexpay-auth-canary.org/probe</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Storm-0842 automated recon bot scraped the deceptive canary endpoint from IP <strong>185.220.101.5</strong>. Adversary intention confirmed 18 hours prior to public campaign launch!
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 text-xs font-mono text-rose-300 bg-rose-900/60 rounded border border-rose-700 shrink-0">
          ZERO-HOUR DETECTION
        </span>
      </div>

      {/* Grid: Active Canaries + Deployment Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Canaries List */}
        <div className="lg:col-span-7 space-y-3">
          <h4 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
            Active Deployed Canary Assets ({tokens.length})
          </h4>

          <div className="space-y-3">
            {tokens.map((canary) => {
              const isTripped = canary.status === 'TRIPPED_ALERT';
              return (
                <div
                  key={canary.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isTripped
                      ? 'border-rose-800 bg-rose-950/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                      : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono text-slate-400">
                      {canary.token_type} · {canary.platform}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                        isTripped
                          ? 'bg-rose-900 text-rose-200 border-rose-700'
                          : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      }`}
                    >
                      {isTripped ? 'TRIPPED (ALERT)' : 'ARMED & MONITORING'}
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-white font-mono">{canary.identifier}</h5>

                  {canary.tripped_details && (
                    <p className="mt-2 text-xs text-rose-300 font-mono bg-rose-950/60 p-2 rounded border border-rose-900">
                      ⚠ {canary.tripped_details}
                    </p>
                  )}

                  <div className="mt-2.5 text-[10px] text-slate-400 font-mono flex justify-between">
                    <span>ID: {canary.id}</span>
                    <span>Deployed: {new Date(canary.deployed_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deploy New Canary Form */}
        <div className="lg:col-span-5 p-6 rounded-lg border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-bold text-white">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Deploy New Deceptive Canary</span>
          </div>

          <form onSubmit={handleDeploy} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Canary Trap Type
              </label>
              <select
                value={tokenType}
                onChange={(e: any) => setTokenType(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white font-mono"
              >
                <option value="HONEY_PROFILE">HONEY_PROFILE (Social Media Trap)</option>
                <option value="CANARY_UPI">CANARY_UPI (Deceptive Payment VPA)</option>
                <option value="DECEPTIVE_URL">DECEPTIVE_URL (Tripwire Web Endpoint)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Decoy Asset Identifier *
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                placeholder="e.g. @ApexPay_Refund_Trap"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Indexed in public search directories to bait automated scam crawlers.
              </span>
            </div>

            <button
              type="submit"
              disabled={isDeploying}
              className="w-full py-2.5 px-4 rounded bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white font-medium text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>{isDeploying ? 'Arming Trap...' : 'Arm Deceptive Canary'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
