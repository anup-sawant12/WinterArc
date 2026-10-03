import React from 'react';
import { Flame, Zap, Calendar, Sparkles } from 'lucide-react';
import { getGreeting, formatDisplayDate } from '../../utils/dateUtils';

export function TopHeader({
  userName,
  challengeDay,
  streak,
  todayStr,
  onTriggerWhatNext,
  onOpenWizard
}) {
  return (
    <header className="border-b border-white/5 bg-[#080a0f]/80 backdrop-blur-xl sticky top-0 z-20 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Greeting & Current Date */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-semibold">
            {getGreeting(userName)}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{formatDisplayDate(todayStr)}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300 font-mono font-medium">Day {challengeDay} of 90</span>
        </div>
      </div>

      {/* Right: Quick Actions & Badges */}
      <div className="flex items-center gap-2.5">
        {/* Streak Counter */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono font-semibold">
          <Flame className="w-4 h-4 fill-orange-500" />
          <span>{streak} DAY STREAK</span>
        </div>

        {/* Wizard Quick Link */}
        <button
          onClick={onOpenWizard}
          title="Restart Setup Wizard"
          className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-slate-400 hover:text-white text-xs transition-colors hidden lg:flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Setup</span>
        </button>

        {/* Prominent Action Button: WHAT SHOULD I DO NOW? */}
        <button
          onClick={onTriggerWhatNext}
          className="flex items-center gap-2 px-3.5 py-1.5 md:px-4 md:py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-black text-xs font-black tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.35)] active:scale-95"
        >
          <Zap className="w-4 h-4 fill-black" />
          <span className="hidden xs:inline">WHAT SHOULD I DO NOW?</span>
          <span className="xs:hidden"></span>
        </button>
      </div>
    </header>
  );
}
