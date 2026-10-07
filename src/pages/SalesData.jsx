import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { 
  BarChart3, 
  Upload, 
  Plus, 
  FileSpreadsheet, 
  Search, 
  Filter, 
  CheckCircle2, 
  Download, 
  Calendar, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  ArrowUpRight, 
  ChevronRight, 
  Layers, 
  UtensilsCrossed, 
  RefreshCw, 
  X, 
  Zap, 
  Info,
  Check,
  AlertTriangle
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

export default function SalesData({ onNavigate }) {
  // Page Telemetry State
  const [salesSummary, setSalesSummary] = useState(null);
  const [trendTimeRange, setTrendTimeRange] = useState('7 Days');
  const [metricType, setMetricType] = useState('Quantity'); // Quantity | Revenue
  const [salesTrendChartData, setSalesTrendChartData] = useState([]);
  
  // Food-wise Performance & Detail Modal
  const [foodPerformance, setFoodPerformance] = useState([]);
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);

  // Peak Hours & Day Pattern
  const [peakHours, setPeakHours] = useState([]);
  const [weeklyPattern, setWeeklyPattern] = useState([]);

  // CSV Drag-and-Drop & Validation State
  const [isDragging, setIsDragging] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgressStep, setValidationProgressStep] = useState(0);
  const [validationResult, setValidationResult] = useState(null);

  // Recent Transactions & Filter State
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // AI Insights
  const [aiInsights, setAiInsights] = useState([]);

  // Add Sales Modal State
  const [isAddSalesModalOpen, setIsAddSalesModalOpen] = useState(false);
  const [newSalesForm, setNewSalesForm] = useState({
    foodItem: 'Veg Biryani',
    date: new Date().toISOString().split('T')[0],
    time: '07:30 PM',
    qty: 5,
    price: 240
  });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    loadSalesData();
  }, [trendTimeRange, metricType]);

  const loadSalesData = () => {
    const summary = apiService.getSalesIntelligenceSummary();
    setSalesSummary(summary);

    const trend = apiService.getSalesTrendChart(trendTimeRange, metricType);
    setSalesTrendChartData(trend);

    const foodPerf = apiService.getFoodWiseSalesPerformance();
    setFoodPerformance(foodPerf);
    if (!selectedFoodItem && foodPerf.length > 0) {
      setSelectedFoodItem(foodPerf[0]);
    }

    const peak = apiService.getPeakSalesHoursData();
    setPeakHours(peak);

    const pattern = apiService.getWeeklySalesPatternData();
    setWeeklyPattern(pattern);

    const txs = apiService.getRecentTransactionsList();
    setRecentTransactions(txs);

    const insights = apiService.getAiSalesInsights();
    setAiInsights(insights);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // CSV Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    if (!file.name.endsWith('.csv')) {
      showToast('❌ Please select a valid CSV file.');
      return;
    }
    setUploadFile(file);
    runValidationAnimation(file.name);
  };

  const runValidationAnimation = (fileName) => {
    setIsValidating(true);
    setValidationProgressStep(0);
    setValidationResult(null);

    const steps = [
      "Reading File...",
      "Checking Columns...",
      "Checking Missing Values...",
      "Checking Duplicates...",
      "Validating Sales Data..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setValidationProgressStep(currentStep);
      } else {
        clearInterval(interval);
        setIsValidating(false);
        const result = apiService.validateSalesCsv(fileName);
        setValidationResult(result);
        showToast(`✓ CSV Ingestion Verified: ${result.validRecords.toLocaleString()} valid sales entries!`);
      }
    }, 500);
  };

  const handleSampleCsvDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8,Date,Food Item,Quantity Sold,Price,Day,Holiday,Weather\n" +
      "2026-10-06,Veg Biryani,85,240,Monday,No,Sunny\n" +
      "2026-10-06,Masala Dosa,110,140,Monday,No,Sunny\n" +
      "2026-10-06,Paneer Curry,62,280,Monday,No,Sunny\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "smartserve_sales_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("📥 Downloaded Sample POS Sales CSV Template");
  };

  const handleAddSalesSubmit = (e) => {
    e.preventDefault();
    if (!newSalesForm.foodItem) return;

    const added = apiService.addSalesRecord({
      foodItem: newSalesForm.foodItem,
      date: newSalesForm.date,
      time: newSalesForm.time,
      qty: newSalesForm.qty,
      revenue: newSalesForm.qty * newSalesForm.price
    });

    setRecentTransactions(prev => [added, ...prev]);
    setIsAddSalesModalOpen(false);
    showToast(`✓ Sales record for ${added.foodItem} added successfully.`);
  };

  // Pagination for Recent Transactions
  const filteredTxs = recentTransactions.filter(tx => 
    tx.foodItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredTxs.length / itemsPerPage);
  const paginatedTxs = filteredTxs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" /> POS Sales Intelligence Engine
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading text-white">
              Sales Intelligence
            </h1>
            <p className="text-gray-300 text-sm md:text-base mt-1 max-w-2xl">
              Understand what customers buy and help SmartServe AI predict what comes next.
            </p>
          </div>

          {/* Telemetry Status Box */}
          <div className="bg-[#040d09]/80 backdrop-blur-md p-4 rounded-2xl border border-[#d4af37]/30 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-emerald-400">{salesSummary?.status || 'DATA SYNCED'}</span>
            </div>
            <div className="h-6 w-px bg-gray-700 hidden sm:block" />
            <div>
              <span className="text-gray-400 block text-[10px]">LAST UPDATE</span>
              <span className="text-white font-medium">{salesSummary?.lastUpdate}</span>
            </div>
            <div className="h-6 w-px bg-gray-700 hidden sm:block" />
            <div>
              <span className="text-gray-400 block text-[10px]">TOTAL RECORDS</span>
              <span className="text-white font-extrabold">{salesSummary?.totalRecords.toLocaleString()}</span>
            </div>
            <div className="h-6 w-px bg-gray-700 hidden sm:block" />
            <div>
              <span className="text-gray-400 block text-[10px]">DATA QUALITY</span>
              <span className="text-amber-300 font-bold text-sm">{salesSummary?.dataQuality}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 13. QUICK ACTIONS BAR */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAddSalesModalOpen(true)}
            className="bg-[#081c15] hover:bg-[#1b4332] text-white font-bold text-xs px-4 py-2.5 rounded-2xl border border-[#d4af37]/30 shadow-md flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 text-[#d4af37]" /> Add Sales
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('sales-csv-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs px-4 py-2.5 rounded-2xl border border-gray-300 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4 text-emerald-700" /> Upload CSV
          </button>
          <button
            onClick={() => onNavigate && onNavigate('prediction')}
            className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-semibold text-xs px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-[#d4af37]" /> View Predictions
          </button>
          <button
            onClick={() => onNavigate && onNavigate('waste')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs px-4 py-2.5 rounded-2xl border border-gray-300 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-600" /> Record Waste
          </button>
          <button
            onClick={() => onNavigate && onNavigate('analytics')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs px-4 py-2.5 rounded-2xl border border-gray-300 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-blue-600" /> View Analytics
          </button>
        </div>
      </div>

      {/* 2. SALES OVERVIEW (5 PREMIUM METRICS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">Today's Sales</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-gray-900">{salesSummary?.todaySalesPortions.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> {salesSummary?.todaySalesGrowth}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block">portions sold</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">Revenue</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-gray-900">₹{salesSummary?.revenue.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> {salesSummary?.revenueGrowth}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block">POS revenue</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">Average Order Value</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-800">₹{salesSummary?.avgOrderValue}</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> {salesSummary?.avgOrderGrowth}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block">per ticket</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">Top Selling Item</span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-extrabold text-amber-600 truncate">{salesSummary?.topSellingItem}</span>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
              {salesSummary?.topSellingQty}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block">units sold today</span>
        </div>

        <div className="bg-[#081c15] text-white p-5 rounded-2xl border border-[#d4af37]/40 shadow-md space-y-1">
          <span className="text-[11px] text-[#d4af37] font-bold uppercase tracking-wider block">Overall Sales Growth</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-300">{salesSummary?.overallSalesGrowth}</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
              vs last week
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block">AI Baseline match</span>
        </div>
      </div>

      {/* 3. SALES TREND CHART */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-700" /> Sales Trend & Demand Trajectory
            </h2>
            <p className="text-xs text-gray-500">Actual sales transactions vs AI predicted demand baseline</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Metric Switcher */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs">
              <button
                onClick={() => setMetricType('Quantity')}
                className={`px-3 py-1 rounded-lg font-semibold cursor-pointer transition-all ${
                  metricType === 'Quantity' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Quantity
              </button>
              <button
                onClick={() => setMetricType('Revenue')}
                className={`px-3 py-1 rounded-lg font-semibold cursor-pointer transition-all ${
                  metricType === 'Revenue' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Revenue (₹)
              </button>
            </div>

            {/* Time Filter */}
            <div className="flex items-center gap-1 bg-[#f4f6f0] p-1 rounded-xl border border-gray-200 text-xs">
              {['Today', '7 Days', '30 Days', '90 Days'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTrendTimeRange(range)}
                  className={`px-3 py-1 rounded-lg font-semibold cursor-pointer transition-all ${
                    trendTimeRange === range ? 'bg-[#081c15] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesTrendChartData}>
              <defs>
                <linearGradient id="gradActualSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="gradPredSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey={trendTimeRange === 'Today' ? 'time' : 'label'} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#081c15', borderRadius: '12px', border: '1px solid #d4af37', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey={metricType === 'Quantity' ? 'actual' : 'revenue'} name={metricType === 'Quantity' ? 'Actual Sales (portions)' : 'Actual Revenue (₹)'} stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#gradActualSales)" />
              <Area type="monotone" dataKey="predicted" name="AI Predicted Demand" stroke="#d4af37" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#gradPredSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4 & 5. FOOD-WISE SALES TABLE & FOOD DETAIL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Food-wise Sales Table */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-emerald-700" /> Food-Wise Performance
              </h2>
              <p className="text-xs text-gray-500">Click any row to inspect deep-dive item telemetry</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#081c15] text-white">
                  <th className="p-3 rounded-l-xl">Food Item</th>
                  <th className="p-3">Units Sold</th>
                  <th className="p-3">Revenue (₹)</th>
                  <th className="p-3">Growth</th>
                  <th className="p-3">Demand Trend</th>
                  <th className="p-3 rounded-r-xl">AI Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {foodPerformance.map((item) => {
                  const isSelected = selectedFoodItem?.id === item.id;
                  return (
                    <tr 
                      key={item.id}
                      onClick={() => setSelectedFoodItem(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-50/80 border-l-4 border-emerald-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="p-3 font-bold text-gray-900">{item.foodItem}</td>
                      <td className="p-3 font-semibold text-gray-800">{item.unitsSold}</td>
                      <td className="p-3 font-semibold text-emerald-950">₹{item.revenue.toLocaleString()}</td>
                      <td className="p-3 font-bold text-emerald-600">{item.growth}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-gray-100 font-medium text-gray-700">
                          {item.demandTrend}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                          item.aiStatus === 'High Demand' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.aiStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Food Detail Panel */}
        {selectedFoodItem && (
          <div className="lg:col-span-5 bg-gradient-to-br from-[#081c15] to-[#1b4332] text-white p-6 rounded-3xl border border-[#d4af37]/40 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-[#1b4332] pb-3 mb-3">
                <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">Food Telemetry Inspector</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {selectedFoodItem.aiStatus}
                </span>
              </div>
              <h3 className="font-extrabold text-white text-2xl font-heading">{selectedFoodItem.foodItem}</h3>
              <p className="text-xs text-gray-300 mt-0.5">Units sold today: {selectedFoodItem.todaySales} portions</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#040d09]/80 border border-[#1b4332]">
                <span className="text-gray-400 block text-[10px]">7-DAY AVERAGE</span>
                <span className="text-base font-bold text-white">{selectedFoodItem.avg7Day} portions</span>
              </div>
              <div className="p-3 rounded-xl bg-[#040d09]/80 border border-[#1b4332]">
                <span className="text-gray-400 block text-[10px]">30-DAY AVERAGE</span>
                <span className="text-base font-bold text-white">{selectedFoodItem.avg30Day} portions</span>
              </div>
              <div className="p-3 rounded-xl bg-[#040d09]/80 border border-[#1b4332]">
                <span className="text-gray-400 block text-[10px]">EXPECTED WASTE</span>
                <span className="text-base font-bold text-emerald-400">{selectedFoodItem.wastePortions} portions</span>
              </div>
              <div className="p-3 rounded-xl bg-[#040d09]/80 border border-[#1b4332]">
                <span className="text-gray-400 block text-[10px]">PREDICTION ACCURACY</span>
                <span className="text-base font-bold text-amber-300">{selectedFoodItem.accuracy}%</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#040d09] border border-[#d4af37]/30 text-xs space-y-1">
              <span className="text-[#d4af37] font-bold block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> AI Recommendation:
              </span>
              <p className="text-gray-200 leading-relaxed font-medium">"{selectedFoodItem.recommendation}"</p>
            </div>
          </div>
        )}
      </div>

      {/* 6 & 7. PEAK SALES HOURS & DAY-OF-WEEK PATTERN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Peak Hours Chart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-700" /> Customer Demand by Hour
              </h3>
              <p className="text-xs text-gray-500">Hourly sales volume distribution throughout service</p>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Peak: 7 PM – 9 PM
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHours}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#081c15', borderRadius: '12px', border: '1px solid #d4af37', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="portions" name="Portions Sold" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-[#f4f6f0] border border-gray-200 text-xs text-gray-700 flex items-center gap-2 font-medium">
            💡 <span className="font-bold">AI Insight:</span> "Prepare additional high-demand items before 7 PM dinner rush."
          </div>
        </div>

        {/* Day-of-Week Chart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700" /> Weekly Sales Pattern
              </h3>
              <p className="text-xs text-gray-500">Sales vs demand across days of the week</p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyPattern}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#081c15', borderRadius: '12px', border: '1px solid #d4af37', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="sales" name="Actual Sales" fill="#081c15" radius={[6, 6, 0, 0]} />
                <Bar dataKey="demand" name="Predicted Demand" fill="#d4af37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium">
            💡 <span className="font-bold">AI Insight:</span> "Friday and Saturday show consistently higher demand (+22%)."
          </div>
        </div>
      </div>

      {/* 8 & 9. CSV UPLOAD CENTER & ANIMATED VALIDATION */}
      <div id="sales-csv-section" className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-700" /> Import Historical Sales CSV
          </h2>
          <p className="text-xs text-gray-500">Ingest bulk POS sales data to power SmartServe AI's feature engineering</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Drag & Drop Area */}
          <div className="lg:col-span-8">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                isDragging 
                  ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]' 
                  : 'border-gray-300 hover:border-emerald-500/60 bg-gray-50/50'
              }`}
            >
              <FileSpreadsheet className="w-10 h-10 text-emerald-700 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-800">Drop POS Sales CSV file here</p>
              <p className="text-xs text-gray-500 mt-1">or click to browse from computer</p>

              <label className="mt-4 inline-block">
                <input type="file" accept=".csv" onChange={handleFileInputChange} className="hidden" />
                <span className="bg-[#081c15] hover:bg-[#1b4332] text-white text-xs font-semibold px-4 py-2 rounded-xl border border-[#d4af37]/30 cursor-pointer inline-flex items-center gap-1.5">
                  Browse Files
                </span>
              </label>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleSampleCsvDownload}
                  className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download Sample CSV Template
                </button>
              </div>
            </div>
          </div>

          {/* Schema Requirements */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-[#f4f6f0] border border-gray-200 space-y-3 text-xs">
            <h4 className="font-bold text-gray-900">Required CSV Columns:</h4>
            <div className="flex flex-wrap gap-1.5">
              {['Date', 'Food Item', 'Quantity Sold', 'Price'].map((col, idx) => (
                <span key={idx} className="bg-white text-emerald-950 font-bold px-2.5 py-1 rounded border border-gray-300">
                  {col}
                </span>
              ))}
            </div>
            <h4 className="font-bold text-gray-900 pt-2">Optional Factors:</h4>
            <div className="flex flex-wrap gap-1.5">
              {['Day', 'Holiday', 'Weather', 'Event'].map((col, idx) => (
                <span key={idx} className="bg-white text-gray-700 font-medium px-2 py-0.5 rounded border border-gray-200 text-[10px]">
                  {col}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Validation Animation & Results */}
        {(isValidating || validationResult) && (
          <div className="p-6 rounded-2xl bg-[#081c15] text-white border border-[#1b4332] space-y-4 animate-fadeIn">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> AI CSV Validation Engine
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs text-center">
              {[
                "Reading File",
                "Checking Columns",
                "Missing Values",
                "Duplicates",
                "Validating Data"
              ].map((stepName, idx) => {
                const isDone = validationResult ? true : idx < validationProgressStep;
                return (
                  <div key={idx} className={`p-2.5 rounded-xl border ${isDone ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-gray-900 border-gray-800 text-gray-500'}`}>
                    <Check className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                    <span className="font-semibold block text-[11px]">{stepName}</span>
                  </div>
                );
              })}
            </div>

            {validationResult && (
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-800 text-xs">
                <div>
                  <span className="text-gray-400">Total: {validationResult.totalRecords.toLocaleString()} | </span>
                  <span className="text-emerald-400 font-bold">Valid: {validationResult.validRecords.toLocaleString()} | </span>
                  <span className="text-amber-400">Warnings: {validationResult.warningsCount} | </span>
                  <span className="text-red-400">Errors: {validationResult.errorsCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => showToast("CSV entries reviewed.")}
                    className="px-3 py-1.5 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 cursor-pointer"
                  >
                    Review Data
                  </button>
                  <button 
                    onClick={() => showToast("✓ Data imported into SmartServe AI training pipeline!")}
                    className="px-4 py-1.5 rounded-xl bg-[#d4af37] text-gray-950 font-bold hover:bg-amber-400 cursor-pointer shadow-md"
                  >
                    Import Data
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 11. AI SALES INSIGHTS */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" /> AI Sales Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiInsights.map((ins) => (
            <div 
              key={ins.id}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#d4af37]/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    {ins.impact} Impact
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700">Confidence: {ins.confidence}</span>
                </div>
                <p className="text-sm font-bold text-gray-900 leading-snug">
                  "{ins.text}"
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#f4f6f0] border border-gray-200 text-xs">
                <span className="font-bold text-emerald-900 block mb-0.5">Recommended Action:</span>
                <p className="text-gray-700">{ins.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 12. SALES → AI PIPELINE VISUAL FLOW */}
      <div className="bg-[#040d09] text-white p-6 md:p-8 rounded-3xl border border-[#1b4332] shadow-2xl space-y-4">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block mb-1">Architecture Pipeline</span>
          <h3 className="font-bold text-white text-xl font-heading">How Sales Data Powers AI Prediction</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-2 text-center text-xs">
          {[
            "SALES DATA",
            "PATTERN ANALYSIS",
            "FEATURE ENGINEERING",
            "AI MODEL",
            "DEMAND FORECAST",
            "PREP RECOMMENDATION"
          ].map((node, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-[#081c15] border border-[#1b4332] flex flex-col items-center justify-center space-y-1">
              <span className="w-5 h-5 rounded-full bg-[#1b4332] text-[#d4af37] font-bold text-[10px] flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="font-bold text-[10px] text-gray-200 leading-tight">{node}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 10. RECENT SALES TRANSACTIONS TABLE */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-700" /> Recent Sales Transactions Log
            </h3>
            <p className="text-xs text-gray-500">Live POS stream transactions</p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search POS log..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-emerald-600 w-44"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#081c15] text-white">
                <th className="p-3 rounded-l-xl">TX ID</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Food Item</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Revenue (₹)</th>
                <th className="p-3 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedTxs.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-mono text-gray-500">{tx.id}</td>
                  <td className="p-3 text-gray-700 font-medium">{tx.date} • {tx.time}</td>
                  <td className="p-3 font-bold text-emerald-950">{tx.foodItem}</td>
                  <td className="p-3 font-semibold text-gray-800">{tx.qty} portions</td>
                  <td className="p-3 font-bold text-amber-600">₹{tx.revenue}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
          <span>Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTxs.length)} of {filteredTxs.length} entries</span>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-100 cursor-pointer"
            >
              Prev
            </button>
            <span className="px-3 py-1 font-bold text-gray-800">{currentPage} / {totalPages || 1}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-100 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 14. MODAL: ADD SALES */}
      {isAddSalesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-700" /> Record Sales Transaction
              </h3>
              <button onClick={() => setIsAddSalesModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSalesSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Food Item</label>
                <select 
                  value={newSalesForm.foodItem}
                  onChange={(e) => setNewSalesForm({ ...newSalesForm, foodItem: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 bg-white"
                >
                  <option value="Veg Biryani">Veg Biryani</option>
                  <option value="Masala Dosa">Masala Dosa</option>
                  <option value="Paneer Curry">Paneer Curry</option>
                  <option value="Cold Coffee">Cold Coffee</option>
                  <option value="Chicken Dum Biryani">Chicken Dum Biryani</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Date</label>
                  <input 
                    type="date" 
                    value={newSalesForm.date}
                    onChange={(e) => setNewSalesForm({ ...newSalesForm, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Time</label>
                  <input 
                    type="text" 
                    value={newSalesForm.time}
                    onChange={(e) => setNewSalesForm({ ...newSalesForm, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Quantity Sold</label>
                  <input 
                    type="number" 
                    value={newSalesForm.qty}
                    onChange={(e) => setNewSalesForm({ ...newSalesForm, qty: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Selling Price (₹)</label>
                  <input 
                    type="number" 
                    value={newSalesForm.price}
                    onChange={(e) => setNewSalesForm({ ...newSalesForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddSalesModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#081c15] text-white font-bold border border-[#d4af37]/30 hover:bg-[#1b4332] shadow-md cursor-pointer"
                >
                  Save Sales
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
