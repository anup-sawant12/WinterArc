import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, AlertCircle, RotateCcw, FileText, Check, Filter, Upload, Sparkles } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export function DSA({
  questions = [],
  questionStatus = {},
  onToggleStatus,
  onSaveNotes,
  onNavigateImport
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [selectedFilterStatus, setSelectedFilterStatus] = useState('ALL');

  const [activeNoteModalQuestion, setActiveNoteModalQuestion] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Extract unique topics
  const topics = useMemo(() => {
    const set = new Set(questions.map(q => q.topic).filter(Boolean));
    return ['ALL', ...Array.from(set).sort()];
  }, [questions]);

  // Counts
  const stats = useMemo(() => {
    let easy = 0, medium = 0, hard = 0, completed = 0, difficult = 0, review = 0;
    questions.forEach(q => {
      const diff = q.difficulty?.toLowerCase();
      if (diff === 'easy') easy++;
      else if (diff === 'hard') hard++;
      else medium++;

      const st = questionStatus[q.id]?.status;
      if (st === 'completed') completed++;
      else if (st === 'difficult') difficult++;
      else if (st === 'review') review++;
    });
    return { total: questions.length, easy, medium, hard, completed, difficult, review };
  }, [questions, questionStatus]);

  // Filtered list
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = q.title?.toLowerCase().includes(query);
        const matchesTopic = q.topic?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesTopic) return false;
      }

      // Difficulty
      if (selectedDifficulty !== 'ALL' && q.difficulty?.toUpperCase() !== selectedDifficulty) {
        return false;
      }

      // Topic
      if (selectedTopic !== 'ALL' && q.topic !== selectedTopic) {
        return false;
      }

      // Status filter
      if (selectedFilterStatus === 'COMPLETED' && questionStatus[q.id]?.status !== 'completed') return false;
      if (selectedFilterStatus === 'UNSOLVED' && questionStatus[q.id]?.status === 'completed') return false;
      if (selectedFilterStatus === 'DIFFICULT' && questionStatus[q.id]?.status !== 'difficult') return false;
      if (selectedFilterStatus === 'REVIEW' && questionStatus[q.id]?.status !== 'review') return false;

      return true;
    });
  }, [questions, questionStatus, searchQuery, selectedDifficulty, selectedTopic, selectedFilterStatus]);

  const handleOpenNoteModal = (q) => {
    setActiveNoteModalQuestion(q);
    setNoteText(questionStatus[q.id]?.notes || '');
  };

  const handleSaveNotes = () => {
    if (activeNoteModalQuestion) {
      onSaveNotes(activeNoteModalQuestion.id, noteText);
      setActiveNoteModalQuestion(null);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            DSA Question Bank
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Complete database of problems automatically scheduled into your 3 daily tasks.
          </p>
        </div>

        <button
          onClick={onNavigateImport}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          <Upload className="w-4 h-4" />
          <span>Import Excel Sheet</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
        <div className="p-3 rounded-xl bg-[#0c1017] border border-white/5">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">Total Bank</span>
          <span className="text-lg font-bold text-white font-mono">{stats.total}</span>
        </div>
        <div className="p-3 rounded-xl bg-[#0c1017] border border-emerald-500/20">
          <span className="text-[10px] text-emerald-400 uppercase font-mono block">Easy</span>
          <span className="text-lg font-bold text-emerald-400 font-mono">{stats.easy}</span>
        </div>
        <div className="p-3 rounded-xl bg-[#0c1017] border border-amber-500/20">
          <span className="text-[10px] text-amber-400 uppercase font-mono block">Medium</span>
          <span className="text-lg font-bold text-amber-400 font-mono">{stats.medium}</span>
        </div>
        <div className="p-3 rounded-xl bg-[#0c1017] border border-rose-500/20">
          <span className="text-[10px] text-rose-400 uppercase font-mono block">Hard</span>
          <span className="text-lg font-bold text-rose-400 font-mono">{stats.hard}</span>
        </div>
        <div className="p-3 rounded-xl bg-[#0c1017] border border-cyan-500/20">
          <span className="text-[10px] text-cyan-400 uppercase font-mono block">Solved</span>
          <span className="text-lg font-bold text-cyan-400 font-mono">{stats.completed}</span>
        </div>
        <div className="p-3 rounded-xl bg-[#0c1017] border border-rose-500/20">
          <span className="text-[10px] text-rose-400 uppercase font-mono block">Difficult</span>
          <span className="text-lg font-bold text-rose-400 font-mono">{stats.difficult}</span>
        </div>
        <div className="p-3 rounded-xl bg-[#0c1017] border border-amber-500/20">
          <span className="text-[10px] text-amber-400 uppercase font-mono block">Review</span>
          <span className="text-lg font-bold text-amber-400 font-mono">{stats.review}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0c1017] border border-white/10 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problem title or topic..."
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Topic Select */}
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            {topics.map(t => (
              <option key={t} value={t}>{t === 'ALL' ? 'All Topics' : t}</option>
            ))}
          </select>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
          <span className="text-slate-500 text-[11px] font-mono">Difficulty:</span>
          {['ALL', 'EASY', 'MEDIUM', 'HARD'].map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] uppercase transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}

          <span className="text-slate-500 text-[11px] font-mono ml-2">Status:</span>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'COMPLETED', label: 'Solved' },
            { id: 'UNSOLVED', label: 'Unsolved' },
            { id: 'DIFFICULT', label: 'Difficult' },
            { id: 'REVIEW', label: 'Review' }
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setSelectedFilterStatus(st.id)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors ${
                selectedFilterStatus === st.id
                  ? 'bg-amber-400 text-black font-bold'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Table */}
      <div className="rounded-2xl bg-[#0c1017] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e131d] border-b border-white/5 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Problem Title</th>
                <th className="py-3 px-4">Topic</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((q, idx) => {
                  const status = questionStatus[q.id]?.status;
                  const isDone = status === 'completed';
                  const isDifficult = status === 'difficult';
                  const isReview = status === 'review';
                  const hasNotes = Boolean(questionStatus[q.id]?.notes);

                  const diffVariant = q.difficulty?.toLowerCase() === 'easy' ? 'easy' : q.difficulty?.toLowerCase() === 'hard' ? 'hard' : 'medium';

                  return (
                    <tr
                      key={q.id}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        isDone ? 'bg-emerald-950/5 opacity-75' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono text-slate-500">{idx + 1}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                            {q.title}
                          </span>
                          {hasNotes && (
                            <span title={questionStatus[q.id]?.notes} className="cursor-pointer text-cyan-400">
                              <FileText className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-slate-300">{q.topic}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={diffVariant}>{q.difficulty}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">
                        {q.platform || 'LeetCode'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {q.link && (
                            <a
                              href={q.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-white/[0.02] hover:bg-white/10 text-slate-400 hover:text-white"
                              title="Solve Problem"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => onToggleStatus(q.id, 'difficult')}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isDifficult ? 'bg-rose-500/20 text-rose-400' : 'text-slate-500 hover:text-rose-400'
                            }`}
                            title="Mark Difficult"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onToggleStatus(q.id, 'review')}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isReview ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-amber-400'
                            }`}
                            title="Review Later"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenNoteModal(q)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-white"
                            title="Notes"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onToggleStatus(q.id, 'completed')}
                            className={`px-2.5 py-1 rounded-lg font-mono font-bold text-[11px] transition-all ${
                              isDone
                                ? 'bg-emerald-500 text-black'
                                : 'bg-white/5 hover:bg-white/10 text-white'
                            }`}
                          >
                            {isDone ? '✓ Solved' : 'Solve'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No matching problems found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes Modal */}
      {activeNoteModalQuestion && (
        <Modal
          isOpen={Boolean(activeNoteModalQuestion)}
          onClose={() => setActiveNoteModalQuestion(null)}
          title={`Problem Notes: ${activeNoteModalQuestion.title}`}
          subtitle={`${activeNoteModalQuestion.difficulty} • ${activeNoteModalQuestion.topic}`}
        >
          <div className="space-y-4">
            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Record your logic, pattern observed, edge cases, time/space complexity..."
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveNoteModalQuestion(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold"
              >
                Save Notes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
