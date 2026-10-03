import React from 'react';
import {
  LayoutDashboard,
  Brain,
  Target,
  Terminal,
  MoreHorizontal
} from 'lucide-react';

export function MobileNav({ activeTab, setActiveTab, onOpenMore }) {
  const mainItems = [
    { id: 'dashboard', label: 'Dash', icon: LayoutDashboard },
    { id: 'dsa', label: 'DSA', icon: Brain },
    { id: 'aptitude', label: 'Aptitude', icon: Target },
    { id: 'corecs', label: 'Core CS', icon: Terminal },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090c12]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around">
      {mainItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}

      {/* More / Menu Drawer trigger */}
      <button
        onClick={onOpenMore}
        className="flex flex-col items-center justify-center py-1 px-3 text-slate-400 hover:text-white"
      >
        <MoreHorizontal className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">More</span>
      </button>
    </nav>
  );
}
