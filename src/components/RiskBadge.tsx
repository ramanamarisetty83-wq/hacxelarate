import React from 'react';
import { RiskLevel } from '../types/threat';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const configs: Record<RiskLevel, { text: string; bg: string; border: string; textCol: string; dot: string }> = {
    CRITICAL: {
      text: 'CRITICAL',
      bg: 'bg-rose-950/40',
      border: 'border-rose-700/60',
      textCol: 'text-rose-400',
      dot: 'bg-rose-500',
    },
    HIGH: {
      text: 'HIGH',
      bg: 'bg-amber-950/40',
      border: 'border-amber-700/60',
      textCol: 'text-amber-400',
      dot: 'bg-amber-500',
    },
    MEDIUM: {
      text: 'MEDIUM',
      bg: 'bg-sky-950/40',
      border: 'border-sky-700/60',
      textCol: 'text-sky-400',
      dot: 'bg-sky-500',
    },
    LOW: {
      text: 'LOW',
      bg: 'bg-emerald-950/40',
      border: 'border-emerald-700/60',
      textCol: 'text-emerald-400',
      dot: 'bg-emerald-500',
    },
  };

  const c = configs[level] || configs.LOW;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-semibold tracking-wider rounded border ${c.bg} ${c.border} ${c.textCol} ${padding} whitespace-nowrap shrink-0`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      <span>{c.text}</span>
    </span>
  );
};
