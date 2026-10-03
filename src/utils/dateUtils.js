/**
 * Timezone-safe date utilities for ARC90
 */

// Return current local date as "YYYY-MM-DD"
export function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format Date object to "YYYY-MM-DD"
export function formatDateToString(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Parse "YYYY-MM-DD" string to local Date at midnight 00:00:00
export function parseDateString(dateStr) {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

// Calculate Challenge Day Number (1-indexed) based on start date
// If today is startDate, result is 1. If earlier than start date, can return <= 0.
export function calculateChallengeDay(startDateStr, targetDateStr = getTodayString()) {
  const start = parseDateString(startDateStr);
  const target = parseDateString(targetDateStr);
  
  // Calculate difference in calendar days (using UTC timestamps to avoid daylight savings quirks)
  const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utcTarget = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  
  const diffDays = Math.floor((utcTarget - utcStart) / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

// Get greeting based on current local hour
export function getGreeting(userName = 'ANUP') {
  const hour = new Date().getHours();
  let timeGreeting = 'HELLO';
  if (hour >= 4 && hour < 12) timeGreeting = 'GOOD MORNING';
  else if (hour >= 12 && hour < 17) timeGreeting = 'GOOD AFTERNOON';
  else if (hour >= 17 && hour < 22) timeGreeting = 'GOOD EVENING';
  else timeGreeting = 'GOOD NIGHT';

  return `${timeGreeting}, ${userName.toUpperCase()} 👋`;
}

// Calculate remaining days until exam
export function getDaysRemaining(targetDateStr) {
  if (!targetDateStr) return null;
  const today = parseDateString(getTodayString());
  const target = parseDateString(targetDateStr);
  
  const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const utcTarget = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  
  return Math.ceil((utcTarget - utcToday) / (1000 * 60 * 60 * 24));
}

// Get user-friendly formatted date e.g. "Sat, Oct 3, 2026"
export function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const d = parseDateString(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
