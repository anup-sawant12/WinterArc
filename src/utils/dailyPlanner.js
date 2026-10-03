import { getDaysRemaining, parseDateString } from './dateUtils';

/**
 * Calculates college subject recommendation for the day
 * Dynamically prioritizes approaching exams and subject priority levels.
 */
export function getRecommendedCollegeSubject(subjects = [], completedSubjectHistory = {}, dateStr = '') {
  if (!subjects || subjects.length === 0) return null;

  // Calculate dynamic urgency score for each subject
  const scored = subjects.map(subj => {
    let score = 0;
    
    // Base priority
    if (subj.priority === 'high') score += 10;
    else if (subj.priority === 'medium') score += 6;
    else score += 3;

    // Exam urgency bonus
    if (subj.examDate) {
      const daysLeft = getDaysRemaining(subj.examDate);
      if (daysLeft !== null && daysLeft >= 0) {
        if (daysLeft <= 3) score += 50;
        else if (daysLeft <= 7) score += 30;
        else if (daysLeft <= 14) score += 18;
        else if (daysLeft <= 30) score += 8;
      }
    }

    // Days since last studied penalty/boost (spaced rotation)
    return {
      subject: subj,
      score,
      daysLeft: subj.examDate ? getDaysRemaining(subj.examDate) : null
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.subject || subjects[0];
}

/**
 * Calculates recommended project task for the day
 */
export function getRecommendedProjectTask(tasks = []) {
  if (!tasks || tasks.length === 0) return null;

  // 1. First preference: Any task currently marked 'in_progress'
  const inProgress = tasks.find(t => t.status === 'in_progress');
  if (inProgress) return inProgress;

  // 2. Next preference: First 'todo' task by defined order or high priority
  const todoTasks = tasks.filter(t => t.status === 'todo');
  if (todoTasks.length === 0) return null;

  // Sort by priority and order
  const priorityRank = { high: 1, medium: 2, low: 3 };
  todoTasks.sort((a, b) => {
    const pDiff = (priorityRank[a.priority] || 2) - (priorityRank[b.priority] || 2);
    if (pDiff !== 0) return pDiff;
    return (a.order || 0) - (b.order || 0);
  });

  return todoTasks[0];
}

/**
 * "WHAT SHOULD I DO NOW?" Recommendation Engine
 * Finds the exact next incomplete item on today's mission.
 */
export function getWhatShouldIDoNow({
  dsaQuestions = [],
  dsaStatus = {},
  aptitudeTopic = null,
  aptitudeDone = false,
  coreCSTopic = null,
  coreCSDone = false,
  collegeSubject = null,
  collegeDone = false,
  projectTask = null,
  projectDone = false
}) {
  // 1. Check DSA Problems in order
  for (let i = 0; i < dsaQuestions.length; i++) {
    const q = dsaQuestions[i];
    const isCompleted = dsaStatus[q.id]?.status === 'completed';
    if (!isCompleted) {
      const timeEst = q.difficulty === 'Easy' ? '25 minutes' : q.difficulty === 'Medium' ? '40 minutes' : '55 minutes';
      return {
        category: 'DSA',
        categoryIcon: '🧠',
        categoryColor: '#38bdf8',
        title: q.title,
        subtitle: `${q.difficulty} • ${q.topic}`,
        details: `Platform: ${q.platform || 'LeetCode'}`,
        estimatedTime: timeEst,
        actionLabel: 'Solve Problem →',
        actionType: 'dsa',
        item: q,
        targetRoute: 'dsa'
      };
    }
  }

  // 2. Check Aptitude
  if (!aptitudeDone && aptitudeTopic) {
    return {
      category: 'Aptitude',
      categoryIcon: '🎯',
      categoryColor: '#f97316',
      title: aptitudeTopic.topic,
      subtitle: aptitudeTopic.subtopic,
      details: 'Daily aptitude drills & formula practice',
      estimatedTime: '60 minutes',
      actionLabel: 'Start Aptitude Session',
      actionType: 'aptitude',
      item: aptitudeTopic,
      targetRoute: 'aptitude'
    };
  }

  // 3. Check Core CS
  if (!coreCSDone && coreCSTopic) {
    return {
      category: 'Core CS',
      categoryIcon: '💻',
      categoryColor: '#10b981',
      title: `${coreCSTopic.subject} — ${coreCSTopic.topic}`,
      subtitle: coreCSTopic.details,
      details: 'Interview questions & core systems theory',
      estimatedTime: '30 minutes',
      actionLabel: 'Study Core CS',
      actionType: 'corecs',
      item: coreCSTopic,
      targetRoute: 'corecs'
    };
  }

  // 4. Check College Subject
  if (!collegeDone && collegeSubject) {
    const daysLeft = collegeSubject.examDate ? getDaysRemaining(collegeSubject.examDate) : null;
    const examNote = daysLeft !== null ? (daysLeft < 0 ? 'Exam passed' : `${daysLeft} days until exam`) : 'Semester coursework';
    return {
      category: 'College',
      categoryIcon: '🎓',
      categoryColor: '#a855f7',
      title: collegeSubject.name,
      subtitle: `${collegeSubject.priority.toUpperCase()} Priority • ${examNote}`,
      details: collegeSubject.notes || 'Lecture notes, assignments & tutorial sheets',
      estimatedTime: '60 minutes',
      actionLabel: 'Start College Study',
      actionType: 'college',
      item: collegeSubject,
      targetRoute: 'college'
    };
  }

  // 5. Check Project Task
  if (!projectDone && projectTask) {
    return {
      category: 'Project',
      categoryIcon: '🚀',
      categoryColor: '#eab308',
      title: projectTask.title,
      subtitle: `${projectTask.priority.toUpperCase()} Priority • ${projectTask.status.replace('_', ' ')}`,
      details: projectTask.description,
      estimatedTime: `${projectTask.estimatedMinutes || 90} minutes`,
      actionLabel: 'Work on Project',
      actionType: 'project',
      item: projectTask,
      targetRoute: 'project'
    };
  }

  // All completed!
  return null;
}
