import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', label }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-slate-400">
      <div
        className={`${sizeClasses[size]} border-slate-700 border-t-rose-500 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {label && <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">{label}</p>}
    </div>
  );
};
