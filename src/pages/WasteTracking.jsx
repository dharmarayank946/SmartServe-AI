import React, { useState } from 'react';
import { 
  Trash2, 
  Leaf, 
  AlertOctagon, 
  Plus, 
  PieChart as PieIcon, 
  CheckCircle2, 
  TrendingDown,
  DollarSign,
  Sparkles,
  ArrowRight,
  Search,
  Download,
  Filter,
  AlertTriangle,
  HelpCircle,
  BarChart2,
  Calendar,
  Layers,
  ChevronRight,
  RefreshCw,
  Clock,
  Flame,
  ShieldAlert,
  Bot,
  Send,
  Zap,
  Check,
  TrendingUp,
  Activity,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import AnimatedCounter from '../components/AnimatedCounter';
import Modal from '../components/Modal';
import { apiService } from '../services/apiService';

export default function WasteTracking({ onNavigate }) {
  // Service Data
  const wasteData = apiService.getWasteData();
  const foodItems = apiService.getFoodItems();
  const sustainabilityScore = apiService.getSustainabilityScore();
  const heatmapData = apiService.getWasteHeatmap();
  const tomorrowRisk = apiService.getTomorrowWasteRisk();
  const predictionVsWaste = apiService.getPredictionVsWasteData();

  // State Management
  const [trendPeriod, setTrendPeriod] = useState('30 Days'); // '7 Days', '30 Days', '90 Days'
  const [chartMode, setChartMode] = useState('portions'); // 'portions' or 'cost'
  const [heatmapTab, setHeatmapTab] = useState('Day'); // 'Day', 'Time', 'Food Item'

  // Modals & Search
  const [search, setSearch] = useState('');
  const [reasonFilter, setReasonFilter] = useState('All');
  const [selectedFoodModal, setSelectedFoodModal] = useState(null);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Toast & Notifications State
  const [successToast, setSuccessToast] = useState('');
  const [appliedRec, setAppliedRec] = useState(false);

  // AI Assistant Chat State
  const [chatQuery, setChatQuery] = useState('');
  const [chatAnswer, setChatAnswer] = useState(null);
  const [isChatThinking, setIsChatThinking] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  // Record Waste Form
  const [formData, setFormData] = useState({
    itemName: foodItems[0]?.name || 'Paneer Curry',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    qty: '8',
    unit: 'portions',
    reason: 'Over-preparation',
    estimatedCost: '240',
    notes: 'Kitchen prepared excess batch during lunch rush.'
  });

  const handleRecordWasteSubmit = (e) => {
    e.preventDefault();
    apiService.recordWasteEntry({
      itemName: formData.itemName,
      qty: Number(formData.qty),
      unit: formData.unit,
      financialLoss: Number(formData.estimatedCost),
      reason: formData.reason,
      date: formData.date
    });
    setIsRecordModalOpen(false);
    setSuccessToast(`✓ Waste record of ${formData.qty} ${formData.unit} for ${formData.itemName} submitted successfully!`);
    setTimeout(() => setSuccessToast(''), 4500);
  };

  const handleApplyRecommendation = (recText = "Reduce Paneer Curry preparation by 8 portions") => {
    setAppliedRec(true);
    setSuccessToast(`✓ Smart Recommendation Applied: ${recText}`);
    setTimeout(() => {
      setAppliedRec(false);
      setSuccessToast('');
    }, 4500);
  };

  const handleAskQuestion = (q) => {
    setChatQuery(q);
    setIsChatThinking(true);
    setShowChatModal(true);

    setTimeout(() => {
      let answer = "";
      const text = q.toLowerCase();

      if (text.includes('paneer curry')) {
        answer = "Paneer Curry accounted for 18 portions (₹540 loss) yesterday due to weekday over-preparation during the 12:30 - 2:30 PM lunch batch. SmartServe AI recommends reducing tomorrow's prep batch by 8 portions.";
      } else if (text.includes('prepare less tomorrow')) {
        answer = "Tomorrow's preparation reduction priorities: (1) Paneer Curry -> Reduce by 8 portions (High Waste Risk), (2) Cold Coffee -> Reduce prep base by 5 glasses (Rain forecast impact).";
      } else if (text.includes('how much money') || text.includes('lost to waste')) {
        answer = "In the recent period, food waste cost loss total is ₹7,420. By optimizing preparation safety buffers to 6%, SmartServe can recover ~₹2,150 this week and ₹18,600 monthly.";
      } else if (text.includes('reduce waste this week')) {
        answer = "Top 3 actions to reduce waste this week: (1) Shift Paneer Curry prep to 2-stage batches, (2) Adjust Cold Coffee syrup base according to evening rain forecasts, (3) Use dynamic 10-bowl salad prep.";
      } else if (text.includes('highest waste risk')) {
        answer = "Paneer Curry currently has the highest waste risk score (78/100 HIGH), followed by Cold Coffee (52/100 MEDIUM) and Masala Dosa (45/100 MEDIUM).";
      } else {
        answer = `AI Telemetry Analysis for: "${q}" -> Total weekly waste is 286 portions (↓18% vs last week). Sustainability score is 78/100. Target potential savings: ₹2,150.`;
      }

      setChatAnswer(answer);
      setIsChatThinking(false);
    }, 600);
  };

  // Top 5 Highest Waste Foods
  const topWasteFoods = [
    { name: "Paneer Curry", qty: 18, cost: 540, risk: "HIGH", color: "bg-[#1b4332]", progress: 85, aiNote: "Over-prepared weekday lunch batch by 18 portions." },
    { name: "Veg Biryani", qty: 12, cost: 420, risk: "MEDIUM", color: "bg-[#2d6a4f]", progress: 60, aiNote: "Night dinner shift overflow buffer." },
    { name: "Cold Coffee", qty: 10, cost: 350, risk: "MEDIUM", color: "bg-[#d4af37]", progress: 50, aiNote: "Rainy afternoon reduced cold beverage demand." },
    { name: "Fresh Garden Salad", qty: 8, cost: 240, risk: "HIGH", color: "bg-orange-500", progress: 40, aiNote: "High perishability on Monday salad batching." },
    { name: "Garlic Naan", qty: 6, cost: 180, risk: "LOW", color: "bg-[#10b981]", progress: 25, aiNote: "Unclaimed dinner side orders." }
  ];

  // AI Root Cause Analysis Factors
  const rootCauses = [
    { cause: "Over-preparation", percentage: 46, color: "#ef4444", barWidth: "92%" },
    { cause: "Demand Prediction Error", percentage: 27, color: "#f97316", barWidth: "54%" },
    { cause: "Low Customer Demand", percentage: 16, color: "#eab308", barWidth: "32%" },
    { cause: "Kitchen Variance", percentage: 11, color: "#3b82f6", barWidth: "22%" }
  ];

  // Trend Data per filter
  const trendDataMap = {
    '7 Days': [
      { day: "Mon", waste: 28, target: 15, cost: 2240 },
      { day: "Tue", waste: 22, target: 15, cost: 1760 },
      { day: "Wed", waste: 19, target: 15, cost: 1520 },
      { day: "Thu", waste: 15, target: 15, cost: 1200 },
      { day: "Fri", waste: 18, target: 15, cost: 1440 },
      { day: "Sat", waste: 24, target: 15, cost: 1920 },
      { day: "Sun", waste: 20, target: 15, cost: 1600 }
    ],
    '30 Days': [
      { day: "Week 1", waste: 140, target: 90, cost: 11200 },
      { day: "Week 2", waste: 118, target: 90, cost: 9440 },
      { day: "Week 3", waste: 95, target: 90, cost: 7600 },
      { day: "Week 4", waste: 82, target: 90, cost: 6560 }
    ],
    '90 Days': [
      { day: "Month 1", waste: 520, target: 360, cost: 41600 },
      { day: "Month 2", waste: 410, target: 360, cost: 32800 },
      { day: "Month 3", waste: 286, target: 360, cost: 22880 }
    ]
  };

  const activeTrendData = trendDataMap[trendPeriod] || trendDataMap['30 Days'];

  return (
    <div className="space-y-8 pb-16 font-sans text-gray-800">
      
      {/* --------------------------------------------------
          1. HERO SECTION
      -------------------------------------------------- */}
      <div className="bg-gradient-to-r from-[#040d09] via-[#081c15] to-[#1b4332] rounded-3xl p-6 md:p-8 text-white shadow-2xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/15 px-3 py-1 rounded-full border border-[#d4af37]/30 flex items-center gap-1.5 shadow-xs">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" /> SUSTAINABILITY COMMAND CENTER
              </span>

              <span className="text-xs text-emerald-300 font-semibold bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <span className="font-extrabold tracking-wide">● AI ANALYSIS ACTIVE</span>
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
              Waste Intelligence
            </h1>
            <p className="text-gray-300 text-xs md:text-sm mt-1.5 font-medium max-w-xl">
              "AI-powered insights to reduce unnecessary preparation and save money."
            </p>
          </div>

          {/* Hero Sustainability Highlight Card */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/15 text-center lg:text-right shrink-0 space-y-1 shadow-inner">
            <span className="text-xs text-gray-300 font-bold uppercase tracking-wider block">Potential Waste Reduction</span>
            <p className="text-4xl md:text-5xl font-extrabold font-heading text-[#d4af37] tracking-tight">
              23%
            </p>
            <p className="text-[11px] text-gray-300 max-w-xs">
              "Based on recent preparation, sales and waste patterns."
            </p>
            <button
              onClick={() => setIsRecordModalOpen(true)}
              className="mt-2 px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Record Waste Entry
            </button>
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
          2. WASTE OVERVIEW (4 Premium Metric Cards)
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Waste */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 duration-300 space-y-1.5 group">
          <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600 mb-1">
            <Trash2 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Today's Waste</span>
          <p className="text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
            <AnimatedCounter value={49} suffix=" portions" />
          </p>
          <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> ↓ 12% vs yesterday
          </span>
        </div>

        {/* Weekly Waste */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 duration-300 space-y-1.5 group">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-800 mb-1">
            <BarChart2 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Weekly Waste</span>
          <p className="text-3xl font-extrabold font-heading text-amber-800 tracking-tight">
            <AnimatedCounter value={286} suffix=" portions" />
          </p>
          <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> ↓ 18% from last week
          </span>
        </div>

        {/* Waste Cost */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 duration-300 space-y-1.5 group">
          <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600 mb-1">
            <DollarSign className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Waste Cost</span>
          <p className="text-3xl font-extrabold font-heading text-red-600 tracking-tight">
            <AnimatedCounter value={7420} prefix="₹" />
          </p>
          <span className="text-[10px] text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded-full inline-block">
            Direct ingredient cost
          </span>
        </div>

        {/* Potential Savings */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 duration-300 space-y-1.5 group">
          <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37] mb-1">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Potential Savings</span>
          <p className="text-3xl font-extrabold font-heading text-[#d4af37] tracking-tight">
            <AnimatedCounter value={2150} prefix="₹" />
          </p>
          <span className="text-[10px] text-amber-900 font-extrabold bg-[#d4af37]/15 px-2 py-0.5 rounded-full inline-block">
            Recoverable this week
          </span>
        </div>
      </div>

      {/* --------------------------------------------------
          GRID: 12. SUSTAINABILITY SCORE & 3. WASTE TREND ANALYSIS
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 12. SUSTAINABILITY SCORE (Large Circular Score Gauge) */}
        <div className="bg-gradient-to-br from-[#040d09] via-[#081c15] to-[#1b4332] text-white rounded-3xl p-6 shadow-xl border border-emerald-800/40 flex flex-col justify-between items-center text-center space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <span className="text-xs font-extrabold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/20 px-3 py-1 rounded-full border border-[#d4af37]/40">
            Sustainability Score
          </span>

          {/* Large Circular Gauge SVG */}
          <div className="relative w-40 h-40 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="68" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="transparent" />
              <circle 
                cx="80" 
                cy="80" 
                r="68" 
                stroke="#d4af37" 
                strokeWidth="12" 
                strokeDasharray={427.25}
                strokeDashoffset={427.25 * (1 - 78 / 100)}
                strokeLinecap="round"
                fill="transparent" 
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold font-heading text-white">78<span className="text-lg text-gray-400">/100</span></span>
              <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">GOOD</span>
            </div>
          </div>

          <p className="text-xs text-gray-300 font-medium italic">
            "Good — your restaurant is moving toward smarter preparation."
          </p>

          <div className="grid grid-cols-3 gap-2 w-full pt-3 border-t border-white/10 text-center">
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="text-[9px] text-gray-400 uppercase font-semibold block">Waste Reduction</span>
              <p className="text-base font-extrabold text-emerald-400 font-heading">82</p>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="text-[9px] text-gray-400 uppercase font-semibold block">Prep Accuracy</span>
              <p className="text-base font-extrabold text-[#d4af37] font-heading">76</p>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="text-[9px] text-gray-400 uppercase font-semibold block">Efficiency</span>
              <p className="text-base font-extrabold text-white font-heading">75</p>
            </div>
          </div>
        </div>

        {/* 3. WASTE TREND ANALYSIS (Interactive Chart) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#1b4332]" /> Waste Trend Analysis
              </h3>
              <p className="text-xs text-gray-500 font-medium">Actual Food Waste vs Target Threshold</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Period Filters */}
              <div className="flex items-center gap-1 bg-[#f4f6f0] p-1 rounded-xl border border-gray-200">
                {['7 Days', '30 Days', '90 Days'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setTrendPeriod(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      trendPeriod === p ? 'bg-[#1b4332] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Mode Toggle: Portions vs Cost */}
              <div className="flex items-center gap-1 bg-[#f4f6f0] p-1 rounded-xl border border-gray-200">
                <button
                  onClick={() => setChartMode('portions')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    chartMode === 'portions' ? 'bg-[#d4af37] text-slate-950' : 'text-gray-600'
                  }`}
                >
                  Portions
                </button>
                <button
                  onClick={() => setChartMode('cost')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    chartMode === 'cost' ? 'bg-[#d4af37] text-slate-950' : 'text-gray-600'
                  }`}
                >
                  Cost (₹)
                </button>
              </div>
            </div>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActualWaste" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#081c15', borderRadius: '12px', color: '#fff', fontSize: '12px', borderColor: '#1b4332' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area 
                  type="monotone" 
                  dataKey={chartMode === 'portions' ? 'waste' : 'cost'} 
                  name={chartMode === 'portions' ? 'Actual Food Waste (Portions)' : 'Actual Waste Cost (₹)'} 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  fill="url(#colorActualWaste)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  name="Target Maximum Threshold" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  strokeDasharray="4 4" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* --------------------------------------------------
          GRID: 4. TOP WASTE ITEMS & 5. AI ROOT-CAUSE ANALYSIS
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 4. TOP WASTE ITEMS ("Highest Waste Foods") */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold font-heading text-gray-900">Highest Waste Foods</h3>
              <p className="text-xs text-gray-500">Top 5 items driving over-prep losses</p>
            </div>
            <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
              Audit Alert
            </span>
          </div>

          <div className="space-y-4">
            {topWasteFoods.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedFoodModal(item)}
                className="space-y-1.5 text-xs p-2.5 rounded-2xl hover:bg-[#f4f6f0] transition-colors cursor-pointer group"
              >
                <div className="flex justify-between font-bold text-gray-900">
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-400">{idx + 1}.</span>
                    <span className="group-hover:text-[#1b4332] transition-colors">{item.name}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-red-600 font-mono">{item.qty} portions</span>
                    <span className="font-extrabold text-gray-900 font-mono">₹{item.cost}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      item.risk === 'HIGH' ? 'bg-red-100 text-red-900' : item.risk === 'MEDIUM' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {item.risk}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden p-0.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${item.color}`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. AI ROOT-CAUSE ANALYSIS ("Why Is Food Being Wasted?") */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#1b4332]" /> Why Is Food Being Wasted?
                </h3>
                <p className="text-xs text-gray-500 font-medium">AI root-cause classification breakdown</p>
              </div>
              <span className="text-xs font-extrabold text-[#d4af37] bg-[#d4af37]/15 px-2.5 py-1 rounded-full border border-[#d4af37]/30">
                AI Diagnostic
              </span>
            </div>

            <div className="space-y-4 pt-4">
              {rootCauses.map((item, idx) => (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-gray-800">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.cause}</span>
                    </span>
                    <span className="font-mono font-extrabold text-[#1b4332]">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden p-0.5 shadow-inner">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ width: item.barWidth, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 font-semibold space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-800 block">AI INSIGHT</span>
            <p className="text-gray-900 font-bold">
              "Paneer Curry preparation has consistently exceeded actual demand during weekdays."
            </p>
          </div>
        </div>

      </div>

      {/* --------------------------------------------------
          GRID: 6. SMART RECOMMENDATION & 7. PREDICTION VS WASTE
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 6. SMART WASTE RECOMMENDATION */}
        <div className="bg-gradient-to-br from-[#081c15] via-[#112a12] to-[#1b4332] text-white rounded-3xl p-6 shadow-xl border border-[#d4af37]/30 space-y-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#d4af37] bg-[#d4af37]/20 px-3 py-1 rounded-full border border-[#d4af37]/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> SMART RECOMMENDATION
              </span>
              <span className="text-[10px] text-emerald-300 font-mono bg-emerald-500/20 px-2.5 py-1 rounded-full">
                High Impact
              </span>
            </div>

            <div>
              <p className="text-xs text-gray-300 font-semibold uppercase">Action Strategy</p>
              <h3 className="text-2xl font-extrabold font-heading text-white mt-1">
                Reduce tomorrow's Paneer Curry preparation by: <span className="text-[#d4af37]">8 portions</span>
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center pt-1">
              <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] text-gray-300 uppercase font-semibold">Expected Waste</span>
                <p className="text-xl font-extrabold text-emerald-400 font-heading mt-0.5">↓ 18%</p>
              </div>

              <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] text-gray-300 uppercase font-semibold">Cost Saving</span>
                <p className="text-xl font-extrabold text-[#d4af37] font-heading mt-0.5">↓ ₹240</p>
              </div>

              <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] text-gray-300 uppercase font-semibold">Shortage Risk</span>
                <p className="text-xl font-extrabold text-emerald-400 font-heading mt-0.5">Very Low</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center gap-3 relative z-10">
            <button
              onClick={() => handleApplyRecommendation("Reduce Paneer Curry preparation by 8 portions")}
              className="flex-1 py-3.5 rounded-2xl bg-[#d4af37] hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer text-center uppercase tracking-wider"
            >
              Apply Recommendation
            </button>
            <button
              onClick={() => setShowPredictionModal(true)}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer text-center"
            >
              View Prediction
            </button>
          </div>
        </div>

        {/* 7. PREDICTION VS WASTE Comparison */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold font-heading text-gray-900">Prediction vs Waste Correlation</h3>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Kitchen Precision
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f4f6f0] p-3 rounded-2xl border border-gray-200 text-center my-3">
              <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-bold uppercase">Predicted</span>
                <p className="text-lg font-extrabold text-[#1b4332] font-heading">85</p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-bold uppercase">Actual Sales</span>
                <p className="text-lg font-extrabold text-gray-900 font-heading">82</p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-bold uppercase">Prepared</span>
                <p className="text-lg font-extrabold text-amber-700 font-heading">90</p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-bold uppercase">Wasted</span>
                <p className="text-lg font-extrabold text-red-600 font-heading">8</p>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={predictionVsWaste} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#081c15', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="prepared" name="Prepared" fill="#1b4332" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" name="Actual Sales" fill="#d4af37" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="wasted" name="Wasted" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#f4f6f0] border border-gray-200 text-xs text-gray-700 font-medium">
            💡 <strong>AI Insight:</strong> "Better demand prediction helps restaurants prepare closer to actual demand."
          </div>
        </div>

      </div>

      {/* --------------------------------------------------
          8. WASTE HEATMAP (Day, Time, Food Item)
      -------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-lg font-bold font-heading text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#1b4332]" /> Waste Heatmap Matrix
            </h3>
            <p className="text-xs text-gray-500 font-medium">Identify peak waste intensity windows across operation dimensions</p>
          </div>

          {/* Switcher Tabs */}
          <div className="flex items-center gap-1 bg-[#f4f6f0] p-1.5 rounded-2xl border border-gray-200">
            {['Day', 'Time', 'Food Item'].map((tab) => (
              <button
                key={tab}
                onClick={() => setHeatmapTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  heatmapTab === tab
                    ? 'bg-[#1b4332] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab} View
              </button>
            ))}
          </div>
        </div>

        {/* Heatmap Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {heatmapTab === 'Day' && heatmapData.byDay.map((item, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border text-center space-y-1 ${item.intensity}`}>
              <span className="text-xs font-bold uppercase block">{item.name}</span>
              <p className="text-lg font-extrabold font-heading">{item.level}</p>
              <span className="text-[10px] opacity-80">{item.value} portions wasted</span>
            </div>
          ))}

          {heatmapTab === 'Time' && heatmapData.byTime.map((item, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border text-center space-y-1 col-span-1 sm:col-span-2 lg:col-span-1 ${item.intensity}`}>
              <span className="text-[11px] font-bold block">{item.name}</span>
              <p className="text-lg font-extrabold font-heading">{item.level}</p>
              <span className="text-[10px] opacity-80">{item.value} portions wasted</span>
            </div>
          ))}

          {heatmapTab === 'Food Item' && heatmapData.byItem.map((item, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border text-center space-y-1 col-span-1 sm:col-span-2 lg:col-span-1 ${item.intensity}`}>
              <span className="text-xs font-bold block">{item.name}</span>
              <p className="text-lg font-extrabold font-heading">{item.level}</p>
              <span className="text-[10px] opacity-80">{item.value} portions wasted</span>
            </div>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------
          GRID: 9. WASTE COST ANALYSIS & 11. AI WASTE PREDICTION
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 9. WASTE COST ANALYSIS ("Financial Impact of Waste") */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" /> Financial Impact of Waste
              </h3>
              <span className="text-xs font-extrabold text-[#d4af37] bg-[#d4af37]/15 px-2.5 py-1 rounded-full border border-[#d4af37]/30">
                ROI Forecast
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center my-4">
              <div className="bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-semibold uppercase block">Food Cost Lost</span>
                <p className="text-xl font-extrabold text-red-600 font-heading mt-1">₹7,420</p>
              </div>

              <div className="bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-semibold uppercase block">Potential Monthly Savings</span>
                <p className="text-xl font-extrabold text-[#1b4332] font-heading mt-1">₹18,600</p>
              </div>

              <div className="bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-semibold uppercase block">Potential Annual Savings</span>
                <p className="text-xl font-extrabold text-[#d4af37] font-heading mt-1">₹2,23,200</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-bold leading-relaxed">
            💰 "Reducing waste is not only sustainable — it directly improves profitability."
          </div>
        </div>

        {/* 11. AI WASTE PREDICTION ("Tomorrow's Waste Risk") */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" /> Tomorrow's Waste Risk
            </h3>
            <span className="text-xs font-mono text-gray-500">AI Predictive Audit</span>
          </div>

          <div className="space-y-3">
            {tomorrowRisk.map((item, idx) => (
              <div key={idx} className={`p-3.5 rounded-2xl border space-y-1 ${item.color}`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-gray-900 text-sm">{item.name}</span>
                  <span className="font-extrabold px-2.5 py-0.5 rounded-full text-[10px] uppercase bg-white/80">
                    Risk: {item.risk} ({item.score}%)
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-800">
                  Predicted Waste: <strong>{item.predictedWaste} portions</strong>
                </p>
                <p className="text-[11px] font-bold text-[#1b4332]">
                  Recommended Action: {item.action}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* --------------------------------------------------
          10. WASTE RECORDING FORM (Clean Form Panel)
      -------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#1b4332]" /> Record Food Waste Entry
            </h3>
            <p className="text-xs text-gray-500 font-medium">Log kitchen waste for real-time AI model learning and cost tracking</p>
          </div>
        </div>

        <form onSubmit={handleRecordWasteSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Food Item</label>
            <select
              value={formData.itemName}
              onChange={(e) => setFormData({...formData, itemName: e.target.value})}
              className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            >
              {foodItems.map(i => (
                <option key={i.id} value={i.name}>{i.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              required
              value={formData.qty}
              onChange={(e) => setFormData({...formData, qty: e.target.value})}
              className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Unit</label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({...formData, unit: e.target.value})}
              className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            >
              <option value="portions">portions</option>
              <option value="plates">plates</option>
              <option value="kg">kg</option>
              <option value="liters">liters</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Reason for Waste</label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            >
              <option value="Over-preparation">Over-preparation</option>
              <option value="Spoilage">Spoilage</option>
              <option value="Low Demand">Low Demand</option>
              <option value="Cooking Error">Cooking Error</option>
              <option value="Customer Return">Customer Return</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Estimated Cost Loss (₹)</label>
            <input
              type="number"
              value={formData.estimatedCost}
              onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})}
              className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            />
          </div>

          <div className="md:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Record Waste
            </button>
          </div>
        </form>
      </div>

      {/* --------------------------------------------------
          13. AI CHAT ("Ask SmartServe AI" Assistant Section)
      -------------------------------------------------- */}
      <div className="bg-gradient-to-r from-[#081c15] via-[#112a12] to-[#1b4332] text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-emerald-800/40 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/20 px-3 py-1 rounded-full border border-[#d4af37]/40 inline-flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-[#d4af37]" /> WASTE AI ASSISTANT
            </span>
            <h3 className="text-2xl font-extrabold font-heading text-white mt-2">
              "Ask SmartServe AI About Waste Intelligence"
            </h3>
            <p className="text-xs text-gray-300 mt-1">Select a question to analyze root causes, costs, and reduction actions</p>
          </div>
        </div>

        {/* Quick Question Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {[
            "Why did we waste so much Paneer Curry?",
            "Which food should we prepare less tomorrow?",
            "How much money did we lose to waste?",
            "How can we reduce waste this week?",
            "Which food has the highest waste risk?"
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
          MODALS
      -------------------------------------------------- */}

      {/* Food Detail Analysis Modal */}
      {selectedFoodModal && (
        <Modal
          isOpen={!!selectedFoodModal}
          onClose={() => setSelectedFoodModal(null)}
          title={`Waste Intelligence Audit: ${selectedFoodModal.name}`}
        >
          <div className="space-y-4 text-xs">
            <div className="bg-[#081c15] text-white p-4 rounded-2xl border border-[#1b4332] space-y-1">
              <span className="text-[10px] text-[#d4af37] uppercase font-bold">AI Diagnostics</span>
              <h4 className="text-lg font-bold font-heading">{selectedFoodModal.name}</h4>
              <p className="text-gray-300 leading-relaxed mt-1 font-medium">{selectedFoodModal.aiNote}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#f4f6f0] p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Wasted Quantity</span>
                <p className="text-sm font-extrabold text-red-600 font-mono mt-0.5">{selectedFoodModal.qty} portions</p>
              </div>

              <div className="bg-[#f4f6f0] p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Financial Loss</span>
                <p className="text-sm font-extrabold text-gray-900 font-mono mt-0.5">₹{selectedFoodModal.cost}</p>
              </div>

              <div className="bg-[#f4f6f0] p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Risk Rating</span>
                <p className="text-sm font-extrabold text-amber-800 mt-0.5">{selectedFoodModal.risk}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedFoodModal(null)}
                className="px-5 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Prediction Details Modal */}
      {showPredictionModal && (
        <Modal
          isOpen={showPredictionModal}
          onClose={() => setShowPredictionModal(false)}
          title="Tomorrow's Demand & Prep Prediction"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-[#081c15] text-white p-4 rounded-2xl border border-[#1b4332] space-y-1">
              <span className="text-[10px] text-[#d4af37] uppercase font-bold">Prediction Engine</span>
              <h4 className="text-lg font-bold font-heading">Paneer Curry Forecast</h4>
              <p className="text-gray-300 leading-relaxed mt-1 font-medium">
                Predicted Demand: 62 portions. Recommended Prep (with 6% buffer): 65 portions. Shifting prep down by 8 portions eliminates over-preparation waste.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowPredictionModal(false)}
                className="px-5 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold"
              >
                Close Prediction
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* AI Chat Answer Modal */}
      {showChatModal && (
        <Modal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          title="Ask SmartServe Waste AI"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-[#081c15] text-white p-4 rounded-2xl border border-[#1b4332] space-y-1">
              <span className="text-[10px] text-[#d4af37] uppercase font-bold">Question</span>
              <p className="text-sm font-bold text-white font-heading">"{chatQuery}"</p>
            </div>

            {isChatThinking ? (
              <div className="p-6 rounded-2xl bg-[#f4f6f0] border border-gray-200 text-center space-y-2">
                <Sparkles className="w-6 h-6 text-[#d4af37] animate-spin mx-auto" />
                <p className="text-xs text-gray-600 font-semibold">SmartServe AI analyzing waste log telemetry...</p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#f4f6f0] border border-gray-200 text-gray-800 font-medium leading-relaxed">
                {chatAnswer}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowChatModal(false)}
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
