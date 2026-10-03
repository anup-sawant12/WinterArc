import React, { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, AlertCircle, Clock, Check, X, Circle, Sparkles, ExternalLink } from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { parseDateString, formatDateToString } from '../utils/dateUtils';
import { getDailyDsaQuestions } from '../utils/dsaScheduler';
import { Badge } from '../components/common/Badge';

export function CalendarView({
  startDateStr,
  currentChallengeDay,
  dsaQuestions = [],
  dsaStatus = {},
  dsaDailyAssignments = {},
  aptitudePlan = [],
  aptitudeProgress = {},
  coreCSPlan = [],
  coreCSProgress = {},
  collegeSubjects = [],
  collegeProgress = {},
  projectTasks = [],
  projectProgress = {},
  completedDates = []
}) {
  const [selectedDayInfo, setSelectedDayInfo] = useState(null);

  // Generate 90 day slots
  const days = Array.from({ length: 90 }, (_, i) => {
    const dayNum = i + 1;
    const start = parseDateString(startDateStr);
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const dateStr = formatDateToString(date);

    const isPast = dayNum < currentChallengeDay;
    const isToday = dayNum === currentChallengeDay;
    const isFuture = dayNum > currentChallengeDay;

    const isCompleted = completedDates.includes(dateStr);
    
    // Check partial progress on this day
    const hasAptitude = Boolean(aptitudeProgress[dateStr]?.completed);
    const hasCoreCS = Boolean(coreCSProgress[dateStr]?.completed);
    const hasCollege = Boolean(collegeProgress[dateStr]?.completed);
    const hasProject = Boolean(projectProgress[dateStr]?.completed);
    const isPartial = !isCompleted && (hasAptitude || hasCoreCS || hasCollege || hasProject);

    let statusType = 'future';
    if (isCompleted) statusType = 'completed';
    else if (isToday) statusType = isPartial ? 'partial' : 'today';
    else if (isPast) statusType = isPartial ? 'partial' : 'missed';

    return {
      dayNum,
      dateStr,
      date,
      isPast,
      isToday,
      isFuture,
      statusType
    };
  });

  const handleInspectDay = (dayItem) => {
    // Look up day's topics
    const aptTopic = aptitudePlan[(dayItem.dayNum - 1) % aptitudePlan.length];
    const csTopic = coreCSPlan[(dayItem.dayNum - 1) % coreCSPlan.length];
    
    // DSA questions for this day
    const assignedIds = dsaDailyAssignments[dayItem.dateStr];
    let dayQuestions = [];
    if (Array.isArray(assignedIds)) {
      dayQuestions = assignedIds.map(id => dsaQuestions.find(q => q.id === id)).filter(Boolean);
    } else {
      dayQuestions = getDailyDsaQuestions({
        dateStr: dayItem.dateStr,
        challengeDay: dayItem.dayNum,
        questions: dsaQuestions,
        questionStatus: dsaStatus
      });
    }

    setSelectedDayInfo({
      ...dayItem,
      aptitude: aptTopic,
      coreCS: csTopic,
      dsa: dayQuestions,
      isAptDone: Boolean(aptitudeProgress[dayItem.dateStr]?.completed),
      isCSDone: Boolean(coreCSProgress[dayItem.dateStr]?.completed),
      isColDone: Boolean(collegeProgress[dayItem.dateStr]?.completed),
      isProjDone: Boolean(projectProgress[dayItem.dateStr]?.completed)
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📅</span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              90-Day Challenge Calendar
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Visual day-by-day roadmap. Click any day to inspect its curriculum and targets.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono flex-wrap bg-[#0c1017] p-2.5 rounded-xl border border-white/5">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>✓ Complete</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>◐ Partial</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>× Missed</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>⚡ Today</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span>○ Future</span>
          </div>
        </div>
      </div>

      {/* 90-Day Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2.5">
        {days.map((item) => {
          let cardStyle = 'bg-white/[0.02] border-white/5 text-slate-500';
          let statusIcon = <Circle className="w-3.5 h-3.5 text-slate-700" />;

          if (item.statusType === 'completed') {
            cardStyle = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]';
            statusIcon = <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />;
          } else if (item.statusType === 'partial') {
            cardStyle = 'bg-amber-500/15 border-amber-500/40 text-amber-400';
            statusIcon = <span className="font-bold text-xs text-amber-400">◐</span>;
          } else if (item.statusType === 'missed') {
            cardStyle = 'bg-rose-500/10 border-rose-500/20 text-rose-400';
            statusIcon = <X className="w-4 h-4 text-rose-400" />;
          } else if (item.statusType === 'today') {
            cardStyle = 'bg-cyan-500/15 border-cyan-400 text-cyan-300 ring-2 ring-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]';
            statusIcon = <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />;
          }

          return (
            <button
              key={item.dayNum}
              type="button"
              onClick={() => handleInspectDay(item)}
              className={`p-3 rounded-xl border flex flex-col items-center justify-between gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 ${cardStyle}`}
            >
              <span className="font-mono text-xs font-bold">
                {item.dayNum}
              </span>
              <div className="my-0.5">
                {statusIcon}
              </div>
              <span className="text-[9px] font-mono opacity-60">
                {item.date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
              </span>
            </button>
          );
        })}
      </div>

      {/* Day Inspector Modal */}
      {selectedDayInfo && (
        <Modal
          isOpen={Boolean(selectedDayInfo)}
          onClose={() => setSelectedDayInfo(null)}
          title={`Day ${selectedDayInfo.dayNum} Mission Curriculum`}
          subtitle={selectedDayInfo.dateStr}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            {/* Status Pill */}
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs text-slate-400 font-mono">Day Status:</span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
                {selectedDayInfo.statusType.toUpperCase()}
              </span>
            </div>

            {/* DSA Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">🧠 DSA Problems</span>
                <span className="text-[10px] text-slate-500 font-mono">3 Problems</span>
              </div>
              <div className="space-y-1.5">
                {selectedDayInfo.dsa.map((q, idx) => (
                  <div key={q.id || idx} className="p-2.5 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-white font-semibold">{idx + 1}. {q.title}</span>
                      <span className="text-[10px] text-slate-400 ml-2 font-mono">{q.difficulty} • {q.topic}</span>
                    </div>
                    {q.link && (
                      <a href={q.link} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Aptitude Section */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-orange-400 uppercase">🎯 Aptitude (60m)</span>
                <span className="text-xs font-mono">{selectedDayInfo.isAptDone ? '✓ Done' : 'Pending'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5 text-xs">
                <span className="text-white font-bold">{selectedDayInfo.aptitude?.topic}</span>
                <p className="text-[11px] text-slate-400">{selectedDayInfo.aptitude?.subtopic}</p>
              </div>
            </div>

            {/* Core CS Section */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">💻 Core CS (30m)</span>
                <span className="text-xs font-mono">{selectedDayInfo.isCSDone ? '✓ Done' : 'Pending'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5 text-xs">
                <span className="text-white font-bold">{selectedDayInfo.coreCS?.subject} — {selectedDayInfo.coreCS?.topic}</span>
                <p className="text-[11px] text-slate-400 line-clamp-1">{selectedDayInfo.coreCS?.details}</p>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setSelectedDayInfo(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
