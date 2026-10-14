import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean; // positive = risk increased or decreased depending on context
    isGood?: boolean;
  };
  variant?: 'default' | 'critical' | 'warning' | 'info';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  onClick,
}) => {
  const variantStyles = {
    default: 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700',
    critical: 'border-rose-900/40 bg-gradient-to-br from-slate-900/90 to-rose-950/20 hover:border-rose-800/60',
    warning: 'border-amber-900/40 bg-gradient-to-br from-slate-900/90 to-amber-950/20 hover:border-amber-800/60',
    info: 'border-sky-900/40 bg-gradient-to-br from-slate-900/90 to-sky-950/20 hover:border-sky-800/60',
  }[variant];

  const iconColors = {
    default: 'text-slate-400 bg-slate-800/60 border-slate-700/50',
    critical: 'text-rose-400 bg-rose-950/50 border-rose-800/50',
    warning: 'text-amber-400 bg-amber-950/50 border-amber-800/50',
    info: 'text-sky-400 bg-sky-950/50 border-sky-800/50',
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-lg border ${variantStyles} backdrop-blur-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer transform hover:-translate-y-0.5 shadow-lg' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-extrabold font-mono tracking-tight text-white tabular-nums">
              {value}
            </span>
            {trend && (
              <span
                className={`text-xs font-mono font-medium ${
                  trend.isGood ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`p-2.5 rounded-md border ${iconColors}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
