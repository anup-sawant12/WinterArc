import React, { useState } from 'react';
import { useArcStore } from './hooks/useArcStore';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { MobileNav } from './components/layout/MobileNav';
import { Modal } from './components/common/Modal';
import { WhatShouldIDoModal } from './components/dashboard/WhatShouldIDoModal';
import { SetupWizard } from './components/wizard/SetupWizard';

// Pages
import { Dashboard } from './pages/Dashboard';
import { DSA } from './pages/DSA';
import { Aptitude } from './pages/Aptitude';
import { CoreCS } from './pages/CoreCS';
import { College } from './pages/College';
import { Project } from './pages/Project';
import { Progress } from './pages/Progress';
import { CalendarView } from './pages/CalendarView';
import { Import } from './pages/Import';
import { Settings } from './pages/Settings';
import { sampleDsaQuestions } from './data/sampleDsaQuestions';

import {
  GraduationCap,
  Rocket,
  BarChart3,
  Calendar,
  FileSpreadsheet,
  Settings as SettingsIcon,
  X
} from 'lucide-react';

export default function App() {
  const {
    state,
    todayStr,
    challengeDay,
    streakStats,
    todayDsaQuestions,
    todayAptitudeTopic,
    todayCoreCSTopic,
    todayCollegeSubject,
    todayProjectTask,
    dsaCompletedCount,
    isDsaFinished,
    isAptitudeFinished,
    isCoreCSFinished,
    isCollegeFinished,
    isProjectFinished,
    isTodayFullyComplete,
    todayProgressPercent,
    whatShouldIDo,
    markDsaQuestionStatus,
    toggleAptitudeCompletion,
    toggleCoreCSCompletion,
    toggleCollegeCompletion,
    toggleProjectTaskCompletion,
    setDsaQuestions,
    updateSettings,
    updateCollegeSubjects,
    updateProject
  } = useArcStore();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isWhatNextOpen, setIsWhatNextOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(() => !state.settings?.hasCompletedWizard);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  // Mark complete action from the "What Should I Do Now?" modal
  const handleMarkWhatNextComplete = (task) => {
    if (!task) return;
    if (task.actionType === 'dsa' && task.item?.id) {
      markDsaQuestionStatus(task.item.id, 'completed');
    } else if (task.actionType === 'aptitude') {
      toggleAptitudeCompletion(todayStr, 60);
    } else if (task.actionType === 'corecs') {
      toggleCoreCSCompletion(todayStr, 30);
    } else if (task.actionType === 'college' && task.item?.id) {
      toggleCollegeCompletion(todayStr, task.item.id, 60);
    } else if (task.actionType === 'project' && task.item?.id) {
      toggleProjectTaskCompletion(todayStr, task.item.id);
    }
  };

  const handleWizardComplete = ({ userName, challengeStartDate, questions, collegeSubjects, projectName, projectDesc }) => {
    updateSettings({
      userName,
      challengeStartDate,
      hasCompletedWizard: true
    });
    if (questions && questions.length > 0) {
      setDsaQuestions(questions);
    }
    if (collegeSubjects && collegeSubjects.length > 0) {
      updateCollegeSubjects(collegeSubjects);
    }
    if (projectName) {
      updateProject({
        ...state.project,
        name: projectName,
        description: projectDesc || ''
      });
    }
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            userName={state.settings.userName}
            challengeDay={challengeDay}
            streakStats={streakStats}
            todayProgressPercent={todayProgressPercent}
            isTodayFullyComplete={isTodayFullyComplete}
            todayDsaQuestions={todayDsaQuestions}
            dsaQuestionStatus={state.dsa.questionStatus}
            dsaCompletedCount={dsaCompletedCount}
            onToggleDsaStatus={markDsaQuestionStatus}
            onSaveDsaNotes={(qId, notes) => markDsaQuestionStatus(qId, state.dsa.questionStatus[qId]?.status || 'not_started', notes)}
            todayAptitudeTopic={todayAptitudeTopic}
            isAptitudeFinished={isAptitudeFinished}
            onToggleAptitude={() => toggleAptitudeCompletion(todayStr, 60)}
            todayCoreCSTopic={todayCoreCSTopic}
            isCoreCSFinished={isCoreCSFinished}
            onToggleCoreCS={() => toggleCoreCSCompletion(todayStr, 30)}
            todayCollegeSubject={todayCollegeSubject}
            isCollegeFinished={isCollegeFinished}
            onToggleCollege={() => toggleCollegeCompletion(todayStr, todayCollegeSubject?.id, 60)}
            todayProjectTask={todayProjectTask}
            isProjectFinished={isProjectFinished}
            onToggleProject={() => toggleProjectTaskCompletion(todayStr, todayProjectTask?.id)}
            hasCollegeSubjects={Boolean(state.college.subjects && state.college.subjects.length > 0)}
            hasProjectTasks={Boolean(state.project.tasks && state.project.tasks.length > 0)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onTriggerWhatNext={() => setIsWhatNextOpen(true)}
          />
        );

      case 'dsa':
        return (
          <DSA
            questions={state.dsa.questions}
            questionStatus={state.dsa.questionStatus}
            onToggleStatus={markDsaQuestionStatus}
            onSaveNotes={(qId, notes) => markDsaQuestionStatus(qId, state.dsa.questionStatus[qId]?.status || 'not_started', notes)}
            onNavigateImport={() => setActiveTab('import')}
          />
        );

      case 'aptitude':
        return (
          <Aptitude
            plan={state.aptitude.plan}
            progress={state.aptitude.progress}
            challengeDay={challengeDay}
            todayStr={todayStr}
            onToggleComplete={() => toggleAptitudeCompletion(todayStr, 60)}
          />
        );

      case 'corecs':
        return (
          <CoreCS
            plan={state.coreCS.plan}
            progress={state.coreCS.progress}
            challengeDay={challengeDay}
            todayStr={todayStr}
            onToggleComplete={() => toggleCoreCSCompletion(todayStr, 30)}
          />
        );

      case 'college':
        return (
          <College
            subjects={state.college.subjects}
            progress={state.college.progress}
            todaySubject={todayCollegeSubject}
            todayStr={todayStr}
            onUpdateSubjects={updateCollegeSubjects}
            onToggleComplete={() => toggleCollegeCompletion(todayStr, todayCollegeSubject?.id, 60)}
          />
        );

      case 'project':
        return (
          <Project
            project={state.project}
            progress={state.projectProgress}
            todayTask={todayProjectTask}
            todayStr={todayStr}
            onUpdateProject={updateProject}
            onToggleComplete={toggleProjectTaskCompletion}
          />
        );

      case 'progress':
        return (
          <Progress
            challengeDay={challengeDay}
            targetDuration={state.settings.targetDuration}
            streakStats={streakStats}
            dsaQuestions={state.dsa.questions}
            dsaStatus={state.dsa.questionStatus}
            aptitudeProgress={state.aptitude.progress}
            coreCSProgress={state.coreCS.progress}
            collegeProgress={state.college.progress}
            projectTasks={state.project.tasks}
            dailyProgress={state.dailyProgress}
          />
        );

      case 'calendar':
        return (
          <CalendarView
            startDateStr={state.settings.challengeStartDate}
            currentChallengeDay={challengeDay}
            dsaQuestions={state.dsa.questions}
            dsaStatus={state.dsa.questionStatus}
            dsaDailyAssignments={state.dsa.dailyAssignments}
            aptitudePlan={state.aptitude.plan}
            aptitudeProgress={state.aptitude.progress}
            coreCSPlan={state.coreCS.plan}
            coreCSProgress={state.coreCS.progress}
            collegeSubjects={state.college.subjects}
            collegeProgress={state.college.progress}
            projectTasks={state.project.tasks}
            projectProgress={state.projectProgress}
            completedDates={state.streak.completedDates || []}
          />
        );

      case 'import':
        return (
          <Import
            currentQuestionsCount={state.dsa.questions?.length || 0}
            onImportQuestions={(newQs) => setDsaQuestions(newQs)}
            onResetToSample={() => setDsaQuestions(sampleDsaQuestions)}
          />
        );

      case 'settings':
        return (
          <Settings
            settings={state.settings}
            onUpdateSettings={updateSettings}
            onRelaunchWizard={() => setIsWizardOpen(true)}
          />
        );

      default:
        return null;
    }
  };

  const moreNavItems = [
    { id: 'college', label: 'College', icon: GraduationCap },
    { id: 'project', label: 'Project', icon: Rocket },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'calendar', label: '90-Day Calendar', icon: Calendar },
    { id: 'import', label: 'Import Excel', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Desktop Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        challengeDay={challengeDay}
        streak={streakStats.currentStreak}
        onTriggerWhatNext={() => setIsWhatNextOpen(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          userName={state.settings.userName}
          challengeDay={challengeDay}
          streak={streakStats.currentStreak}
          todayStr={todayStr}
          onTriggerWhatNext={() => setIsWhatNextOpen(true)}
          onOpenWizard={() => setIsWizardOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Floating Bottom Bar */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMore={() => setIsMobileMoreOpen(true)}
      />

      {/* Mobile More Drawer */}
      {isMobileMoreOpen && (
        <Modal
          isOpen={isMobileMoreOpen}
          onClose={() => setIsMobileMoreOpen(false)}
          title="More Navigation"
        >
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            {moreNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMoreOpen(false);
                  }}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition-colors ${
                    isActive
                      ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </Modal>
      )}

      {/* ⚡ "WHAT SHOULD I DO NOW?" Modal */}
      <WhatShouldIDoModal
        isOpen={isWhatNextOpen}
        onClose={() => setIsWhatNextOpen(false)}
        task={whatShouldIDo}
        onMarkComplete={handleMarkWhatNextComplete}
        onNavigate={(route) => setActiveTab(route)}
      />

      {/* First-Time Setup Wizard */}
      <SetupWizard
        isOpen={isWizardOpen}
        onClose={() => {
          setIsWizardOpen(false);
          updateSettings({ hasCompletedWizard: true });
        }}
        initialSettings={state.settings}
        onCompleteSetup={handleWizardComplete}
      />
    </div>
  );
}
