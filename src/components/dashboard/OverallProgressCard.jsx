import React from 'react';
import { ProgressBar } from '../common/ProgressBar';
import { Check, Flame, Trophy, Calendar, CheckCircle2 } from 'lucide-react';

export function OverallProgressCard({
  challengeDay,
  targetDuration = 90,
  streakStats,
  todayProgressPercent,
  dsaCompletedCount,
  dsaTotal = 3,
  isAptitudeFinished,
  isCoreCSFinished,
  isCollegeFinished,
  isProjectFinished,
  hasCollege,
  hasProject
}) {
  const arcPercent = Math.min(100, Math.round((Math.max(0, challengeDay - 1 + (todayProgressPercent === 100 ? 1 : 0)) / targetDuration) * 100));

  const checklistItems = [
    { label: 'DSA', value: `${dsaCompletedCount} / ${dsaTotal}`, isDone: dsaCompletedCount >= dsaTotal },
    { label: 'Aptitude', value: isAptitudeFinished ? '✓' : '0 / 1', isDone: isAptitudeFinished },
    { label: 'Core CS', value: isCoreCSFinished ? '✓' : '0 / 1', isDone: isCoreCSFinished },
  ];

  if (hasCollege) {
    checklistItems.push({
      label: 'College',
      value: isCollegeFinished ? '✓' : '0 / 1',
      isDone: isCollegeFinished
    });
  }

  if (hasProject) {
    checklistItems.push({
      label: 'Project',
      value: isProjectFinished ? '✓' : '0 / 1',
      isDone: isProjectFinished
    });
  }

  return (
    <div className="rounded-2xl bg-[#0c1017] border border-white/10 p-5 md:p-6 space-y-6 shadow-xl">
      {/* 90-Day Challenge Overall Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold tracking-wider uppercase">WINTER ARC PROGRESS</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-semibold">{challengeDay} / {targetDuration} days</span>
          </div>
          <span className="text-white font-extrabold text-sm">{arcPercent}%</span>
        </div>
        <ProgressBar percent={arcPercent} color="cyan" height="h-2.5" />
      </div>

      {/* Today's Tasks Completion Breakdown */}
      <div className="pt-2 border-t border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
            TODAY'S MISSION PROGRESS
          </h4>
          <span className="text-xs font-mono font-bold text-amber-400">{todayProgressPercent}%</span>
        </div>

        <ProgressBar percent={todayProgressPercent} color="orange" height="h-2" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-2">
          {checklistItems.map(item => (
            <div
              key={item.label}
              className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                item.isDone
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-white/[0.02] border-white/5 text-slate-400'
              }`}
            >
              <span className="text-xs font-medium">{item.label}</span>
              <div className="flex items-center gap-1 font-mono text-xs font-bold">
                {item.isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <span className="text-slate-500">{item.value}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
