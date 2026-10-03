import React, { useState } from 'react';
import { Check, Clock, Calendar, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';

export function ModuleMissionCard({
  icon,
  category,
  title,
  subtitle,
  details,
  targetTime,
  isCompleted,
  onToggleComplete,
  onNavigate,
  badgeText,
  badgeVariant = 'default',
  countdownText,
  accentColor = '#38bdf8'
}) {
  const [isRunningTimer, setIsRunningTimer] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Quick session timer toggle
  React.useEffect(() => {
    let interval = null;
    if (isRunningTimer) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunningTimer]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className={`rounded-2xl bg-[#0c1017] border p-5 flex flex-col justify-between transition-all duration-200 group ${
      isCompleted
        ? 'border-emerald-500/20 bg-emerald-950/5'
        : 'border-white/10 hover:border-white/20'
    }`}>
      <div className="space-y-4">
        {/* Top category row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg border"
              style={{
                backgroundColor: `${accentColor}15`,
                borderColor: `${accentColor}30`,
                color: accentColor
              }}
            >
              {icon}
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: accentColor }}>
                {category}
              </span>
              <span className="text-[11px] text-slate-500">Daily Mission</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{targetTime}</span>
          </div>
        </div>

        {/* Content Details */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={`text-base font-bold tracking-tight ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
              {title}
            </h4>
            {badgeText && <Badge variant={badgeVariant}>{badgeText}</Badge>}
          </div>

          {subtitle && (
            <p className="text-xs font-semibold text-slate-300">
              {subtitle}
            </p>
          )}

          {details && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {details}
            </p>
          )}

          {countdownText && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 w-fit mt-1">
              <Calendar className="w-3 h-3" />
              <span>{countdownText}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-5 border-t border-white/5 flex items-center justify-between gap-3 mt-4">
        <div className="flex items-center gap-2">
          {/* Quick Focus Timer Button */}
          <button
            type="button"
            onClick={() => setIsRunningTimer(!isRunningTimer)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors ${
              isRunningTimer
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
                : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-white'
            }`}
            title="Focus Session Timer"
          >
            <Play className={`w-3 h-3 ${isRunningTimer ? 'fill-amber-400' : ''}`} />
            <span>{isRunningTimer ? formatTimer(secondsElapsed) : 'Timer'}</span>
          </button>

          {/* Module Deep Link */}
          {onNavigate && (
            <button
              type="button"
              onClick={onNavigate}
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors px-1"
            >
              <span>View</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Completion Toggle */}
        <button
          type="button"
          onClick={onToggleComplete}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
            isCompleted
              ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
          }`}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>{isCompleted ? 'Done' : 'Complete'}</span>
        </button>
      </div>
    </div>
  );
}
