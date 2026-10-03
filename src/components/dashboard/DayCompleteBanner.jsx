import React from 'react';
import { Flame, Sparkles, Trophy } from 'lucide-react';

export function DayCompleteBanner({ challengeDay, currentStreak }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/40 via-orange-950/40 to-slate-900 border border-orange-500/30 p-6 md:p-8 shadow-[0_0_40px_rgba(249,115,22,0.15)] animate-in fade-in zoom-in-95 duration-500">
      {/* Background radial glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(249,115,22,0.4)] shrink-0">
            🔥
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                DAILY MISSION COMPLETE
              </span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-1 tracking-tight">
              DAY {challengeDay} COMPLETED!
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              All required missions conquered today. Come back tomorrow for Day {challengeDay + 1}.
            </p>
          </div>
        </div>

        {/* Streak highlight badge */}
        <div className="flex items-center gap-3 bg-black/40 border border-white/10 px-5 py-3 rounded-2xl shrink-0">
          <Trophy className="w-6 h-6 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">Active Streak</span>
            <span className="text-xl font-black text-white font-mono">{currentStreak} DAYS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
