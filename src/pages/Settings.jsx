import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  User,
  ShieldCheck
} from 'lucide-react';
import { exportBackupJSON, importBackupJSON, clearProgressOnly, resetAllToDefaults } from '../utils/storage';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { getTodayString } from '../utils/dateUtils';

export function Settings({
  settings = {},
  onUpdateSettings,
  onRelaunchWizard
}) {
  const [userName, setUserName] = useState(settings.userName || 'Anup');
  const [startDate, setStartDate] = useState(settings.challengeStartDate || getTodayString());
  const [duration, setDuration] = useState(settings.targetDuration || 90);

  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusError, setStatusError] = useState(null);

  const handleSaveChallengeSettings = (e) => {
    e.preventDefault();
    onUpdateSettings({
      userName: userName.trim() || 'Anup',
      challengeStartDate: startDate,
      targetDuration: Number(duration) || 90
    });
    setStatusMessage('Settings updated successfully!');
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleExport = () => {
    exportBackupJSON();
    setStatusMessage('arc90-backup.json downloaded successfully!');
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const res = importBackupJSON(content);
      if (res.success) {
        setStatusMessage('Backup restored successfully! All data refreshed.');
        setTimeout(() => setStatusMessage(null), 3500);
      } else {
        setStatusError(res.error || 'Failed to restore backup.');
        setTimeout(() => setStatusError(null), 5000);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmClearProgress = () => {
    clearProgressOnly();
    setStatusMessage('All completed tasks and streak logs cleared. Question bank and custom subjects preserved.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleConfirmResetAll = () => {
    resetAllToDefaults();
    setStatusMessage('All data reset to fresh defaults.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Settings & Data Management
          </h1>
        </div>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Configure challenge timeline, personalize preferences, and export full localStorage backups.
        </p>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {statusError && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center gap-2 text-xs font-mono">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{statusError}</span>
        </div>
      )}

      {/* Challenge Configuration Form */}
      <div className="rounded-2xl bg-[#0c1017] border border-white/10 p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-sm font-mono font-bold tracking-wider text-cyan-400 uppercase">
            CHALLENGE CONFIGURATION
          </h3>
          <button
            onClick={onRelaunchWizard}
            className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Relaunch Setup Wizard</span>
          </button>
        </div>

        <form onSubmit={handleSaveChallengeSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Challenge Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Challenge Duration (Days)</label>
              <input
                type="number"
                min="30"
                max="365"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Local Storage Backup & Data Export */}
      <div className="rounded-2xl bg-[#0c1017] border border-white/10 p-6 space-y-6 shadow-xl">
        <h3 className="text-sm font-mono font-bold tracking-wider text-cyan-400 uppercase border-b border-white/5 pb-3">
          DATA BACKUP & PERSISTENCE
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export JSON */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Export Local Backup</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Creates a snapshot of your entire local dataset (`arc90-backup.json`) including questions, completed days, streak, and subjects.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold transition-colors"
            >
              Download arc90-backup.json
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Restore Backup</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Upload a previously exported `arc90-backup.json` to restore your exact progress and custom question bank.
              </p>
            </div>
            <label className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold text-center cursor-pointer transition-colors block">
              <span>Choose Backup File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl bg-rose-950/10 border border-rose-500/20 p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-mono font-bold tracking-wider text-rose-400 uppercase border-b border-rose-500/20 pb-2">
          DANGER ZONE
        </h3>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-black/40 border border-rose-500/10">
            <div>
              <h4 className="text-sm font-bold text-white">Clear Daily Progress & Streak</h4>
              <p className="text-xs text-slate-400">
                Resets completed task history, streaks, and review marks. Preserves your question bank, subjects, and settings.
              </p>
            </div>
            <button
              onClick={() => setConfirmClearOpen(true)}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold font-mono transition-colors shrink-0"
            >
              Clear Progress
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-black/40 border border-rose-500/10">
            <div>
              <h4 className="text-sm font-bold text-white">Reset Everything to Fresh Defaults</h4>
              <p className="text-xs text-slate-400">
                Wipes all custom data, subjects, imported Excel questions, and restarts ARC90 with original sample defaults.
              </p>
            </div>
            <button
              onClick={() => setConfirmResetOpen(true)}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono transition-colors shrink-0 shadow-lg shadow-rose-950/40"
            >
              Reset Everything
            </button>
          </div>
        </div>
      </div>

      {/* Clear Progress Confirmation */}
      <ConfirmDialog
        isOpen={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        onConfirm={handleConfirmClearProgress}
        title="Clear All Completed Progress?"
        message="This will reset your completed questions, streak count, and daily activity logs back to Day 1. Your question bank and subjects will NOT be deleted."
        confirmText="Yes, Clear Progress"
        confirmVariant="amber"
      />

      {/* Reset All Confirmation */}
      <ConfirmDialog
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        onConfirm={handleConfirmResetAll}
        title="Hard Reset ARC90 to Defaults?"
        message="This will permanently delete all your imported questions, custom subjects, project tasks, and streak history. This cannot be undone unless you have a backup."
        confirmText="Yes, Reset Everything"
        confirmVariant="danger"
      />
    </div>
  );
}
