import React, { useState } from 'react';
import { FileSpreadsheet, Upload, CheckCircle2, AlertTriangle, Table, ArrowRight, RefreshCw, FileText } from 'lucide-react';
import { parseExcelFile } from '../utils/excelParser';
import { sampleDsaQuestions } from '../data/sampleDsaQuestions';
import { Badge } from '../components/common/Badge';

export function Import({
  currentQuestionsCount = 0,
  onImportQuestions,
  onResetToSample
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const processFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await parseExcelFile(file);
      if (result.success) {
        setParsedData(result);
      } else {
        setErrorMessage(result.error);
        setParsedData(null);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to parse Excel file.');
      setParsedData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleConfirmImport = () => {
    if (parsedData && parsedData.questions) {
      onImportQuestions(parsedData.questions);
      setSuccessMessage(`${parsedData.questions.length} questions successfully imported and saved!`);
      setParsedData(null);
    }
  };

  const handleLoadSample = () => {
    onResetToSample();
    setSuccessMessage(`${sampleDsaQuestions.length} curated sample DSA questions loaded into your bank.`);
    setParsedData(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Import DSA Questions
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Upload your customized syllabus sheet (.xlsx, .xls, .csv) with intelligent column detection.
          </p>
        </div>

        <button
          onClick={handleLoadSample}
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 text-xs font-semibold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load Sample Questions</span>
        </button>
      </div>

      {/* Currently stored count info */}
      <div className="p-4 rounded-xl bg-[#0c1017] border border-white/5 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400">Current Question Bank in Storage:</span>
        <span className="text-cyan-400 font-bold">{currentQuestionsCount} Questions</span>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 text-xs font-mono">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center gap-3 text-xs font-mono">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Drag & Drop Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-8 md:p-12 text-center space-y-4 transition-all ${
          isDragging
            ? 'border-cyan-400 bg-cyan-500/10'
            : 'border-white/10 hover:border-cyan-500/30 bg-[#0c1017]/80'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(6,182,212,0.2)]">
          <FileSpreadsheet className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">
            {loading ? 'Reading and parsing file...' : 'Drop your Excel spreadsheet here'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Supports .xlsx, .xls, and .csv files. Automatic detection for Problem, Title, Topic, Difficulty, and URL columns.
          </p>
        </div>

        <div>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Upload className="w-4 h-4" />
            <span>Select File from Computer</span>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Preview Section if File Parsed */}
      {parsedData && (
        <div className="rounded-2xl bg-[#0c1017] border border-cyan-500/30 p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                PREVIEW & VERIFICATION
              </span>
              <h3 className="text-xl font-extrabold text-white">
                {parsedData.questions.length} questions parsed successfully
              </h3>
            </div>

            <button
              onClick={handleConfirmImport}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Replace Dataset</span>
            </button>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-slate-500 block text-[10px]">TOTAL QUESTIONS</span>
              <span className="text-lg font-bold text-white">{parsedData.total}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="text-slate-500 block text-[10px]">EASY</span>
              <span className="text-lg font-bold">{parsedData.stats.easy}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <span className="text-slate-500 block text-[10px]">MEDIUM</span>
              <span className="text-lg font-bold">{parsedData.stats.medium}</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <span className="text-slate-500 block text-[10px]">HARD</span>
              <span className="text-lg font-bold">{parsedData.stats.hard}</span>
            </div>
          </div>

          {/* Preview Table First 10 rows */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 uppercase">First 8 Rows Preview</span>
            <div className="rounded-xl border border-white/5 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0e131d] text-slate-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3">Topic</th>
                    <th className="py-2.5 px-3">Difficulty</th>
                    <th className="py-2.5 px-3">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {parsedData.questions.slice(0, 8).map((q, i) => (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      <td className="py-2 px-3 font-semibold text-white">{q.title}</td>
                      <td className="py-2 px-3 text-slate-300">{q.topic}</td>
                      <td className="py-2 px-3">
                        <Badge variant={q.difficulty?.toLowerCase() === 'easy' ? 'easy' : q.difficulty?.toLowerCase() === 'hard' ? 'hard' : 'medium'}>
                          {q.difficulty}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-cyan-400 font-mono text-[11px] truncate max-w-xs">{q.link}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
