import React, { useState } from 'react';
import { Rocket, Plus, CheckCircle2, Clock, Trash2, Edit2, Check, ArrowRight } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Modal } from '../components/common/Modal';

export function Project({
  project = { name: 'CivicAsset', description: '', tasks: [] },
  progress = {},
  todayTask,
  todayStr,
  onUpdateProject,
  onToggleComplete
}) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [projectHeaderForm, setProjectHeaderForm] = useState({
    name: project.name || '',
    description: project.description || ''
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'high',
    estimatedMinutes: 90,
    status: 'todo'
  });

  const isTodayDone = Boolean(progress[todayStr]?.completed);

  const tasks = project.tasks || [];
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const projectPercent = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  const handleOpenAddTask = () => {
    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      priority: 'high',
      estimatedMinutes: 90,
      status: 'todo'
    });
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'medium',
      estimatedMinutes: task.estimatedMinutes || 90,
      status: task.status || 'todo'
    });
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    const updated = tasks.filter(t => t.id !== taskId);
    onUpdateProject({ ...project, tasks: updated });
  };

  const handleTaskStatusChange = (taskId, newStatus) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    onUpdateProject({ ...project, tasks: updated });
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    if (editingTask) {
      const updated = tasks.map(t => t.id === editingTask.id ? { ...t, ...taskForm } : t);
      onUpdateProject({ ...project, tasks: updated });
    } else {
      const newTask = {
        id: `task-${Date.now()}`,
        ...taskForm,
        order: tasks.length + 1
      };
      onUpdateProject({ ...project, tasks: [...tasks, newTask] });
    }
    setIsTaskModalOpen(false);
  };

  const handleSaveProjectHeader = (e) => {
    e.preventDefault();
    onUpdateProject({
      ...project,
      name: projectHeaderForm.name.trim() || 'My Project',
      description: projectHeaderForm.description.trim()
    });
    setIsEditProjectModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {project.name || 'Flagship Project'}
            </h1>
            <button
              onClick={() => {
                setProjectHeaderForm({ name: project.name, description: project.description });
                setIsEditProjectModalOpen(true);
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              title="Edit Project Details"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
            {project.description || 'Deliver 1 concrete milestone each day to complete a fullstack production piece.'}
          </p>
        </div>

        <button
          onClick={handleOpenAddTask}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Project Completion Progress Bar */}
      <div className="rounded-2xl bg-[#0c1017] border border-white/10 p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-amber-400 font-bold tracking-wider uppercase">PROJECT COMPLETION</span>
          <span className="text-white font-extrabold">{completedTasksCount} / {tasks.length} tasks ({projectPercent}%)</span>
        </div>
        <ProgressBar percent={projectPercent} color="orange" height="h-2.5" />
      </div>

      {/* Today's Recommended Task Focus Card */}
      {todayTask ? (
        <div className="rounded-2xl bg-gradient-to-r from-amber-950/20 via-[#0c1017] to-[#0c1017] border border-amber-500/30 p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  RECOMMENDED TODAY
                </span>
                <Badge variant={todayTask.priority === 'high' ? 'high' : 'low'}>
                  {todayTask.priority?.toUpperCase()} PRIORITY
                </Badge>
                <span className="text-xs text-slate-400 font-mono">Est. {todayTask.estimatedMinutes || 90} mins</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {todayTask.title}
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-white/5">
                {todayTask.description || 'Focus on implementing this milestone feature and committing clean, modular code.'}
              </p>
            </div>

            {/* Action Card */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/40 border border-white/5 p-4 rounded-2xl shrink-0">
              <div className="text-center sm:text-left">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Sprint Target</span>
                <span className="text-2xl font-mono font-black text-white">{todayTask.estimatedMinutes || 90} MIN</span>
              </div>

              <button
                type="button"
                onClick={() => onToggleComplete(todayStr, todayTask.id)}
                className={`px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  isTodayDone
                    ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]'
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
          <p className="text-sm text-slate-400">All project tasks are currently completed or no tasks exist.</p>
          <button
            onClick={handleOpenAddTask}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs"
          >
            + Add New Milestone
          </button>
        </div>
      )}

      {/* Task Roadmap List */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
          PROJECT MILESTONES & WORK ORDERS ({tasks.length})
        </h3>

        <div className="space-y-2.5">
          {tasks.map((task, idx) => {
            const isCompleted = task.status === 'completed';
            const isInProgress = task.status === 'in_progress';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/10 border-emerald-500/20 opacity-80'
                    : isInProgress
                    ? 'bg-amber-950/10 border-amber-500/30'
                    : 'bg-[#0c1017] border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="font-mono text-xs font-bold text-slate-500 pt-0.5 w-6 shrink-0">
                    #{idx + 1}
                  </span>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`text-sm font-bold truncate ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                        {task.title}
                      </h4>
                      <Badge variant={task.priority === 'high' ? 'high' : 'mediumPriority'}>
                        {task.priority?.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] font-mono text-slate-500">
                        {task.estimatedMinutes || 90}m
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Switcher & Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <select
                    value={task.status}
                    onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-300 font-mono"
                  >
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>

                  <button
                    onClick={() => handleOpenEditTask(task)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
                    title="Edit Task"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                    title="Delete Task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Modal */}
      {isTaskModalOpen && (
        <Modal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          title={editingTask ? 'Edit Task' : 'Add Project Task'}
        >
          <form onSubmit={handleSaveTask} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Task Title *</label>
              <input
                type="text"
                required
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="e.g. Implement Work Order API"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Priority</label>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Est. Time (Minutes)</label>
                <input
                  type="number"
                  min="15"
                  max="360"
                  step="15"
                  value={taskForm.estimatedMinutes}
                  onChange={(e) => setTaskForm({ ...taskForm, estimatedMinutes: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Status</label>
              <select
                value={taskForm.status}
                onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Description / Key Deliverables</label>
              <textarea
                rows={3}
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                placeholder="What API endpoints, database models, or UI components does this entail?"
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsTaskModalOpen(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                {editingTask ? 'Save Task' : 'Add Task'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Project Header Modal */}
      {isEditProjectModalOpen && (
        <Modal
          isOpen={isEditProjectModalOpen}
          onClose={() => setIsEditProjectModalOpen(false)}
          title="Edit Project Details"
        >
          <form onSubmit={handleSaveProjectHeader} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Project Name *</label>
              <input
                type="text"
                required
                value={projectHeaderForm.name}
                onChange={(e) => setProjectHeaderForm({ ...projectHeaderForm, name: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Description</label>
              <textarea
                rows={3}
                value={projectHeaderForm.description}
                onChange={(e) => setProjectHeaderForm({ ...projectHeaderForm, description: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditProjectModalOpen(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
