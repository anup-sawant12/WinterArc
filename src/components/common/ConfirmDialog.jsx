import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmVariant = 'danger' }) {
  const buttonColors = {
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30',
    primary: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/30',
    amber: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-3">
          <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-white/5 border border-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-lg transition-all ${buttonColors[confirmVariant] || buttonColors.danger}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
