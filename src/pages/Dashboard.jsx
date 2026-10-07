import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  ChefHat, 
  Trash2, 
  DollarSign, 
  Users, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  CloudRain, 
  ArrowRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  HelpCircle, 
  Zap, 
  Check, 
  Layers,
  BarChart3,
  Calendar,
  Sliders,
  ChevronRight,
  Activity,
  FileText,
  Upload,
  Plus,
  Bot,
  Flame,
  Award,
  RefreshCw,
  X
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import AnimatedCounter from '../components/AnimatedCounter';
import DigitalTwinGraph from '../components/DigitalTwinGraph';
import Modal from '../components/Modal';
import { apiService } from '../services/apiService';

export default function Dashboard({ onNavigate }) {
  // Horizon for Forecast Chart: Today, Tomorrow, 7 Days
  const [forecastRange, setForecastRange] = useState('Today');

  // Interactive States & Feedback
  const [successToast, setSuccessToast] = useState('');
  const [selectedRiskModal, setSelectedRiskModal] = useState(null);
  const [selectedFoodModal, setSelectedFoodModal] = useState(null);
  const [showFullReasoningModal, setShowFullReasoningModal] = useState(false);
  const [showFullBriefingModal, setShowFullBriefingModal] = useState(false);

  // Copilot Assistant Modal State
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotAnswer, setCopilotAnswer] = useState(null);
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);
  const [showCopilotModal, setShowCopilotModal] = useState(false);

  // Service Data Bindings
  const alertsData = apiService.getRealtimeAlerts();
  const factorsData = apiService.getExplainableFactors();
  const businessImpactData = apiService.getBusinessImpactMetrics();
  const weatherData = apiService.getWeatherForecast();
  const foodMatrixData = apiService.getFoodPerformanceMatrix();
  const healthScoreData = apiService.getRestaurantIntelligenceScore();
  const accuracyMetricsData = apiService.getPredictionAccuracyMetrics();
  const briefingData = apiService.getAiDailyBriefing();

  // Action Button Handlers
  const handleTakeActionHighPriority = () => {
    setSuccessToast("✓ Action Executed: Added +15 portions of Masala Dosa to kitchen prep line.");
    setTimeout(() => setSuccessToast(''), 4500);
  };

  const handleReviewMediumPriority = () => {
    setSuccessToast("✓ Review Applied: Reduced Paneer Curry preparation by 8 portions.");
    setTimeout(() => setSuccessToast(''), 4500);
  };

  const handleCopilotAsk = (questionText) => {
    setCopilotQuery(questionText);
    setIsCopilotThinking(true);
    setShowCopilotModal(true);

    setTimeout(() => {
      let ans = "";
      const q = questionText.toLowerCase();

      if (q.includes('prepare now')) {
        ans = "Immediate Priority: (1) Prepare 15 additional Masala Dosa portions before 7 PM dinner rush, (2) Reduce Paneer Curry prep by 8 portions to avoid over-prep waste.";
      } else if (q.includes('biggest risk')) {
        ans = "Your biggest risk right now is a DEMAND SPIKE on Masala Dosa during the 7:00 - 9:00 PM dinner peak (+18% above baseline).";
      } else if (q.includes('why is demand increasing')) {
        ans = "Today's demand is 12.4% higher due to (1) Friday evening footfall surge (+42% factor weight), (2) Local corporate lunch bookings (+21%), and (3) Pleasant 28°C weather (+11%).";
      } else if (q.includes('prepare tomorrow')) {
        ans = "Tomorrow's AI Prep Target: Veg Biryani 90 portions, Paneer Curry 65 portions, Chicken Biryani 125 portions, Masala Dosa 116 portions.";
      } else if (q.includes('waste can i reduce')) {
        ans = "By shifting to dynamic 2-stage batching for Paneer Curry and Cold Coffee, you can reduce waste by 23% and save ₹18,400 monthly.";
      } else {
        ans = `SmartServe AI Copilot: Analysis for "${questionText}" -> Restaurant health is 87/100 EXCELLENT with 96.2% prediction accuracy today.`;
      }

      setCopilotAnswer(ans);
      setIsCopilotThinking(false);
    }, 600);
  };

  // Forecast Chart Data
  const forecastChartDataMap = {
    Today: [
      { time: "11 AM", actual: 32, predicted: 35, prep: 38 },
      { time: "01 PM", actual: 135, predicted: 140, prep: 145 },
      { time: "03 PM", actual: 40, predicted: 45, prep: 48 },
      { time: "06 PM", actual: 70, predicted: 75, prep: 80 },
      { time: "08 PM", actual: 185, predicted: 190, prep: 198 },
      { time: "10 PM", actual: 48, predicted: 50, prep: 53 }
    ],
    Tomorrow: [
      { time: "11 AM", actual: null, predicted: 42, prep: 45 },
      { time: "01 PM", actual: null, predicted: 155, prep: 162 },
      { time: "03 PM", actual: null, predicted: 48, prep: 52 },
      { time: "06 PM", time: "06 PM", actual: null, predicted: 85, prep: 90 },
      { time: "08 PM", actual: null, predicted: 215, prep: 225 },
      { time: "10 PM", actual: null, predicted: 55, prep: 58 }
    ],
    '7 Days': [
      { time: "Mon", actual: 340, predicted: 350, prep: 368 },
      { time: "Tue", actual: 380, predicted: 375, prep: 402 },
      { time: "Wed", actual: 410, predicted: 405, prep: 429 },
      { time: "Thu", actual: 440, predicted: 450, prep: 455 },
      { time: "Fri", actual: 590, predicted: 580, prep: 608 },
      { time: "Sat", actual: 680, predicted: 690, prep: 704 },
      { time: "Sun", actual: 640, predicted: 630, prep: 660 }
    ]
  };

  const activeForecastChart = forecastChartDataMap[forecastRange] || forecastChartDataMap.Today;

  // Live Activity Stream Timestamps
  const activityStream = [
    { text: "Sales POS data analyzed", time: "1 min ago", color: "text-emerald-400" },
    { text: "Weather radar updated (78% Rain Prob)", time: "2 mins ago", color: "text-blue-400" },
    { text: "Demand time-series model evaluated", time: "4 mins ago", color: "text-amber-400" },
    { text: "Prediction generated (1,086 portions)", time: "5 mins ago", color: "text-emerald-400" },
    { text: "Preparation recommendation created", time: "6 mins ago", color: "text-[#d4af37]" },
    { text: "Waste risk detected for Paneer Curry", time: "8 mins ago", color: "text-red-400" },
    { text: "AI executive briefing updated", time: "10 mins ago", color: "text-emerald-400" }
  ];

  // Risks Data for Risk Center
  const liveRisks = [
    { id: "r1", name: "SHORTAGE RISK", level: "LOW", color: "bg-emerald-100 text-emerald-900 border-emerald-300", detail: "Veg Biryani stock matches demand with 5-portion buffer." },
    { id: "r2", name: "WASTE RISK", level: "MEDIUM", color: "bg-amber-100 text-amber-900 border-amber-300", detail: "Paneer Curry weekday over-prep excess (8 portions)." },
    { id: "r3", name: "DEMAND SPIKE", level: "HIGH", color: "bg-orange-100 text-orange-900 border-orange-300", detail: "Masala Dosa morning/evening rush (+18% above baseline)." },
    { id: "r4", name: "WEATHER IMPACT", level: "MEDIUM", color: "bg-blue-100 text-blue-900 border-blue-300", detail: "Evening rain reduces cold beverages by 22% and increases hot meals by 14%." },
    { id: "r5", name: "KITCHEN CAPACITY", level: "LOW", color: "bg-purple-100 text-purple-900 border-purple-300", detail: "Kitchen capacity load is optimal at 82%." }
  ];

  return (
    <div className="space-y-8 pb-16 font-sans text-gray-800">
      
      {/* --------------------------------------------------
          1. HERO — AI RESTAURANT BRAIN
      -------------------------------------------------- */}
      <div className="bg-gradient-to-r from-[#040d09] via-[#081c15] to-[#1b4332] rounded-3xl p-6 md:p-8 text-white shadow-2xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/15 px-3 py-1 rounded-full border border-[#d4af37]/30 flex items-center gap-1.5 shadow-xs">
                <Cpu className="w-3.5 h-3.5 text-[#d4af37]" /> AI RESTAURANT BRAIN
              </span>

              <span className="text-xs text-emerald-300 font-semibold bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <span className="font-extrabold tracking-wide">● AI ENGINE ACTIVE</span>
              </span>
            </div>

            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
                "Good Evening, Restaurant Manager"
              </h1>
              <p className="text-emerald-300 text-sm md:text-base font-bold mt-2 font-mono">
                "SmartServe AI has analyzed your restaurant."
              </p>
              <p className="text-white text-base md:text-lg mt-1 font-bold">
                "Today's demand is expected to be <span className="text-[#d4af37]">12% higher</span> than usual."
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate && onNavigate('preparation')}
                className="px-5 py-3.5 rounded-2xl bg-[#d4af37] hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all cursor-pointer tracking-wider uppercase"
              >
                VIEW AI RECOMMENDATIONS
              </button>

              <button
                onClick={() => onNavigate && onNavigate('prediction')}
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
              >
                OPEN PREDICTION CENTER
              </button>
            </div>
          </div>

          {/* Hero Right: Animated AI Data-Flow Diagram */}
          <div className="lg:col-span-5 bg-black/40 backdrop-blur-md p-5 rounded-3xl border border-white/10 text-center space-y-3 relative overflow-hidden shadow-inner">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Subtle Neural Data Flow Pipeline</span>
            
            {/* Visual Pipeline Block */}
            <div className="space-y-2 text-xs font-mono font-bold">
              {/* Inputs */}
              <div className="flex flex-wrap justify-center gap-1.5 text-[10px]">
                <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">SALES</span>
                <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-400/30">WEATHER</span>
                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">EVENTS</span>
                <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-400/30">CUSTOMERS</span>
                <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-400/30">WASTE</span>
              </div>

              {/* Arrow Down */}
              <div className="text-emerald-400 text-sm font-extrabold animate-bounce">↓</div>

              {/* Core Engine */}
              <div className="bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] py-2 px-4 rounded-xl border border-emerald-400/40 text-white shadow-md inline-flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#d4af37] animate-spin" />
                <span className="font-extrabold tracking-wider">SMARTSERVE AI CORE</span>
              </div>

              {/* Arrow Down */}
              <div className="text-emerald-400 text-sm font-extrabold animate-bounce">↓</div>

              {/* Outputs */}
              <div className="flex justify-center gap-2 text-[10px]">
                <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-xl border border-emerald-400/30 font-bold">PREDICTION</span>
                <span className="bg-[#d4af37]/20 text-[#d4af37] px-3 py-1 rounded-xl border border-[#d4af37]/30 font-bold">RECOMMENDATION</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs md:text-sm flex items-center justify-between gap-3 animate-fade-in shadow-xl border border-emerald-400/40">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-white/80 hover:text-white text-xs underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* --------------------------------------------------
          2. AI STATUS BAR
      -------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-4 px-6 shadow-xs border border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 font-extrabold text-[#1b4332]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="uppercase tracking-wider text-xs font-heading">● AI ENGINE ACTIVE</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 font-semibold text-gray-700">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-normal">Model Status:</span>
            <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Healthy</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-normal">Data Status:</span>
            <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Synchronized</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-normal">Last Prediction:</span>
            <span className="font-mono text-gray-900 font-bold">2 minutes ago</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-normal">Prediction Confidence:</span>
            <span className="text-[#d4af37] font-mono font-extrabold bg-[#d4af37]/15 px-2.5 py-0.5 rounded-full border border-[#d4af37]/30">94%</span>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------
          3. EXECUTIVE METRICS (4 Large Dominant Cards)
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TODAY'S DEMAND */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 duration-300 space-y-2 group">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">TODAY'S DEMAND</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#1b4332]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-4xl font-extrabold font-heading text-gray-900 tracking-tight">
            <AnimatedCounter value={1086} suffix=" portions" />
          </p>
          <span className="text-xs text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> ↑ 12.4% vs usual
          </span>
        </div>

        {/* RECOMMENDED PREPARATION */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 duration-300 space-y-2 group">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">RECOMMENDED PREPARATION</span>
            <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37]">
              <ChefHat className="w-4 h-4" />
            </div>
          </div>
          <p className="text-4xl font-extrabold font-heading text-[#1b4332] tracking-tight">
            <AnimatedCounter value={1135} suffix=" portions" />
          </p>
          <span className="text-xs text-amber-900 font-extrabold bg-[#d4af37]/15 px-2.5 py-1 rounded-full inline-block">
            94% confidence score
          </span>
        </div>

        {/* EXPECTED WASTE */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 duration-300 space-y-2 group">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">EXPECTED WASTE</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <Trash2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-4xl font-extrabold font-heading text-red-600 tracking-tight">
            <AnimatedCounter value={49} suffix=" portions" />
          </p>
          <span className="text-xs text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5" /> ↓ 18% waste reduction
          </span>
        </div>

        {/* ESTIMATED SAVINGS */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 duration-300 space-y-2 group">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">ESTIMATED SAVINGS</span>
            <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-4xl font-extrabold font-heading text-[#d4af37] tracking-tight">
            <AnimatedCounter value={4850} prefix="₹" />
          </p>
          <span className="text-xs text-amber-900 font-extrabold bg-[#d4af37]/15 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> ↑ 23% cost recovery
          </span>
        </div>
      </div>

      {/* --------------------------------------------------
          15. QUICK ACTIONS TOOLBAR
      -------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-4 px-6 shadow-xs border border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-extrabold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-[#d4af37]" /> Quick Executive Actions:
        </span>

        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <button onClick={() => onNavigate && onNavigate('sales')} className="px-3.5 py-2 rounded-xl bg-[#1b4332] text-white hover:bg-[#2d6a4f] transition-all flex items-center gap-1.5 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Add Sales
          </button>
          <button onClick={() => onNavigate && onNavigate('waste')} className="px-3.5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-all flex items-center gap-1.5 cursor-pointer">
            <Trash2 className="w-3.5 h-3.5" /> Record Waste
          </button>
          <button onClick={() => onNavigate && onNavigate('sales')} className="px-3.5 py-2 rounded-xl bg-[#081c15] text-white hover:bg-[#1b4332] transition-all flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-emerald-400" /> Upload CSV
          </button>
          <button onClick={() => onNavigate && onNavigate('prediction')} className="px-3.5 py-2 rounded-xl bg-[#d4af37] text-slate-950 hover:bg-amber-400 transition-all flex items-center gap-1.5 cursor-pointer">
            <TrendingUp className="w-3.5 h-3.5" /> Run Prediction
          </button>
          <button onClick={() => onNavigate && onNavigate('prediction')} className="px-3.5 py-2 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all flex items-center gap-1.5 cursor-pointer">
            <Sliders className="w-3.5 h-3.5 text-[#1b4332]" /> Open Simulator
          </button>
          <button onClick={() => handleCopilotAsk("What should I prepare now?")} className="px-3.5 py-2 rounded-xl bg-[#081c15] text-[#d4af37] hover:bg-[#1b4332] transition-all flex items-center gap-1.5 cursor-pointer border border-[#d4af37]/40">
            <Bot className="w-3.5 h-3.5 text-[#d4af37]" /> Ask AI
          </button>
        </div>
      </div>

      {/* --------------------------------------------------
          4. "WHAT SHOULD I DO NOW?" (Priority Action Cards)
      -------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold font-heading text-gray-900 flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-500" /> What Should I Do Now?
            </h2>
            <p className="text-xs text-gray-500 font-medium">AI-generated priority action recommendations for immediate operational dispatch</p>
          </div>
          <span className="text-xs font-extrabold text-[#1b4332] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Action Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* HIGH PRIORITY */}
          <div className="p-5 rounded-3xl bg-red-50/70 border border-red-200 space-y-3 flex flex-col justify-between hover-card-rise">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-950 bg-red-200 px-3 py-1 rounded-full inline-block">
                🔴 HIGH PRIORITY
              </span>
              <h3 className="text-base font-extrabold font-heading text-gray-900 leading-snug">
                Prepare 15 additional Masala Dosa portions before 7 PM.
              </h3>
              <p className="text-xs text-red-900 font-medium">
                Reason: Evening demand is expected to increase by 18%.
              </p>
            </div>

            <button
              onClick={handleTakeActionHighPriority}
              className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer uppercase tracking-wider"
            >
              Take Action
            </button>
          </div>

          {/* MEDIUM PRIORITY */}
          <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-3 flex flex-col justify-between hover-card-rise">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-950 bg-amber-200 px-3 py-1 rounded-full inline-block">
                🟠 MEDIUM PRIORITY
              </span>
              <h3 className="text-base font-extrabold font-heading text-gray-900 leading-snug">
                Reduce Paneer Curry preparation by 8 portions.
              </h3>
              <p className="text-xs text-amber-900 font-medium">
                Reason: Waste has exceeded normal levels for 4 consecutive days.
              </p>
            </div>

            <button
              onClick={handleReviewMediumPriority}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer uppercase tracking-wider"
            >
              Review Action
            </button>
          </div>

          {/* OPTIMIZATION */}
          <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 space-y-3 flex flex-col justify-between hover-card-rise">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-950 bg-emerald-200 px-3 py-1 rounded-full inline-block">
                🟢 OPTIMIZATION
              </span>
              <h3 className="text-base font-extrabold font-heading text-gray-900 leading-snug">
                Current Veg Biryani preparation is optimal.
              </h3>
              <p className="text-xs text-emerald-900 font-medium">
                Reason: Kitchen preparation matches predicted dinner demand with 5-portion buffer.
              </p>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('preparation')}
              className="w-full py-3 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer uppercase tracking-wider"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------
          8. LIVE RISK CENTER (Horizontal Risk Monitor)
      -------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold font-heading text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#1b4332]" /> Live Risk Center Radar
          </h3>
          <span className="text-xs text-gray-500 font-mono">Click any risk card for detailed analysis</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {liveRisks.map((risk) => (
            <div
              key={risk.id}
              onClick={() => setSelectedRiskModal(risk)}
              className={`p-4 rounded-2xl border text-center space-y-1 cursor-pointer transition-all hover-card-rise ${risk.color}`}
            >
              <span className="text-[10px] font-extrabold uppercase tracking-wider block">{risk.name}</span>
              <p className="text-xl font-extrabold font-heading">{risk.level}</p>
              <span className="text-[9px] opacity-80 block">Click for details</span>
            </div>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------
          GRID: 5. DEMAND FORECAST & 6. AI EXPLANATION
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 5. DEMAND FORECAST CHART */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#1b4332]" /> Demand Forecast Curve & Confidence Area
              </h3>
              <p className="text-xs text-gray-500 font-medium">Actual Sales vs AI Predicted Demand vs Recommended Preparation</p>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center gap-1 bg-[#f4f6f0] p-1 rounded-xl border border-gray-200">
              {['Today', 'Tomorrow', '7 Days'].map((range) => (
                <button
                  key={range}
                  onClick={() => setForecastRange(range)}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    forecastRange === range ? 'bg-[#1b4332] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeForecastChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#081c15', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="prep" name="Recommended Prep" stroke="#10b981" fill="url(#colorForecast)" strokeWidth={2} />
                <Line type="monotone" dataKey="predicted" name="AI Predicted Demand" stroke="#1b4332" strokeWidth={3} />
                {activeForecastChart[0].actual !== null && (
                  <Line type="monotone" dataKey="actual" name="Actual POS Sales" stroke="#d4af37" strokeWidth={2.5} />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. AI EXPLANATION ("Why is today's demand different?") */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#1b4332]" /> Why is today's demand different?
              </h3>
              <span className="text-xs font-extrabold text-[#d4af37] bg-[#d4af37]/15 px-2.5 py-1 rounded-full border border-[#d4af37]/30">
                Confidence 94%
              </span>
            </div>

            <div className="space-y-3 pt-3">
              {factorsData.map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>{item.factor}</span>
                    <span className="text-[#1b4332] font-mono">+{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden p-0.5">
                    <div 
                      className="h-full rounded-full transition-all duration-700" 
                      style={{ width: item.width, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowFullReasoningModal(true)}
            className="w-full py-2.5 rounded-xl bg-[#f4f6f0] hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all cursor-pointer border border-gray-200 text-center"
          >
            See full reasoning
          </button>
        </div>

      </div>

      {/* --------------------------------------------------
          GRID: 7. RESTAURANT HEALTH & 9. WEATHER INTELLIGENCE
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 7. RESTAURANT HEALTH SCORE (Large Circular SVG Gauge) */}
        <div className="bg-gradient-to-br from-[#040d09] via-[#081c15] to-[#1b4332] text-white rounded-3xl p-6 shadow-xl border border-emerald-800/40 flex flex-col justify-between items-center text-center space-y-4 relative overflow-hidden">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/20 px-3 py-1 rounded-full border border-[#d4af37]/40">
            RESTAURANT HEALTH
          </span>

          <div className="relative w-40 h-40 flex items-center justify-center my-1">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="68" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="transparent" />
              <circle 
                cx="80" 
                cy="80" 
                r="68" 
                stroke="#d4af37" 
                strokeWidth="12" 
                strokeDasharray={427.25}
                strokeDashoffset={427.25 * (1 - 87 / 100)}
                strokeLinecap="round"
                fill="transparent" 
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold font-heading text-white">87<span className="text-lg text-gray-400">/100</span></span>
              <span className="text-[10px] uppercase font-extrabold text-emerald-300 tracking-wider">EXCELLENT</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full pt-3 border-t border-white/10 text-center text-xs">
            <div className="bg-white/5 p-2 rounded-xl">
              <span className="text-[9px] text-gray-400 uppercase font-semibold block">Demand Accuracy</span>
              <p className="text-sm font-extrabold text-emerald-400 font-heading">94%</p>
            </div>
            <div className="bg-white/5 p-2 rounded-xl">
              <span className="text-[9px] text-gray-400 uppercase font-semibold block">Waste Efficiency</span>
              <p className="text-sm font-extrabold text-amber-300 font-heading">81%</p>
            </div>
            <div className="bg-white/5 p-2 rounded-xl">
              <span className="text-[9px] text-gray-400 uppercase font-semibold block">Prep Efficiency</span>
              <p className="text-sm font-extrabold text-white font-heading">91%</p>
            </div>
            <div className="bg-white/5 p-2 rounded-xl">
              <span className="text-[9px] text-gray-400 uppercase font-semibold block">Forecast Reliability</span>
              <p className="text-sm font-extrabold text-[#d4af37] font-heading">89%</p>
            </div>
          </div>
        </div>

        {/* 9. WEATHER INTELLIGENCE */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-blue-600" /> Weather Intelligence
              </h3>
              <span className="text-xs font-extrabold text-blue-900 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
                Rain Probability: 78%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 text-center">
              <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block">Hot Food Demand</span>
                <p className="text-2xl font-extrabold text-emerald-700 font-heading mt-0.5">↑ 14%</p>
              </div>

              <div className="bg-orange-50 p-3.5 rounded-2xl border border-orange-200">
                <span className="text-[10px] text-orange-800 font-bold uppercase block">Cold Beverage Demand</span>
                <p className="text-2xl font-extrabold text-orange-600 font-heading mt-0.5">↓ 22%</p>
              </div>

              <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200">
                <span className="text-[10px] text-blue-800 font-bold uppercase block">Customer Footfall</span>
                <p className="text-2xl font-extrabold text-blue-900 font-heading mt-0.5">↓ 8%</p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-bold">
            💡 Recommended Action: "Increase hot-food preparation while reducing cold beverage preparation."
          </div>
        </div>

      </div>

      {/* --------------------------------------------------
          10. FOOD INTELLIGENCE (Premium Food Performance Table)
      -------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-lg font-bold font-heading text-gray-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#1b4332]" /> Food Intelligence Matrix
            </h3>
            <p className="text-xs text-gray-500 font-medium">Click any row to open item operational analysis</p>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-[#f4f6f0] px-3 py-1 rounded-full border border-gray-200">
            Clickable Items
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#081c15] text-gray-200 uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="px-5 py-3.5">Food Item</th>
                <th className="px-5 py-3.5">Demand</th>
                <th className="px-5 py-3.5">Trend</th>
                <th className="px-5 py-3.5">Prepared</th>
                <th className="px-5 py-3.5 text-red-400">Waste</th>
                <th className="px-5 py-3.5">Risk</th>
                <th className="px-5 py-3.5 text-right">AI Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
              {foodMatrixData.map((item, idx) => (
                <tr 
                  key={idx}
                  onClick={() => setSelectedFoodModal(item)}
                  className="hover:bg-emerald-50/60 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3.5 font-bold text-gray-900 flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                    <span className="group-hover:text-[#1b4332] transition-colors">{item.name}</span>
                  </td>
                  <td className="px-5 py-3.5 font-extrabold text-gray-900 font-mono">{item.demand}</td>
                  <td className={`px-5 py-3.5 font-extrabold ${item.growthIsUp ? 'text-emerald-700' : 'text-orange-600'}`}>{item.growth}</td>
                  <td className="px-5 py-3.5 font-bold text-gray-900 font-mono">{item.demand + 5}</td>
                  <td className="px-5 py-3.5 font-extrabold text-red-600 font-mono">{item.waste === 'Low' ? 2 : item.waste === 'High' ? 8 : 4}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-700">{item.waste}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase shadow-2xs ${
                      item.action === 'Increase' ? 'bg-amber-500 text-white' : item.action === 'Reduce' ? 'bg-red-500 text-white' : 'bg-[#1b4332] text-white'
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
          GRID: 12. AI DAILY BRIEFING & 13. PREDICTION ACCURACY & 14. ACTIVITY STREAM
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 12. AI DAILY BRIEFING */}
        <div className="bg-gradient-to-br from-[#081c15] via-[#112a12] to-[#1b4332] text-white rounded-3xl p-6 shadow-xl border border-emerald-800/40 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#d4af37] bg-[#d4af37]/20 px-3 py-1 rounded-full border border-[#d4af37]/40 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> TODAY'S AI BRIEFING
            </span>

            <div className="space-y-2 pt-1">
              {briefingData.map((bText, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-white/10 text-xs text-gray-200 font-medium leading-relaxed flex items-start gap-2 border border-white/10">
                  <span className="text-[#d4af37] font-bold">•</span>
                  <span>"{bText}"</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowFullBriefingModal(true)}
            className="w-full py-3 rounded-2xl bg-[#d4af37] hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer text-center"
          >
            VIEW FULL BRIEFING
          </button>
        </div>

        {/* 13. PREDICTION ACCURACY ("How Well Is AI Performing?") */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-700" /> How Well Is AI Performing?
              </h3>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Self-Learning
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center my-3">
              <div className="bg-[#f4f6f0] p-2.5 rounded-xl border border-gray-200">
                <span className="text-[9px] text-gray-500 font-bold uppercase block">Today</span>
                <p className="text-base font-extrabold text-emerald-700 font-heading">{accuracyMetricsData.today}</p>
              </div>
              <div className="bg-[#f4f6f0] p-2.5 rounded-xl border border-gray-200">
                <span className="text-[9px] text-gray-500 font-bold uppercase block">This Week</span>
                <p className="text-base font-extrabold text-[#1b4332] font-heading">{accuracyMetricsData.thisWeek}</p>
              </div>
              <div className="bg-[#f4f6f0] p-2.5 rounded-xl border border-gray-200">
                <span className="text-[9px] text-gray-500 font-bold uppercase block">This Month</span>
                <p className="text-base font-extrabold text-[#d4af37] font-heading">{accuracyMetricsData.thisMonth}</p>
              </div>
            </div>

            {/* Prediction vs Actual Small Line Chart */}
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyMetricsData.chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#081c15', borderRadius: '10px', color: '#fff', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#1b4332" strokeWidth={2} />
                  <Line type="monotone" dataKey="actual" name="Actual" stroke="#d4af37" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="text-[10px] text-gray-500 italic">
            Proves that the system continuously learns from actual restaurant POS sales performance.
          </p>
        </div>

        {/* 14. AI ACTIVITY STREAM */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" /> AI Activity Stream
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="space-y-2.5 text-xs">
            {activityStream.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#f4f6f0] border border-gray-200/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${item.color} shrink-0`} />
                  <span className="font-bold text-gray-800 text-[11px]">{item.text}</span>
                </div>
                <span className="text-[9px] text-gray-400 font-mono shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 11. RESTAURANT DIGITAL TWIN Section */}
      <DigitalTwinGraph />

      {/* 11. BUSINESS IMPACT ("SmartServe Impact") */}
      <div className="bg-gradient-to-r from-[#040d09] via-[#081c15] to-[#1b4332] text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-[#d4af37]/30 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider bg-[#d4af37]/20 px-3 py-1 rounded-full border border-[#d4af37]/30">
              Commercial Impact & ROI
            </span>
            <h3 className="text-2xl font-bold font-heading text-white mt-2">
              SmartServe AI Impact
            </h3>
          </div>
          <span className="text-xs text-gray-400 font-medium">Estimated impact based on available restaurant data</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {businessImpactData.map((metric, idx) => (
            <div key={idx} className="bg-white/5 p-5 rounded-2xl border border-white/10 text-center hover:bg-white/10 transition-colors">
              <span className="text-xs font-semibold text-gray-300 uppercase">{metric.label}</span>
              <p className="text-3xl font-extrabold font-heading text-[#d4af37] mt-1">{metric.value}</p>
              <span className="text-[10px] text-emerald-400 font-medium mt-1 block">{metric.subtext}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------
          MODALS & SLIDE-OVERS
      -------------------------------------------------- */}

      {/* Risk Detail Modal */}
      {selectedRiskModal && (
        <Modal
          isOpen={!!selectedRiskModal}
          onClose={() => setSelectedRiskModal(null)}
          title={`Risk Analysis: ${selectedRiskModal.name}`}
        >
          <div className="space-y-4 text-xs">
            <div className="bg-[#081c15] text-white p-4 rounded-2xl border border-[#1b4332] space-y-1">
              <span className="text-[10px] text-[#d4af37] uppercase font-bold">Live Risk Telemetry</span>
              <h4 className="text-xl font-bold font-heading text-white">{selectedRiskModal.name} ({selectedRiskModal.level})</h4>
              <p className="text-gray-300 leading-relaxed mt-1 font-medium">{selectedRiskModal.detail}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRiskModal(null)}
                className="px-5 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold cursor-pointer"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Food Performance Matrix Detail Modal */}
      {selectedFoodModal && (
        <Modal
          isOpen={!!selectedFoodModal}
          onClose={() => setSelectedFoodModal(null)}
          title={`Food Item Analysis: ${selectedFoodModal.name}`}
        >
          <div className="space-y-4 text-xs">
            <div className="bg-[#081c15] text-white p-4 rounded-2xl border border-[#1b4332] space-y-1">
              <span className="text-[10px] text-[#d4af37] uppercase font-bold">Category: {selectedFoodModal.category}</span>
              <h4 className="text-lg font-bold font-heading">{selectedFoodModal.name}</h4>
              <p className="text-gray-300 leading-relaxed mt-1 font-medium">{selectedFoodModal.aiExplanation}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#f4f6f0] p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Demand</span>
                <p className="text-sm font-extrabold text-[#1b4332] font-mono mt-0.5">{selectedFoodModal.demand} portions</p>
              </div>

              <div className="bg-[#f4f6f0] p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Price / Cost</span>
                <p className="text-sm font-extrabold text-gray-900 font-mono mt-0.5">₹{selectedFoodModal.price} / ₹{selectedFoodModal.cost}</p>
              </div>

              <div className="bg-[#f4f6f0] p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Action</span>
                <p className="text-sm font-extrabold text-amber-800 mt-0.5">{selectedFoodModal.action}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedFoodModal(null)}
                className="px-5 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold cursor-pointer"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Full Reasoning Modal */}
      {showFullReasoningModal && (
        <Modal
          isOpen={showFullReasoningModal}
          onClose={() => setShowFullReasoningModal(false)}
          title="Full Demand Reasoning Model"
        >
          <div className="space-y-4 text-xs">
            <p className="text-gray-600 font-medium">
              Demand forecast generated using ensemble LightGBM time-series neural layers combining POS sales velocity, weather radar, and day-of-week seasonality.
            </p>

            <div className="space-y-2 pt-1">
              {factorsData.map((f, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#f4f6f0] border border-gray-200 flex justify-between font-bold text-gray-900">
                  <span>{f.factor}</span>
                  <span className="text-[#1b4332]">+{f.percentage}% Impact Weight</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowFullReasoningModal(false)}
                className="px-5 py-2 rounded-xl bg-[#1b4332] text-white font-bold text-xs"
              >
                Close Reasoning
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Full Briefing Modal */}
      {showFullBriefingModal && (
        <Modal
          isOpen={showFullBriefingModal}
          onClose={() => setShowFullBriefingModal(false)}
          title="Executive AI Daily Briefing"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-[#081c15] text-white p-4 rounded-2xl border border-[#1b4332] space-y-1">
              <span className="text-[10px] text-[#d4af37] uppercase font-bold">Executive Summary</span>
              <h4 className="text-lg font-bold font-heading">Today's Restaurant Briefing</h4>
            </div>

            <div className="space-y-2">
              {briefingData.map((bText, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#f4f6f0] border border-gray-200 text-gray-800 font-medium leading-relaxed flex items-start gap-2">
                  <span className="text-[#1b4332] font-bold">•</span>
                  <span>"{bText}"</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowFullBriefingModal(false)}
                className="px-5 py-2 rounded-xl bg-[#1b4332] text-white font-bold text-xs"
              >
                Close Briefing
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Copilot Assistant Modal */}
      {showCopilotModal && (
        <Modal
          isOpen={showCopilotModal}
          onClose={() => setShowCopilotModal(false)}
          title="Ask SmartServe AI Copilot"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-[#081c15] text-white p-4 rounded-2xl border border-[#1b4332] space-y-1">
              <span className="text-[10px] text-[#d4af37] uppercase font-bold">User Query</span>
              <p className="text-sm font-bold text-white font-heading">"{copilotQuery}"</p>
            </div>

            {isCopilotThinking ? (
              <div className="p-6 rounded-2xl bg-[#f4f6f0] border border-gray-200 text-center space-y-2">
                <Sparkles className="w-6 h-6 text-[#d4af37] animate-spin mx-auto" />
                <p className="text-xs text-gray-600 font-semibold">SmartServe AI analyzing restaurant telemetry...</p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#f4f6f0] border border-gray-200 text-gray-800 font-medium leading-relaxed">
                {copilotAnswer}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowCopilotModal(false)}
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
