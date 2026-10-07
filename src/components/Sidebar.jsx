import React, { useState } from 'react';
import { 
  LayoutDashboard,
  Cpu, 
  TrendingUp, 
  ChefHat, 
  BarChart3, 
  Trash2, 
  Database,
  PieChart, 
  Sparkles, 
  Globe,
  Settings, 
  Bot,
  Bell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const navigationGroups = [
    {
      groupLabel: "Main",
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'controlroom', label: 'AI Control Room', icon: Cpu, isAi: true },
        { id: 'prediction', label: 'Demand Prediction', icon: TrendingUp },
        { id: 'preparation', label: 'Preparation', icon: ChefHat }
      ]
    },
    {
      groupLabel: "Data",
      items: [
        { id: 'sales', label: 'Sales Data', icon: BarChart3 },
        { id: 'waste', label: 'Waste Tracking', icon: Trash2 },
        { id: 'datalearning', label: 'Data & AI Learning', icon: Database, isAi: true }
      ]
    },
    {
      groupLabel: "Intelligence",
      items: [
        { id: 'analytics', label: 'Analytics', icon: PieChart },
        { id: 'insights', label: 'AI Insights', icon: Sparkles, isAi: true },
        { id: 'network', label: 'Restaurant Network', icon: Globe }
      ]
    },
    {
      groupLabel: "Management",
      items: [
        { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
        { id: 'settings', label: 'Restaurant Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-[#081c15] text-gray-200 flex flex-col h-screen fixed left-0 top-0 z-40 border-r border-[#1b4332]/40 shadow-2xl transition-all duration-300`}>
      {/* 1. BRANDING HEADER */}
      <div className="p-4 border-b border-[#1b4332]/40 shrink-0 space-y-3 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] flex items-center justify-center text-emerald-300 shadow-md shadow-emerald-950/60 border border-emerald-500/30 shrink-0">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="text-base font-extrabold tracking-tight font-heading text-white flex items-center gap-1.5 truncate">
                  SmartServe <span className="text-[#d4af37] text-[10px] font-semibold px-1 rounded bg-[#d4af37]/10 border border-[#d4af37]/20">AI</span>
                </h1>
                <p className="text-[10px] text-gray-400 font-medium tracking-wide truncate">Predict. Prepare. Reduce Waste.</p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          {setIsCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex w-6 h-6 rounded-full bg-[#1b4332] text-gray-300 hover:text-white items-center justify-center border border-emerald-500/30 transition-transform cursor-pointer shadow-sm"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5 text-emerald-400" /> : <ChevronLeft className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          )}
        </div>

        {/* 2. ZERO WASTE ENGINE SYSTEM STATUS */}
        {!isCollapsed && (
          <div className="px-3 py-1.5 rounded-xl bg-[#040d09]/60 border border-[#1b4332]/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-[11px] font-semibold text-gray-200 truncate">Zero Waste Engine</span>
            </div>
            <span className="text-[10px] font-medium text-emerald-400/90 shrink-0">Active</span>
          </div>
        )}
      </div>

      {/* 3. CLEAN NAVIGATION AREA */}
      <nav className="flex-1 px-2.5 py-4 space-y-5 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1b4332] scrollbar-track-transparent">
        {navigationGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!isCollapsed ? (
              <div className="px-3 text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest mb-1.5">
                {group.groupLabel}
              </div>
            ) : (
              <div className="h-px bg-[#1b4332]/40 my-2 mx-2" />
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 ${isCollapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'} rounded-xl text-xs transition-all duration-150 group text-left cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#1b4332] to-[#0d2a1f] text-white font-semibold border-l-2 border-[#d4af37] shadow-sm shadow-emerald-950/40'
                      : 'text-gray-300 font-medium hover:bg-[#1b4332]/40 hover:text-white'
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <Icon className={`w-4 h-4 transition-transform duration-150 group-hover:scale-110 ${
                      isActive 
                        ? item.isAi ? 'text-[#d4af37]' : 'text-emerald-400'
                        : 'text-emerald-500/70 group-hover:text-emerald-400'
                    }`} />
                  </div>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* 4. RESTAURANT PROFILE FOOTER */}
      <div 
        onClick={() => setActiveTab('profile')}
        className="p-3 border-t border-[#1b4332]/40 bg-[#040d09]/80 text-xs text-gray-400 cursor-pointer hover:bg-[#1b4332]/40 transition-colors shrink-0"
        title="SmartServe Bistro HYD-04"
      >
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-1 py-1'} rounded-xl`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] flex items-center justify-center font-bold text-white text-xs border border-emerald-500/30 shrink-0 shadow-inner">
            SB
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">SmartServe Bistro</p>
              <p className="text-[10px] text-emerald-400/90 truncate">Manager • HYD Branch</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
