import React from 'react';
import { RiskLevel } from '../types/threat';

interface RiskScoreProps {
  score: number;
  level?: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const RiskScore: React.FC<RiskScoreProps> = ({
  score,
  level,
  size = 'md',
  showLabel = true,
}) => {
  const normalized = Math.min(100, Math.max(0, Math.round(score)));
  
  const computedLevel: RiskLevel = 
    level || 
    (normalized >= 80 ? 'CRITICAL' : 
     normalized >= 60 ? 'HIGH' : 
     normalized >= 40 ? 'MEDIUM' : 'LOW');

  const colorConfig = {
    CRITICAL: {
      text: 'text-rose-400',
      stroke: '#F43F5E',
      bgGlow: 'shadow-[0_0_20px_rgba(244,63,94,0.25)]',
      border: 'border-rose-500/30',
    },
    HIGH: {
      text: 'text-amber-400',
      stroke: '#F59E0B',
      bgGlow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
      border: 'border-amber-500/30',
    },
    MEDIUM: {
      text: 'text-sky-400',
      stroke: '#0EA5E9',
      bgGlow: 'shadow-[0_0_20px_rgba(14,165,233,0.2)]',
      border: 'border-sky-500/30',
    },
    LOW: {
      text: 'text-emerald-400',
      stroke: '#10B981',
      bgGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
      border: 'border-emerald-500/30',
    },
  }[computedLevel];

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${normalized}%`, backgroundColor: colorConfig.stroke }}
          />
        </div>
        <span className={`font-mono font-bold text-xs tabular-nums ${colorConfig.text}`}>
          {normalized}/100
        </span>
      </div>
    );
  }

  // Circular gauge for md and lg
  const radius = size === 'lg' ? 44 : 32;
  const strokeWidth = size === 'lg' ? 6 : 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalized / 100) * circumference;
  const viewBoxSize = (radius + strokeWidth) * 2;

  return (
    <div className="flex flex-col items-center">
      <div className={`relative flex items-center justify-center rounded-full ${colorConfig.bgGlow}`}>
        <svg
          width={viewBoxSize}
          height={viewBoxSize}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={viewBoxSize / 2}
            cy={viewBoxSize / 2}
            r={radius}
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated progress circle */}
          <circle
            cx={viewBoxSize / 2}
            cy={viewBoxSize / 2}
            r={radius}
            stroke={colorConfig.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-mono font-extrabold tabular-nums tracking-tight ${size === 'lg' ? 'text-3xl' : 'text-xl'} ${colorConfig.text}`}>
            {normalized}
          </span>
          <span className="text-[10px] font-mono text-slate-400 tracking-wider">
            /100
          </span>
        </div>
      </div>
      {showLabel && (
        <div className="mt-2 text-center">
          <span className={`text-xs font-mono font-semibold tracking-wider ${colorConfig.text}`}>
            {computedLevel} RISK
          </span>
        </div>
      )}
    </div>
  );
};
