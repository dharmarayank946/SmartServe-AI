import React, { useState } from 'react';
import { 
  PieChart as AnalyticsIcon, 
  TrendingUp, 
  Trash2, 
  DollarSign, 
  Sliders, 
  Zap,
  BarChart2,
  Calendar,
  Clock,
  CloudRain,
  Layers,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Bot,
  Send,
  Download,
  FileText,
  ShieldAlert,
  HelpCircle,
  Activity,
  CheckCircle2,
  RefreshCw,
  Award,
  ArrowRight,
  X,
  Flame,
  Check
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import AnimatedCounter from '../components/AnimatedCounter';
import Modal from '../components/Modal';
import { apiService } from '../services/apiService';

export default function Analytics() {
  // Service Data
  const salesData = apiService.getSalesTrends();
  const foodItems = apiService.getFoodItems();
  const hourlyData = apiService.getHourlyDemand();
  const weather = apiService.getWeatherForecast();
  const healthScore = apiService.getRestaurantIntelligenceScore();
  const foodMatrix = apiService.getFoodPerformanceMatrix();
  const comparisonData = apiService.getComparisonThisVsLastWeek();
  const reportData = apiService.generateAnalyticsReport();

  // State Management
  const [dateRange, setDateRange] = useState('7 Days'); // Today, 7 Days, 30 Days, 90 Days, Custom
  const [demandChartPeriod, setDemandChartPeriod] = useState('Daily'); // Daily, Weekly, Monthly
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('2 minutes ago');

  // Modals & Side Panels
  const [selectedFoodRow, setSelectedFoodRow] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // AI Ask Bar State
  const [askQuery, setAskQuery] = useState('');
  const [askAnswer, setAskAnswer] = useState(null);
  const [isAskThinking, setIsAskThinking] = useState(false);
  const [showAskModal, setShowAskModal] = useState(false);

  // Toast Feedback State
  const [successToast, setSuccessToast] = useState('');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated('Just now');
      setSuccessToast('✓ Telemetry & analytics model refreshed with latest POS data!');
      setTimeout(() => setSuccessToast(''), 4000);
    }, 900);
  };

  const handleAskQuestion = (q) => {
    setAskQuery(q);
    setIsAskThinking(true);
    setShowAskModal(true);

    setTimeout(() => {
      let answer = "";
      const text = q.toLowerCase();

      if (text.includes('prepare more tomorrow')) {
        answer = "Based on time-series forecasting, you should prepare more: Veg Biryani (+8 portions, 90 total) and Chicken Dum Biryani (+15 portions, 125 total).";
      } else if (text.includes('sales decrease') || text.includes('why did sales')) {
        answer = "Sales dip on Monday & Tuesday afternoons is normal mid-week seasonality (-14% volume). However, Friday & Saturday dinner surges compensate for 68% of total weekly revenue.";
      } else if (text.includes('costing me the most') || text.includes('waste')) {
        answer = "Paneer Curry accounts for the highest cost loss (₹540/week due to 18 over-prepared portions), followed by Cold Coffee (₹350/week during rainy afternoons).";
      } else if (text.includes('peak hours')) {
        answer = "Your primary peak demand window is 7:00 PM – 9:00 PM (Dinner surge, 190 portions/hr), with a secondary peak between 12:30 PM – 2:00 PM (Lunch rush, 140 portions/hr).";
      } else if (text.includes('how accurate') || text.includes('predictions')) {
        answer = "Your overall demand prediction model accuracy is 94.2% with an average error rate of only 5.8%. Veg Biryani lead precision is highest at 96.0%.";
      } else {
        answer = `SmartServe AI Intelligence Answer for: "${q}" -> Total revenue for ${dateRange} is ₹3,48,500 across 7,590 portions with 94.2% forecast accuracy.`;
      }

      setAskAnswer(answer);
      setIsAskThinking(false);
    }, 600);
  };

  // Demand Performance Multi-period Data
  const demandPerformanceDataMap = {
    Daily: [
      { period: "Mon", actual: 340, predicted: 350, prepared: 368 },
      { period: "Tue", actual: 380, predicted: 375, prepared: 402 },
      { period: "Wed", actual: 410, predicted: 405, prepared: 429 },
      { period: "Thu", actual: 440, predicted: 450, prepared: 455 },
      { period: "Fri", actual: 590, predicted: 580, prepared: 608 },
      { period: "Sat", actual: 680, predicted: 690, prepared: 704 },
      { period: "Sun", actual: 640, predicted: 630, prepared: 660 }
    ],
    Weekly: [
      { period: "Week 1", actual: 2450, predicted: 2480, prepared: 2560 },
      { period: "Week 2", actual: 2620, predicted: 2600, prepared: 2710 },
      { period: "Week 3", actual: 2850, predicted: 2830, prepared: 2940 },
      { period: "Week 4", actual: 2980, predicted: 3000, prepared: 3080 }
    ],
    Monthly: [
      { period: "Jul", actual: 10200, predicted: 10100, prepared: 10600 },
      { period: "Aug", actual: 11400, predicted: 11300, prepared: 11800 },
      { period: "Sep", actual: 12100, predicted: 12200, prepared: 12550 },
      { period: "Oct", actual: 12890, predicted: 12800, prepared: 13200 }
    ]
  };

  const activeDemandData = demandPerformanceDataMap[demandChartPeriod] || demandPerformanceDataMap.Daily;

  // Day-of-Week Pattern Data
  const dayOfWeekPatterns = [
    { day: "Mon", demand: 340, waste: 28, revenue: 48500 },
    { day: "Tue", demand: 380, waste: 22, revenue: 54200 },
    { day: "Wed", demand: 410, waste: 19, revenue: 58400 },
    { day: "Thu", demand: 440, waste: 15, revenue: 62800 },
    { day: "Fri", demand: 590, waste: 18, revenue: 84200 },
    { day: "Sat", demand: 680, waste: 24, revenue: 98600 },
    { day: "Sun", demand: 640, waste: 20, revenue: 91400 }
  ];

  // 5 AI Business Insights
  const businessInsights = [
    { id: "01", title: "Demand is increasing for Veg Biryani.", action: "Increase preparation by approximately 8 portions.", impact: "High Revenue", confidence: "96%" },
    { id: "02", title: "Paneer Curry waste is above normal baseline.", action: "Reduce preparation during weekdays.", impact: "Waste Reduction", confidence: "91%" },
    { id: "03", title: "Saturday evening has the highest demand.", action: "Increase preparation and kitchen capacity.", impact: "Peak Efficiency", confidence: "96%" },
    { id: "04", title: "Cold Beverage demand drops during rainy afternoons.", action: "Scale back prep base by 22%.", impact: "Cost Control", confidence: "89%" },
    { id: "05", title: "Morning rush spike expected for Masala Dosa.", action: "Pre-heat griddles 15 mins earlier.", impact: "Turnaround Time", confidence: "94%" }
  ];

  // Upcoming Risks (5 Risk Monitors)
  const upcomingRisks = [
    { name: "Demand Spike Risk", level: "HIGH", color: "bg-orange-100 text-orange-900 border-orange-300", what: "Breakfast rush for Masala Dosa (+18%)", when: "Tomorrow, 8:30 - 10:30 AM", why: "Corporate morning footfall pattern", action: "Pre-allocate Batch 1 dough prep" },
    { name: "Food Waste Risk", level: "MEDIUM", color: "bg-amber-100 text-amber-900 border-amber-300", what: "Over-prep of Paneer Curry", when: "Weekday Lunch (12:30 PM)", why: "Kitchen batch size exceeds actual orders", action: "Reduce batch size by 8 portions" },
    { name: "Shortage Risk", level: "LOW", color: "bg-emerald-100 text-emerald-900 border-emerald-300", what: "Veg Biryani dinner stockout", when: "Friday 8:00 PM+", why: "High footfall velocity", action: "Maintain 5-portion safety buffer" },
    { name: "Weather Impact Risk", level: "MEDIUM", color: "bg-blue-100 text-blue-900 border-blue-300", what: "Rainfall drops beverage demand by 22%", when: "Evening (5:30 PM)", why: "Local rain forecast (78% prob)", action: "Scale down milk base prep" },
    { name: "Kitchen Capacity Load", level: "MEDIUM", color: "bg-purple-100 text-purple-900 border-purple-300", what: "Kitchen peak load reaches 82%", when: "Saturday 7:30 PM", why: "Weekend dinner rush", action: "Add 1 line cook to assembly station" }
  ];

  return (
    <div className="space-y-8 pb-16 font-sans text-gray-800">
      
      {/* --------------------------------------------------
          1. INTELLIGENCE HEADER
      -------------------------------------------------- */}
      <div className="bg-gradient-to-r from-[#040d09] via-[#081c15] to-[#1b4332] rounded-3xl p-6 md:p-8 text-white shadow-2xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/15 px-3 py-1 rounded-full border border-[#d4af37]/30 flex items-center gap-1.5 shadow-xs">
                <AnalyticsIcon className="w-3.5 h-3.5 text-[#d4af37]" /> COMMERCIAL INTELLIGENCE PLATFORM
              </span>

              <span className="text-xs text-emerald-300 font-semibold bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <span className="font-extrabold tracking-wide">● AI ENGINE ACTIVE</span>
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
              Restaurant Intelligence
            </h1>
            <p className="text-gray-300 text-xs md:text-sm mt-1.5 font-medium max-w-xl">
              "Understand your restaurant. Predict demand. Make better decisions."
            </p>
          </div>

          {/* Top-Right Controls: Sync & Date Range Selector */}
          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="flex items-center gap-2 bg-black/40 p-2.5 px-3.5 rounded-2xl border border-white/10">
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase font-bold">Last Analysis</p>
                <p className="text-xs font-bold text-emerald-400 font-mono">Updated {lastUpdated}</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-all"
              >
                <RefreshCw className={`w-4 h-4 text-emerald-300 ${isRefreshing ? 'animate-spin text-[#d4af37]' : ''}`} />
              </button>
            </div>

            {/* Date-Range Selector Buttons */}
            <div className="flex items-center gap-1 bg-white/10 p-1.5 rounded-2xl border border-white/15">
              {['Today', '7 Days', '30 Days', '90 Days', 'Custom'].map((r) => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    dateRange === r
                      ? 'bg-[#d4af37] text-slate-950 shadow-md'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {r}
                </button>
              ))}
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
          2. EXECUTIVE OVERVIEW (5 Large Intelligent Metrics)
      -------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 duration-300 space-y-1.5 group">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 mb-1">
            <DollarSign className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Revenue</span>
          <p className="text-3xl font-extrabold font-heading text-gray-900 tracking-tight">
            <AnimatedCounter value={48650} prefix="₹" />
          </p>
          <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> ↑ 14.2% vs prev period
          </span>
        </div>

        {/* Food Demand */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 duration-300 space-y-1.5 group">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#1b4332] mb-1">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Food Demand</span>
          <p className="text-3xl font-extrabold font-heading text-[#1b4332] tracking-tight">
            <AnimatedCounter value={1086} suffix=" portions" />
          </p>
          <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> ↑ 9.4% demand volume
          </span>
        </div>

        {/* Preparation Accuracy */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 duration-300 space-y-1.5 group">
          <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37] mb-1">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Prep Accuracy</span>
          <p className="text-3xl font-extrabold font-heading text-[#d4af37] tracking-tight">
            <AnimatedCounter value={94.2} suffix="%" />
          </p>
          <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> ↑ 6.8% accuracy gain
          </span>
        </div>

        {/* Food Waste */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 duration-300 space-y-1.5 group">
          <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600 mb-1">
            <Trash2 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Food Waste</span>
          <p className="text-3xl font-extrabold font-heading text-red-600 tracking-tight">
            <AnimatedCounter value={49} suffix=" portions" />
          </p>
          <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <ArrowDownRight className="w-3 h-3" /> ↓ 18.0% waste reduction
          </span>
        </div>

        {/* Estimated Savings */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 duration-300 space-y-1.5 group col-span-2 sm:col-span-1">
          <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37] mb-1">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Estimated Savings</span>
          <p className="text-3xl font-extrabold font-heading text-amber-800 tracking-tight">
            <AnimatedCounter value={4850} prefix="₹" />
          </p>
          <span className="text-[10px] text-amber-900 font-extrabold bg-[#d4af37]/15 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> ↑ 24.5% recovered
          </span>
        </div>
      </div>

      {/* --------------------------------------------------
          GRID: 10. RESTAURANT HEALTH SCORE & 3. DEMAND INTELLIGENCE
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 10. RESTAURANT HEALTH SCORE (Large Circular Gauge) */}
        <div className="bg-gradient-to-br from-[#040d09] via-[#081c15] to-[#1b4332] text-white rounded-3xl p-6 shadow-xl border border-emerald-800/40 flex flex-col justify-between items-center text-center space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

          <span className="text-xs font-extrabold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/20 px-3 py-1 rounded-full border border-[#d4af37]/40">
            Restaurant Intelligence Score
          </span>

          {/* Large SVG Circular Gauge */}
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
                strokeDashoffset={427.25 * (1 - 86 / 100)}
                strokeLinecap="round"
                fill="transparent" 
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold font-heading text-white">86<span className="text-lg text-gray-400">/100</span></span>
              <span className="text-[10px] uppercase font-extrabold text-emerald-300 tracking-wider">EXCELLENT</span>
            </div>
          </div>

          <p className="text-xs text-gray-300 font-medium italic">
            "Restaurant operating with high predictive precision and minimal waste loss."
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full pt-3 border-t border-white/10 text-center">
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="text-[9px] text-gray-400 uppercase font-semibold block">Demand Accuracy</span>
              <p className="text-sm font-extrabold text-emerald-400 font-heading">94%</p>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="text-[9px] text-gray-400 uppercase font-semibold block">Waste Control</span>
              <p className="text-sm font-extrabold text-amber-300 font-heading">78%</p>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="text-[9px] text-gray-400 uppercase font-semibold block">Prep Efficiency</span>
              <p className="text-sm font-extrabold text-white font-heading">91%</p>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="text-[9px] text-gray-400 uppercase font-semibold block">Forecast Reliability</span>
              <p className="text-sm font-extrabold text-[#d4af37] font-heading">89%</p>
            </div>
          </div>
        </div>

        {/* 3. DEMAND INTELLIGENCE (Large Interactive Chart) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#1b4332]" /> Demand Performance Intelligence
              </h3>
              <p className="text-xs text-gray-500 font-medium">Actual Sales vs AI Predicted Demand vs Prepared Quantity</p>
            </div>

            {/* Period Switcher: Daily, Weekly, Monthly */}
            <div className="flex items-center gap-1 bg-[#f4f6f0] p-1 rounded-xl border border-gray-200">
              {['Daily', 'Weekly', 'Monthly'].map((p) => (
                <button
                  key={p}
                  onClick={() => setDemandChartPeriod(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    demandChartPeriod === p ? 'bg-[#1b4332] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeDemandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#081c15', borderRadius: '12px', color: '#fff', fontSize: '12px', borderColor: '#1b4332' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="actual" name="Actual POS Sales" stroke="#1b4332" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="predicted" name="AI Predicted Demand" stroke="#d4af37" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="prepared" name="Prepared Quantity" stroke="#10b981" strokeWidth={2} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-[#f4f6f0] p-3 rounded-2xl border border-gray-200 text-center text-xs font-bold">
            <div className="bg-white p-2.5 rounded-xl border border-gray-200">
              <span className="text-[10px] text-gray-500 font-semibold uppercase">Prediction Accuracy</span>
              <p className="text-base font-extrabold text-[#1b4332] font-heading mt-0.5">94.2%</p>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-gray-200">
              <span className="text-[10px] text-gray-500 font-semibold uppercase">Average Prediction Error</span>
              <p className="text-base font-extrabold text-amber-700 font-heading mt-0.5">5.8%</p>
            </div>
          </div>
        </div>

      </div>

      {/* --------------------------------------------------
          4. FOOD PERFORMANCE MATRIX (Table & Clickable Rows)
      -------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-lg font-bold font-heading text-gray-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#1b4332]" /> Food Performance Matrix
            </h3>
            <p className="text-xs text-gray-500 font-medium">Click any row to open detailed item intelligence & trend panel</p>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-[#f4f6f0] px-3 py-1 rounded-full border border-gray-200">
            6 Core Dishes Analyzed
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#081c15] text-gray-200 uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="px-5 py-3.5">Food Item</th>
                <th className="px-5 py-3.5">Demand</th>
                <th className="px-5 py-3.5">Growth</th>
                <th className="px-5 py-3.5">Prep Accuracy</th>
                <th className="px-5 py-3.5">Waste Risk</th>
                <th className="px-5 py-3.5">Profit Impact</th>
                <th className="px-5 py-3.5 text-right">AI Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
              {foodMatrix.map((item, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => setSelectedFoodRow(item)}
                  className="hover:bg-emerald-50/60 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3.5 font-bold text-gray-900 flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                    <span className="group-hover:text-[#1b4332] transition-colors">{item.name}</span>
                  </td>
                  <td className="px-5 py-3.5 font-extrabold text-gray-900 font-mono">{item.demand}</td>
                  <td className={`px-5 py-3.5 font-extrabold ${item.growthIsUp ? 'text-emerald-700' : 'text-orange-600'}`}>{item.growth}</td>
                  <td className="px-5 py-3.5 font-bold text-gray-900 font-mono">{item.accuracy}%</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-700">{item.waste}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-700">{item.profitImpact}</td>
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
          GRID: 5. PEAK HOURS & 6. DAY-OF-WEEK PATTERNS
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 5. PEAK HOURS INTELLIGENCE */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#1b4332]" /> Peak Demand Hours Heatmap
              </h3>
              <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Peak Shift: 7-9 PM
              </span>
            </div>

            {/* Hourly Heatmap Slots */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 my-4 text-center text-xs">
              {[
                { hour: "8 AM", level: "Low", value: "35 pts", bg: "bg-emerald-100 text-emerald-900 border-emerald-300" },
                { hour: "12 PM", level: "High", value: "140 pts", bg: "bg-orange-100 text-orange-900 border-orange-300" },
                { hour: "2 PM", level: "Medium", value: "110 pts", bg: "bg-amber-100 text-amber-900 border-amber-300" },
                { hour: "5 PM", level: "Low", value: "40 pts", bg: "bg-emerald-100 text-emerald-900 border-emerald-300" },
                { hour: "7 PM", level: "Peak", value: "190 pts", bg: "bg-red-100 text-red-900 border-red-300" },
                { hour: "9 PM", level: "High", value: "130 pts", bg: "bg-orange-100 text-orange-900 border-orange-300" }
              ].map((slot, idx) => (
                <div key={idx} className={`p-3 rounded-2xl border space-y-0.5 ${slot.bg}`}>
                  <span className="font-extrabold block text-xs">{slot.hour}</span>
                  <span className="font-bold block text-[10px]">{slot.level}</span>
                  <span className="text-[9px] font-mono opacity-80 block">{slot.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#081c15] text-white text-xs space-y-1.5 border border-[#1b4332]">
            <div className="flex justify-between items-center text-amber-300 font-extrabold text-[10px] uppercase tracking-wider">
              <span>Primary Peak Window</span>
              <span>7:00 PM – 9:00 PM</span>
            </div>
            <p className="text-gray-200 font-medium">Expected Customer Demand: <strong className="text-white">High Volume</strong></p>
            <p className="text-emerald-300 font-bold">
              AI Recommendation: "Increase kitchen preparation capacity by 15%."
            </p>
          </div>
        </div>

        {/* 6. DAY-OF-WEEK INTELLIGENCE */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#1b4332]" /> Demand Pattern by Day
              </h3>
              <span className="text-xs text-gray-500 font-mono">Weekly Volume</span>
            </div>

            <div className="h-52 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayOfWeekPatterns} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#081c15', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="demand" name="Customer Demand" fill="#1b4332" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="waste" name="Wasted Portions" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f4f6f0] border border-gray-200 text-xs text-gray-800 font-semibold">
            💡 <strong>AI Insight:</strong> "Friday and Saturday consistently show higher demand."
          </div>
        </div>

      </div>

      {/* --------------------------------------------------
          GRID: 7. WEATHER IMPACT & 8. PROFITABILITY INTELLIGENCE
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 7. WEATHER IMPACT ANALYTICS */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <CloudRain className="w-5 h-5 text-blue-600" /> Weather → Demand Relationship
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                <span className="text-[10px] font-bold text-blue-900 uppercase">Current Weather Sensor</span>
                <p className="text-lg font-extrabold text-blue-950 font-heading">28°C • 78% Humidity</p>
                <p className="text-blue-800 font-semibold text-[11px]">78% Rain Probability</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="text-[10px] font-bold text-emerald-900 uppercase">Overall Demand Impact</span>
                <p className="text-lg font-extrabold text-emerald-950 font-heading">+8.4% Footfall</p>
                <p className="text-emerald-800 font-semibold text-[11px]">Dine-in Shift</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-[#f4f6f0] border border-gray-200 flex items-center justify-between">
                <span className="font-bold text-gray-900">Rainfall ↑ → Hot Food Demand</span>
                <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded">↑ 14%</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#f4f6f0] border border-gray-200 flex items-center justify-between">
                <span className="font-bold text-gray-900">Rainfall ↑ → Cold Beverage Demand</span>
                <span className="font-extrabold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded">↓ 22%</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 italic">
            Sensors continuously synchronize micro-climate radar feeds with menu category models.
          </p>
        </div>

        {/* 8. PROFITABILITY INTELLIGENCE ("Business Impact") */}
        <div className="bg-gradient-to-br from-[#081c15] via-[#112a12] to-[#1b4332] text-white rounded-3xl p-6 shadow-xl border border-[#d4af37]/30 space-y-5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#d4af37] bg-[#d4af37]/20 px-3 py-1 rounded-full border border-[#d4af37]/40 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#d4af37]" /> Business Impact
              </span>
              <span className="text-[10px] text-emerald-300 font-mono bg-emerald-500/20 px-2.5 py-1 rounded-full">
                ROI Telemetry
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-gray-300 font-semibold uppercase">Potential Monthly Savings</span>
                <p className="text-2xl font-extrabold text-[#d4af37] font-heading mt-1">₹18,600</p>
              </div>

              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-gray-300 font-semibold uppercase">Potential Annual Savings</span>
                <p className="text-2xl font-extrabold text-white font-heading mt-1">₹2,23,200</p>
              </div>

              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-gray-300 font-semibold uppercase">Waste Cost Reduction</span>
                <p className="text-xl font-extrabold text-emerald-400 font-heading mt-1">23%</p>
              </div>

              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-gray-300 font-semibold uppercase">Preparation Efficiency</span>
                <p className="text-xl font-extrabold text-emerald-400 font-heading mt-1">31%</p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-amber-300 font-mono bg-amber-400/10 p-2.5 rounded-xl border border-amber-400/30 text-center relative z-10">
            * "AI-estimated impact based on available restaurant data."
          </p>
        </div>

      </div>

      {/* --------------------------------------------------
          9. AI BUSINESS INSIGHTS (5 Cards)
      -------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-lg font-bold font-heading text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d4af37]" /> AI Business Insights
            </h3>
            <p className="text-xs text-gray-500 font-medium">Automated operational recommendations generated from cross-variable ML models</p>
          </div>
          <span className="text-xs font-bold text-[#1b4332] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            5 Active Insights
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {businessInsights.map((ins) => (
            <div key={ins.id} className="p-4 rounded-2xl bg-[#f4f6f0] border border-gray-200 space-y-2 hover-card-rise flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-[#1b4332] text-white">
                    INSIGHT {ins.id}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Confidence: {ins.confidence}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 pt-1 leading-snug">{ins.title}</h4>
              </div>

              <div className="pt-2 border-t border-gray-200 space-y-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Recommended Action</span>
                <p className="text-xs font-bold text-[#1b4332]">{ins.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------
          GRID: 11. PREDICTIVE ALERTS & 12. COMPARE PERFORMANCE
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 11. PREDICTIVE ALERTS ("Upcoming Risks") */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" /> Upcoming Risks & Predictive Alerts
            </h3>
            <span className="text-xs font-mono text-gray-500">Risk Radar</span>
          </div>

          <div className="space-y-3">
            {upcomingRisks.map((risk, idx) => (
              <div key={idx} className={`p-3.5 rounded-2xl border space-y-1.5 ${risk.color}`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-gray-900 text-sm">{risk.name}</span>
                  <span className="font-extrabold px-2.5 py-0.5 rounded-full text-[10px] uppercase bg-white/80">
                    {risk.level}
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-800">{risk.what}</p>
                <div className="grid grid-cols-2 text-[10px] text-gray-600 pt-0.5 font-medium">
                  <span>When: <strong>{risk.when}</strong></span>
                  <span>Why: <strong>{risk.why}</strong></span>
                </div>
                <p className="text-[11px] font-extrabold text-[#1b4332] pt-0.5">
                  Action: {risk.action}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 12. COMPARE PERFORMANCE ("This Week vs Last Week") */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#1b4332]" /> Compare Performance: This Week vs Last Week
              </h3>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Period Comparison
              </span>
            </div>

            <div className="space-y-3 pt-3">
              {comparisonData.map((row, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#f4f6f0] border border-gray-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>{row.metric}</span>
                    <span className="text-emerald-700 font-extrabold">{row.change}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-600 font-mono">
                    <span>This Week: <strong>{row.thisWeek.toLocaleString()}</strong></span>
                    <span>Last Week: <strong>{row.lastWeek.toLocaleString()}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 13. EXPORT & REPORTING BUTTONS */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setSuccessToast("✓ Analytics data exported to JSON/CSV successfully.");
                setTimeout(() => setSuccessToast(''), 3500);
              }}
              className="flex-1 py-3 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export Analytics
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="px-5 py-3 rounded-xl bg-[#d4af37] hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" /> Generate Report
            </button>
          </div>
        </div>

      </div>

      {/* --------------------------------------------------
          14. AI ASK BAR (Command Interface at Bottom)
      -------------------------------------------------- */}
      <div className="bg-gradient-to-r from-[#081c15] via-[#112a12] to-[#1b4332] text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-emerald-800/40 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/20 px-3 py-1 rounded-full border border-[#d4af37]/40 inline-flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-[#d4af37]" /> AI COMMAND INTERFACE
            </span>
            <h3 className="text-2xl font-extrabold font-heading text-white mt-2">
              "Ask SmartServe AI anything about your restaurant..."
            </h3>
            <p className="text-xs text-gray-300 mt-1">Select a prompt below or type your custom query</p>
          </div>
        </div>

        {/* Example Prompt Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {[
            "Which food should I prepare more tomorrow?",
            "Why did sales decrease this week?",
            "Which item is costing me the most through waste?",
            "What are my peak hours?",
            "How accurate are my predictions?"
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

      {/* Food Performance Matrix Side Detail Modal */}
      {selectedFoodRow && (
        <Modal
          isOpen={!!selectedFoodRow}
          onClose={() => setSelectedFoodRow(null)}
          title={`Item Intelligence: ${selectedFoodRow.name}`}
        >
          <div className="space-y-4 text-xs">
            <div className="bg-[#081c15] text-white p-4 rounded-2xl border border-[#1b4332] space-y-1">
              <span className="text-[10px] text-[#d4af37] uppercase font-bold">Category: {selectedFoodRow.category}</span>
              <h4 className="text-lg font-bold font-heading">{selectedFoodRow.name}</h4>
              <p className="text-gray-300 leading-relaxed mt-1 font-medium">{selectedFoodRow.aiExplanation}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#f4f6f0] p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Demand Forecast</span>
                <p className="text-sm font-extrabold text-[#1b4332] font-mono mt-0.5">{selectedFoodRow.demand} portions</p>
              </div>

              <div className="bg-[#f4f6f0] p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Prediction Accuracy</span>
                <p className="text-sm font-extrabold text-[#d4af37] font-mono mt-0.5">{selectedFoodRow.accuracy}%</p>
              </div>

              <div className="bg-[#f4f6f0] p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Price / Cost</span>
                <p className="text-sm font-extrabold text-gray-900 font-mono mt-0.5">₹{selectedFoodRow.price} / ₹{selectedFoodRow.cost}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedFoodRow(null)}
                className="px-5 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold cursor-pointer"
              >
                Close Item Analysis
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Generate Report Preview Modal */}
      {showReportModal && (
        <Modal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          title="Executive Restaurant Intelligence Report"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-[#081c15] text-white p-5 rounded-2xl border border-[#1b4332] space-y-2">
              <div className="flex justify-between text-[10px] text-[#d4af37] uppercase font-bold">
                <span>{reportData.title}</span>
                <span>{reportData.generatedAt}</span>
              </div>
              <h4 className="text-lg font-bold font-heading">{reportData.restaurant} ({reportData.branch})</h4>
              <p className="text-xs text-emerald-300">Period: {reportData.period}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center bg-[#f4f6f0] p-3 rounded-xl border border-gray-200">
              <div>
                <span className="text-[9px] text-gray-500 uppercase">Total Revenue</span>
                <p className="text-sm font-extrabold text-gray-900">{reportData.executiveSummary.totalRevenue}</p>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 uppercase">Accuracy</span>
                <p className="text-sm font-extrabold text-emerald-700">{reportData.executiveSummary.predictionAccuracy}</p>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 uppercase">Total Savings</span>
                <p className="text-sm font-extrabold text-[#d4af37]">{reportData.executiveSummary.totalSavings}</p>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="font-bold text-gray-900">Key AI Recommendations:</span>
              <ul className="list-disc list-inside space-y-1 text-gray-700 font-medium">
                {reportData.topRecommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", "smartserve_executive_report.json");
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="px-4 py-2 rounded-xl bg-[#d4af37] text-slate-950 font-bold text-xs"
              >
                Download Full Report (JSON/CSV)
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 rounded-xl bg-[#1b4332] text-white font-bold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Ask AI Answer Modal */}
      {showAskModal && (
        <Modal
          isOpen={showAskModal}
          onClose={() => setShowAskModal(false)}
          title="SmartServe AI Command Copilot"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-[#081c15] text-white p-4 rounded-2xl border border-[#1b4332] space-y-1">
              <span className="text-[10px] text-[#d4af37] uppercase font-bold">Query</span>
              <p className="text-sm font-bold text-white font-heading">"{askQuery}"</p>
            </div>

            {isAskThinking ? (
              <div className="p-6 rounded-2xl bg-[#f4f6f0] border border-gray-200 text-center space-y-2">
                <Sparkles className="w-6 h-6 text-[#d4af37] animate-spin mx-auto" />
                <p className="text-xs text-gray-600 font-semibold">Analyzing POS sales velocity & demand time-series...</p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#f4f6f0] border border-gray-200 text-gray-800 font-medium leading-relaxed">
                {askAnswer}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowAskModal(false)}
                className="px-5 py-2 rounded-xl bg-[#1b4332] text-white font-bold text-xs"
              >
                Close Copilot
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
