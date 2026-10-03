import { parseDateString, formatDateToString, getTodayString } from './dateUtils';

/**
 * Calculates current and longest streaks based on completed dates.
 * A day is counted if all required daily items were finished.
 */
export function calculateStreakStats(completedDates = [], startDateStr, todayStr = getTodayString()) {
  const sortedDates = Array.from(new Set(completedDates))
    .filter(Boolean)
    .sort();

  if (sortedDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      daysCompleted: 0,
      daysMissed: 0
    };
  }

  const completedSet = new Set(sortedDates);
  const today = parseDateString(todayStr);
  
  // Calculate longest streak across history
  let longestStreak = 0;
  let runningStreak = 0;
  let prevDate = null;

  for (const dateStr of sortedDates) {
    const currentDate = parseDateString(dateStr);
    if (!prevDate) {
      runningStreak = 1;
    } else {
      const diffDays = Math.round((currentDate - prevDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        runningStreak++;
      } else {
        runningStreak = 1;
      }
    }
    if (runningStreak > longestStreak) {
      longestStreak = runningStreak;
    }
    prevDate = currentDate;
  }

  // Calculate current active streak working backwards from today or yesterday
  let currentStreak = 0;
  const checkDate = new Date(today);
  const checkDateStr = formatDateToString(checkDate);

  // If today is completed, streak includes today
  // If today is not yet completed, streak continues if yesterday was completed
  let cursor = new Date(today);
  if (!completedSet.has(checkDateStr)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const cursorStr = formatDateToString(cursor);
    if (completedSet.has(cursorStr)) {
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  // Days missed calculation (between start date and yesterday)
  let daysMissed = 0;
  if (startDateStr) {
    const start = parseDateString(startDateStr);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const cur = new Date(start);
    while (cur <= yesterday) {
      const curStr = formatDateToString(cur);
      if (!completedSet.has(curStr)) {
        daysMissed++;
      }
      cur.setDate(cur.getDate() + 1);
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    daysCompleted: sortedDates.length,
    daysMissed: Math.max(0, daysMissed)
  };
}
