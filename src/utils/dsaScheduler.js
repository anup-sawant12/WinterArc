/**
 * ARC90 DSA Question Selection Engine
 * Selects exactly 3 balanced, deterministic questions per challenge day.
 */

export const DEFAULT_TOPIC_ORDER = [
  'Arrays & Hashing',
  'Arrays',
  'Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Queue',
  'Binary Search',
  'Linked List',
  'Trees',
  'BST',
  'Heap',
  'Graphs',
  'Greedy',
  'Backtracking',
  'Dynamic Programming'
];

// Simple deterministic string hasher for PRNG seed
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Deterministic Pseudo-Random Number Generator (Mulberry32)
function createPRNG(seed) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Normalizes topic names to match our progression order loosely
 */
function matchTopicProgression(topic, pattern) {
  if (!topic || !pattern) return false;
  const t = topic.toLowerCase();
  const p = pattern.toLowerCase();
  return t.includes(p) || p.includes(t);
}

/**
 * Selects 3 questions for a specific day deterministically
 */
export function getDailyDsaQuestions({
  dateStr,
  challengeDay = 1,
  questions = [],
  questionStatus = {},
  existingAssignment = null,
  topicOrder = DEFAULT_TOPIC_ORDER
}) {
  if (!questions || questions.length === 0) {
    return [];
  }

  // 1. If today already has an assigned list of question IDs, return them
  if (Array.isArray(existingAssignment) && existingAssignment.length > 0) {
    const assignedQuestions = existingAssignment
      .map(id => questions.find(q => q.id === id))
      .filter(Boolean);

    if (assignedQuestions.length === 3) {
      return assignedQuestions;
    }
  }

  // 2. Setup deterministic seed for this day
  const seed = simpleHash(`${dateStr}-arc90-dsa-day-${challengeDay}`);
  const rand = createPRNG(seed);

  // Group questions by status
  const completedIds = new Set(
    Object.keys(questionStatus).filter(id => questionStatus[id]?.status === 'completed')
  );
  const difficultIds = new Set(
    Object.keys(questionStatus).filter(id => questionStatus[id]?.status === 'difficult' || questionStatus[id]?.status === 'review')
  );

  const uncompleted = questions.filter(q => !completedIds.has(q.id));
  const difficultPool = questions.filter(q => difficultIds.has(q.id));
  const completedPool = questions.filter(q => completedIds.has(q.id));

  // Determine current active topic focus based on challengeDay
  // 90 days distributed over topic progression (each topic gets ~5-6 days focus)
  const currentTopicIndex = Math.floor(((challengeDay - 1) % topicOrder.length));
  const currentTopicName = topicOrder[currentTopicIndex] || topicOrder[0];

  const selectedQuestions = [];
  const selectedIds = new Set();

  function addQuestion(candidate) {
    if (candidate && !selectedIds.has(candidate.id)) {
      selectedQuestions.push(candidate);
      selectedIds.add(candidate.id);
      return true;
    }
    return false;
  }

  // Helper to pick from a list using PRNG
  function pickFromList(list, filterFn = null) {
    let available = list.filter(q => !selectedIds.has(q.id));
    if (filterFn) {
      const filtered = available.filter(filterFn);
      if (filtered.length > 0) available = filtered;
    }
    if (available.length === 0) return null;
    const index = Math.floor(rand() * available.length);
    return available[index];
  }

  // Check if today should incorporate a Revision question (e.g., every 4th day)
  const isRevisionDay = challengeDay % 4 === 0 && (difficultPool.length > 0 || completedPool.length > 0);

  // Slot 1: Easy (Prefer current topic, then uncompleted easy, then any easy)
  let slot1 = pickFromList(uncompleted, q => q.difficulty === 'Easy' && matchTopicProgression(q.topic, currentTopicName)) ||
              pickFromList(uncompleted, q => q.difficulty === 'Easy') ||
              pickFromList(questions, q => q.difficulty === 'Easy') ||
              pickFromList(uncompleted);
  addQuestion(slot1);

  // Slot 2: Medium (Prefer current topic, then uncompleted medium)
  let slot2 = pickFromList(uncompleted, q => q.difficulty === 'Medium' && matchTopicProgression(q.topic, currentTopicName)) ||
              pickFromList(uncompleted, q => q.difficulty === 'Medium') ||
              pickFromList(questions, q => q.difficulty === 'Medium') ||
              pickFromList(uncompleted);
  addQuestion(slot2);

  // Slot 3: Hard / Difficult revision / Medium
  let slot3 = null;
  if (isRevisionDay && difficultPool.length > 0) {
    // Pick from weak / difficult pool
    slot3 = pickFromList(difficultPool);
  } else if (isRevisionDay && completedPool.length > 0) {
    // Pick spaced repetition from completed pool
    slot3 = pickFromList(completedPool);
  }

  if (!slot3) {
    slot3 = pickFromList(uncompleted, q => q.difficulty === 'Hard' && matchTopicProgression(q.topic, currentTopicName)) ||
            pickFromList(uncompleted, q => q.difficulty === 'Hard') ||
            pickFromList(uncompleted, q => q.difficulty === 'Medium') ||
            pickFromList(questions, q => q.difficulty === 'Hard') ||
            pickFromList(questions);
  }
  addQuestion(slot3);

  // If still less than 3, fill from remaining questions
  while (selectedQuestions.length < 3 && selectedQuestions.length < questions.length) {
    const filler = pickFromList(questions);
    if (!filler) break;
    addQuestion(filler);
  }

  return selectedQuestions;
}
