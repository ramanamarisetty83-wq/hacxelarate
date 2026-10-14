import React from 'react';
import { Threat, ThreatStatus } from '../types/threat';
import { RiskBadge } from './RiskBadge';
import { Globe, UserX, Smartphone, AlertTriangle, Eye, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ThreatTableProps {
  threats: Threat[];
  onSelectThreat: (threat: Threat) => void;
  onUpdateStatus?: (id: string, status: ThreatStatus) => void;
}

export const ThreatTable: React.FC<ThreatTableProps> = ({
  threats,
  onSelectThreat,
  onUpdateStatus,
}) => {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'SOCIAL_IMPERSONATION':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-medium">
            <UserX className="w-3.5 h-3.5 text-amber-400" />
            Social
          </span>
        );
      case 'PHISHING_URL':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-rose-300 font-medium">
            <Globe className="w-3.5 h-3.5 text-rose-400" />
            URL
          </span>
        );
      case 'ROGUE_APP':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-purple-300 font-medium">
            <Smartphone className="w-3.5 h-3.5 text-purple-400" />
            App (APK)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-sky-300 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-sky-400" />
            Content
          </span>
        );
    }
  };

  const getStatusText = (status: ThreatStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="text-xs text-rose-400 font-medium">Active Threat</span>;
      case 'TAKEDOWN_REQUESTED':
        return <span className="text-xs text-amber-400 font-medium">Takedown Sent</span>;
      case 'INVESTIGATING':
        return <span className="text-xs text-sky-400 font-medium">Investigating</span>;
      case 'RESOLVED':
        return <span className="text-xs text-emerald-400 font-medium">Neutralized</span>;
      case 'FALSE_POSITIVE':
        return <span className="text-xs text-slate-500 line-through">False Positive</span>;
      default:
        return <span className="text-xs text-slate-400">{status}</span>;
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  if (threats.length === 0) {
    return (
      <div className="p-12 text-center border border-slate-800 bg-slate-900/40 rounded-lg">
        <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <h4 className="text-base font-semibold text-slate-300">No threats found</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No matching threat vectors recorded for the selected filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/60">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <th className="py-3 px-4">Threat Entity</th>
            <th className="py-3 px-4">Vector</th>
            <th className="py-3 px-4">Risk Score</th>
            <th className="py-3 px-4">Severity</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Detected</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300 font-sans">
          {threats.map((threat) => (
            <tr
              key={threat.id}
              className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
              onClick={() => onSelectThreat(threat)}
            >
              <td className="py-3 px-4 max-w-xs">
                <div className="font-semibold text-white tracking-tight truncate group-hover:text-rose-400 transition-colors">
                  {threat.entity}
                </div>
                <div className="text-xs text-slate-400 font-mono tabular-nums">
                  {threat.id} · Target: {threat.target_brand}
                </div>
              </td>

              <td className="py-3 px-4 whitespace-nowrap">
                {getTypeBadge(threat.threat_type)}
              </td>

              <td className="py-3 px-4 whitespace-nowrap font-mono tabular-nums font-bold">
                <span
                  className={
                    threat.risk_score >= 80
                      ? 'text-rose-400'
                      : threat.risk_score >= 60
                      ? 'text-amber-400'
                      : threat.risk_score >= 40
                      ? 'text-sky-400'
                      : 'text-emerald-400'
                  }
                >
                  {threat.risk_score}
                </span>
                <span className="text-xs text-slate-400">/100</span>
              </td>

              <td className="py-3 px-4 whitespace-nowrap">
                <RiskBadge level={threat.risk_level} size="sm" />
              </td>

              <td className="py-3 px-4 whitespace-nowrap">
                {getStatusText(threat.status)}
              </td>

              <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-400 font-mono tabular-nums">
                {formatDate(threat.created_at)}
              </td>

              <td className="py-3 px-4 whitespace-nowrap text-right">
                <div
                  className="flex items-center justify-end gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onSelectThreat(threat)}
                    className="p-1.5 rounded hover:bg-slate-700/60 text-slate-400 hover:text-white transition-colors"
                    title="View Forensics & Evidence"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {threat.status !== 'TAKEDOWN_REQUESTED' && threat.status !== 'RESOLVED' && onUpdateStatus && (
                    <button
                      onClick={() => onUpdateStatus(threat.id, 'TAKEDOWN_REQUESTED')}
                      className="px-2 py-1 text-xs font-medium rounded border border-rose-800/80 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 transition-colors"
                      title="Issue Takedown Notice"
                    >
                      Takedown
                    </button>
                  )}

                  {threat.status === 'TAKEDOWN_REQUESTED' && onUpdateStatus && (
                    <button
                      onClick={() => onUpdateStatus(threat.id, 'RESOLVED')}
                      className="p-1.5 rounded hover:bg-emerald-950/60 text-emerald-400 transition-colors"
                      title="Mark Resolved"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
