import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, Edit2, Calendar, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { getDaysRemaining } from '../utils/dateUtils';

export function College({
  subjects = [],
  progress = {},
  todaySubject,
  todayStr,
  onUpdateSubjects,
  onToggleComplete
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    priority: 'medium',
    examDate: '',
    notes: '',
    color: '#38bdf8'
  });

  const isTodayDone = Boolean(progress[todayStr]?.completed);
  const totalCompletedDays = Object.values(progress).filter(p => p.completed).length;

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setFormData({
      name: '',
      priority: 'medium',
      examDate: '',
      notes: '',
      color: '#38bdf8'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (subj) => {
    setEditingSubject(subj);
    setFormData({
      name: subj.name,
      priority: subj.priority || 'medium',
      examDate: subj.examDate || '',
      notes: subj.notes || '',
      color: subj.color || '#38bdf8'
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = (id) => {
    onUpdateSubjects(subjects.filter(s => s.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingSubject) {
      const updated = subjects.map(s => s.id === editingSubject.id ? { ...s, ...formData } : s);
      onUpdateSubjects(updated);
    } else {
      const newSubject = {
        id: `subj-${Date.now()}`,
        ...formData
      };
      onUpdateSubjects([...subjects, newSubject]);
    }
    setIsAddModalOpen(false);
  };

  const todayDaysLeft = todaySubject?.examDate ? getDaysRemaining(todaySubject.examDate) : null;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              College & Semester Prep
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Dynamic 1-hour study engine automatically balancing coursework and impending exam dates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {/* Today's Recommended Subject Focus Banner */}
      {todaySubject ? (
        <div className="rounded-2xl bg-gradient-to-r from-purple-950/20 via-[#0c1017] to-[#0c1017] border border-purple-500/30 p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  TODAY'S SCHEDULED SUBJECT
                </span>
                <Badge variant={todaySubject.priority === 'high' ? 'high' : 'low'}>
                  {todaySubject.priority.toUpperCase()} PRIORITY
                </Badge>
                {todayDaysLeft !== null && (
                  <span className="text-xs text-rose-400 font-mono font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {todayDaysLeft < 0 ? 'Exam ended' : todayDaysLeft === 0 ? 'Exam today!' : `${todayDaysLeft} days remaining`}
                  </span>
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {todaySubject.name}
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-white/5">
                {todaySubject.notes || 'Revise lecture notes, solve previous year question papers, and prepare formula cheat sheets.'}
              </p>
            </div>

            {/* Action Card */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/40 border border-white/5 p-4 rounded-2xl shrink-0">
              <div className="text-center sm:text-left">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Daily Target</span>
                <span className="text-2xl font-mono font-black text-white">60 MIN</span>
              </div>

              <button
                type="button"
                onClick={() => onToggleComplete()}
                className={`px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  isTodayDone
                    ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isTodayDone ? 'Completed' : 'Mark Complete'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#0c1017] border border-dashed border-white/15 p-8 text-center space-y-3">
          <p className="text-sm text-slate-400">No college subjects added yet.</p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
          >
            + Add First Subject
          </button>
        </div>
      )}

      {/* College Subjects Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
          YOUR SEMESTER SUBJECTS ({subjects.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map(subj => {
            const daysLeft = subj.examDate ? getDaysRemaining(subj.examDate) : null;
            return (
              <div
                key={subj.id}
                className="p-5 rounded-2xl bg-[#0c1017] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-base font-bold text-white">{subj.name}</h4>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(subj)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(subj.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={subj.priority === 'high' ? 'high' : 'low'}>
                      {subj.priority.toUpperCase()} PRIORITY
                    </Badge>
                    {daysLeft !== null && (
                      <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {daysLeft < 0 ? 'Exam ended' : daysLeft === 0 ? 'Exam today!' : `Exam in ${daysLeft} days`}
                      </span>
                    )}
                  </div>

                  {subj.notes && (
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {subj.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Subject Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={editingSubject ? 'Edit College Subject' : 'Add College Subject'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Subject Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Signals & Systems"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Exam Date (Optional)</label>
                <input
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Study Notes / Syllabus Focus</label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Key chapters, assignment deadlines, tutorial references..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                {editingSubject ? 'Save Changes' : 'Add Subject'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
