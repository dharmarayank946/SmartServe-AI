import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  Users, 
  Layers, 
  Activity, 
  X, 
  ChevronRight,
  Sliders,
  DollarSign,
  BarChart3
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

export default function RestaurantNetwork({ onNavigate }) {
  // Page State
  const [networkSummary, setNetworkSummary] = useState(null);
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('All Locations');
  const [restaurantsList, setRestaurantsList] = useState([]);
  const [selectedRestaurantModal, setSelectedRestaurantModal] = useState(null);

  // Comparison State
  const [selectedComparisonIds, setSelectedComparisonIds] = useState(['rest-1', 'rest-2', 'rest-3']);
  const [comparisonData, setComparisonData] = useState([]);

  // Analytics Forecast State
  const [forecastTimeRange, setForecastTimeRange] = useState('7 Days');
  const [analyticsData, setAnalyticsData] = useState([]);

  // Alerts, Insights & Benchmarks
  const [networkAlerts, setNetworkAlerts] = useState([]);
  const [networkInsights, setNetworkInsights] = useState([]);
  const [wasteBenchmarks, setWasteBenchmarks] = useState([]);
  const [locationRecommendations, setLocationRecommendations] = useState([]);
  const [globalBriefing, setGlobalBriefing] = useState([]);

  // Add Restaurant Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRestForm, setNewRestForm] = useState({
    name: '',
    location: 'Bengaluru',
    manager: '',
    type: 'Fine Dining',
    operatingHours: '10:00 AM - 11:00 PM',
    cuisineType: 'North Indian & South Indian'
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, [selectedLocationFilter, forecastTimeRange]);

  const loadData = () => {
    const summary = apiService.getNetworkSummary();
    setNetworkSummary(summary);

    const rests = apiService.getRestaurantsList(selectedLocationFilter);
    setRestaurantsList(rests);

    const analytics = apiService.getNetworkAnalytics(forecastTimeRange, selectedLocationFilter);
    setAnalyticsData(analytics);

    const alerts = apiService.getNetworkAlerts();
    setNetworkAlerts(alerts);

    const insights = apiService.getNetworkInsights();
    setNetworkInsights(insights);

    const benchmarks = apiService.getWasteBenchmarking();
    setWasteBenchmarks(benchmarks);

    const recs = apiService.getNetworkRecommendationsByLocation();
    setLocationRecommendations(recs);

    const briefing = apiService.getGlobalAiBriefing();
    setGlobalBriefing(briefing);

    const comp = apiService.getNetworkComparison(selectedComparisonIds);
    setComparisonData(comp);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleComparisonToggle = (id) => {
    let updated;
    if (selectedComparisonIds.includes(id)) {
      if (selectedComparisonIds.length === 1) return;
      updated = selectedComparisonIds.filter(i => i !== id);
    } else {
      if (selectedComparisonIds.length >= 4) return;
      updated = [...selectedComparisonIds, id];
    }
    setSelectedComparisonIds(updated);
    setComparisonData(apiService.getNetworkComparison(updated));
  };

  const handleAddRestaurantSubmit = (e) => {
    e.preventDefault();
    if (!newRestForm.name) return;

    const added = apiService.addRestaurant(newRestForm);
    setRestaurantsList(prev => [added, ...prev]);
    setIsAddModalOpen(false);
    setNewRestForm({
      name: '',
      location: 'Bengaluru',
      manager: '',
      type: 'Fine Dining',
      operatingHours: '10:00 AM - 11:00 PM',
      cuisineType: 'North Indian & South Indian'
    });
    showToast(`🏢 Restaurant "${added.name}" added successfully to the SmartServe Network!`);
  };

  const locationsList = ['All Locations', 'Bengaluru', 'Kalaburagi', 'Hyderabad', 'Mysuru', 'Mumbai'];

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#081c15] text-white border border-[#d4af37]/50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-[#d4af37]" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. NETWORK HEADER */}
      <div className="bg-gradient-to-r from-[#040d09] via-[#081c15] to-[#1b4332] p-6 md:p-8 rounded-3xl text-white shadow-2xl border border-[#1b4332]/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4332]/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
              <Globe className="w-3.5 h-3.5 text-emerald-400" /> Multi-Location Intelligence Grid
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading text-white">
              Restaurant Network
            </h1>
            <p className="text-gray-300 text-sm md:text-base mt-1 max-w-2xl">
              One AI platform. Every restaurant. Smarter decisions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Header Telemetry Badge */}
            <div className="bg-[#040d09]/80 backdrop-blur-md p-3.5 rounded-2xl border border-[#d4af37]/30 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-emerald-400">{networkSummary?.status || 'NETWORK ONLINE'}</span>
              </div>
              <div className="h-6 w-px bg-gray-700" />
              <div>
                <span className="text-gray-400 block text-[10px]">CONNECTED</span>
                <span className="text-white font-extrabold">{networkSummary?.restaurantsConnected || 12} Locations</span>
              </div>
              <div className="h-6 w-px bg-gray-700" />
              <div>
                <span className="text-gray-400 block text-[10px]">RECORDS</span>
                <span className="text-amber-300 font-extrabold">{networkSummary?.totalDataRecords.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#d4af37] hover:bg-[#b59226] text-gray-950 font-bold text-xs px-4 py-3 rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Restaurant
            </button>
          </div>
        </div>
      </div>

      {/* 2. LOCATION SELECTOR BAR */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2 shrink-0">Filter Location:</span>
          {locationsList.map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocationFilter(loc)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedLocationFilter === loc 
                  ? 'bg-[#081c15] text-white border border-[#d4af37]/40 shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 w-full md:w-auto justify-end">
          <span className="font-semibold text-gray-700">Scope:</span>
          <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
            {selectedLocationFilter === 'All Locations' ? 'All 12 Restaurants' : `${selectedLocationFilter} Region`}
          </span>
        </div>
      </div>

      {/* 3. NETWORK OVERVIEW METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">Today's Total Demand</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-gray-900">{networkSummary?.metrics.todayDemandPortions.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> {networkSummary?.metrics.demandChange}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block">Across all locations</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">Total Preparation</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-gray-900">{networkSummary?.metrics.todayPreparationPortions.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> {networkSummary?.metrics.prepChange}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block">Recommended buffer included</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">Total Waste</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-800">{networkSummary?.metrics.todayWastePortions}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3" /> {networkSummary?.metrics.wasteChange}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block">Portions waste loss</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">Estimated Savings</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-600">₹{networkSummary?.metrics.estimatedSavings.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> {networkSummary?.metrics.savingsChange}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block">Recovered cost</span>
        </div>

        <div className="bg-[#081c15] text-white p-5 rounded-2xl border border-[#d4af37]/40 shadow-md space-y-1">
          <span className="text-[11px] text-[#d4af37] font-bold uppercase tracking-wider block">Avg Prediction Accuracy</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-300">{networkSummary?.metrics.avgPredictionAccuracy}%</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
              {networkSummary?.metrics.accuracyChange}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block">AI Neural Grid</span>
        </div>
      </div>

      {/* 4. RESTAURANT PERFORMANCE MAP (ABSTRACT VISUALIZATION) */}
      <div className="bg-[#040d09] text-white p-6 md:p-8 rounded-3xl border border-[#1b4332] shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4332] text-emerald-300 text-xs font-semibold mb-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Geographic Neural Map
            </div>
            <h2 className="text-2xl font-bold font-heading text-white">
              Restaurant Performance Map
            </h2>
            <p className="text-gray-300 text-xs mt-1">
              Live location telemetry showing demand spikes, waste levels, and risk statuses.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Healthy</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Attention</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical</span>
          </div>
        </div>

        {/* Interactive Map Visual Board */}
        <div className="relative w-full h-80 bg-[#081c15] rounded-2xl border border-[#1b4332] overflow-hidden flex items-center justify-center p-4">
          {/* Abstract Grid Lines & Connecting Pulses */}
          <svg className="absolute inset-0 w-full h-full stroke-[#1b4332]/60" strokeWidth="1">
            <line x1="10%" y1="20%" x2="90%" y2="80%" strokeDasharray="4" />
            <line x1="20%" y1="70%" x2="80%" y2="30%" strokeDasharray="4" />
            <line x1="35%" y1="55%" x2="65%" y2="32%" stroke="#d4af37" strokeWidth="2" strokeOpacity="0.4" />
          </svg>

          {/* Location Nodes */}
          {restaurantsList.map((rest) => {
            const isRed = rest.status === 'Critical';
            const isAmber = rest.status === 'Attention';

            return (
              <div
                key={rest.id}
                onClick={() => setSelectedRestaurantModal(rest)}
                style={{ left: `${rest.coords.x}%`, top: `${rest.coords.y}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 ${
                  isRed 
                    ? 'bg-red-950 border-red-500 text-red-400' 
                    : isAmber 
                      ? 'bg-amber-950 border-amber-500 text-amber-400' 
                      : 'bg-emerald-950 border-emerald-500 text-emerald-400'
                } group-hover:scale-125 transition-all duration-200`}>
                  <Building2 className="w-4 h-4" />
                  <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping ${
                    isRed ? 'bg-red-500' : isAmber ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                </div>

                {/* Hover Tooltip Label */}
                <div className="absolute top-9 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#040d09] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-[#d4af37]/40 shadow-xl whitespace-nowrap z-30">
                  <p>{rest.name}</p>
                  <p className="text-gray-400 font-normal">{rest.demand} portions • {rest.accuracy}% Acc</p>
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-3 right-3 text-[10px] text-gray-400 bg-[#040d09]/80 px-3 py-1 rounded-full border border-gray-700">
            Click any node to inspect location telemetry
          </div>
        </div>
      </div>

      {/* 5. RESTAURANT HEALTH TABLE ("Location Intelligence") */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-700" /> Location Intelligence
            </h2>
            <p className="text-xs text-gray-500">Real-time telemetry and risk tracking per restaurant branch</p>
          </div>
          <span className="text-xs text-gray-500">{restaurantsList.length} Active Nodes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#081c15] text-white">
                <th className="p-3 rounded-l-xl">Restaurant Name</th>
                <th className="p-3">Today's Demand</th>
                <th className="p-3">Waste (portions)</th>
                <th className="p-3">Prediction Accuracy</th>
                <th className="p-3">Savings (₹)</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {restaurantsList.map((row) => (
                <tr 
                  key={row.id} 
                  onClick={() => setSelectedRestaurantModal(row)}
                  className="hover:bg-emerald-50/50 transition-colors cursor-pointer group"
                >
                  <td className="p-3">
                    <p className="font-bold text-gray-900 group-hover:text-emerald-800">{row.name}</p>
                    <p className="text-[10px] text-gray-500">{row.city} • {row.type}</p>
                  </td>
                  <td className="p-3 font-semibold text-gray-800">
                    {row.demand.toLocaleString()} portions <span className="text-[10px] text-emerald-600 ml-1">{row.demandTrend}</span>
                  </td>
                  <td className="p-3 font-semibold text-gray-700">
                    {row.waste} <span className="text-[10px] text-emerald-600 ml-1">{row.wasteTrend}</span>
                  </td>
                  <td className="p-3 font-extrabold text-emerald-800">{row.accuracy}%</td>
                  <td className="p-3 font-bold text-amber-600">₹{row.savings.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      row.risk === 'Critical' ? 'bg-red-100 text-red-800' : row.risk === 'High' || row.risk === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {row.risk}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] ${
                      row.status === 'Critical' ? 'bg-red-500 text-white' : row.status === 'Attention' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. AI NETWORK INSIGHTS */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" /> AI Network Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {networkInsights.map((ins) => (
            <div 
              key={ins.id} 
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#d4af37]/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    {ins.impact}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700">Confidence: {ins.confidence}</span>
                </div>
                <p className="text-sm font-bold text-gray-900 leading-snug">
                  "{ins.text}"
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#f4f6f0] border border-gray-200 text-xs">
                <span className="font-bold text-emerald-900 block mb-0.5">Recommended Action:</span>
                <p className="text-gray-700">{ins.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. LOCATION COMPARISON TOOL */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-700" /> Location Comparison Matrix
            </h2>
            <p className="text-xs text-gray-500">Select up to 4 locations to compare operational performance</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {restaurantsList.map((r) => {
              const isSelected = selectedComparisonIds.includes(r.id);
              return (
                <button
                  key={r.id}
                  onClick={() => handleComparisonToggle(r.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-[#081c15] text-white border border-[#d4af37]/40 shadow-xs' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {r.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comparison Bar Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#081c15', borderRadius: '12px', border: '1px solid #d4af37', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="demand" name="Today's Demand (portions)" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="waste" name="Waste (portions)" fill="#ef4444" radius={[6, 6, 0, 0]} />
              <Bar dataKey="savings" name="Savings (₹)" fill="#d4af37" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 8. NETWORK DEMAND FORECAST CHART */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-700" /> Network Demand Forecast
            </h2>
            <p className="text-xs text-gray-500">Aggregated demand forecast vs actual sales across network</p>
          </div>

          <div className="flex items-center gap-1 bg-[#f4f6f0] p-1 rounded-xl border border-gray-200">
            {['Today', '7 Days', '30 Days'].map((range) => (
              <button
                key={range}
                onClick={() => setForecastTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  forecastTimeRange === range 
                    ? 'bg-[#081c15] text-white shadow-xs' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="gradNetActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="gradNetPrep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey={forecastTimeRange === 'Today' ? 'time' : forecastTimeRange === '7 Days' ? 'day' : 'week'} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#081c15', borderRadius: '12px', border: '1px solid #d4af37', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="actual" name="Actual Demand" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#gradNetActual)" />
              <Area type="monotone" dataKey="predicted" name="Predicted Demand" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" />
              <Area type="monotone" dataKey="prep" name="Recommended Preparation" stroke="#d4af37" strokeWidth={2} fillOpacity={1} fill="url(#gradNetPrep)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 9 & 10. WASTE BENCHMARKING & RECOMMENDATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Waste Benchmarking */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" /> Waste Performance Rankings
          </h2>
          <p className="text-xs text-gray-500">Locations benchmarked by food waste prevention efficiency</p>

          <div className="space-y-3">
            {wasteBenchmarks.map((bm) => (
              <div key={bm.rank} className="p-3.5 rounded-2xl bg-[#f4f6f0] border border-gray-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#081c15] text-[#d4af37] flex items-center justify-center font-bold text-xs shrink-0">
                    #{bm.rank}
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">{bm.name}</p>
                    <p className="text-[10px] text-gray-500">Waste Rate: {bm.wastePct}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-base font-extrabold ${bm.color}`}>{bm.score}/100</span>
                  <span className="text-[10px] text-gray-400 block">{bm.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium">
            💡 <span className="font-bold">AI Insight:</span> Restaurants with higher prediction accuracy consistently display lower food waste.
          </div>
        </div>

        {/* AI Recommendations by Location */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600" /> Actionable Recommendations
          </h2>
          <p className="text-xs text-gray-500">Priority prep actions grouped by restaurant branch</p>

          <div className="space-y-3">
            {locationRecommendations.map((rec, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#081c15] text-white border border-[#1b4332] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#d4af37]">{rec.location}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    rec.urgency === 'High' ? 'bg-red-500 text-white' : rec.urgency === 'Medium' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {rec.urgency} Urgency
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-200">{rec.action}</p>
                <p className="text-[10px] text-gray-400">Reason: {rec.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 11. NETWORK ALERT CENTER */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" /> Critical Network Alerts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {networkAlerts.map((alt) => (
            <div 
              key={alt.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3 ${
                alt.type === 'critical' 
                  ? 'bg-red-50 border-red-200 text-red-950' 
                  : alt.type === 'warning' 
                    ? 'bg-amber-50 border-amber-200 text-amber-950' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    <span>{alt.icon}</span> {alt.title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-gray-200 shadow-2xs">
                    {alt.location}
                  </span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mt-2">{alt.text}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200/60 text-xs">
                <button 
                  onClick={() => showToast(`🔍 Inspected alert for ${alt.location}`)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-gray-300 font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  View
                </button>
                <button 
                  onClick={() => showToast(`✓ Resolved alert for ${alt.location}`)}
                  className="px-2.5 py-1 rounded-lg bg-[#081c15] text-white font-semibold hover:bg-[#1b4332] cursor-pointer"
                >
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 12. GLOBAL AI BRIEFING */}
      <div className="bg-gradient-to-r from-[#040d09] via-[#081c15] to-[#1b4332] text-white p-6 md:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl space-y-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4332] text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Executive Briefing
          </div>
          <h2 className="text-2xl font-bold font-heading text-white">
            Network AI Briefing
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {globalBriefing.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-[#081c15]/90 border border-[#1b4332] flex items-center gap-3 text-xs text-gray-200">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 13. NETWORK IMPACT SUMMARY */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" /> SmartServe AI Network Impact
          </h2>
          <p className="text-xs text-gray-500">Measurable efficiency gains across 12 restaurant locations</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200 text-center">
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Total Waste Reduced</span>
            <span className="text-2xl font-extrabold text-emerald-700">23%</span>
          </div>
          <div className="bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200 text-center">
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Total Estimated Savings</span>
            <span className="text-2xl font-extrabold text-amber-600">₹4.2 Lakh</span>
          </div>
          <div className="bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200 text-center">
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Prediction Accuracy</span>
            <span className="text-2xl font-extrabold text-emerald-800">93.8%</span>
          </div>
          <div className="bg-[#081c15] text-white p-4 rounded-2xl border border-[#d4af37]/30 text-center">
            <span className="text-[10px] text-[#d4af37] font-bold uppercase block">Restaurants Optimized</span>
            <span className="text-2xl font-extrabold text-amber-300">12 Locations</span>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 text-center italic">
          * Estimated impact based on available restaurant telemetry & preparation logs.
        </p>
      </div>

      {/* 14. ADD RESTAURANT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-lg w-full p-6 space-y-6 shadow-2xl relative animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-700" /> Add Restaurant to Network
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRestaurantSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Restaurant Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Indiranagar Bistro" 
                  value={newRestForm.name}
                  onChange={(e) => setNewRestForm({ ...newRestForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Location City</label>
                  <select 
                    value={newRestForm.location}
                    onChange={(e) => setNewRestForm({ ...newRestForm, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Kalaburagi">Kalaburagi</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Mysuru">Mysuru</option>
                    <option value="Mumbai">Mumbai</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Restaurant Type</label>
                  <select 
                    value={newRestForm.type}
                    onChange={(e) => setNewRestForm({ ...newRestForm, type: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="Fine Dining">Fine Dining</option>
                    <option value="Casual Dining">Casual Dining</option>
                    <option value="Quick Service">Quick Service</option>
                    <option value="Cloud Kitchen">Cloud Kitchen</option>
                    <option value="Express Kitchen">Express Kitchen</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Branch Manager</label>
                <input 
                  type="text" 
                  placeholder="e.g. Suresh Kumar" 
                  value={newRestForm.manager}
                  onChange={(e) => setNewRestForm({ ...newRestForm, manager: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#081c15] text-white font-bold border border-[#d4af37]/30 hover:bg-[#1b4332] shadow-md cursor-pointer"
                >
                  Add Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOCATION INSPECTION POPUP MODAL */}
      {selectedRestaurantModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#040d09] text-white rounded-3xl border border-[#d4af37]/40 max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#1b4332] pb-3">
              <div>
                <h3 className="font-bold text-white text-lg">{selectedRestaurantModal.name}</h3>
                <p className="text-xs text-gray-400">{selectedRestaurantModal.city} • {selectedRestaurantModal.type}</p>
              </div>
              <button 
                onClick={() => setSelectedRestaurantModal(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#081c15] border border-[#1b4332]">
                <span className="text-gray-400 block text-[10px]">TODAY'S DEMAND</span>
                <span className="text-base font-bold text-white">{selectedRestaurantModal.demand} portions</span>
              </div>
              <div className="p-3 rounded-xl bg-[#081c15] border border-[#1b4332]">
                <span className="text-gray-400 block text-[10px]">PREPARATION</span>
                <span className="text-base font-bold text-white">{selectedRestaurantModal.prepared} portions</span>
              </div>
              <div className="p-3 rounded-xl bg-[#081c15] border border-[#1b4332]">
                <span className="text-gray-400 block text-[10px]">WASTE LOSS</span>
                <span className="text-base font-bold text-emerald-400">{selectedRestaurantModal.waste} portions</span>
              </div>
              <div className="p-3 rounded-xl bg-[#081c15] border border-[#1b4332]">
                <span className="text-gray-400 block text-[10px]">PREDICTION ACCURACY</span>
                <span className="text-base font-bold text-amber-300">{selectedRestaurantModal.accuracy}%</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#081c15] border border-[#1b4332] text-xs flex items-center justify-between">
              <span className="text-gray-300 font-semibold">Current Risk Status:</span>
              <span className={`px-2 py-0.5 rounded font-extrabold ${
                selectedRestaurantModal.risk === 'Critical' ? 'bg-red-500 text-white' : selectedRestaurantModal.risk === 'High' || selectedRestaurantModal.risk === 'Medium' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {selectedRestaurantModal.risk} Risk
              </span>
            </div>

            <button
              onClick={() => setSelectedRestaurantModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#1b4332] text-white font-bold hover:bg-[#2d6a4f] cursor-pointer text-xs"
            >
              Close Telemetry View
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
