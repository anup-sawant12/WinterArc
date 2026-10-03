import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  getStoredState,
  saveStoredState,
  subscribeToState,
  updateStoredState
} from '../utils/storage';
import { getTodayString, calculateChallengeDay } from '../utils/dateUtils';
import { getDailyDsaQuestions } from '../utils/dsaScheduler';
import { calculateStreakStats } from '../utils/streak';
import {
  getRecommendedCollegeSubject,
  getRecommendedProjectTask,
  getWhatShouldIDoNow
} from '../utils/dailyPlanner';

export function useArcStore() {
  const [state, setState] = useState(() => getStoredState());
  const todayStr = useMemo(() => getTodayString(), []);

  useEffect(() => {
    const unsubscribe = subscribeToState((newState) => {
      setState({ ...newState });
    });
    return unsubscribe;
  }, []);

  const challengeDay = useMemo(() => {
    return Math.max(1, calculateChallengeDay(state.settings.challengeStartDate, todayStr));
  }, [state.settings.challengeStartDate, todayStr]);

  // Today's deterministic DSA questions
  const todayDsaQuestions = useMemo(() => {
    const existing = state.dsa.dailyAssignments?.[todayStr];
    const questions = getDailyDsaQuestions({
      dateStr: todayStr,
      challengeDay,
      questions: state.dsa.questions,
      questionStatus: state.dsa.questionStatus,
      existingAssignment: existing,
      topicOrder: state.settings.topicOrder
    });

    // If not yet persisted for today, save the assignment deterministically
    if (!existing && questions.length > 0) {
      setTimeout(() => {
        updateStoredState(prev => ({
          ...prev,
          dsa: {
            ...prev.dsa,
            dailyAssignments: {
              ...prev.dsa.dailyAssignments,
              [todayStr]: questions.map(q => q.id)
            }
          }
        }));
      }, 0);
    }

    return questions;
  }, [state.dsa.questions, state.dsa.dailyAssignments, state.dsa.questionStatus, state.settings.topicOrder, challengeDay, todayStr]);

  // Today's Aptitude topic (from 90-day plan)
  const todayAptitudeTopic = useMemo(() => {
    const planIndex = (challengeDay - 1) % state.aptitude.plan.length;
    return state.aptitude.plan[planIndex] || state.aptitude.plan[0];
  }, [state.aptitude.plan, challengeDay]);

  // Today's Core CS topic (from 90-day plan)
  const todayCoreCSTopic = useMemo(() => {
    const planIndex = (challengeDay - 1) % state.coreCS.plan.length;
    return state.coreCS.plan[planIndex] || state.coreCS.plan[0];
  }, [state.coreCS.plan, challengeDay]);

  // Today's recommended College Subject
  const todayCollegeSubject = useMemo(() => {
    return getRecommendedCollegeSubject(state.college.subjects, state.college.progress, todayStr);
  }, [state.college.subjects, state.college.progress, todayStr]);

  // Today's recommended Project Task
  const todayProjectTask = useMemo(() => {
    return getRecommendedProjectTask(state.project.tasks);
  }, [state.project.tasks]);

  // Today's task statuses
  const dsaCompletedCount = useMemo(() => {
    return todayDsaQuestions.filter(q => state.dsa.questionStatus?.[q.id]?.status === 'completed').length;
  }, [todayDsaQuestions, state.dsa.questionStatus]);

  const isDsaFinished = todayDsaQuestions.length > 0 && dsaCompletedCount >= todayDsaQuestions.length;
  const isAptitudeFinished = Boolean(state.aptitude.progress?.[todayStr]?.completed);
  const isCoreCSFinished = Boolean(state.coreCS.progress?.[todayStr]?.completed);
  const isCollegeFinished = Boolean(state.college.progress?.[todayStr]?.completed);
  const isProjectFinished = Boolean(state.projectProgress?.[todayStr]?.completed);

  // Overall today's completion (all 5 core modules)
  // College & Project are considered optional if user hasn't added any yet
  const requiredCategories = useMemo(() => {
    const req = ['dsa', 'aptitude', 'corecs'];
    if (state.college.subjects && state.college.subjects.length > 0) req.push('college');
    if (state.project.tasks && state.project.tasks.length > 0) req.push('project');
    return req;
  }, [state.college.subjects, state.project.tasks]);

  const completedCategoriesCount = useMemo(() => {
    let count = 0;
    if (isDsaFinished) count++;
    if (isAptitudeFinished) count++;
    if (isCoreCSFinished) count++;
    if (requiredCategories.includes('college') && isCollegeFinished) count++;
    if (requiredCategories.includes('project') && isProjectFinished) count++;
    return count;
  }, [isDsaFinished, isAptitudeFinished, isCoreCSFinished, isCollegeFinished, isProjectFinished, requiredCategories]);

  const isTodayFullyComplete = completedCategoriesCount >= requiredCategories.length;
  const todayProgressPercent = Math.round((completedCategoriesCount / requiredCategories.length) * 100);

  // Synchronize streak and daily completion history if day becomes fully complete
  useEffect(() => {
    const currentCompletedDates = state.streak.completedDates || [];
    const hasTodayInHistory = currentCompletedDates.includes(todayStr);

    if (isTodayFullyComplete && !hasTodayInHistory) {
      const updatedDates = [...currentCompletedDates, todayStr];
      const stats = calculateStreakStats(updatedDates, state.settings.challengeStartDate, todayStr);
      
      updateStoredState(prev => ({
        ...prev,
        dailyProgress: {
          ...prev.dailyProgress,
          [todayStr]: {
            isDayComplete: true,
            completedAt: new Date().toISOString(),
            dsaCompletedCount,
            dsaTotal: todayDsaQuestions.length
          }
        },
        streak: {
          currentStreak: stats.currentStreak,
          longestStreak: stats.longestStreak,
          completedDates: updatedDates
        }
      }));
    } else if (!isTodayFullyComplete && hasTodayInHistory) {
      // If user uncompleted a task, adjust completed dates
      const updatedDates = currentCompletedDates.filter(d => d !== todayStr);
      const stats = calculateStreakStats(updatedDates, state.settings.challengeStartDate, todayStr);
      
      updateStoredState(prev => ({
        ...prev,
        dailyProgress: {
          ...prev.dailyProgress,
          [todayStr]: {
            ...prev.dailyProgress[todayStr],
            isDayComplete: false
          }
        },
        streak: {
          currentStreak: stats.currentStreak,
          longestStreak: stats.longestStreak,
          completedDates: updatedDates
        }
      }));
    }
  }, [isTodayFullyComplete, todayStr, dsaCompletedCount, todayDsaQuestions.length, state.settings.challengeStartDate, state.streak.completedDates]);

  // Overall streak stats
  const streakStats = useMemo(() => {
    return calculateStreakStats(state.streak.completedDates, state.settings.challengeStartDate, todayStr);
  }, [state.streak.completedDates, state.settings.challengeStartDate, todayStr]);

  // "What Should I Do Now?"
  const whatShouldIDo = useMemo(() => {
    return getWhatShouldIDoNow({
      dsaQuestions: todayDsaQuestions,
      dsaStatus: state.dsa.questionStatus,
      aptitudeTopic: todayAptitudeTopic,
      aptitudeDone: isAptitudeFinished,
      coreCSTopic: todayCoreCSTopic,
      coreCSDone: isCoreCSFinished,
      collegeSubject: todayCollegeSubject,
      collegeDone: isCollegeFinished,
      projectTask: todayProjectTask,
      projectDone: isProjectFinished
    });
  }, [
    todayDsaQuestions,
    state.dsa.questionStatus,
    todayAptitudeTopic,
    isAptitudeFinished,
    todayCoreCSTopic,
    isCoreCSFinished,
    todayCollegeSubject,
    isCollegeFinished,
    todayProjectTask,
    isProjectFinished
  ]);

  // Actions
  const markDsaQuestionStatus = useCallback((questionId, status, notes = '') => {
    updateStoredState(prev => {
      const prevEntry = prev.dsa.questionStatus[questionId] || {};
      const newStatus = prevEntry.status === status ? 'not_started' : status;
      return {
        ...prev,
        dsa: {
          ...prev.dsa,
          questionStatus: {
            ...prev.dsa.questionStatus,
            [questionId]: {
              ...prevEntry,
              status: newStatus,
              notes: notes !== undefined ? notes : (prevEntry.notes || ''),
              completedAt: newStatus === 'completed' ? new Date().toISOString() : null
            }
          }
        }
      };
    });
  }, []);

  const toggleAptitudeCompletion = useCallback((targetDateStr = todayStr, minutes = 60) => {
    updateStoredState(prev => {
      const current = prev.aptitude.progress?.[targetDateStr]?.completed;
      return {
        ...prev,
        aptitude: {
          ...prev.aptitude,
          progress: {
            ...prev.aptitude.progress,
            [targetDateStr]: {
              completed: !current,
              minutesSpent: !current ? minutes : 0,
              completedAt: !current ? new Date().toISOString() : null
            }
          }
        }
      };
    });
  }, [todayStr]);

  const toggleCoreCSCompletion = useCallback((targetDateStr = todayStr, minutes = 30) => {
    updateStoredState(prev => {
      const current = prev.coreCS.progress?.[targetDateStr]?.completed;
      return {
        ...prev,
        coreCS: {
          ...prev.coreCS,
          progress: {
            ...prev.coreCS.progress,
            [targetDateStr]: {
              completed: !current,
              minutesSpent: !current ? minutes : 0,
              completedAt: !current ? new Date().toISOString() : null
            }
          }
        }
      };
    });
  }, [todayStr]);

  const toggleCollegeCompletion = useCallback((targetDateStr = todayStr, subjectId, minutes = 60) => {
    updateStoredState(prev => {
      const current = prev.college.progress?.[targetDateStr]?.completed;
      return {
        ...prev,
        college: {
          ...prev.college,
          progress: {
            ...prev.college.progress,
            [targetDateStr]: {
              subjectId: subjectId || todayCollegeSubject?.id,
              completed: !current,
              minutesSpent: !current ? minutes : 0,
              completedAt: !current ? new Date().toISOString() : null
            }
          }
        }
      };
    });
  }, [todayStr, todayCollegeSubject]);

  const toggleProjectTaskCompletion = useCallback((targetDateStr = todayStr, taskId) => {
    updateStoredState(prev => {
      const isProgressDone = prev.projectProgress?.[targetDateStr]?.completed;
      const targetId = taskId || todayProjectTask?.id;

      // Also update project.tasks status
      const updatedTasks = prev.project.tasks.map(t => {
        if (t.id === targetId) {
          return {
            ...t,
            status: !isProgressDone ? 'completed' : 'todo',
            completedAt: !isProgressDone ? new Date().toISOString() : null
          };
        }
        return t;
      });

      return {
        ...prev,
        project: {
          ...prev.project,
          tasks: updatedTasks
        },
        projectProgress: {
          ...prev.projectProgress,
          [targetDateStr]: {
            taskId: targetId,
            completed: !isProgressDone,
            completedAt: !isProgressDone ? new Date().toISOString() : null
          }
        }
      };
    });
  }, [todayStr, todayProjectTask]);

  const setDsaQuestions = useCallback((newQuestions) => {
    updateStoredState(prev => ({
      ...prev,
      dsa: {
        ...prev.dsa,
        questions: newQuestions,
        // Reset daily assignments so new questions can be selected
        dailyAssignments: {
          ...prev.dsa.dailyAssignments,
          [todayStr]: null
        }
      }
    }));
  }, [todayStr]);

  const updateSettings = useCallback((newSettings) => {
    updateStoredState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings
      }
    }));
  }, []);

  const updateCollegeSubjects = useCallback((newSubjects) => {
    updateStoredState(prev => ({
      ...prev,
      college: {
        ...prev.college,
        subjects: newSubjects
      }
    }));
  }, []);

  const updateProject = useCallback((newProject) => {
    updateStoredState(prev => ({
      ...prev,
      project: newProject
    }));
  }, []);

  return {
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
    requiredCategories,
    completedCategoriesCount,
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
  };
}
