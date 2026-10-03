import React from 'react';
import { Modal } from '../common/Modal';
import { Clock, ExternalLink, CheckCircle2, Flame, ArrowRight, Sparkles } from 'lucide-react';

export function WhatShouldIDoModal({
  isOpen,
  onClose,
  task,
  onMarkComplete,
  onNavigate
}) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚡ What Should I Do Now?"
      subtitle="Eliminate decision fatigue. Execute your next high-impact mission."
      maxWidth="max-w-lg"
    >
      {task ? (
        <div className="space-y-5">
          {/* Category Pill & Time Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{task.categoryIcon}</span>
              <span
                className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border font-mono"
                style={{
                  color: task.categoryColor,
                  borderColor: `${task.categoryColor}40`,
                  backgroundColor: `${task.categoryColor}15`
                }}
              >
                {task.category}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Est. {task.estimatedTime}</span>
            </div>
          </div>

          {/* Task Core Info */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 space-y-2">
            <h4 className="text-xl font-bold text-white tracking-tight leading-snug">
              {task.title}
            </h4>
            {task.subtitle && (
              <p className="text-xs font-semibold text-cyan-400">
                {task.subtitle}
              </p>
            )}
            {task.details && (
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {task.details}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {task.actionType === 'dsa' && task.item?.link && (
              <a
                href={task.item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <span>Solve on {task.item.platform || 'LeetCode'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={() => {
                onMarkComplete(task);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Complete</span>
            </button>
          </div>

          {/* Jump to Module page button */}
          <div className="pt-1 text-center">
            <button
              onClick={() => {
                onNavigate(task.targetRoute);
                onClose();
              }}
              className="text-xs text-slate-400 hover:text-cyan-400 inline-flex items-center gap-1 transition-colors"
            >
              <span>Go to {task.category} module page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Celebration state if everything is completed */
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(245,158,11,0.25)]">
            🔥
          </div>
          <div>
            <h4 className="text-xl font-black text-white uppercase tracking-wider">
              DAY MISSION ACCOMPLISHED!
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              You completed all required tasks for today. Rest, recover, and prepare for tomorrow's challenge.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
