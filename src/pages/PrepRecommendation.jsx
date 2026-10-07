import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { 
  ChefHat, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert, 
  Save, 
  Plus, 
  RefreshCw, 
  TrendingUp, 
  Trash2, 
  DollarSign, 
  Flame, 
  Activity, 
  Bot, 
  Zap, 
  ArrowRight, 
  Check, 
  Layers, 
  Sliders, 
  X, 
  UtensilsCrossed, 
  Info,
  ListOrdered
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export default function PrepRecommendation({ onNavigate }) {
  // Service Data State
  const [prepSummary, setPrepSummary] = useState(null);
  const [servicePeriod, setServicePeriod] = useState('Dinner'); // Breakfast | Lunch | Evening | Dinner
  const [prepPlan, setPrepPlan] = useState([]);
  const [shortageList, setShortageList] = useState([]);
  const [wastePrevention, setWastePrevention] = useState([]);
  const [prepTimeline, setPrepTimeline] = useState([]);
  const [prepVsActualChartData, setPrepVsActualChartData] = useState([]);
  const [prepInsights, setPrepInsights] = useState([]);
  const [optimizedSequence, setOptimizedSequence] = useState([]);

  // Modal & Form States
  const [isSmartRecApplied, setIsSmartRecApplied] = useState(false);
  const [showReasoningModal, setShowReasoningModal] = useState(false);
  const [isPlannerGenerated, setIsPlannerGenerated] = useState(false);

  // Ask AI Copilot Modal State
  const [showAskModal, setShowAskModal] = useState(false);
  const [askQuery, setAskQuery] = useState('');
  const [askAnswer, setAskAnswer] = useState(null);
  const [isAskThinking, setIsAskThinking] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    loadPrepData();
  }, [servicePeriod]);

  const loadPrepData = () => {
    const summary = apiService.getPreparationSummary();
    setPrepSummary(summary);

    const plan = apiService.getKitchenPreparationPlan(servicePeriod);
    setPrepPlan(plan);

    const timeline = apiService.getPrepTimeline();
    setPrepTimeline(timeline);

    const chart = apiService.getPrepVsActualChartData();
    setPrepVsActualChartData(chart);

    const insights = apiService.getPrepInsights();
    setPrepInsights(insights);

    const shortages = apiService.getKitchenShortages();
    setShortageList(shortages);

    const wastePrev = apiService.getKitchenWastePrevention();
    setWastePrevention(wastePrev);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleQuickAddPrep = (itemId, increment) => {
    setPrepPlan(prev => prev.map(item => {
      if (item.id === itemId) {
        const newPrepared = item.prepared + increment;
        const newRemaining = Math.max(0, item.recommendedPrep - newPrepared);
        const newRisk = newRemaining <= 5 ? "LOW" : newRemaining <= 15 ? "MEDIUM" : "HIGH";
        const newAction = newRemaining <= 5 ? "Optimal" : newRemaining <= 15 ? "Prepare More" : "Prepare Now";
        return { ...item, prepared: newPrepared, remaining: newRemaining, risk: newRisk, action: newAction };
      }
      return item;
    }));
    showToast(`✓ Added +${increment} portions to prepared quantity.`);
  };

  const handleApplySmartRecommendation = () => {
    setIsSmartRecApplied(true);
    setPrepPlan(prev => prev.map(item => {
      if (item.food.includes('Masala Dosa')) {
        return { ...item, prepared: item.prepared + 15, risk: 'LOW', action: 'Optimal' };
      }
      return item;
    }));
    showToast("✓ Applied Smart Recommendation: +15 Masala Dosa portions added to prep line!");
  };

  const handleGenerateKitchenPlan = () => {
    const sequence = apiService.generateOptimizedKitchenSequence();
    setOptimizedSequence(sequence);
    setIsPlannerGenerated(true);
    showToast("⚡ Kitchen cooking sequence generated based on demand & prep time!");
  };

  const handleAskQuestion = (q) => {
    setAskQuery(q);
    setIsAskThinking(true);
    setShowAskModal(true);

    setTimeout(() => {
      let ans = "";
      const text = q.toLowerCase();

      if (text.includes('prepare now') || text.includes('what should i prepare')) {
        ans = "Kitchen Priority: (1) Prepare 15 additional portions of Masala Dosa before 7 PM dinner rush, (2) Simmer Paneer Curry batch 2, (3) Maintain Veg Biryani batch 1 rate.";
      } else if (text.includes('shortage') || text.includes('risk')) {
        ans = "Masala Dosa current stock is 12 portions against 23 expected demand. Preparing 15 additional portions now prevents stockout.";
      } else if (text.includes('waste')) {
        ans = "Paneer Curry weekday sales show 4% decline. Reduce preparation batch size by 8 portions to avoid waste.";
      } else {
        ans = `Kitchen Copilot AI: ${q} -> All stations operating at 82% capacity with 94.2% prep accuracy.`;
      }

      setAskAnswer(ans);
      setIsAskThinking(false);
    }, 600);
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#081c15] text-white border border-[#d4af37]/50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-[#d4af37]" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. HEADER */}
      <div className="bg-gradient-to-r from-[#040d09] via-[#081c15] to-[#1b4332] p-6 md:p-8 rounded-3xl text-white shadow-2xl border border-[#1b4332]/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4332]/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
              <ChefHat className="w-3.5 h-3.5 text-emerald-400" /> Kitchen Execution Engine
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading text-white">
              Preparation Management
            </h1>
            <p className="text-gray-300 text-sm md:text-base mt-1 max-w-2xl">
              Turn AI demand forecasts into precise food preparation plans.
            </p>
          </div>

          {/* Telemetry Status Box */}
          <div className="bg-[#040d09]/80 backdrop-blur-md p-4 rounded-2xl border border-[#d4af37]/30 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-emerald-400">{prepSummary?.status || 'AI PLAN READY'}</span>
            </div>
            <div className="h-6 w-px bg-gray-700 hidden sm:block" />
            <div>
              <span className="text-gray-400 block text-[10px]">TODAY'S PLAN</span>
              <span className="text-white font-medium">Updated {prepSummary?.lastUpdate}</span>
            </div>
            <div className="h-6 w-px bg-gray-700 hidden sm:block" />
            <div>
              <span className="text-gray-400 block text-[10px]">ACTIVE SERVICE</span>
              <span className="text-amber-300 font-bold">{servicePeriod} Shift</span>
            </div>
          </div>
        </div>
      </div>

      {/* 14. QUICK ACTIONS TOOLBAR */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleQuickAddPrep(prepPlan[0]?.id, 10)}
            className="bg-[#081c15] hover:bg-[#1b4332] text-white font-bold text-xs px-4 py-2.5 rounded-2xl border border-[#d4af37]/30 shadow-md flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 text-[#d4af37]" /> Update Preparation
          </button>
          <button
            onClick={() => onNavigate && onNavigate('sales')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs px-4 py-2.5 rounded-2xl border border-gray-300 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <DollarSign className="w-4 h-4 text-emerald-700" /> Record Sales
          </button>
          <button
            onClick={() => onNavigate && onNavigate('waste')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs px-4 py-2.5 rounded-2xl border border-gray-300 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Trash2 className="w-4 h-4 text-amber-600" /> Record Waste
          </button>
          <button
            onClick={() => onNavigate && onNavigate('prediction')}
            className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-semibold text-xs px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-[#d4af37]" /> Run AI Prediction
          </button>
          <button
            onClick={() => handleAskQuestion("What should I prepare now?")}
            className="bg-[#d4af37] hover:bg-amber-400 text-gray-950 font-bold text-xs px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Bot className="w-4 h-4 text-gray-950" /> Ask AI
          </button>
        </div>
      </div>

      {/* 2. PREPARATION SUMMARY (5 PREMIUM METRICS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">Total Recommended</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-gray-900">{prepSummary?.totalRecommended.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Buffer included
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block">portions target</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">Prepared</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#10b981]">{prepSummary?.prepared.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              86% completed
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block">portions cooked</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">Remaining</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-600">{prepSummary?.remaining}</span>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
              In progress
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block">portions to cook</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">Expected Waste</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-800">{prepSummary?.expectedWaste}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              ↓ 18% lower
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block">portions risk</span>
        </div>

        <div className="bg-[#081c15] text-white p-5 rounded-2xl border border-[#d4af37]/40 shadow-md space-y-1">
          <span className="text-[11px] text-[#d4af37] font-bold uppercase tracking-wider block">Preparation Accuracy</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-300">{prepSummary?.prepAccuracy}%</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
              Optimal
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block">AI Baseline match</span>
        </div>
      </div>

      {/* 4. SMART RECOMMENDATION PANEL */}
      <div className="bg-gradient-to-r from-[#040d09] via-[#081c15] to-[#1b4332] text-white p-6 md:p-8 rounded-3xl border border-[#d4af37]/40 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4332] text-amber-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Today's Smart Preparation Recommendation
            </div>
            <h2 className="text-2xl font-bold font-heading text-white">
              Prepare 15 additional portions of Masala Dosa before 7 PM.
            </h2>
            <p className="text-gray-300 text-xs mt-1">
              Why? Evening demand is expected to increase by 18% during peak dinner service.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowReasoningModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold border border-emerald-500/30 cursor-pointer"
            >
              View AI Reasoning
            </button>
            <button
              onClick={handleApplySmartRecommendation}
              disabled={isSmartRecApplied}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs shadow-lg cursor-pointer transition-all ${
                isSmartRecApplied 
                  ? 'bg-emerald-600 text-white cursor-default' 
                  : 'bg-[#d4af37] text-gray-950 hover:bg-amber-400'
              }`}
            >
              {isSmartRecApplied ? 'Recommendation Applied ✓' : 'Apply Recommendation'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#1b4332] text-xs text-center">
          <div>
            <span className="text-gray-400 block text-[10px]">CURRENT PREPARATION</span>
            <span className="text-lg font-bold text-white">95 portions</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">RECOMMENDED TARGET</span>
            <span className="text-lg font-bold text-amber-300">110 portions</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">EXPECTED SHORTAGE RISK</span>
            <span className="text-lg font-bold text-emerald-400">Low Risk</span>
          </div>
        </div>
      </div>

      {/* 6. SERVICE PERIOD TABS & 3. MAIN PREPARATION PLAN TABLE */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-700" /> Today's Preparation Plan
            </h2>
            <p className="text-xs text-gray-500">Live preparation targets by service shift</p>
          </div>

          {/* Service Period Switcher Tabs */}
          <div className="flex items-center gap-1 bg-[#f4f6f0] p-1.5 rounded-2xl border border-gray-200 text-xs">
            {['Breakfast', 'Lunch', 'Evening', 'Dinner'].map((period) => (
              <button
                key={period}
                onClick={() => setServicePeriod(period)}
                className={`px-4 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
                  servicePeriod === period 
                    ? 'bg-[#081c15] text-white shadow-xs' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Main Plan Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#081c15] text-white">
                <th className="p-3 rounded-l-xl">Food Item</th>
                <th className="p-3">Predicted Demand</th>
                <th className="p-3">Recommended</th>
                <th className="p-3">Prepared</th>
                <th className="p-3">Remaining</th>
                <th className="p-3">Waste Risk</th>
                <th className="p-3 rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {prepPlan.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-bold text-gray-900">{row.food}</td>
                  <td className="p-3 font-semibold text-gray-700">{row.predictedDemand}</td>
                  <td className="p-3 font-extrabold text-amber-600">{row.recommendedPrep}</td>
                  <td className="p-3 font-extrabold text-emerald-700">{row.prepared}</td>
                  <td className="p-3 font-semibold text-gray-800">{row.remaining}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      row.risk === 'HIGH' ? 'bg-red-100 text-red-800' : row.risk === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {row.risk} Risk
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleQuickAddPrep(row.id, 5)}
                      className="px-3 py-1 rounded-xl bg-[#081c15] text-white font-bold text-[10px] hover:bg-[#1b4332] cursor-pointer"
                    >
                      {row.action} (+5)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. PREPARATION PROGRESS (INTERACTIVE PROGRESS BARS) */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-700" /> Live Preparation Progress Tracker
        </h3>
        <p className="text-xs text-gray-500">Update actual preparation batches to recalculate progress dynamically</p>

        <div className="space-y-4">
          {prepPlan.map((item) => {
            const pct = Math.min(100, Math.round((item.prepared / item.recommendedPrep) * 100));
            return (
              <div key={item.id} className="p-4 rounded-2xl bg-[#f4f6f0] border border-gray-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-extrabold text-gray-900 text-sm">{item.food}</span>
                    <span className="text-gray-500 font-semibold ml-2">({item.prepared} / {item.recommendedPrep} portions)</span>
                  </div>

                  {/* Quick Add Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => handleQuickAddPrep(item.id, 5)} 
                      className="px-2.5 py-1 rounded-lg bg-white border border-gray-300 font-bold text-[#1b4332] hover:bg-[#1b4332] hover:text-white cursor-pointer"
                    >
                      +5
                    </button>
                    <button 
                      onClick={() => handleQuickAddPrep(item.id, 10)} 
                      className="px-2.5 py-1 rounded-lg bg-white border border-gray-300 font-bold text-[#1b4332] hover:bg-[#1b4332] hover:text-white cursor-pointer"
                    >
                      +10
                    </button>
                    <button 
                      onClick={() => handleQuickAddPrep(item.id, 20)} 
                      className="px-2.5 py-1 rounded-lg bg-white border border-gray-300 font-bold text-[#1b4332] hover:bg-[#1b4332] hover:text-white cursor-pointer"
                    >
                      +20
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-extrabold text-gray-900 w-10 text-right">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8 & 9. SHORTAGE PREVENTION & WASTE PREVENTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Shortage Prevention */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" /> Shortage Monitor
          </h2>
          <p className="text-xs text-gray-500">Food items predicted to run out before service completion</p>

          <div className="space-y-3">
            {shortageList.map((sItem, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2 text-xs text-red-950">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm">{sItem.food}</span>
                  <span className="font-mono font-bold text-red-800">Est Shortage: {sItem.estimatedShortageTime}</span>
                </div>

                <div className="grid grid-cols-2 pt-1 font-medium">
                  <p>Current stock: <strong>{sItem.currentAvailability} portions</strong></p>
                  <p>Expected demand: <strong>{sItem.predictedRemainingDemand} portions</strong></p>
                </div>

                <div className="pt-2 border-t border-red-200 flex items-center justify-between">
                  <span className="font-bold text-[#1b4332]">Action: {sItem.recommendedAction}</span>
                  <button
                    onClick={() => handleQuickAddPrep(prepPlan[1]?.id, 15)}
                    className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer shadow-xs"
                  >
                    Prepare More (+15)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Waste Prevention */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-amber-600" /> Waste Prevention
          </h2>
          <p className="text-xs text-gray-500">Identify over-prepared items to avoid end-of-day food waste</p>

          <div className="space-y-3">
            {wastePrevention.map((wItem, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#f4f6f0] border border-gray-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-gray-900 text-sm">{wItem.food}</span>
                  <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${wItem.badgeColor}`}>
                    {wItem.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 text-center bg-white p-2 rounded-xl border border-gray-200">
                  <div>
                    <span className="text-[9px] text-gray-400 font-semibold block">Prepared</span>
                    <p className="font-extrabold text-gray-900">{wItem.prepared}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 font-semibold block">Predicted Sales</span>
                    <p className="font-extrabold text-[#1b4332]">{wItem.predictedSales}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 font-semibold block">Expected Waste</span>
                    <p className="font-extrabold text-red-600">{wItem.expectedWaste}</p>
                  </div>
                </div>

                <p className="text-gray-700 font-medium">Recommendation: "{wItem.action}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7 & 13. PREPARATION TIMELINE & KITCHEN CAPACITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-700" /> Today's Preparation Timeline
          </h3>
          <p className="text-xs text-gray-500">AI-generated time markers for kitchen station scheduling</p>

          <div className="space-y-3">
            {prepTimeline.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#f4f6f0] border border-gray-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-16 font-mono font-bold text-emerald-950 shrink-0">{item.time}</span>
                  <div>
                    <p className="font-bold text-gray-900">{item.title}</p>
                    <p className="text-[11px] text-gray-500">{item.desc}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                  item.isDone ? 'bg-emerald-100 text-emerald-800' : item.isCurrent ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-700'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Kitchen Capacity Meter */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-amber-600" /> Kitchen Capacity Load
            </h3>
            <p className="text-xs text-gray-500">Current griddle & station utilization</p>

            <div className="grid grid-cols-3 gap-3 text-center mt-4">
              <div className="bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Current Load</span>
                <span className="text-2xl font-extrabold text-[#1b4332]">{prepSummary?.kitchenCapacityCurrent}%</span>
              </div>
              <div className="bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Expected Peak</span>
                <span className="text-2xl font-extrabold text-amber-600">{prepSummary?.kitchenCapacityPeak}%</span>
              </div>
              <div className="bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Available</span>
                <span className="text-2xl font-extrabold text-emerald-700">{prepSummary?.availableCapacity}%</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium">
            💡 <span className="font-bold">AI Recommendation:</span> "Begin high-demand preparation before the 7 PM evening peak."
          </div>
        </div>
      </div>

      {/* 10. PREPARATION VS ACTUAL CHART */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-700" /> Preparation vs Actual Sales (Last 7 Days)
            </h2>
            <p className="text-xs text-gray-500">Comparing AI Recommended, Actual Prepared, and Actual Sales</p>
          </div>

          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Preparation Accuracy: {prepSummary?.prepAccuracy}%
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={prepVsActualChartData}>
              <defs>
                <linearGradient id="gradRec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="gradPrep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#081c15', borderRadius: '12px', border: '1px solid #d4af37', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="recommended" name="AI Recommended" stroke="#d4af37" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#gradRec)" />
              <Area type="monotone" dataKey="prepared" name="Actual Prepared" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#gradPrep)" />
              <Area type="monotone" dataKey="sales" name="Actual Sales" stroke="#3b82f6" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#f4f6f0] border border-gray-200 text-xs text-gray-700 text-center font-medium">
          🧠 SmartServe AI is continuously learning from preparation and sales differences to improve future batch accuracy.
        </div>
      </div>

      {/* 12. BULK PREPARATION PLANNER */}
      <div className="bg-[#040d09] text-white p-6 md:p-8 rounded-3xl border border-[#1b4332] shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4332] text-amber-300 text-xs font-semibold mb-2">
              <ListOrdered className="w-3.5 h-3.5 text-amber-400" /> Kitchen Station Scheduler
            </div>
            <h2 className="text-2xl font-bold font-heading text-white">
              Bulk Preparation Planner
            </h2>
            <p className="text-gray-300 text-xs mt-1">
              Generate an optimized cooking sequence based on demand, prep time, and peak hours.
            </p>
          </div>

          <button
            onClick={handleGenerateKitchenPlan}
            className="px-5 py-2.5 rounded-2xl bg-[#d4af37] text-gray-950 font-extrabold text-xs hover:bg-amber-400 cursor-pointer shadow-lg shrink-0"
          >
            Generate Kitchen Plan
          </button>
        </div>

        {isPlannerGenerated && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
            {optimizedSequence.map((seq) => (
              <div key={seq.step} className="p-4 rounded-2xl bg-[#081c15] border border-[#1b4332] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-[#d4af37] text-gray-950 font-bold flex items-center justify-center text-xs">
                    #{seq.step}
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">Start: {seq.startAt}</span>
                </div>
                <h4 className="font-extrabold text-white text-base">{seq.item}</h4>
                <p className="text-gray-300">Target: {seq.qty} portions ({seq.prepTimeMins} mins prep time)</p>
                <p className="text-[10px] text-gray-400 italic">Reasoning: {seq.reasoning}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 11. AI PREPARATION INSIGHTS */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" /> AI Preparation Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {prepInsights.map((ins) => (
            <div 
              key={ins.id}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#d4af37]/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 inline-block mb-2">
                  {ins.impact}
                </span>
                <h4 className="font-bold text-gray-900 text-sm">{ins.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{ins.reason}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#f4f6f0] border border-gray-200 text-xs text-emerald-950 font-medium">
                <strong>Action:</strong> {ins.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI REASONING MODAL */}
      {showReasoningModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#040d09] text-white rounded-3xl border border-[#d4af37]/40 max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1b4332] pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" /> AI Model Reasoning Breakdown
              </h3>
              <button onClick={() => setShowReasoningModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-300">
              <p className="leading-relaxed">
                "SmartServe AI model predicts an 18% surge in Masala Dosa demand between 7:00 PM and 9:00 PM based on:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-200 font-medium">
                <li>Historical Friday dinner footfall (+24%)</li>
                <li>Clear evening weather forecast (28°C)</li>
                <li>Recent 3-day breakfast and dinner order velocity</li>
              </ul>
              <p className="text-amber-300 font-semibold">
                Preparing 15 additional portions by 7:00 PM prevents expected stockout while maintaining expected waste under 2 portions."
              </p>
            </div>

            <button
              onClick={() => setShowReasoningModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#1b4332] text-white font-bold text-xs hover:bg-[#2d6a4f] cursor-pointer"
            >
              Close Reasoning Breakdown
            </button>
          </div>
        </div>
      )}

      {/* ASK AI MODAL */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#040d09] text-white rounded-3xl border border-[#d4af37]/40 max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1b4332] pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#d4af37]" /> SmartServe Kitchen AI Copilot
              </h3>
              <button onClick={() => setShowAskModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#081c15] border border-[#1b4332]">
                <span className="text-[10px] text-[#d4af37] font-bold block">QUERY</span>
                <p className="font-bold text-white mt-0.5">"{askQuery}"</p>
              </div>

              {isAskThinking ? (
                <div className="p-6 rounded-2xl bg-[#081c15] border border-[#1b4332] text-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-[#d4af37] animate-spin mx-auto" />
                  <p className="text-gray-400 text-xs">SmartServe AI analyzing kitchen line telemetry...</p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#081c15] border border-[#1b4332] text-gray-200 font-medium leading-relaxed">
                  {askAnswer}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowAskModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#1b4332] text-white font-bold text-xs hover:bg-[#2d6a4f] cursor-pointer"
            >
              Close Copilot
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
