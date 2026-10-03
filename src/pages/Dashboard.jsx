import React from 'react';
import { OverallProgressCard } from '../components/dashboard/OverallProgressCard';
import { DayCompleteBanner } from '../components/dashboard/DayCompleteBanner';
import { DsaMissionCard } from '../components/dashboard/DsaMissionCard';
import { ModuleMissionCard } from '../components/dashboard/ModuleMissionCard';
import { getDaysRemaining } from '../utils/dateUtils';
import { Zap, Flame, Calendar, Sparkles } from 'lucide-react';

export function Dashboard({
  userName,
  challengeDay,
  streakStats,
  todayProgressPercent,
  isTodayFullyComplete,
  todayDsaQuestions,
  dsaQuestionStatus,
  dsaCompletedCount,
  onToggleDsaStatus,
  onSaveDsaNotes,
  todayAptitudeTopic,
  isAptitudeFinished,
  onToggleAptitude,
  todayCoreCSTopic,
  isCoreCSFinished,
  onToggleCoreCS,
  todayCollegeSubject,
  isCollegeFinished,
  onToggleCollege,
  todayProjectTask,
  isProjectFinished,
  onToggleProject,
  hasCollegeSubjects,
  hasProjectTasks,
  onNavigateTab,
  onTriggerWhatNext
}) {
  const collegeDaysLeft = todayCollegeSubject?.examDate ? getDaysRemaining(todayCollegeSubject.examDate) : null;
  const collegeCountdown = collegeDaysLeft !== null
    ? (collegeDaysLeft < 0 ? 'Exam ended' : collegeDaysLeft === 0 ? 'Exam today!' : `Exam in ${collegeDaysLeft} days`)
    : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Top Banner & Quick Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Today's Mission
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Keep moving. Execute today's targets with zero hesitation.
          </p>
        </div>

        <button
          onClick={onTriggerWhatNext}
          className="self-start md:self-auto flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-black text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(245,158,11,0.35)] active:scale-95"
        >
          <Zap className="w-4 h-4 fill-black" />
          <span>WHAT SHOULD I DO NOW?</span>
        </button>
      </div>

      {/* Celebratory Day Complete Banner if all required tasks are finished */}
      {isTodayFullyComplete && (
        <DayCompleteBanner
          challengeDay={challengeDay}
          currentStreak={streakStats.currentStreak}
        />
      )}

      {/* Overall Winter Arc Progress & Today's Checklist */}
      <OverallProgressCard
        challengeDay={challengeDay}
        targetDuration={90}
        streakStats={streakStats}
        todayProgressPercent={todayProgressPercent}
        dsaCompletedCount={dsaCompletedCount}
        dsaTotal={todayDsaQuestions.length}
        isAptitudeFinished={isAptitudeFinished}
        isCoreCSFinished={isCoreCSFinished}
        isCollegeFinished={isCollegeFinished}
        isProjectFinished={isProjectFinished}
        hasCollege={hasCollegeSubjects}
        hasProject={hasProjectTasks}
      />

      {/* Today's Missions Container */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
            ACTIVE TARGETS
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {isTodayFullyComplete ? 'All targets completed' : 'Finish daily quota to maintain streak'}
          </span>
        </div>

        {/* 1. DSA Card (Largest & Most Prominent) */}
        <DsaMissionCard
          questions={todayDsaQuestions}
          questionStatus={dsaQuestionStatus}
          onToggleStatus={onToggleDsaStatus}
          onSaveNotes={onSaveDsaNotes}
          onNavigateImport={() => onNavigateTab('import')}
        />

        {/* 2. Grid for the Other 4 Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Aptitude Card */}
          <ModuleMissionCard
            icon="🎯"
            category="Aptitude"
            accentColor="#f97316"
            title={todayAptitudeTopic?.topic || 'Percentages'}
            subtitle={todayAptitudeTopic?.subtopic}
            details="Daily practice problems, shortcuts & quantitative accuracy."
            targetTime="60 min"
            isCompleted={isAptitudeFinished}
            onToggleComplete={() => onToggleAptitude()}
            onNavigate={() => onNavigateTab('aptitude')}
            badgeText="Target: 60m"
            badgeVariant="orange"
          />

          {/* Core CS Card */}
          <ModuleMissionCard
            icon="💻"
            category="Core CS"
            accentColor="#10b981"
            title={`${todayCoreCSTopic?.subject || 'DBMS'} — ${todayCoreCSTopic?.topic || 'Fundamentals'}`}
            subtitle={todayCoreCSTopic?.details}
            details="Deep dive into system concepts, algorithms & interview patterns."
            targetTime="30 min"
            isCompleted={isCoreCSFinished}
            onToggleComplete={() => onToggleCoreCS()}
            onNavigate={() => onNavigateTab('corecs')}
            badgeText={todayCoreCSTopic?.subject || 'CS'}
            badgeVariant="cyan"
          />

          {/* College Card */}
          {hasCollegeSubjects ? (
            <ModuleMissionCard
              icon="🎓"
              category="College"
              accentColor="#a855f7"
              title={todayCollegeSubject?.name || 'College Coursework'}
              subtitle={todayCollegeSubject?.notes}
              details="Stay ahead of semester curriculum and upcoming exam deliverables."
              targetTime="60 min"
              isCompleted={isCollegeFinished}
              onToggleComplete={() => onToggleCollege()}
              onNavigate={() => onNavigateTab('college')}
              badgeText={`${todayCollegeSubject?.priority?.toUpperCase()} PRIORITY`}
              badgeVariant={todayCollegeSubject?.priority === 'high' ? 'high' : 'low'}
              countdownText={collegeCountdown}
            />
          ) : (
            <div className="rounded-2xl bg-[#0c1017] border border-dashed border-white/10 p-5 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xl">🎓</span>
                <h4 className="text-sm font-bold text-white">No College Subjects Added</h4>
                <p className="text-xs text-slate-400">
                  Add your semester subjects to receive daily recommendations weighted by exam urgency.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('college')}
                className="mt-4 self-start px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 text-xs font-semibold"
              >
                + Add College Subjects
              </button>
            </div>
          )}

          {/* Project Card */}
          {hasProjectTasks ? (
            <ModuleMissionCard
              icon="🚀"
              category="Project"
              accentColor="#eab308"
              title={todayProjectTask?.title || 'Daily Project Sprint'}
              subtitle={todayProjectTask?.description}
              details="1 focused task daily builds your production-grade flagship application."
              targetTime={`${todayProjectTask?.estimatedMinutes || 90} min`}
              isCompleted={isProjectFinished}
              onToggleComplete={() => onToggleProject()}
              onNavigate={() => onNavigateTab('project')}
              badgeText={todayProjectTask ? todayProjectTask.priority?.toUpperCase() : 'TODO'}
              badgeVariant="mediumPriority"
            />
          ) : (
            <div className="rounded-2xl bg-[#0c1017] border border-dashed border-white/10 p-5 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xl">🚀</span>
                <h4 className="text-sm font-bold text-white">No Project Configured</h4>
                <p className="text-xs text-slate-400">
                  Add your major project and milestone tasks to keep your portfolio progressing daily.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('project')}
                className="mt-4 self-start px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 text-xs font-semibold"
              >
                + Configure Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
