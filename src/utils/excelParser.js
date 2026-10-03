import * as XLSX from 'xlsx';

/**
 * Intelligent Excel & CSV Parser for DSA Question Sheets
 */

// Normalized column field mappings
const COLUMN_ALIASES = {
  id: ['id', 'problem id', 'sr no', 'sr. no', 's.no', 'sno', '#', 'number', 'no'],
  title: ['title', 'problem', 'question', 'problem name', 'question name', 'problem title', 'name'],
  topic: ['topic', 'category', 'pattern', 'algorithm', 'tag', 'tags', 'ds', 'data structure'],
  difficulty: ['difficulty', 'level', 'diff'],
  link: ['link', 'url', 'problem link', 'leetcode link', 'gfg link', 'practice link', 'href'],
  platform: ['platform', 'source', 'site', 'website']
};

export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error('Workbook contains no sheets.');
        }

        // Read first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert sheet to json rows (array of objects)
        const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        
        if (!rawRows || rawRows.length === 0) {
          throw new Error('The uploaded sheet is empty.');
        }

        const normalizedResult = normalizeQuestionRows(rawRows);
        resolve(normalizedResult);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read the file. Please check file permissions.'));
    };

    reader.readAsArrayBuffer(file);
  });
}

export function normalizeQuestionRows(rawRows) {
  if (rawRows.length === 0) {
    return { success: false, error: 'File contains no rows.', questions: [] };
  }

  // Detect column mapping from the keys of the first non-empty row
  const sampleRow = rawRows.find(r => Object.keys(r).length > 0) || rawRows[0];
  const keys = Object.keys(sampleRow);

  const columnMap = {};
  
  for (const [standardKey, aliases] of Object.entries(COLUMN_ALIASES)) {
    const matchedKey = keys.find(k => {
      const cleanKey = k.trim().toLowerCase();
      return aliases.includes(cleanKey);
    });
    if (matchedKey) {
      columnMap[standardKey] = matchedKey;
    }
  }

  // Required columns validation
  const missingRequired = [];
  if (!columnMap.title) missingRequired.push('Problem / Title / Question');
  if (!columnMap.topic) missingRequired.push('Topic / Category');
  if (!columnMap.difficulty) missingRequired.push('Difficulty');

  if (missingRequired.length > 0) {
    return {
      success: false,
      error: `Missing required column(s): ${missingRequired.join(', ')}. Found columns: [${keys.join(', ')}]`,
      questions: []
    };
  }

  // Process rows
  const questions = [];
  let easyCount = 0;
  let mediumCount = 0;
  let hardCount = 0;
  const uniqueTopics = new Set();
  const seenTitles = new Set();

  rawRows.forEach((row, index) => {
    const titleVal = String(row[columnMap.title] || '').trim();
    if (!titleVal) return; // Skip empty rows

    // Deduplicate identical question titles in same sheet
    const normalizedTitleKey = titleVal.toLowerCase();
    if (seenTitles.has(normalizedTitleKey)) return;
    seenTitles.add(normalizedTitleKey);

    // Normalize topic
    let topicVal = String(row[columnMap.topic] || 'General').trim();
    if (!topicVal) topicVal = 'General';
    uniqueTopics.add(topicVal);

    // Normalize difficulty
    const rawDiff = String(row[columnMap.difficulty] || '').trim().toLowerCase();
    let difficulty = 'Medium';
    if (rawDiff.includes('easy') || rawDiff === 'e' || rawDiff === '1') {
      difficulty = 'Easy';
      easyCount++;
    } else if (rawDiff.includes('hard') || rawDiff === 'h' || rawDiff === '3') {
      difficulty = 'Hard';
      hardCount++;
    } else {
      difficulty = 'Medium';
      mediumCount++;
    }

    // Link
    let linkVal = columnMap.link ? String(row[columnMap.link] || '').trim() : '';
    if (!linkVal && linkVal.startsWith('http') === false) {
      // Create search query fallback if link missing
      linkVal = `https://www.google.com/search?q=${encodeURIComponent(titleVal + ' leetcode')}`;
    }

    // Platform
    let platformVal = columnMap.platform ? String(row[columnMap.platform] || '').trim() : '';
    if (!platformVal) {
      if (linkVal.includes('leetcode.com')) platformVal = 'LeetCode';
      else if (linkVal.includes('geeksforgeeks.org')) platformVal = 'GFG';
      else if (linkVal.includes('codeforces.com')) platformVal = 'Codeforces';
      else platformVal = 'Practice';
    }

    const idVal = columnMap.id && row[columnMap.id] ? String(row[columnMap.id]).trim() : `dsa-imp-${index + 1}`;

    questions.push({
      id: idVal,
      title: titleVal,
      topic: topicVal,
      difficulty,
      link: linkVal,
      platform: platformVal
    });
  });

  return {
    success: true,
    total: questions.length,
    stats: {
      easy: easyCount,
      medium: mediumCount,
      hard: hardCount,
      topicsCount: uniqueTopics.size,
      topics: Array.from(uniqueTopics)
    },
    questions
  };
}
