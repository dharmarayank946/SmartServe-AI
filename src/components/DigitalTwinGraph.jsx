import React from 'react';
import { 
  Users, 
  TrendingUp, 
  ChefHat, 
  Trash2, 
  CloudRain, 
  DollarSign, 
  Activity, 
  ArrowRight,
  Cpu
} from 'lucide-react';
import { apiService } from '../services/apiService';

export default function DigitalTwinGraph() {
  const nodes = apiService.getDigitalTwinNodes();

  const iconMap = {
    Users,
    TrendingUp,
    ChefHat,
    Trash2,
    CloudRain,
    DollarSign
  };

  return (
    <div className="bg-gradient-to-br from-[#040d09] via-[#081c15] to-[#1b4332] rounded-3xl p-6 md:p-8 text-white shadow-2xl border border-emerald-800/40 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2d6a4f]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-400/30 inline-flex items-center gap-2 mb-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> RESTAURANT ECOSYSTEM DIGITAL TWIN
          </span>
          <h3 className="text-2xl font-bold font-heading text-white">
            Restaurant Intelligence Telemetry
          </h3>
          <p className="text-xs text-gray-300 mt-1 max-w-xl font-normal">
            Real-time continuous operational state visualizer connecting footfall telemetry, AI demand forecasting, kitchen preparation, weather sensors, and revenue.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-semibold bg-black/40 px-3.5 py-2 rounded-xl border border-emerald-500/30 text-emerald-400">
          <Cpu className="w-4 h-4 text-[#d4af37] animate-spin" />
          <span>CONTINUOUS AI SYNC ACTIVE</span>
        </div>
      </div>

      {/* Interactive Node Graph */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
        {nodes.map((node, idx) => {
          const IconComponent = iconMap[node.icon] || Activity;
          return (
            <div 
              key={node.id}
              className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-emerald-700/30 hover:border-emerald-500/60 transition-all duration-300 hover:scale-[1.02] shadow-xl group relative overflow-hidden"
            >
              {/* Subtle top indicator line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-[#d4af37] to-teal-400" />

              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${node.color} text-white flex items-center justify-center shadow-lg border border-white/10 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-5 h-5" />
                </div>

                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Node 0{idx + 1}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{node.title}</p>
                <p className="text-xl font-bold font-heading text-white mt-0.5">{node.metric}</p>
              </div>

              {/* Data Flow Line indicator */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1 text-emerald-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Data Stream
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Ticker */}
      <div className="mt-8 p-4 rounded-2xl bg-black/50 border border-emerald-900/40 text-xs text-gray-300 flex items-center justify-between font-mono">
        <span>● SmartServe AI continuously ingests POS data, kitchen status & weather radar.</span>
        <span className="text-amber-400 font-bold hidden md:inline">Sync Latency: 12ms</span>
      </div>
    </div>
  );
}
