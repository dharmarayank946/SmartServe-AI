import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Activity, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  ChefHat, 
  Trash2, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  CloudRain, 
  ArrowRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldAlert, 
  HelpCircle, 
  Zap, 
  Filter, 
  X,
  RefreshCw,
  Sliders,
  Flame,
  PieChart,
  Bot,
  Send,
  Info,
  Check,
  Calendar,
  Layers,
  BarChart3,
  SunMedium
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import AnimatedCounter from '../components/AnimatedCounter';
import Modal from '../components/Modal';
import { apiService } from '../services/apiService';

export default function AiControlRoom({ onNavigate }) {
  // Timeline State: NOW, NEXT 2 HOURS, TODAY, TOMORROW, NEXT 7 DAYS
  const [timelinePeriod, setTimelinePeriod] = useState('NEXT 2 HOURS');
  const [appliedRec, setAppliedRec] = useState(false);
  const [appliedRecItem, setAppliedRecItem] = useState('Veg Biryani (90 portions)');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState('2 mins ago');

  // Modals state
  const [selectedFoodDetail, setSelectedFoodDetail] = useState(null);
  const [showReasoningModal, setShowReasoningModal] = useState(false);
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [showAssistantModal, setShowAssistantModal] = useState(false);

  // AI Assistant Query State
  const [assistantQuery, setAssistantQuery] = useState('');
  const [assistantAnswer, setAssistantAnswer] = useState(null);
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);

  // Reality Chart Metric toggle
  const [realityChartMode, setRealityChartMode] = useState('portions'); // 'portions' or 'revenue'

  // Service data
  const alertsData = apiService.getRealtimeAlerts();
  const factorsData = apiService.getExplainableFactors();
  const weatherData = apiService.getWeatherForecast();
  const salesData = apiService.getSalesTrends();

  // Active Alert actions state
  const [handledAlerts, setHandledAlerts] = useState({});

  const handleApplyRecommendation = (itemName = 'Veg Biryani (90 portions)') => {
    setAppliedRecItem(itemName);
    setAppliedRec(true);
    setTimeout(() => setAppliedRec(false), 4500);
  };

  const handleRefreshAnalysis = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdatedTime('Just now');
    }, 1000);
  };

  // Timeline Data Mapping
  const timelineData = {
    NOW: { 
      demand: "↑ 5%", 
      risk: "Low", 
      recommendation: "Maintain current kitchen batch strategy. POS traffic matching steady state.", 
      riskColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      targetQty: "340 portions active"
    },
    'NEXT 2 HOURS': { 
      demand: "↑ 18%", 
      risk: "Medium", 
      recommendation: "Increase preparation of Masala Dosa by 15 portions before 8:30 AM rush.", 
      riskColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      targetQty: "420 portions surge"
    },
    TODAY: { 
      demand: "↑ 12%", 
      risk: "Low", 
      recommendation: "Prepare 90 portions of Veg Biryani for peak dinner volume.", 
      riskColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      targetQty: "1,086 total portions"
    },
    TOMORROW: { 
      demand: "↑ 22%", 
      risk: "Medium", 
      recommendation: "Pre-order 15 kg cottage cheese for Paneer Curry weekend surge.", 
      riskColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      targetQty: "1,250 total portions"
    },
    'NEXT 7 DAYS': { 
      demand: "↑ 15%", 
      risk: "Low", 
      recommendation: "Execute weekend prep shift 30 mins earlier to smooth out kitchen load.", 
      riskColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      targetQty: "7,800 total portions"
    }
  };

  const currentTimeline = timelineData[timelinePeriod] || timelineData['NEXT 2 HOURS'];

  // Food Intelligence Interactive Matrix Data
  const foodIntelligenceList = [
    { 
      name: 'Veg Biryani', 
      demand: 85, 
      trend: '↑ 12%', 
      waste: 'Low', 
      risk: 'Low', 
      action: 'Prepare', 
      category: 'Main Course', 
      cost: 85, 
      price: 240, 
      prepBuffer: 5,
      aiNote: 'High Friday dinner footfall pattern. Historical conversion rate: 88%. Recommended prep: 90 portions.' 
    },
    { 
      name: 'Masala Dosa', 
      demand: 110, 
      trend: '↑ 18%', 
      waste: 'Medium', 
      risk: 'High', 
      action: 'Increase', 
      category: 'Main Course', 
      cost: 35, 
      price: 140, 
      prepBuffer: 6,
      aiNote: 'Surge in breakfast orders between 8:30-10:30 AM. Rapid turn-around required.' 
    },
    { 
      name: 'Cold Coffee', 
      demand: 42, 
      trend: '↓ 15%', 
      waste: 'High', 
      risk: 'Medium', 
      action: 'Reduce', 
      category: 'Beverages', 
      cost: 35, 
      price: 130, 
      prepBuffer: 2,
      aiNote: 'Evening rainfall forecast (78% prob) drops cold beverage demand by ~22%. Scale back milk prep.' 
    },
    { 
      name: 'Paneer Curry', 
      demand: 62, 
      trend: '↑ 8%', 
      waste: 'Low', 
      risk: 'Low', 
      action: 'Prepare', 
      category: 'Main Course', 
      cost: 95, 
      price: 280, 
      prepBuffer: 3,
      aiNote: 'Consistent weekly baseline. Low risk of shelf-life expiry over 48 hours.' 
    },
    { 
      name: 'Chicken Dum Biryani', 
      demand: 125, 
      trend: '↑ 25%', 
      waste: 'Low', 
      risk: 'Low', 
      action: 'Increase', 
      category: 'Main Course', 
      cost: 120, 
      price: 320, 
      prepBuffer: 8,
      aiNote: 'Top revenue driver. Pre-marinate batch 1 by 11:30 AM for lunch peak.' 
    },
    { 
      name: 'Fresh Garden Salad', 
      demand: 30, 
      trend: '↓ 10%', 
      waste: 'High', 
      risk: 'High', 
      action: 'Reduce', 
      category: 'Appetizers', 
      cost: 40, 
      price: 150, 
      prepBuffer: 2,
      aiNote: 'Highly perishable. Over-prep accounts for 40% of Monday waste. Batch in 10-bowl units.' 
    }
  ];

  // Risk Radar Data for Recharts Radar Chart
  const radarData = [
    { subject: 'Food Shortage', value: 30, fullMark: 100, label: 'LOW' },
    { subject: 'Food Waste', value: 65, fullMark: 100, label: 'MEDIUM' },
    { subject: 'Demand Spike', value: 85, fullMark: 100, label: 'HIGH' },
    { subject: 'Weather Impact', value: 60, fullMark: 100, label: 'MEDIUM' },
    { subject: 'Kitchen Load', value: 82, fullMark: 100, label: '82% OPTIMAL' }
  ];

  // Live Activity Feed Timestamps
  const activityFeed = [
    { text: "Sales POS data analyzed", time: "1 min ago", icon: CheckCircle2, color: "text-emerald-400" },
    { text: "Weather data updated", time: "2 mins ago", icon: CloudRain, color: "text-blue-400" },
    { text: "Demand model refreshed", time: "4 mins ago", icon: Cpu, color: "text-amber-400" },
    { text: "Prediction generated", time: "5 mins ago", icon: Sparkles, color: "text-[#d4af37]" },
    { text: "Preparation recommendation created", time: "6 mins ago", icon: ChefHat, color: "text-emerald-400" },
    { text: "Waste trend analyzed", time: "8 mins ago", icon: Trash2, color: "text-red-400" }
  ];

  // AI Assistant quick question responder
  const handleAskQuestion = (questionText) => {
    setIsAssistantThinking(true);
    setAssistantQuery(questionText);
    setShowAssistantModal(true);

    setTimeout(() => {
      let response = "";
      const q = questionText.toLowerCase();

      if (q.includes('prepare tomorrow')) {
        response = "SmartServe AI recommends preparing: Veg Biryani (90 portions), Paneer Curry (65 portions), Chicken Biryani (125 portions), and Masala Dosa (116 portions). Maintain a tight 6% safety buffer to eliminate waste.";
      } else if (q.includes('why is demand increasing')) {
        response = "Today's demand is up 18% driven by three key factors: (1) Historical Friday dinner surge pattern (42% weight), (2) Local corporate group lunch reservations (21% weight), and (3) Pleasant 28°C weather driving higher dine-in traffic (11% weight).";
      } else if (q.includes('wastes the most') || q.includes('food wastes')) {
        response = "Fresh Garden Salad & Cold Coffee base suffer from the highest waste ratio (over-preparation on Mondays & rainy afternoons). Shifting prep to small 10-portion dynamic batches will reduce waste by 38%.";
      } else if (q.includes('how much can i save') || q.includes('save')) {
        response = "By replacing manual 15% safety padding with SmartServe's ML safety buffer (5 portions), you can save ₹4,850 today and ~₹18,400 this month in raw ingredient cost recovery.";
      } else if (q.includes('biggest risk')) {
        response = "Today's biggest risk is a DEMAND SPIKE on Masala Dosa during the 8:30 - 10:30 AM morning rush (+18% above baseline), which could cause kitchen delays if griddles are not pre-heated.";
      } else {
        response = `SmartServe AI Analysis for: "${questionText}" -> Operational telemetry indicates smooth performance with 96.4% prediction accuracy. Kitchen load is optimal at 82% capacity.`;
      }

      setAssistantAnswer(response);
      setIsAssistantThinking(false);
    }, 600);
  };

  return (
    <div className="space-y-8 pb-16 font-sans text-gray-800">
      
      {/* --------------------------------------------------
          1. HEADER
      -------------------------------------------------- */}
      <div className="bg-gradient-to-r from-[#040d09] via-[#081c15] to-[#1b4332] rounded-3xl p-6 md:p-8 text-white shadow-2xl border border-emerald-800/40 relative overflow-hidden">
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/30 flex items-center gap-1.5 shadow-xs">
                <Cpu className="w-3.5 h-3.5 text-[#d4af37]" /> MISSION CONTROL CENTER
              </span>

              {/* Live Pulsing AI Engine Active Status Indicator */}
              <span className="text-xs text-emerald-300 font-semibold bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <span className="font-extrabold tracking-wide">● AI ENGINE ACTIVE</span>
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-white tracking-tight flex items-center gap-3">
              AI Control Room
            </h1>
            <p className="text-gray-300 text-xs md:text-sm mt-1.5 font-medium max-w-xl">
              "Real-time intelligence for smarter restaurant decisions"
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <div className="bg-black/40 backdrop-blur-md p-3.5 px-4 rounded-2xl border border-white/10 text-right shadow-inner">
              <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Last Analysis</p>
              <p className="text-xs md:text-sm font-bold text-emerald-400 font-mono mt-0.5">
                Updated {lastUpdatedTime}
              </p>
              <span className="text-[10px] text-gray-400">Continuous POS Sync</span>
            </div>

            <button
              onClick={handleRefreshAnalysis}
              disabled={isRefreshing}
              title="Refresh AI Analysis"
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer flex items-center justify-center group"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-300 ${isRefreshing ? 'animate-spin text-[#d4af37]' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Applied Recommendation Alert Toast */}
      {appliedRec && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs md:text-sm flex items-center justify-between gap-3 animate-fade-in shadow-xl border border-emerald-400/40">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>Recommendation Approved! "{appliedRecItem}" dispatched to Kitchen Display Monitors.</span>
          </div>
          <button onClick={() => setAppliedRec(false)} className="text-white/80 hover:text-white text-xs underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* --------------------------------------------------
          2. LIVE RESTAURANT STATUS (5 Animated Metrics)
      -------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* CUSTOMERS */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 duration-300 space-y-1.5 relative overflow-hidden group">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#1b4332] mb-1">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">CUSTOMERS</span>
          <p className="text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
            <AnimatedCounter value={1248} />
          </p>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
            +12% vs last week
          </span>
        </div>

        {/* DEMAND */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 duration-300 space-y-1.5 relative overflow-hidden group">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#1b4332] mb-1">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">DEMAND</span>
          <p className="text-3xl font-extrabold font-heading text-[#1b4332] tracking-tight">
            <AnimatedCounter value={1086} suffix=" portions" />
          </p>
          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
            High Precision Model
          </span>
        </div>

        {/* KITCHEN */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 duration-300 space-y-1.5 relative overflow-hidden group">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 mb-1">
            <ChefHat className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">KITCHEN</span>
          <p className="text-3xl font-extrabold font-heading text-amber-700 tracking-tight">
            <AnimatedCounter value={82} suffix="% capacity" />
          </p>
          <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full inline-block">
            Optimal Workload
          </span>
        </div>

        {/* WASTE */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 duration-300 space-y-1.5 relative overflow-hidden group">
          <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600 mb-1">
            <Trash2 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">WASTE</span>
          <p className="text-3xl font-extrabold font-heading text-red-600 tracking-tight">
            <AnimatedCounter value={49} suffix=" portions" />
          </p>
          <span className="text-[10px] text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded-full inline-block">
            Low Ratio (4.2%)
          </span>
        </div>

        {/* SAVINGS */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 duration-300 space-y-1.5 relative overflow-hidden group col-span-2 sm:col-span-1">
          <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37] mb-1">
            <DollarSign className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">SAVINGS</span>
          <p className="text-3xl font-extrabold font-heading text-[#d4af37] tracking-tight">
            <AnimatedCounter value={4850} prefix="₹" />
          </p>
          <span className="text-[10px] text-amber-900 font-bold bg-[#d4af37]/15 px-2 py-0.5 rounded-full inline-block">
            Cost Recovered Today
          </span>
        </div>
      </div>

      {/* --------------------------------------------------
          3. AI PREDICTION TIMELINE (Interactive Horizon)
      -------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold font-heading text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#1b4332]" /> AI Prediction Timeline Horizon
            </h3>
            <p className="text-xs text-gray-500 font-medium">Select period to inspect real-time forecast and kitchen prep recommendations</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Live Forecast Model:</span>
            <span className="text-xs font-extrabold text-[#1b4332] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              SmartServe AI v2.4
            </span>
          </div>
        </div>

        {/* Horizontal Timeline Segment Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-[#f4f6f0] p-2 rounded-2xl border border-gray-200">
          {['NOW', 'NEXT 2 HOURS', 'TODAY', 'TOMORROW', 'NEXT 7 DAYS'].map((period) => (
            <button
              key={period}
              onClick={() => setTimelinePeriod(period)}
              className={`py-3 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-center ${
                timelinePeriod === period
                  ? 'bg-[#1b4332] text-white shadow-md ring-2 ring-[#d4af37]/40'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Active Selected Period Detail Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#081c15] via-[#112a12] to-[#1b4332] text-white shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in border border-emerald-800/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Active Horizon</span>
            <p className="text-2xl font-extrabold font-heading text-[#d4af37]">{timelinePeriod}</p>
            <div className="mt-2 inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-xs text-gray-300">Expected Demand:</span>
              <strong className="text-sm font-bold text-white font-mono">{currentTimeline.demand}</strong>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Risk Assessment</span>
            <div className="mt-2">
              <span className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border ${currentTimeline.riskColor}`}>
                {currentTimeline.risk} Risk Level
              </span>
            </div>
            <p className="text-[11px] text-gray-300 mt-2">Target Volume: <strong className="text-emerald-300 font-mono">{currentTimeline.targetQty}</strong></p>
          </div>

          <div className="space-y-1 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-[#d4af37] uppercase font-extrabold tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#d4af37]" /> AI RECOMMENDATION
              </span>
              <p className="text-xs text-gray-100 mt-2 font-medium leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
                "{currentTimeline.recommendation}"
              </p>
            </div>
            <button
              onClick={() => handleApplyRecommendation(currentTimeline.recommendation)}
              className="mt-3 w-full py-2.5 rounded-xl bg-[#d4af37] hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Dispatch to Kitchen
            </button>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------
          GRID: 4. AI REASONING ENGINE & 5. SMART RECOMMENDATION
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 4. AI REASONING ENGINE ("Why AI Thinks This") */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold font-heading text-gray-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#1b4332]" /> Why AI Thinks This
                </h3>
                <p className="text-xs text-gray-500 font-medium">Factors influencing today's demand prediction</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-[#d4af37] bg-[#d4af37]/15 px-3 py-1 rounded-full border border-[#d4af37]/30 shadow-2xs">
                  AI Confidence 92%
                </span>
                <span className="text-[10px] text-emerald-700 font-extrabold block mt-1 uppercase tracking-wider">
                  Reliability: HIGH
                </span>
              </div>
            </div>

            {/* Factor Bar Items */}
            <div className="space-y-4 pt-4">
              {factorsData.map((item, idx) => (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-gray-800">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.factor}</span>
                    </span>
                    <span className="font-mono font-extrabold text-[#1b4332]">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner p-0.5">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: item.width, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Model: Ensemble LightGBM + Time-Series</span>
            <button
              onClick={() => setShowReasoningModal(true)}
              className="text-xs font-bold text-[#1b4332] hover:text-[#2d6a4f] underline cursor-pointer flex items-center gap-1"
            >
              <span>View Full Reasoning Model</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 5. SMART RECOMMENDATION CARD */}
        <div className="bg-gradient-to-br from-[#081c15] via-[#112a12] to-[#1b4332] text-white rounded-3xl p-6 shadow-xl border border-[#d4af37]/30 flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-5 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#d4af37] bg-[#d4af37]/20 px-3 py-1 rounded-full border border-[#d4af37]/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> AI RECOMMENDATION
              </span>
              <span className="text-[10px] text-emerald-300 font-mono bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-400/30">
                Action Ready
              </span>
            </div>

            <div>
              <p className="text-xs text-gray-300 font-semibold uppercase tracking-wider">Optimal Prep Target</p>
              <h3 className="text-2xl md:text-3xl font-extrabold font-heading text-white mt-1">
                Prepare 90 portions of Veg Biryani
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] text-gray-300 font-semibold uppercase">Expected Demand</span>
                <p className="text-xl font-extrabold text-white font-heading mt-0.5">85</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] text-gray-300 font-semibold uppercase">Safety Buffer</span>
                <p className="text-xl font-extrabold text-[#d4af37] font-heading mt-0.5">5</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] text-gray-300 font-semibold uppercase">Expected Waste</span>
                <p className="text-xl font-extrabold text-emerald-400 font-heading mt-0.5">Low</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] text-gray-300 font-semibold uppercase">Shortage Risk</span>
                <p className="text-xl font-extrabold text-emerald-400 font-heading mt-0.5">Very Low</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3 relative z-10">
            <button
              onClick={() => handleApplyRecommendation('Veg Biryani (90 portions)')}
              className="w-full sm:flex-1 py-3.5 rounded-2xl bg-[#d4af37] hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all cursor-pointer tracking-wider uppercase text-center"
            >
              APPLY RECOMMENDATION
            </button>
            <button
              onClick={() => setShowReasoningModal(true)}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer text-center"
            >
              VIEW REASONING
            </button>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------
          GRID: 6. PREDICTION VS REALITY & 7. RISK RADAR
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 6. PREDICTION VS REALITY */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold font-heading text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#1b4332]" /> Prediction vs Reality Validation
              </h3>
              <p className="text-xs text-emerald-800 font-medium font-mono mt-0.5">
                "AI is learning from actual restaurant performance."
              </p>
            </div>
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shrink-0">
              96.4% Prediction Accuracy
            </span>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f4f6f0] p-3.5 rounded-2xl border border-gray-200 text-center">
            <div className="bg-white p-2.5 rounded-xl border border-gray-200">
              <span className="text-[10px] text-gray-500 font-bold uppercase">AI Prediction</span>
              <p className="text-xl font-extrabold text-[#1b4332] font-heading">85</p>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-gray-200">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Actual Sales</span>
              <p className="text-xl font-extrabold text-gray-900 font-heading">82</p>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-gray-200">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Prediction Difference</span>
              <p className="text-xl font-extrabold text-emerald-700 font-heading">3 portions</p>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-gray-200">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Prediction Accuracy</span>
              <p className="text-xl font-extrabold text-[#d4af37] font-heading">96.4%</p>
            </div>
          </div>

          {/* Interactive Chart */}
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#081c15', borderRadius: '16px', color: '#fff', fontSize: '12px', borderColor: '#1b4332' }}
                  itemStyle={{ color: '#d4af37' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="predicted" name="AI Predicted Demand" stroke="#1b4332" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="actual" name="Actual POS Sales" stroke="#d4af37" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7. RISK RADAR Visual Risk Monitoring */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold font-heading text-gray-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#1b4332]" /> Risk Radar Monitoring
              </h3>
              <span className="text-[10px] text-gray-500 font-mono">Real-time Sensors</span>
            </div>

            {/* Radar Visual Chart */}
            <div className="h-44 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 'bold', fill: '#374151' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar name="Risk Index" dataKey="value" stroke="#1b4332" fill="#2d6a4f" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Indicator List */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <span className="font-bold text-emerald-950">Food Shortage Risk</span>
                <span className="font-extrabold text-emerald-800 bg-emerald-200/80 px-2.5 py-0.5 rounded-full text-[10px]">LOW</span>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <span className="font-bold text-amber-950">Food Waste Risk</span>
                <span className="font-extrabold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full text-[10px]">MEDIUM</span>
              </div>

              <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between">
                <span className="font-bold text-orange-950">Demand Spike Risk</span>
                <span className="font-extrabold text-orange-900 bg-orange-200/80 px-2.5 py-0.5 rounded-full text-[10px]">HIGH</span>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <span className="font-bold text-blue-950">Weather Impact Risk</span>
                <span className="font-extrabold text-blue-900 bg-blue-200/80 px-2.5 py-0.5 rounded-full text-[10px]">MEDIUM</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#f4f6f0] border border-gray-200 flex items-center justify-between">
                <span className="font-bold text-gray-900">Kitchen Capacity</span>
                <span className="font-extrabold text-[#1b4332] text-[10px]">82% OPTIMAL</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* --------------------------------------------------
          8. FOOD INTELLIGENCE TABLE (Interactive Rows)
      -------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-lg font-bold font-heading text-gray-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#1b4332]" /> Food Intelligence
            </h3>
            <p className="text-xs text-gray-500 font-medium">Click any row to open detailed AI item analysis & preparation strategy</p>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-[#f4f6f0] px-3 py-1 rounded-full border border-gray-200">
            6 Tracked Menu Items
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#081c15] text-gray-200 uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="px-5 py-3.5">Food Item</th>
                <th className="px-5 py-3.5">Demand</th>
                <th className="px-5 py-3.5">Trend</th>
                <th className="px-5 py-3.5">Waste Risk</th>
                <th className="px-5 py-3.5">Shortage Risk</th>
                <th className="px-5 py-3.5 text-right">AI Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
              {foodIntelligenceList.map((item, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => setSelectedFoodDetail(item)}
                  className="hover:bg-emerald-50/60 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3.5 font-bold text-gray-900 flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                    <span className="group-hover:text-[#1b4332] transition-colors">{item.name}</span>
                  </td>
                  <td className="px-5 py-3.5 font-extrabold text-gray-900 font-mono">{item.demand}</td>
                  <td className="px-5 py-3.5 font-extrabold text-emerald-700">{item.trend}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-700">{item.waste}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-700">{item.risk}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase shadow-2xs ${
                      item.action === 'Increase' 
                        ? 'bg-amber-500 text-white' 
                        : item.action === 'Reduce' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-[#1b4332] text-white'
                    }`}>
                      {item.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --------------------------------------------------
          GRID: 9. WEATHER INTELLIGENCE, 10. AI ALERTS, 11. AI ACTIVITY FEED
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 9. WEATHER + DEMAND INTELLIGENCE */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <CloudRain className="w-5 h-5 text-blue-600" /> Weather → Demand Intelligence
            </h3>

            {/* Diagram Connection Flow */}
            <div className="flex items-center justify-between bg-[#f4f6f0] p-2.5 rounded-2xl border border-gray-200 text-[10px] font-extrabold text-gray-700 text-center">
              <span className="bg-blue-100 text-blue-900 px-2 py-1 rounded-lg">WEATHER</span>
              <span>→</span>
              <span className="bg-emerald-100 text-emerald-900 px-2 py-1 rounded-lg">AI ANALYSIS</span>
              <span>→</span>
              <span className="bg-amber-100 text-amber-900 px-2 py-1 rounded-lg">FOOD DEMAND</span>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 rounded-2xl border border-blue-200/80 space-y-1">
              <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider">Rain Probability</span>
              <p className="text-3xl font-extrabold text-blue-950 font-heading">78%</p>
              <span className="text-[10px] text-blue-800 font-medium">Partly Cloudy with Evening Showers</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f4f6f0] border border-gray-200 text-xs space-y-2">
              <p className="font-extrabold text-gray-900">AI Weather Impact Prediction:</p>
              <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-gray-200">
                <span className="font-medium text-gray-700">Hot food demand</span>
                <span className="text-emerald-700 font-extrabold">↑ 14%</span>
              </div>
              <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-gray-200">
                <span className="font-medium text-gray-700">Cold beverage demand</span>
                <span className="text-orange-600 font-extrabold">↓ 22%</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setShowWeatherModal(true)} 
            className="w-full py-3 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            View Weather Impact
          </button>
        </div>

        {/* 10. REAL-TIME AI ALERTS PANEL */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4">
          <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Zap className="w-5 h-5 text-amber-500" /> Real-Time AI Alert Panel
          </h3>

          <div className="space-y-3 text-xs">
            {/* Alert 1 */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-amber-200 text-amber-950 uppercase">HIGH PRIORITY</span>
                <span className="text-[10px] text-gray-400 font-mono">2 mins ago</span>
              </div>
              <p className="font-bold text-gray-900 leading-snug">
                Masala Dosa demand may increase significantly during evening hours.
              </p>
              <p className="text-[#1b4332] font-extrabold text-[11px] pt-1">
                RECOMMENDED ACTION: Prepare additional 15 portions.
              </p>
            </div>

            {/* Alert 2 */}
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-red-200 text-red-950 uppercase">MEDIUM PRIORITY</span>
                <span className="text-[10px] text-gray-400 font-mono">10 mins ago</span>
              </div>
              <p className="font-bold text-gray-900 leading-snug">
                Paneer Curry waste is above normal baseline.
              </p>
              <p className="text-[#1b4332] font-extrabold text-[11px] pt-1">
                RECOMMENDED ACTION: Reduce preparation by 8 portions.
              </p>
            </div>

            {/* Alert 3 */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-emerald-200 text-emerald-950 uppercase">POSITIVE INSIGHT</span>
                <span className="text-[10px] text-gray-400 font-mono">25 mins ago</span>
              </div>
              <p className="font-bold text-gray-900 leading-snug">
                Smart preparation could save approximately ₹1,200 this week.
              </p>
            </div>
          </div>
        </div>

        {/* 11. AI ACTIVITY FEED (Live Activity Feed) */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" /> AI Activity Feed
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="space-y-2.5 text-xs">
            {activityFeed.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#f4f6f0] border border-gray-200/80">
                  <div className="flex items-center gap-2.5">
                    <IconComp className={`w-4 h-4 ${item.color} shrink-0`} />
                    <span className="font-bold text-gray-800">{item.text}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono shrink-0">{item.time}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* --------------------------------------------------
          12. AI ASSISTANT (Inline & Quick Prompts Panel)
      -------------------------------------------------- */}
      <div className="bg-gradient-to-r from-[#081c15] via-[#112a12] to-[#1b4332] text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-emerald-800/40 relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/20 px-3 py-1 rounded-full border border-[#d4af37]/40 inline-flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-[#d4af37]" /> ASK SMARTSERVE AI
            </span>
            <h3 className="text-2xl font-extrabold font-heading text-white mt-2">
              "What would you like to know?"
            </h3>
            <p className="text-xs text-gray-300 mt-1">Click a quick question below or ask our natural language copilot</p>
          </div>

          <button
            onClick={() => handleAskQuestion("What is today's biggest risk?")}
            className="px-5 py-3 rounded-2xl bg-[#d4af37] hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            <span>Ask SmartServe AI</span>
          </button>
        </div>

        {/* Quick Questions Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {[
            "What should I prepare tomorrow?",
            "Why is demand increasing?",
            "Which food wastes the most?",
            "How much can I save?",
            "What is today's biggest risk?"
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuestion(q)}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-left text-xs font-semibold text-gray-200 hover:text-white transition-all cursor-pointer flex items-center justify-between group"
            >
              <span className="line-clamp-2">{q}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#d4af37] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------
          MODALS & DETAIL SLIDE-OVERS
      -------------------------------------------------- */}

      {/* 1. Item Detail Modal when Clicking Food Intelligence Table Row */}
      {selectedFoodDetail && (
        <Modal
          isOpen={!!selectedFoodDetail}
          onClose={() => setSelectedFoodDetail(null)}
          title={`AI Intelligence Analysis: ${selectedFoodDetail.name}`}
        >
          <div className="space-y-5 text-xs">
            <div className="bg-[#081c15] text-white p-5 rounded-2xl border border-[#1b4332] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#d4af37] uppercase font-bold tracking-wider">Item AI Telemetry</span>
                <span className="text-[10px] text-emerald-300 font-mono bg-emerald-500/20 px-2 py-0.5 rounded">Category: {selectedFoodDetail.category}</span>
              </div>
              <h4 className="text-xl font-bold font-heading text-white">{selectedFoodDetail.name}</h4>
              <p className="text-gray-300 leading-relaxed pt-1 font-medium">{selectedFoodDetail.aiNote}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#f4f6f0] p-3.5 rounded-2xl border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Selling Price / Cost</span>
                <p className="text-base font-extrabold text-gray-900 mt-0.5">₹{selectedFoodDetail.price} / ₹{selectedFoodDetail.cost}</p>
              </div>

              <div className="bg-[#f4f6f0] p-3.5 rounded-2xl border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Forecasted Demand</span>
                <p className="text-base font-extrabold text-[#1b4332] mt-0.5">{selectedFoodDetail.demand} Portions</p>
              </div>

              <div className="bg-[#f4f6f0] p-3.5 rounded-2xl border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Recommended Buffer</span>
                <p className="text-base font-extrabold text-[#d4af37] mt-0.5">+{selectedFoodDetail.prepBuffer} Portions</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => {
                  handleApplyRecommendation(`${selectedFoodDetail.name} (${selectedFoodDetail.demand + selectedFoodDetail.prepBuffer} portions)`);
                  setSelectedFoodDetail(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                Dispatch Strategy
              </button>

              <button
                onClick={() => setSelectedFoodDetail(null)}
                className="px-5 py-2.5 rounded-xl bg-[#1b4332] text-white text-xs font-bold cursor-pointer"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 2. Full Reasoning Modal */}
      {showReasoningModal && (
        <Modal
          isOpen={showReasoningModal}
          onClose={() => setShowReasoningModal(false)}
          title="AI Explainability & Reasoning Architecture"
        >
          <div className="space-y-4 text-xs">
            <p className="text-gray-600 font-medium">
              SmartServe AI uses an ensemble time-series neural architecture combining POS sales velocity, weather radar, day-of-week seasonality, and hyper-local event triggers.
            </p>

            <div className="space-y-3 pt-2">
              {factorsData.map((f, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#f4f6f0] border border-gray-200 space-y-1">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>{f.factor}</span>
                    <span className="text-[#1b4332]">{f.percentage}% Impact Weight</span>
                  </div>
                  <p className="text-gray-500 text-[11px]">
                    Evaluates {f.factor.toLowerCase()} patterns from 12+ months of historical restaurant telemetry.
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setShowReasoningModal(false)}
                className="px-5 py-2 rounded-xl bg-[#1b4332] text-white font-bold text-xs"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 3. Weather Impact Modal */}
      {showWeatherModal && (
        <Modal
          isOpen={showWeatherModal}
          onClose={() => setShowWeatherModal(false)}
          title="Weather & Micro-Climate Impact Breakdown"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-blue-900 text-white p-4 rounded-2xl space-y-1">
              <span className="text-[10px] text-blue-300 uppercase font-bold">Local Forecast</span>
              <h4 className="text-lg font-bold font-heading">78% Precipitation Probability</h4>
              <p className="text-blue-100 text-xs">Rain expected between 5:30 PM and 8:00 PM today.</p>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="font-bold text-emerald-900">Hot Meals & Biryani</span>
                <p className="text-emerald-700 font-semibold mt-0.5">Surge expected: +14% extra orders during rain hours.</p>
              </div>

              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
                <span className="font-bold text-orange-900">Cold Beverages & Salads</span>
                <p className="text-orange-700 font-semibold mt-0.5">Decrease expected: -22% drop in cold beverage orders.</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowWeatherModal(false)}
                className="px-5 py-2 rounded-xl bg-[#1b4332] text-white font-bold text-xs"
              >
                Close Weather Impact
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 4. Ask AI Assistant Modal */}
      {showAssistantModal && (
        <Modal
          isOpen={showAssistantModal}
          onClose={() => setShowAssistantModal(false)}
          title="Ask SmartServe AI Copilot"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-[#081c15] text-white p-4 rounded-2xl border border-[#1b4332] space-y-2">
              <span className="text-[10px] text-[#d4af37] uppercase font-bold">User Query</span>
              <p className="text-sm font-bold text-white font-heading">"{assistantQuery}"</p>
            </div>

            {isAssistantThinking ? (
              <div className="p-6 rounded-2xl bg-[#f4f6f0] border border-gray-200 text-center space-y-2">
                <Sparkles className="w-6 h-6 text-[#d4af37] animate-spin mx-auto" />
                <p className="text-xs text-gray-600 font-semibold">SmartServe AI is running time-series inferences...</p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#f4f6f0] border border-gray-200 text-gray-800 font-medium leading-relaxed">
                {assistantAnswer}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowAssistantModal(false)}
                className="px-5 py-2 rounded-xl bg-[#1b4332] text-white font-bold text-xs"
              >
                Close Assistant
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
