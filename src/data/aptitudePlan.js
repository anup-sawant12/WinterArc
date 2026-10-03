/**
 * 90-Day Comprehensive Aptitude Schedule
 * Covers all 19 essential quantitative, logical, and verbal topics.
 */

const TOPIC_ROTATION = [
  { topic: 'Percentages', subtopic: 'Basic calculations, fractions to percentage, increments & decrements' },
  { topic: 'Percentages', subtopic: 'Successive percentage changes & population problems' },
  { topic: 'Profit & Loss', subtopic: 'Cost price, selling price, marked price & discounts' },
  { topic: 'Profit & Loss', subtopic: 'Dishonest dealer problems, false weights & faulty scales' },
  { topic: 'Ratio & Proportion', subtopic: 'Direct & inverse variation, proportion properties' },
  { topic: 'Ratio & Proportion', subtopic: 'Partnerships, capital investments & profit-sharing' },
  { topic: 'Averages', subtopic: 'Weighted averages, replacement problems, batting/bowling averages' },
  { topic: 'Number System', subtopic: 'Divisibility rules, unit digit calculation & remainders' },
  { topic: 'Number System', subtopic: 'HCF, LCM, prime factorizations & base conversion' },
  { topic: 'Time & Work', subtopic: 'Individual work rates, unitary method & efficiency ratios' },
  { topic: 'Time & Work', subtopic: 'Pipes & Cisterns, alternate hour working & leakages' },
  { topic: 'Time, Speed & Distance', subtopic: 'Average speed, relative speed & proportionalities' },
  { topic: 'Time, Speed & Distance', subtopic: 'Trains, platforms, tunnels & crossing mechanics' },
  { topic: 'Time, Speed & Distance', subtopic: 'Boats & Streams, upstream vs downstream' },
  { topic: 'Simple & Compound Interest', subtopic: 'Simple interest formulas & annual compounding' },
  { topic: 'Simple & Compound Interest', subtopic: 'Half-yearly compounding & difference between CI and SI' },
  { topic: 'Permutation & Combination', subtopic: 'Fundamental counting principle & arrangements with restrictions' },
  { topic: 'Permutation & Combination', subtopic: 'Combinations, selections, circular arrangements' },
  { topic: 'Probability', subtopic: 'Classical probability, coins, dice & playing cards' },
  { topic: 'Probability', subtopic: 'Conditional probability & independent events' },
  { topic: 'Data Interpretation', subtopic: 'Tables & Bar graphs analysis' },
  { topic: 'Data Interpretation', subtopic: 'Pie charts, multiple graphs & radar charts' },
  { topic: 'Logical Reasoning', subtopic: 'Direction sense test & angular turns' },
  { topic: 'Logical Reasoning', subtopic: 'Ranking, order & comparison tests' },
  { topic: 'Coding-Decoding', subtopic: 'Letter shifting, reverse indexing & numerical substitution' },
  { topic: 'Coding-Decoding', subtopic: 'Matrix coding & conditional substitution' },
  { topic: 'Blood Relations', subtopic: 'Direct relations, family tree diagrams' },
  { topic: 'Blood Relations', subtopic: 'Coded relations & point-to-a-photo puzzles' },
  { topic: 'Seating Arrangement', subtopic: 'Linear single & double row arrangements' },
  { topic: 'Seating Arrangement', subtopic: 'Circular & rectangular seating with inner/outer facing' },
  { topic: 'Syllogism', subtopic: 'Standard statements (All, Some, No) & Venn diagrams' },
  { topic: 'Syllogism', subtopic: 'Possibility cases & Only A few / Few statements' },
  { topic: 'Series', subtopic: 'Arithmetic, geometric & alternating number series' },
  { topic: 'Series', subtopic: 'Alphabet series, missing term & odd-one-out' },
  { topic: 'Verbal Ability', subtopic: 'Sentence correction, subject-verb agreement & modifiers' },
  { topic: 'Verbal Ability', subtopic: 'Vocabulary in context, synonyms, antonyms & analogies' },
  { topic: 'Reading Comprehension', subtopic: 'Main idea extraction, tone identification & inference questions' },
  { topic: 'Reading Comprehension', subtopic: 'Dense technical passages & rapid scanning drills' }
];

export const aptitudePlan = Array.from({ length: 90 }, (_, index) => {
  const day = index + 1;
  const rotationIndex = index % TOPIC_ROTATION.length;
  const item = TOPIC_ROTATION[rotationIndex];
  
  return {
    day,
    topic: item.topic,
    subtopic: item.subtopic,
    targetMinutes: 60,
    tips: `Focus on accuracy first, then speed up using shortcut methods.`
  };
});
