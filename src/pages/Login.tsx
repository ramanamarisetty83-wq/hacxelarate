import React, { useState } from 'react';
import { ShieldAlert, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('analyst@apexpay-soc.io');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 600);
  };

  const handleQuickDemo = () => {
    setEmail('analyst@apexpay-soc.io');
    setPassword('demo-soc-pass');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background ambient grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-400 mx-auto flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Digital Risk Protection Platform
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Enterprise Brand & Attack Campaign Defense
          </p>
        </div>

        {/* Login Box */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              SOC Portal Sign In
            </span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> System Online
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Security Officer ID / Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Access Token / Passphrase
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs tracking-wide uppercase transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50"
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Enter Security Operations Center</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400 mb-2.5">
              Hackathon Evaluation Mode:
            </p>
            <button
              onClick={handleQuickDemo}
              className="w-full py-2 px-3 text-xs font-mono font-medium rounded border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant Access · ApexPay Brand Scenario</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-400 mt-6 font-mono">
          Correlating Social · Web · Mobile Threats into Unified Attack Campaigns
        </p>
      </div>
    </div>
  );
};
