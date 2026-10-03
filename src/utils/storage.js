import { sampleDsaQuestions } from '../data/sampleDsaQuestions';
import { aptitudePlan } from '../data/aptitudePlan';
import { coreCSPlan } from '../data/coreCSPlan';
import { defaultCollegeSubjects } from '../data/defaultCollegeSubjects';
import { defaultProject } from '../data/defaultProject';
import { DEFAULT_TOPIC_ORDER } from './dsaScheduler';
import { getTodayString } from './dateUtils';

export const STORAGE_KEY = 'arc90_state_v1';

export function getDefaultState() {
  const todayStr = getTodayString();
  return {
    version: 1,
    settings: {
      userName: 'Anup',
      challengeStartDate: todayStr,
      targetDuration: 90,
      dailyTargets: {
        dsaProblems: 3,
        aptitudeMinutes: 60,
        coreCSMinutes: 30,
        collegeMinutes: 60,
        projectTasks: 1
      },
      topicOrder: DEFAULT_TOPIC_ORDER,
      hasCompletedWizard: false
    },
    dsa: {
      questions: sampleDsaQuestions,
      questionStatus: {}, // { [id]: { status: 'completed'|'difficult'|'review'|'skipped', completedAt, notes, attempts } }
      dailyAssignments: {} // { [dateStr]: [id1, id2, id3] }
    },
    aptitude: {
      plan: aptitudePlan,
      progress: {} // { [dateStr]: { completed: boolean, minutesSpent: number, completedAt } }
    },
    coreCS: {
      plan: coreCSPlan,
      progress: {} // { [dateStr]: { completed: boolean, minutesSpent: number, completedAt } }
    },
    college: {
      subjects: defaultCollegeSubjects,
      progress: {} // { [dateStr]: { subjectId: string, completed: boolean, minutesSpent: number, completedAt } }
    },
    project: defaultProject, // { name, description, tasks: [...] }
    projectProgress: {}, // { [dateStr]: { taskId: string, completed: boolean, completedAt } }
    dailyProgress: {}, // { [dateStr]: { isDayComplete: boolean, completedAt, ... } }
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      completedDates: []
    }
  };
}

// Global subscribers for reactive UI updates
const subscribers = new Set();

export function subscribeToState(callback) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function notifySubscribers(newState) {
  subscribers.forEach(cb => {
    try {
      cb(newState);
    } catch (e) {
      console.error('Error notifying subscriber:', e);
    }
  });
}

/**
 * Load full state from localStorage with migration/repair fallback
 */
export function getStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultState();
      saveStoredState(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    
    // Simple schema validation / default fallbacks if fields are missing
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid state object format.');
    }

    const defaultState = getDefaultState();
    return {
      version: parsed.version || 1,
      settings: { ...defaultState.settings, ...(parsed.settings || {}) },
      dsa: {
        questions: Array.isArray(parsed.dsa?.questions) ? parsed.dsa.questions : defaultState.dsa.questions,
        questionStatus: parsed.dsa?.questionStatus || {},
        dailyAssignments: parsed.dsa?.dailyAssignments || {}
      },
      aptitude: {
        plan: parsed.aptitude?.plan || defaultState.aptitude.plan,
        progress: parsed.aptitude?.progress || {}
      },
      coreCS: {
        plan: parsed.coreCS?.plan || defaultState.coreCS.plan,
        progress: parsed.coreCS?.progress || {}
      },
      college: {
        subjects: Array.isArray(parsed.college?.subjects) ? parsed.college.subjects : defaultState.college.subjects,
        progress: parsed.college?.progress || {}
      },
      project: parsed.project || defaultState.project,
      projectProgress: parsed.projectProgress || {},
      dailyProgress: parsed.dailyProgress || {},
      streak: parsed.streak || defaultState.streak
    };
  } catch (err) {
    console.error('Failed to load state from localStorage, using defaults:', err);
    const initial = getDefaultState();
    saveStoredState(initial);
    return initial;
  }
}

/**
 * Persist full state to localStorage and notify all subscribers
 */
export function saveStoredState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    notifySubscribers(state);
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

/**
 * Update partial state using updater function or partial object
 */
export function updateStoredState(updater) {
  const current = getStoredState();
  const updated = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
  saveStoredState(updated);
  return updated;
}

/**
 * Export complete state as downloadable JSON file
 */
export function exportBackupJSON() {
  const state = getStoredState();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `arc90-backup-${getTodayString()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Restore state from JSON text with validation
 */
export function importBackupJSON(jsonText) {
  try {
    const parsed = JSON.parse(jsonText);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid JSON format.');
    }
    if (!parsed.settings || !parsed.dsa) {
      throw new Error('Uploaded JSON is not a valid ARC90 backup file.');
    }
    saveStoredState(parsed);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to parse backup file.' };
  }
}

/**
 * Clear progress only (keeps questions, subjects, project tasks, and settings)
 */
export function clearProgressOnly() {
  const current = getStoredState();
  const resetState = {
    ...current,
    dsa: {
      ...current.dsa,
      questionStatus: {},
      dailyAssignments: {}
    },
    aptitude: {
      ...current.aptitude,
      progress: {}
    },
    coreCS: {
      ...current.coreCS,
      progress: {}
    },
    college: {
      ...current.college,
      progress: {}
    },
    project: {
      ...current.project,
      tasks: current.project.tasks.map(t => ({ ...t, status: 'todo' }))
    },
    projectProgress: {},
    dailyProgress: {},
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      completedDates: []
    }
  };
  saveStoredState(resetState);
  return resetState;
}

/**
 * Hard reset everything back to initial fresh state
 */
export function resetAllToDefaults() {
  const defaultState = getDefaultState();
  saveStoredState(defaultState);
  return defaultState;
}
