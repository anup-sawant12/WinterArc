import React from 'react';
import {
  LayoutDashboard,
  Brain,
  Target,
  Terminal,
  GraduationCap,
  Rocket,
  BarChart3,
  Calendar,
  FileSpreadsheet,
  Settings,
  Flame,
  Zap
} from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, challengeDay, streak, onTriggerWhatNext }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'dsa', label: 'DSA', icon: Brain, badge: '3/day' },
    { id: 'aptitude', label: 'Aptitude', icon: Target },
    { id: 'corecs', label: 'Core CS', icon: Terminal },
    { id: 'college', label: 'College', icon: GraduationCap },
    { id: 'project', label: 'Project', icon: Rocket },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'calendar', label: '90-Day Calendar', icon: Calendar },
    { id: 'import', label: 'Import Excel', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#090c12] border-r border-white/5 flex flex-col h-screen sticky top-0 shrink-0 select-none z-30 hidden md:flex">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-transparent border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <span className="text-xl">❄️</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-white tracking-wider">ARC90</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">PRO</span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 tracking-tight">90-Day Winter Arc</p>
          </div>
        </div>
      </div>

      {/* Challenge Day & Streak Badges */}
      <div className="p-4 mx-3 my-2 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono">
        <div>
          <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Challenge</span>
          <span className="font-bold text-white text-sm">DAY {challengeDay}</span>
          <span className="text-slate-500 text-[11px]"> / 90</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Streak</span>
          <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>{streak} DAYS</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 to-transparent text-cyan-300 font-semibold border-l-2 border-cyan-400 pl-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Prominent "What Should I Do Now" Quick Trigger in Sidebar Footer */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={onTriggerWhatNext}
          className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 hover:from-amber-500/30 hover:to-orange-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.15)] group"
        >
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
          <span>What to do now?</span>
        </button>
      </div>
    </aside>
  );
}
