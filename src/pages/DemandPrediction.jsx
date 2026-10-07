import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  BarChart2, 
  Zap,
  Layers,
  ChefHat,
  Trash2,
  Save,
  Download,
  PieChart,
  RefreshCw,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
  CloudRain,
  Sun,
  Flame,
  Clock,
  Sliders,
  ShieldAlert,
  Play,
  RotateCcw,
  Check,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import AnimatedCounter from '../components/AnimatedCounter';
import Modal from '../components/Modal';
import { apiService } from '../services/apiService';

export default function DemandPrediction({ onNavigate }) {
  const foodItems = apiService.getFoodItems();

  // Form Scenario Inputs State
  const [selectedItemId, setSelectedItemId] = useState(foodItems[0].id);
  const [predictionDate, setPredictionDate] = useState('2026-10-06');
  const [dayOfWeek, setDayOfWeek] = useState('Friday');
  const [expectedCustomers, setExpectedCustomers] = useState(120);
  const [historicalSales, setHistoricalSales] = useState(80);
  const [currentPrep, setCurrentPrep] = useState(85);
  const [weatherCondition, setWeatherCondition] = useState('Sunny');
  const [tempC, setTempC] = useState(28);
  const [rainProb, setRainProb] = useState(10);
  const [isHoliday, setIsHoliday] = useState('No');
  const [specialEvent, setSpecialEvent] = useState('None');

  // Simulation State & Processing Steps
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [simulationComplete, setSimulationComplete] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState('');

  // Initial Simulation Output
  const [simResult, setSimResult] = useState(() => 
    apiService.simulateScenario({
      foodName: foodItems[0].name,
      historicalSales: 80,
      expectedCustomers: 120,
      day: 'Friday',
      weather: 'Sunny',
      rainProb: 10,
      holiday: 'No',
      specialEvent: 'None'
    })
  );

  // "What-If" Dynamic Sliders State
  const [whatIfCustomers, setWhatIfCustomers] = useState(120);
  const [whatIfWeatherImpact, setWhatIfWeatherImpact] = useState(0);
  const [whatIfGrowth, setWhatIfGrowth] = useState(10);
  const [whatIfEventImpact, setWhatIfEventImpact] = useState(0);

  // Active Stress Test Result State
  const [activeStressTest, setActiveStressTest] = useState(null);
  const [showStressModal, setShowStressModal] = useState(false);

  // Simulation History State
  const [historyList, setHistoryList] = useState(() => apiService.getSimulationHistory());

  const currentItem = foodItems.find(i => i.id === selectedItemId) || foodItems[0];

  // Run Simulation Handler with animated multi-step progress
  const handleRunSimulation = (e) => {
    if (e) e.preventDefault();
    setIsSimulating(true);
    setSimulationComplete(false);
    setSimulationStep(1);

    const steps = [
      "Analyzing historical sales...",
      "Analyzing weather forecast...",
      "Analyzing customer footfall patterns...",
      "Running time-series demand model...",
      "Calculating preparation recommendation..."
    ];

    steps.forEach((stepText, index) => {
      setTimeout(() => {
        setSimulationStep(index + 1);
      }, (index + 1) * 300);
    });

    setTimeout(() => {
      const output = apiService.simulateScenario({
        foodName: currentItem.name,
        historicalSales,
        expectedCustomers: whatIfCustomers || expectedCustomers,
        day: dayOfWeek,
        weather: weatherCondition,
        rainProb,
        holiday: isHoliday,
        specialEvent
      });
      setSimResult(output);
      setIsSimulating(false);
      setSimulationComplete(true);
      setSimulationStep(5);
    }, 1800);
  };

  // Handle Dynamic "What-If" Slider Changes
  const computedWhatIfDemand = Math.round(
    (historicalSales * (whatIfCustomers / 100) * (1 + whatIfGrowth / 100) * (1 + whatIfWeatherImpact / 100) * (1 + whatIfEventImpact / 100))
  );
  const computedWhatIfPrep = Math.round(computedWhatIfDemand * 1.06);

  // Handle Preset Stress Test Execution
  const handleRunStressTest = (type) => {
    const res = apiService.runStressTest(type);
    setActiveStressTest(res);
    setShowStressModal(true);
  };

  const handleApplyToPlan = () => {
    setSavedSuccess(`✓ Simulation Recommendation (${simResult.recommendedPrep} portions of ${currentItem.name}) applied to Kitchen Preparation Plan!`);
    setTimeout(() => setSavedSuccess(''), 4000);
  };

  const handleSaveScenario = () => {
    const newScenario = {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      food: currentItem.name,
      scenario: `${weatherCondition} / ${dayOfWeek}`,
      predicted: simResult.predictedDemand,
      recommended: simResult.recommendedPrep,
      confidence: `${simResult.confidence}%`
    };
    const updated = apiService.saveSimulationScenario(newScenario);
    setHistoryList(updated);
    setSavedSuccess(`✓ Scenario saved to Simulation History!`);
    setTimeout(() => setSavedSuccess(''), 4500);
  };

  // Scenario Comparison Data for Section 6 Chart
  const scenarioComparisonData = [
    { scenario: "Scenario A (Normal Weather)", demand: 85, prep: 90 },
    { scenario: "Scenario B (Heavy Rain)", demand: 73, prep: 78 },
    { scenario: "Scenario C (Festival Surge)", demand: 108, prep: 114 },
    { scenario: "Scenario D (Weekend Peak)", demand: 112, prep: 118 }
  ];

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
                <FlaskConical className="w-3.5 h-3.5 text-amber-400" /> AI DECISION LABORATORY
              </span>

              <span className="text-xs text-emerald-300 font-semibold bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <span className="font-extrabold tracking-wide">● AI SIMULATION ENGINE READY</span>
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
              Prediction Simulator
            </h1>
            <p className="text-gray-300 text-xs md:text-sm mt-1.5 font-medium max-w-xl">
              "Change restaurant conditions. Simulate demand. Make smarter preparation decisions."
            </p>
          </div>

          {/* Hero Caption Box */}
          <div className="bg-white/10 backdrop-blur-md p-4 px-5 rounded-3xl border border-white/15 max-w-xs text-right shrink-0 space-y-1 shadow-inner">
            <span className="text-xs text-[#d4af37] font-bold uppercase tracking-wider block">Scenario Experimentation</span>
            <p className="text-xs text-gray-200 font-medium leading-relaxed">
              "Experiment with sales, weather, events and customer patterns to understand how demand may change."
            </p>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs md:text-sm flex items-center justify-between gap-3 animate-fade-in shadow-xl border border-emerald-400/40">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>{savedSuccess}</span>
          </div>
          <button onClick={() => setSavedSuccess('')} className="text-white/80 hover:text-white text-xs underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* --------------------------------------------------
          GRID: 2. SCENARIO INPUT PANEL & 4. AI PREDICTION RESULT
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. SCENARIO INPUT PANEL */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#1b4332]" /> Scenario Input Controls
            </h3>
            <span className="text-[10px] text-gray-500 font-mono">Sim v3.2</span>
          </div>

          <form onSubmit={handleRunSimulation} className="space-y-3 text-xs">
            {/* Food Item */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Food Item</label>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              >
                {foodItems.map(item => (
                  <option key={item.id} value={item.id}>{item.name} ({item.category})</option>
                ))}
              </select>
            </div>

            {/* Date & Day */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={predictionDate}
                  onChange={(e) => setPredictionDate(e.target.value)}
                  className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl px-3 py-2 font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Day of Week</label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl px-3 py-2 font-semibold"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday (Weekend Peak)</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>
            </div>

            {/* Customers & Baseline Sales */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Expected Customers</label>
                <input
                  type="number"
                  value={expectedCustomers}
                  onChange={(e) => {
                    setExpectedCustomers(Number(e.target.value));
                    setWhatIfCustomers(Number(e.target.value));
                  }}
                  className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl px-3 py-2 font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Historical Avg Sales</label>
                <input
                  type="number"
                  value={historicalSales}
                  onChange={(e) => setHistoricalSales(Number(e.target.value))}
                  className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl px-3 py-2 font-semibold"
                />
              </div>
            </div>

            {/* Current Prep */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Current Kitchen Preparation Plan</label>
              <input
                type="number"
                value={currentPrep}
                onChange={(e) => setCurrentPrep(Number(e.target.value))}
                className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl px-3 py-2 font-semibold"
              />
            </div>

            {/* Weather & Rain */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Weather</label>
                <select
                  value={weatherCondition}
                  onChange={(e) => setWeatherCondition(e.target.value)}
                  className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl px-3 py-2 font-semibold"
                >
                  <option value="Sunny">Sunny</option>
                  <option value="Heavy Rain">Heavy Rain</option>
                  <option value="Heatwave">Heatwave</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Rain Prob ({rainProb}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={rainProb}
                  onChange={(e) => setRainProb(Number(e.target.value))}
                  className="w-full accent-[#1b4332] mt-1"
                />
              </div>
            </div>

            {/* Holiday & Event */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Holiday</label>
                <select
                  value={isHoliday}
                  onChange={(e) => setIsHoliday(e.target.value)}
                  className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl px-3 py-2 font-semibold"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes (+25%)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Special Event</label>
                <select
                  value={specialEvent}
                  onChange={(e) => setSpecialEvent(e.target.value)}
                  className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl px-3 py-2 font-semibold"
                >
                  <option value="None">None</option>
                  <option value="Festival">Festival Surge</option>
                  <option value="Corporate Event">Corporate Lunch</option>
                </select>
              </div>
            </div>

            {/* 3. SIMULATE BUTTON */}
            <button
              type="submit"
              disabled={isSimulating}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#081c15] via-[#1b4332] to-[#2d6a4f] hover:from-[#1b4332] hover:to-[#2d6a4f] text-white text-xs font-extrabold shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 tracking-wider uppercase mt-3"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#d4af37]" />
                  <span>Simulating Model...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                  <span>RUN AI SIMULATION</span>
                </>
              )}
            </button>

            {/* Multi-step Loading Animation Indicator */}
            {isSimulating && (
              <div className="p-3 rounded-xl bg-[#081c15] text-emerald-300 text-[11px] font-mono space-y-1 animate-pulse border border-[#1b4332]">
                <p className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Step {simulationStep} of 5</span>
                </p>
                <p className="text-gray-300">
                  {simulationStep === 1 && "Analyzing historical sales..."}
                  {simulationStep === 2 && "Analyzing weather..."}
                  {simulationStep === 3 && "Analyzing customer patterns..."}
                  {simulationStep === 4 && "Running demand model..."}
                  {simulationStep === 5 && "Calculating preparation recommendation..."}
                </p>
              </div>
            )}

            {simulationComplete && !isSimulating && (
              <div className="text-center text-xs font-extrabold text-emerald-700 bg-emerald-50 py-1.5 rounded-xl border border-emerald-200">
                Simulation Complete ✓
              </div>
            )}
          </form>
        </div>

        {/* Output Column: 4. AI PREDICTION RESULT & 5. BEFORE VS AFTER */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 4. AI PREDICTION RESULT (Large Focal Point) */}
          <div className="bg-gradient-to-br from-[#081c15] via-[#112a12] to-[#1b4332] text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-[#d4af37]/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#d4af37] bg-[#d4af37]/20 px-3 py-1 rounded-full border border-[#d4af37]/40 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> SIMULATION OUTPUT RESULT
              </span>

              <div>
                <p className="text-xs text-gray-300 uppercase font-extrabold tracking-wider">Predicted Demand</p>
                <h2 className="text-5xl md:text-6xl font-extrabold font-heading text-white mt-1 tracking-tight">
                  <AnimatedCounter value={simResult.predictedDemand} suffix=" portions" />
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold">
                <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-xl border border-emerald-400/30">
                  Recommended Prep: <strong className="text-white">{simResult.recommendedPrep} portions</strong>
                </span>
                <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-xl border border-amber-400/30">
                  Expected Waste: <strong className="text-white">{simResult.expectedWaste} portions</strong>
                </span>
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-xl border border-blue-400/30">
                  Shortage Risk: <strong className="text-white">{simResult.shortageRisk}</strong>
                </span>
              </div>
            </div>

            {/* Circular Gauge Ring for AI Confidence */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="54" stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="transparent" />
                  <circle 
                    cx="64" 
                    cy="64" 
                    r="54" 
                    stroke="#d4af37" 
                    strokeWidth="10" 
                    strokeDasharray={339.29}
                    strokeDashoffset={339.29 * (1 - simResult.confidence / 100)}
                    strokeLinecap="round"
                    fill="transparent" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-extrabold font-heading text-white">{simResult.confidence}%</span>
                  <span className="text-[9px] uppercase font-bold text-[#d4af37] tracking-wider">AI Confidence</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. BEFORE VS AFTER COMPARISON */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4">
            <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <ArrowRight className="w-5 h-5 text-[#1b4332]" /> Before vs After Strategy Comparison
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CURRENT PLAN */}
              <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-900 bg-red-200 px-2.5 py-0.5 rounded">
                  CURRENT MANUAL PLAN
                </span>
                <p className="text-2xl font-extrabold text-red-950 font-heading">{currentPrep} portions</p>
                <div className="text-xs space-y-1 font-medium text-red-900">
                  <p className="flex justify-between"><span>Expected Shortage:</span> <strong className="font-bold">HIGH (Stockout Risk)</strong></p>
                  <p className="flex justify-between"><span>Expected Waste:</span> <strong>2 portions</strong></p>
                </div>
              </div>

              {/* AI RECOMMENDATION */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-200 px-2.5 py-0.5 rounded">
                  AI RECOMMENDATION
                </span>
                <p className="text-2xl font-extrabold text-emerald-950 font-heading">{simResult.recommendedPrep} portions</p>
                <div className="text-xs space-y-1 font-medium text-emerald-900">
                  <p className="flex justify-between"><span>Shortage Risk:</span> <strong className="font-bold">LOW (Prevented)</strong></p>
                  <p className="flex justify-between"><span>Expected Waste:</span> <strong>{simResult.expectedWaste} portions</strong></p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --------------------------------------------------
          7. "WHAT IF?" CONTROLS (Live Interactive Sliders)
      -------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#1b4332]" /> "What If?" Dynamic Simulation Controls
            </h3>
            <p className="text-xs text-gray-500 font-medium">Drag sliders to instantly observe real-time demand & prep adaptations</p>
          </div>
          <span className="text-xs font-bold text-[#1b4332] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Real-Time Reactive Sliders
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Slider 1: Customer Count */}
          <div className="space-y-2 bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200">
            <div className="flex justify-between text-xs font-bold text-gray-800">
              <span>Customer Count</span>
              <span className="text-[#1b4332] font-extrabold">{whatIfCustomers}</span>
            </div>
            <input
              type="range"
              min="50"
              max="250"
              value={whatIfCustomers}
              onChange={(e) => setWhatIfCustomers(Number(e.target.value))}
              className="w-full accent-[#1b4332]"
            />
            <span className="text-[10px] text-gray-500 block">Baseline: 100 → 150</span>
          </div>

          {/* Slider 2: Weather Impact */}
          <div className="space-y-2 bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200">
            <div className="flex justify-between text-xs font-bold text-gray-800">
              <span>Weather Impact</span>
              <span className="text-blue-700 font-extrabold">+{whatIfWeatherImpact}%</span>
            </div>
            <input
              type="range"
              min="-30"
              max="40"
              value={whatIfWeatherImpact}
              onChange={(e) => setWhatIfWeatherImpact(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <span className="text-[10px] text-gray-500 block">Rain dip / Heat surge</span>
          </div>

          {/* Slider 3: Sales Growth */}
          <div className="space-y-2 bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200">
            <div className="flex justify-between text-xs font-bold text-gray-800">
              <span>Sales Growth</span>
              <span className="text-[#d4af37] font-extrabold">+{whatIfGrowth}%</span>
            </div>
            <input
              type="range"
              min="-20"
              max="50"
              value={whatIfGrowth}
              onChange={(e) => setWhatIfGrowth(Number(e.target.value))}
              className="w-full accent-[#d4af37]"
            />
            <span className="text-[10px] text-gray-500 block">Trend trajectory</span>
          </div>

          {/* Slider 4: Event Impact */}
          <div className="space-y-2 bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200">
            <div className="flex justify-between text-xs font-bold text-gray-800">
              <span>Event Impact</span>
              <span className="text-orange-600 font-extrabold">+{whatIfEventImpact}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={whatIfEventImpact}
              onChange={(e) => setWhatIfEventImpact(Number(e.target.value))}
              className="w-full accent-orange-600"
            />
            <span className="text-[10px] text-gray-500 block">Festival / Catering</span>
          </div>
        </div>

        {/* Dynamic Slider Output Box */}
        <div className="bg-[#081c15] text-white p-5 rounded-2xl border border-[#1b4332] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <span className="text-[10px] text-gray-400 font-semibold uppercase">Computed Demand</span>
            <p className="text-2xl font-extrabold text-white font-heading mt-0.5">{computedWhatIfDemand} portions</p>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-semibold uppercase">Recommended Prep</span>
            <p className="text-2xl font-extrabold text-[#d4af37] font-heading mt-0.5">{computedWhatIfPrep} portions</p>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-semibold uppercase">Waste Risk</span>
            <p className="text-2xl font-extrabold text-emerald-400 font-heading mt-0.5">Low</p>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-semibold uppercase">Shortage Risk</span>
            <p className="text-2xl font-extrabold text-emerald-400 font-heading mt-0.5">Very Low</p>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------
          GRID: 6. SCENARIO COMPARISON & 8. AI EXPLANATION
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 6. SCENARIO COMPARISON (Interactive Chart) */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4">
          <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#1b4332]" /> Scenario Comparison Matrix
          </h3>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scenarioComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="scenario" tick={{ fontSize: 9, fontWeight: 'bold' }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#081c15', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="demand" name="Predicted Demand" fill="#1b4332" radius={[4, 4, 0, 0]} />
                <Bar dataKey="prep" name="Recommended Prep" fill="#d4af37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 8. AI EXPLANATION ("Why did the prediction change?") */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-heading text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <HelpCircle className="w-5 h-5 text-[#1b4332]" /> Why did the prediction change?
            </h3>

            <div className="space-y-3 pt-3">
              {simResult.factors.map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>{item.name}</span>
                    <span className="text-[#1b4332] font-mono">{item.change}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-700" 
                      style={{ width: item.width, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-semibold">
            💡 Feature importance weights calculated dynamically via ensemble time-series neural layers.
          </div>
        </div>

      </div>

      {/* --------------------------------------------------
          11. EXTREME SCENARIO TEST ("Stress Test")
      -------------------------------------------------- */}
      <div className="bg-gradient-to-r from-[#040d09] via-[#081c15] to-[#1b4332] text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-emerald-800/40 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/20 px-3 py-1 rounded-full border border-[#d4af37]/40 inline-flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#d4af37]" /> ADVANCED STRESS TEST
            </span>
            <h3 className="text-2xl font-extrabold font-heading text-white mt-2">
              Extreme Operational Scenario Stress Test
            </h3>
            <p className="text-xs text-gray-300 mt-1">Select an extreme shock scenario to evaluate SmartServe AI kitchen resilience</p>
          </div>
        </div>

        {/* Stress Test Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {['Demand Spike', 'Heavy Rain', 'Festival', 'Sudden Drop', 'Weekend Rush'].map((t) => (
            <button
              key={t}
              onClick={() => handleRunStressTest(t)}
              className="py-3 px-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-extrabold text-gray-200 hover:text-white transition-all cursor-pointer text-center"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------
          GRID: 9. SMART DECISION & 10. SIMULATION HISTORY
      -------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 9. SMART DECISION CARD */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#1b4332] bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1b4332]" /> AI DECISION
            </span>

            <h3 className="text-2xl font-extrabold font-heading text-gray-900">
              "{simResult.aiDecisionText}"
            </h3>

            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              "{simResult.aiExplanation}"
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleApplyToPlan}
              className="w-full py-3 rounded-xl bg-[#d4af37] hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Apply to Preparation Plan
            </button>

            <button
              onClick={handleSaveScenario}
              className="w-full py-3 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Save Scenario
            </button>
          </div>
        </div>

        {/* 10. SIMULATION HISTORY TABLE */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold font-heading text-gray-900">Recent Simulations History</h3>
            <span className="text-xs text-gray-500 font-mono">Logged Experiments</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#081c15] text-gray-200 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Food Item</th>
                  <th className="px-4 py-3">Scenario</th>
                  <th className="px-4 py-3">Demand</th>
                  <th className="px-4 py-3">Recommended</th>
                  <th className="px-4 py-3 text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {historyList.map((row, idx) => (
                  <tr key={idx} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-gray-500">{row.date}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{row.food}</td>
                    <td className="px-4 py-3 text-gray-700">{row.scenario}</td>
                    <td className="px-4 py-3 font-extrabold text-gray-900">{row.predicted}</td>
                    <td className="px-4 py-3 font-extrabold text-[#1b4332]">{row.recommended}</td>
                    <td className="px-4 py-3 text-right font-extrabold text-[#d4af37]">{row.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* --------------------------------------------------
          13. AI INSIGHT & DISCLAIMER FOOTER
      -------------------------------------------------- */}
      <div className="bg-gradient-to-r from-[#040d09] via-[#081c15] to-[#1b4332] text-white rounded-3xl p-6 shadow-2xl border border-[#d4af37]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-[#d4af37]/20 px-3 py-1 rounded-full border border-[#d4af37]/40 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> SmartServe AI Insight
          </span>
          <p className="text-sm font-semibold text-white leading-relaxed max-w-2xl mt-1">
            "Under the simulated festival scenario, demand may increase significantly. Preparing 15–20 additional portions could reduce shortage risk."
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] text-amber-300 font-mono bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/30">
            * "AI simulation — not a guaranteed forecast."
          </span>
        </div>
      </div>

      {/* Stress Test Modal */}
      {showStressModal && activeStressTest && (
        <Modal
          isOpen={showStressModal}
          onClose={() => setShowStressModal(false)}
          title={`Stress Test Result: ${activeStressTest.title}`}
        >
          <div className="space-y-4 text-xs">
            <div className="bg-[#081c15] text-white p-4 rounded-2xl border border-[#1b4332] space-y-1">
              <span className="text-[10px] text-[#d4af37] uppercase font-bold">Predicted Shift</span>
              <h4 className="text-2xl font-bold font-heading text-white">{activeStressTest.predictedChange}</h4>
              <p className="text-gray-300 leading-relaxed mt-1 font-medium">{activeStressTest.aiInsight}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#f4f6f0] p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Predicted Demand</span>
                <p className="text-sm font-extrabold text-[#1b4332] font-mono mt-0.5">{activeStressTest.predictedDemand} portions</p>
              </div>

              <div className="bg-[#f4f6f0] p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Recommended Prep</span>
                <p className="text-sm font-extrabold text-[#d4af37] font-mono mt-0.5">{activeStressTest.recommendedPrep} portions</p>
              </div>

              <div className="bg-[#f4f6f0] p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Kitchen Load</span>
                <p className="text-sm font-extrabold text-amber-800 mt-0.5">{activeStressTest.kitchenCapacity}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-bold">
              Action Plan: {activeStressTest.recommendation}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowStressModal(false)}
                className="px-5 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold cursor-pointer"
              >
                Close Stress Test
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}

// FlaskConical Icon Helper
function FlaskConical(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55A2 2 0 0 0 6.51 23.5h10.98a2 2 0 0 0 1.79-2.95l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <line x1="8.5" y1="2" x2="15.5" y2="2" />
      <path d="M8.5 14h7" />
    </svg>
  );
}
