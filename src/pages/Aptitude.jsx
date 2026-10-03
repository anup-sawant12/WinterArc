import React, { useState, useEffect } from 'react';
import { Target, Clock, CheckCircle2, Play, Pause, RotateCcw, Calendar, BookOpen } from 'lucide-react';
import { ProgressBar } from '../components/common/ProgressBar';

export function Aptitude({
  plan = [],
  progress = {},
  challengeDay = 1,
  todayStr,
  onToggleComplete
}) {
  const currentPlanIndex = (challengeDay - 1) % plan.length;
  const todayTopic = plan[currentPlanIndex] || plan[0];
  const isTodayDone = Boolean(progress[todayStr]?.completed);

  // Focus Stopwatch
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatStopwatch = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Total hours completed
  const totalDaysCompleted = Object.values(progress).filter(p => p.completed).length;
  const totalHours = totalDaysCompleted * 1; // 1 hour per completed day

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Aptitude & Reasoning
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Daily 1-hour session covering Quantitative, Logical Reasoning, and Verbal drills.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-xs font-bold">
            {totalHours} / 90 HOURS COMPLETED
          </div>
        </div>
      </div>

      {/* Today's Active Session Focus Card */}
      <div className="rounded-2xl bg-gradient-to-r from-orange-950/20 via-[#0c1017] to-[#0c1017] border border-orange-500/30 p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-1 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                DAY {challengeDay} FOCUS TOPIC
              </span>
              <span className="text-xs text-slate-400 font-mono">Target: 60 minutes</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {todayTopic?.topic}
            </h2>

            <p className="text-sm font-semibold text-orange-300">
              {todayTopic?.subtopic}
            </p>

            <p className="text-xs text-slate-400 leading-relaxed">
              {todayTopic?.tips || 'Work through 25-30 practice problems focusing on shortcut techniques and rapid calculation.'}
            </p>
          </div>

          {/* Interactive Session Timer & Action */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/40 border border-white/5 p-4 rounded-2xl shrink-0">
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Focus Timer</span>
              <span className="text-3xl font-mono font-black text-white">{formatStopwatch(seconds)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRunning(!isRunning)}
                className={`p-3 rounded-xl font-bold transition-all ${
                  isRunning
                    ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'bg-white/10 hover:bg-white/15 text-white'
                }`}
                title={isRunning ? 'Pause Timer' : 'Start Timer'}
              >
                {isRunning ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-white" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRunning(false);
                  setSeconds(0);
                }}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onToggleComplete()}
              className={`px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                isTodayDone
                  ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.3)]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isTodayDone ? 'Completed' : 'Mark Session Done'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 90-Day Full Curriculum Schedule */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
          90-DAY TOPIC ROADMAP
        </h3>

        <div className="rounded-2xl bg-[#0c1017] border border-white/10 overflow-hidden shadow-xl">
          <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
            {plan.map((item) => {
              const isPastOrToday = item.day <= challengeDay;
              const isCurrent = item.day === challengeDay;

              return (
                <div
                  key={item.day}
                  className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                    isCurrent
                      ? 'bg-orange-500/10 border-l-4 border-orange-500'
                      : isPastOrToday
                      ? 'bg-white/[0.01]'
                      : 'opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs font-bold text-slate-500 w-16">
                      DAY {item.day}
                    </span>
                    <div>
                      <h4 className="text-xs md:text-sm font-bold text-white">
                        {item.topic}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {item.subtopic}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCurrent && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                        TODAY
                      </span>
                    )}
                    <span className="text-xs text-slate-500 font-mono">60m</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
