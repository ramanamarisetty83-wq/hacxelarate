import React from 'react';
import { Threat } from '../types/threat';
import { RiskBadge } from './RiskBadge';
import { Globe, UserX, Smartphone, AlertTriangle, ArrowRight } from 'lucide-react';

interface ThreatCardProps {
  threat: Threat;
  onSelect: (threat: Threat) => void;
}

export const ThreatCard: React.FC<ThreatCardProps> = ({ threat, onSelect }) => {
  const getIcon = () => {
    switch (threat.threat_type) {
      case 'SOCIAL_IMPERSONATION':
        return <UserX className="w-4 h-4 text-amber-400" />;
      case 'PHISHING_URL':
        return <Globe className="w-4 h-4 text-rose-400" />;
      case 'ROGUE_APP':
        return <Smartphone className="w-4 h-4 text-purple-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-sky-400" />;
    }
  };

  const getTypeName = () => {
    switch (threat.threat_type) {
      case 'SOCIAL_IMPERSONATION':
        return 'Fake Social Profile';
      case 'PHISHING_URL':
        return 'Phishing Domain';
      case 'ROGUE_APP':
        return 'Suspicious APK';
      default:
        return 'Scam Content';
    }
  };

  return (
    <div
      onClick={() => onSelect(threat)}
      className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            {getIcon()}
            <span>{getTypeName()}</span>
          </div>
          <RiskBadge level={threat.risk_level} size="sm" />
        </div>

        <h4 className="text-sm font-semibold text-white tracking-tight break-all group-hover:text-rose-400 transition-colors">
          {threat.entity}
        </h4>

        {threat.reasons && threat.reasons.length > 0 && (
          <p className="mt-2 text-xs text-slate-400 line-clamp-2">
            {threat.reasons[0]}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="font-mono tabular-nums">
          Score: <strong className="text-white">{threat.risk_score}</strong>/100
        </span>
        <span className="flex items-center gap-1 text-slate-300 group-hover:text-rose-400 font-medium transition-colors">
          Inspect <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );
};
