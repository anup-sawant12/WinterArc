import React, { useState } from 'react';
import { Sparkles, Calendar, FileSpreadsheet, GraduationCap, Rocket, CheckCircle2, ArrowRight, ArrowLeft, Upload } from 'lucide-react';
import { parseExcelFile } from '../../utils/excelParser';
import { getTodayString } from '../../utils/dateUtils';
import { sampleDsaQuestions } from '../../data/sampleDsaQuestions';

export function SetupWizard({
  isOpen,
  onClose,
  initialSettings,
  onCompleteSetup
}) {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState(initialSettings?.userName || 'Anup');
  const [startDate, setStartDate] = useState(initialSettings?.challengeStartDate || getTodayString());
  const [importedQuestions, setImportedQuestions] = useState(null);
  const [importStats, setImportStats] = useState(null);
  const [importError, setImportError] = useState(null);

  const [subjects, setSubjects] = useState([
    { id: 'subj-1', name: 'Signals & Systems', priority: 'high', examDate: '', notes: '' },
    { id: 'subj-2', name: 'VLSI Design', priority: 'high', examDate: '', notes: '' },
    { id: 'subj-3', name: 'Microcontrollers', priority: 'medium', examDate: '', notes: '' },
  ]);

  const [projectName, setProjectName] = useState('CivicAsset');
  const [projectDesc, setProjectDesc] = useState('Civic Infrastructure Management & Work Order Tracking Platform');

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    try {
      const result = await parseExcelFile(file);
      if (result.success) {
        setImportedQuestions(result.questions);
        setImportStats(result.stats);
      } else {
        setImportError(result.error);
      }
    } catch (err) {
      setImportError(err.message || 'Error parsing Excel file');
    }
  };

  const handleFinish = () => {
    onCompleteSetup({
      userName: userName.trim() || 'Anup',
      challengeStartDate: startDate,
      questions: importedQuestions || sampleDsaQuestions,
      collegeSubjects: subjects.filter(s => s.name.trim() !== ''),
      projectName,
      projectDesc
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-[#0c1017] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-xl">❄️</span>
            <span className="font-extrabold text-sm tracking-wider text-white">ARC90 SETUP</span>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-bold">
            STEP {step} OF 6
          </span>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-sky-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              ❄️
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white tracking-tight">
                Welcome to ARC90
              </h2>
              <p className="text-base text-cyan-400 font-semibold">
                90-Day Winter Arc
              </p>
              <div className="text-xs text-slate-400 max-w-sm mx-auto space-y-1 pt-2 font-mono">
                <p>90 days.</p>
                <p>No excuses.</p>
                <p>One day at a time.</p>
              </div>
            </div>

            <div className="pt-4 max-w-xs mx-auto">
              <label className="block text-left text-xs text-slate-400 font-mono mb-1">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Anup"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              Start Setup →
            </button>
          </div>
        )}

        {/* Step 2: Start Date */}
        {step === 2 && (
          <div className="space-y-6 py-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Choose Your Challenge Start Date</h3>
              <p className="text-xs text-slate-400">
                ARC90 will automatically calculate Day 1 through Day 90 based on this date.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <label className="block text-xs font-mono text-cyan-400 uppercase">Start Date (YYYY-MM-DD)</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-400">
                Defaulted to today ({getTodayString()}). You can adjust it anytime in Settings.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: DSA Excel Import */}
        {step === 3 && (
          <div className="space-y-6 py-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Import DSA Questions</h3>
              <p className="text-xs text-slate-400">
                Upload your curated Excel sheet (.xlsx, .xls) or continue with the included sample set.
              </p>
            </div>

            <div className="border-2 border-dashed border-white/10 hover:border-cyan-500/40 rounded-2xl p-6 text-center space-y-3 transition-colors bg-white/[0.01]">
              <FileSpreadsheet className="w-10 h-10 text-cyan-400 mx-auto" />
              <div className="text-xs text-slate-300">
                <label className="cursor-pointer text-cyan-400 hover:underline font-bold">
                  <span>Click to choose an Excel file</span>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-slate-500 text-[11px] mt-1">Accepts .xlsx, .xls, or .csv</p>
              </div>

              {importError && (
                <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20">
                  {importError}
                </p>
              )}

              {importStats && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-left font-mono text-xs text-emerald-300 space-y-1">
                  <p className="font-bold">✓ {importedQuestions?.length} questions imported successfully</p>
                  <p className="text-[11px] text-slate-400">
                    Easy: {importStats.easy} | Medium: {importStats.medium} | Hard: {importStats.hard} | Topics: {importStats.topicsCount}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                {importedQuestions ? 'Use Uploaded Sheet →' : 'Use Included Sample Set →'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: College Subjects */}
        {step === 4 && (
          <div className="space-y-6 py-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Add Your College Subjects</h3>
              <p className="text-xs text-slate-400">
                ARC90 will automatically rotate subjects and prioritize upcoming exams.
              </p>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {subjects.map((subj, idx) => (
                <div key={subj.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2">
                  <input
                    type="text"
                    value={subj.name}
                    onChange={(e) => {
                      const updated = [...subjects];
                      updated[idx].name = e.target.value;
                      setSubjects(updated);
                    }}
                    placeholder="Subject Name"
                    className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                  <select
                    value={subj.priority}
                    onChange={(e) => {
                      const updated = [...subjects];
                      updated[idx].priority = e.target.value;
                      setSubjects(updated);
                    }}
                    className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-300"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(3)}
                className="px-5 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Main Project */}
        {step === 5 && (
          <div className="space-y-6 py-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Add Your Main Project</h3>
              <p className="text-xs text-slate-400">
                You will complete 1 project milestone every day to build a flagship portfolio piece.
              </p>
            </div>

            <div className="space-y-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-1">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. CivicAsset"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Project Description</label>
                <textarea
                  rows={2}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="What does your project solve?"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(4)}
                className="px-5 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(6)}
                className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Review & Launch →
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Ready */}
        {step === 6 && (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              🚀
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                You're Ready.
              </h3>
              <div className="text-xs text-slate-400 max-w-sm mx-auto space-y-1 font-mono">
                <p>Tomorrow doesn't matter yet.</p>
                <p className="text-cyan-400 font-bold">Just complete today's mission.</p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleFinish}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-black font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] active:scale-95"
              >
                Enter ARC90 ❄️
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
