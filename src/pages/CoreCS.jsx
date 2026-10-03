import React from 'react';
import { Terminal, Clock, CheckCircle2, BookOpen, Layers } from 'lucide-react';
import { Badge } from '../components/common/Badge';

export function CoreCS({
  plan = [],
  progress = {},
  challengeDay = 1,
  todayStr,
  onToggleComplete
}) {
  const currentPlanIndex = (challengeDay - 1) % plan.length;
  const todayTopic = plan[currentPlanIndex] || plan[0];
  const isTodayDone = Boolean(progress[todayStr]?.completed);

  // Total hours completed
  const totalDaysCompleted = Object.values(progress).filter(p => p.completed).length;
  const totalHours = (totalDaysCompleted * 0.5).toFixed(1); // 30 mins per completed day

  const getSubjectBadge = (subject) => {
    switch (subject) {
      case 'DBMS': return 'cyan';
      case 'Operating Systems': return 'purple';
      case 'Computer Networks': return 'orange';
      case 'OOP': return 'emerald';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💻</span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Core Computer Science
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Systematic 30-minute daily deep dive rotating DBMS, OS, Networks, and OOP.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
            {totalHours} / 45 HOURS COMPLETED
          </div>
        </div>
      </div>

      {/* Today's Active Session Focus Card */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/20 via-[#0c1017] to-[#0c1017] border border-emerald-500/30 p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                DAY {challengeDay} FOCUS TOPIC
              </span>
              <Badge variant={getSubjectBadge(todayTopic?.subject)}>
                {todayTopic?.subject}
              </Badge>
              <span className="text-xs text-slate-400 font-mono">Target: 30 minutes</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {todayTopic?.topic}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-white/5">
              {todayTopic?.details}
            </p>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/40 border border-white/5 p-4 rounded-2xl shrink-0">
            <div className="text-center sm:text-left">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Daily Target</span>
              <span className="text-2xl font-mono font-black text-white">30 MIN</span>
            </div>

            <button
              type="button"
              onClick={() => onToggleComplete()}
              className={`px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                isTodayDone
                  ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isTodayDone ? 'Completed' : 'Mark Complete'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 90-Day Full Curriculum Schedule */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
          90-DAY CORE CS ROTATION
        </h3>

        <div className="rounded-2xl bg-[#0c1017] border border-white/10 overflow-hidden shadow-xl">
          <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
            {plan.map((item) => {
              const isCurrent = item.day === challengeDay;

              return (
                <div
                  key={item.day}
                  className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                    isCurrent
                      ? 'bg-emerald-500/10 border-l-4 border-emerald-500'
                      : 'hover:bg-white/[0.01]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs font-bold text-slate-500 w-16">
                      DAY {item.day}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getSubjectBadge(item.subject)} size="xs">
                          {item.subject}
                        </Badge>
                        <h4 className="text-xs md:text-sm font-bold text-white">
                          {item.topic}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {item.details}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCurrent && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        TODAY
                      </span>
                    )}
                    <span className="text-xs text-slate-500 font-mono">30m</span>
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
