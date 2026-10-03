import React, { useState } from 'react';
import { ExternalLink, Check, AlertCircle, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export function DsaMissionCard({
  questions = [],
  questionStatus = {},
  onToggleStatus,
  onSaveNotes,
  onNavigateImport
}) {
  const [activeNoteModalQuestion, setActiveNoteModalQuestion] = useState(null);
  const [noteText, setNoteText] = useState('');

  const completedCount = questions.filter(q => questionStatus[q.id]?.status === 'completed').length;
  const isAllDone = questions.length > 0 && completedCount === questions.length;

  const openNotesModal = (question) => {
    setActiveNoteModalQuestion(question);
    setNoteText(questionStatus[question.id]?.notes || '');
  };

  const handleSaveNotes = () => {
    if (activeNoteModalQuestion) {
      onSaveNotes(activeNoteModalQuestion.id, noteText);
      setActiveNoteModalQuestion(null);
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="rounded-2xl bg-[#0c1017] border border-dashed border-white/15 p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center text-2xl">
          🧠
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">No DSA Questions Imported</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Import your custom Excel sheet or load sample questions to generate your 3 daily problems.
          </p>
        </div>
        <button
          onClick={onNavigateImport}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
        >
          Import Questions Sheet
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#0c1017] border border-white/10 p-5 md:p-6 space-y-5 shadow-2xl relative overflow-hidden group">
      {/* Top Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            🧠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-white tracking-tight">DSA</h3>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                CORE FOCUS
              </span>
            </div>
            <p className="text-xs text-slate-400">3 Problems Scheduled for Today</p>
          </div>
        </div>

        {/* Completion count */}
        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
          <span className={`px-3 py-1 rounded-xl border font-bold ${
            isAllDone
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-white/[0.03] border-white/10 text-slate-300'
          }`}>
            {completedCount} / {questions.length} completed
          </span>
        </div>
      </div>

      {/* 3 Problems List */}
      <div className="space-y-3">
        {questions.map((question, index) => {
          const statusEntry = questionStatus[question.id] || {};
          const isCompleted = statusEntry.status === 'completed';
          const isDifficult = statusEntry.status === 'difficult';
          const isReview = statusEntry.status === 'review';

          const diffVariant = question.difficulty?.toLowerCase() === 'easy' ? 'easy' : question.difficulty?.toLowerCase() === 'hard' ? 'hard' : 'medium';

          return (
            <div
              key={question.id}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isCompleted
                  ? 'bg-emerald-950/10 border-emerald-500/20 opacity-80'
                  : 'bg-white/[0.02] hover:bg-white/[0.04] border-white/5 hover:border-white/15'
              }`}
            >
              {/* Problem Details */}
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <span className="font-mono text-sm font-bold text-slate-500 pt-0.5 w-5 shrink-0">
                  {index + 1}.
                </span>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`text-sm md:text-base font-bold truncate ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                      {question.title}
                    </h4>
                    <Badge variant={diffVariant}>{question.difficulty}</Badge>
                    <Badge variant="default">{question.topic}</Badge>
                    {isDifficult && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        Difficult
                      </span>
                    )}
                    {isReview && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Review Later
                      </span>
                    )}
                  </div>
                  {statusEntry.notes && (
                    <p className="text-xs text-slate-400 italic bg-black/30 p-2 rounded border border-white/5">
                      "{statusEntry.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {/* External Solve Link */}
                {question.link && (
                  <a
                    href={question.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-colors"
                  >
                    <span>Solve</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {/* Mark Difficult */}
                <button
                  type="button"
                  title="Mark as Difficult"
                  onClick={() => onToggleStatus(question.id, 'difficult')}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isDifficult
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                      : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-rose-400'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                </button>

                {/* Mark Review Later */}
                <button
                  type="button"
                  title="Mark for Review Later"
                  onClick={() => onToggleStatus(question.id, 'review')}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isReview
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                      : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-amber-400'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Notes Button */}
                <button
                  type="button"
                  title="Add / Edit Notes"
                  onClick={() => openNotesModal(question)}
                  className="p-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <FileText className="w-4 h-4" />
                </button>

                {/* Main Completion Toggle */}
                <button
                  type="button"
                  onClick={() => onToggleStatus(question.id, 'completed')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{isCompleted ? 'Done' : 'Complete'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes Modal */}
      {activeNoteModalQuestion && (
        <Modal
          isOpen={Boolean(activeNoteModalQuestion)}
          onClose={() => setActiveNoteModalQuestion(null)}
          title={`Notes: ${activeNoteModalQuestion.title}`}
          subtitle={`${activeNoteModalQuestion.difficulty} • ${activeNoteModalQuestion.topic}`}
        >
          <div className="space-y-4">
            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Record your approach, time/space complexity, edge cases, or pitfalls..."
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
                Save Note
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
