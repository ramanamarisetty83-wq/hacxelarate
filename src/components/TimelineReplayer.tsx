import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  ShieldAlert, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { AttackTimelineEvent, BlastRadiusMetrics } from '../types/threat';

interface TimelineReplayerProps {
  events: AttackTimelineEvent[];
  blastRadius?: BlastRadiusMetrics;
  onActiveNodeChange?: (nodeId: string) => void;
}

export const TimelineReplayer: React.FC<TimelineReplayerProps> = ({
  events,
  blastRadius,
  onActiveNodeChange,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(events.length);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= events.length) {
            setIsPlaying(false);
            return prev;
          }
          const next = prev + 1;
          const ev = events.find((e) => e.step === next);
          if (ev && onActiveNodeChange) {
            onActiveNodeChange(ev.node_id);
          }
          return next;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, events, onActiveNodeChange]);

  const activeEvent = events.find((e) => e.step === currentStep) || events[events.length - 1];

  const handleStepClick = (stepNum: number) => {
    setCurrentStep(stepNum);
    const ev = events.find((e) => e.step === stepNum);
    if (ev && onActiveNodeChange) {
      onActiveNodeChange(ev.node_id);
    }
  };

  const getPhaseBadge = (phase: string) => {
    switch (phase) {
      case 'RECON':
        return 'text-sky-400 bg-sky-950/60 border-sky-800';
      case 'WEAPONIZATION':
        return 'text-purple-400 bg-purple-950/60 border-purple-800';
      case 'DELIVERY':
        return 'text-amber-400 bg-amber-950/60 border-amber-800';
      case 'EXPLOITATION':
        return 'text-rose-400 bg-rose-950/60 border-rose-800';
      case 'DEFENSE':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/90 overflow-hidden space-y-4 p-5">
      {/* Top Banner: Blast Radius & Exposure Metrics */}
      {blastRadius && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-lg border border-slate-800 bg-slate-900/60">
          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-400" /> Active Financial Exposure
            </span>
            <p className="text-xl font-bold font-mono text-rose-400 tabular-nums mt-0.5">
              ${blastRadius.active_exposure_usd.toLocaleString()}
            </p>
            <span className="text-[10px] text-slate-400 font-mono">
              Rate: ${blastRadius.estimated_hourly_drain_rate}/hr
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Prevented Loss (DRPP)
            </span>
            <p className="text-xl font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
              ${blastRadius.prevented_loss_usd.toLocaleString()}
            </p>
            <span className="text-[10px] text-slate-400 font-mono">
              Via rapid takedown notice
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400">
              Target Victims Intercepted
            </span>
            <p className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
              {blastRadius.victims_intercepted_count.toLocaleString()}
            </p>
            <span className="text-[10px] text-slate-400 font-mono">
              Velocity: {blastRadius.attack_spread_velocity}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase text-slate-400">
              Brand Reputation Risk
            </span>
            <p className="text-xl font-bold font-mono text-amber-400 tabular-nums mt-0.5">
              {blastRadius.potential_reputation_index} / 100
            </p>
            <span className="text-[10px] text-slate-400 font-mono">
              Severe trust dilution averted
            </span>
          </div>
        </div>
      )}

      {/* Scrubber & Player Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-rose-400" />
          <h4 className="text-xs font-mono uppercase font-bold text-white tracking-wider">
            4D Attack Evolution Timeline Replayer
          </h4>
          <span className="text-xs text-slate-400 font-mono">· Step {currentStep} of {events.length}</span>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStepClick(1)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Rewind to Beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Replay' : 'Play Timeline'}</span>
          </button>

          <button
            onClick={() => {
              const next = Math.min(events.length, currentStep + 1);
              handleStepClick(next);
            }}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Next Stage"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Step Circles Track */}
      <div className="relative pt-4 pb-2">
        <div className="absolute top-7 left-4 right-4 h-0.5 bg-slate-800 -z-0" />
        <div className="grid grid-cols-6 gap-2 relative z-10">
          {events.map((ev) => {
            const isCompleted = ev.step <= currentStep;
            const isCurrent = ev.step === currentStep;
            return (
              <div
                key={ev.step}
                onClick={() => handleStepClick(ev.step)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-rose-600 text-white ring-4 ring-rose-950 scale-110 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                      : isCompleted
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-600/60'
                      : 'bg-slate-900 text-slate-600 border border-slate-800 group-hover:border-slate-700'
                  }`}
                >
                  {ev.step}
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-2 truncate max-w-[80px]">
                  {ev.time_offset}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Description Card */}
      {activeEvent && (
        <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/80 flex items-start justify-between gap-4 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${getPhaseBadge(activeEvent.phase)}`}>
                PHASE: {activeEvent.phase}
              </span>
              <span className="text-xs font-mono text-slate-400">{activeEvent.time_offset}</span>
            </div>
            <h5 className="text-sm font-bold text-white tracking-tight">{activeEvent.title}</h5>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeEvent.description}</p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Correlated Target Node</span>
            <span className="font-mono text-rose-400 font-bold text-xs">{activeEvent.node_id}</span>
          </div>
        </div>
      )}
    </div>
  );
};
