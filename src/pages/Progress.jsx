import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { Trophy, Flame, Calendar, CheckCircle2, TrendingUp } from 'lucide-react';
import { ProgressBar } from '../components/common/ProgressBar';

export function Progress({
  challengeDay = 1,
  targetDuration = 90,
  streakStats = {},
  dsaQuestions = [],
  dsaStatus = {},
  aptitudeProgress = {},
  coreCSProgress = {},
  collegeProgress = {},
  projectTasks = [],
  dailyProgress = {}
}) {
  const challengeElapsedPercent = Math.min(100, Math.round(((challengeDay - 1) / targetDuration) * 100));

  // Category counts
  const dsaSolvedCount = useMemo(() => {
    return Object.values(dsaStatus).filter(s => s.status === 'completed').length;
  }, [dsaStatus]);

  const aptitudeHours = useMemo(() => {
    return Object.values(aptitudeProgress).filter(p => p.completed).length * 1;
  }, [aptitudeProgress]);

  const coreCSHours = useMemo(() => {
    return (Object.values(coreCSProgress).filter(p => p.completed).length * 0.5).toFixed(1);
  }, [coreCSProgress]);

  const collegeHours = useMemo(() => {
    return Object.values(collegeProgress).filter(p => p.completed).length * 1;
  }, [collegeProgress]);

  const projectTasksCompleted = useMemo(() => {
    return projectTasks.filter(t => t.status === 'completed').length;
  }, [projectTasks]);

  // Recharts: DSA Difficulty Distribution
  const difficultyData = useMemo(() => {
    let easy = 0, medium = 0, hard = 0;
    dsaQuestions.forEach(q => {
      if (dsaStatus[q.id]?.status === 'completed') {
        const diff = q.difficulty?.toLowerCase();
        if (diff === 'easy') easy++;
        else if (diff === 'hard') hard++;
        else medium++;
      }
    });
    return [
      { name: 'Easy', value: easy, color: '#10b981' },
      { name: 'Medium', value: medium, color: '#f59e0b' },
      { name: 'Hard', value: hard, color: '#f43f5e' }
    ];
  }, [dsaQuestions, dsaStatus]);

  // Recharts: DSA Solved by Topic (Top 8 topics)
  const topicData = useMemo(() => {
    const counts = {};
    dsaQuestions.forEach(q => {
      const topic = q.topic || 'General';
      if (!counts[topic]) counts[topic] = { solved: 0, total: 0 };
      counts[topic].total++;
      if (dsaStatus[q.id]?.status === 'completed') {
        counts[topic].solved++;
      }
    });

    return Object.entries(counts)
      .map(([topic, data]) => ({
        topic: topic.length > 14 ? topic.substring(0, 12) + '..' : topic,
        solved: data.solved,
        total: data.total
      }))
      .slice(0, 8);
  }, [dsaQuestions, dsaStatus]);

  // Category completion bars data
  const categorySummary = [
    { label: 'DSA', current: dsaSolvedCount, total: 270, unit: 'problems', percent: Math.round((dsaSolvedCount / 270) * 100), color: 'cyan' },
    { label: 'Aptitude', current: aptitudeHours, total: 90, unit: 'hours', percent: Math.round((aptitudeHours / 90) * 100), color: 'orange' },
    { label: 'Core CS', current: coreCSHours, total: 45, unit: 'hours', percent: Math.round((coreCSHours / 45) * 100), color: 'emerald' },
    { label: 'College', current: collegeHours, total: 90, unit: 'hours', percent: Math.round((collegeHours / 90) * 100), color: 'purple' },
    { label: 'Project', current: projectTasksCompleted, total: Math.max(projectTasks.length, 1), unit: 'milestones', percent: Math.round((projectTasksCompleted / Math.max(projectTasks.length, 1)) * 100), color: 'orange' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0c1017] border border-white/10 p-2.5 rounded-xl shadow-xl text-xs font-mono">
          <p className="text-white font-bold mb-1">{label || payload[0]?.name}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color || entry.fill }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Progress & Analytics
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Real-time metrics, topic mastery distribution, and consistency logs.
        </p>
      </div>

      {/* Top Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">Challenge Elapsed</span>
          <span className="text-2xl font-black text-white font-mono">Day {challengeDay} / {targetDuration}</span>
          <p className="text-xs text-cyan-400 font-mono">{challengeElapsedPercent}% elapsed</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1017] border border-orange-500/20 space-y-1">
          <span className="text-[10px] text-orange-400 uppercase font-mono block">Current Streak</span>
          <div className="flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            <span className="text-2xl font-black text-white font-mono">{streakStats.currentStreak} DAYS</span>
          </div>
          <p className="text-xs text-slate-400 font-mono">Longest: {streakStats.longestStreak} days</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1017] border border-emerald-500/20 space-y-1">
          <span className="text-[10px] text-emerald-400 uppercase font-mono block">Days Finished</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">{streakStats.daysCompleted} DAYS</span>
          <p className="text-xs text-slate-400 font-mono">Missed: {streakStats.daysMissed} days</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1017] border border-cyan-500/20 space-y-1">
          <span className="text-[10px] text-cyan-400 uppercase font-mono block">DSA Solved</span>
          <span className="text-2xl font-black text-cyan-400 font-mono">{dsaSolvedCount}</span>
          <p className="text-xs text-slate-400 font-mono">of {dsaQuestions.length} total questions</p>
        </div>
      </div>

      {/* Category Progress Meters */}
      <div className="rounded-2xl bg-[#0c1017] border border-white/10 p-6 space-y-4 shadow-xl">
        <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
          CATEGORY ROADMAP PROGRESS
        </h3>

        <div className="space-y-4">
          {categorySummary.map((cat) => (
            <div key={cat.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold">{cat.label}</span>
                <span className="text-slate-400">
                  {cat.current} / {cat.total} {cat.unit} ({cat.percent}%)
                </span>
              </div>
              <ProgressBar percent={cat.percent} color={cat.color} height="h-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Recharts Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DSA Topic Distribution Chart */}
        <div className="rounded-2xl bg-[#0c1017] border border-white/10 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
              DSA PROBLEMS BY TOPIC
            </h3>
            <span className="text-xs text-slate-500 font-mono">Solved vs Total</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="topic" stroke="#64748b" fontSize={10} tickLine={false} interval={0} angle={-25} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="solved" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Solved" />
                <Bar dataKey="total" fill="#1e293b" radius={[4, 4, 0, 0]} name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DSA Difficulty Breakdown Pie Chart */}
        <div className="rounded-2xl bg-[#0c1017] border border-white/10 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
              SOLVED DIFFICULTY SPREAD
            </h3>
            <span className="text-xs text-slate-500 font-mono">Easy / Med / Hard</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {difficultyData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    formatter={(val) => <span className="text-xs text-slate-400">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-slate-500 font-mono">
                Solve DSA problems to view difficulty breakdown.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
