import React from 'react';

export function ProgressBar({ percent = 0, color = 'cyan', height = 'h-2', showLabel = false, className = '' }) {
  const clampedPercent = Math.min(100, Math.max(0, Math.round(percent)));

  const gradientMap = {
    cyan: 'from-cyan-500 to-sky-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]',
    orange: 'from-orange-500 to-amber-400 shadow-[0_0_12px_rgba(249,115,22,0.5)]',
    emerald: 'from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]',
    purple: 'from-purple-500 to-indigo-400 shadow-[0_0_12px_rgba(168,85,247,0.5)]',
    gradient: 'from-cyan-500 via-sky-400 to-indigo-500 shadow-[0_0_14px_rgba(56,189,248,0.5)]'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-1.5">
          <span>Progress</span>
          <span className="text-slate-200 font-semibold">{clampedPercent}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-900/90 rounded-full overflow-hidden border border-white/5 ${height} p-[2px]`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradientMap[color] || gradientMap.cyan} transition-all duration-500 ease-out`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
    </div>
  );
}
