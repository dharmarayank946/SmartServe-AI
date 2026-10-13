import React, { useState, useEffect } from 'react';
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
  Award,
  Lock,
  X
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
import AuthModal from '../components/AuthModal';
import { apiService } from '../services/apiService';
import { getWasteMetrics, logWasteRecord, deleteWasteRecord } from '../services/wasteService';
import { getFoodItems } from '../services/foodService';
import { isAuthenticated, getCurrentUser, logout } from '../services/api';

export default function WasteTracking({ onNavigate }) {
  // Service Data & Backend State
  const [wasteMetrics, setWasteMetrics] = useState(null);
  const [wasteLogs, setWasteLogs] = useState([]);
  const [foodItems, setFoodItems] = useState(() => apiService.getFoodItems() || []);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [backendError, setBackendError] = useState(null);

  // Static / Auxiliary Analytics
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
  const [historySearch, setHistorySearch] = useState('');
  const [historyReasonFilter, setHistoryReasonFilter] = useState('All');
  const [selectedFoodModal, setSelectedFoodModal] = useState(null);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isSubmittingWaste, setIsSubmittingWaste] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  // Toast & Notifications State
  const [successToast, setSuccessToast] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [appliedRec, setAppliedRec] = useState(false);

  // AI Assistant Chat State
  const [chatQuery, setChatQuery] = useState('');
  const [chatAnswer, setChatAnswer] = useState(null);
  const [isChatThinking, setIsChatThinking] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  // Form Validation State
  const [formErrors, setFormErrors] = useState({});

  // Record Waste Form
  const [formData, setFormData] = useState({
    itemName: 'Paneer Butter Masala',
    foodItemId: 'item-002',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    qty: '5',
    unit: 'portions',
    reason: 'Over-preparation',
    estimatedCost: '475',
    notes: 'Surplus prep during lunch service'
  });

  // Handle auth state synchronization
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setBackendError(null);
    setSuccessToast(`✓ Signed in as ${user?.name || user?.email || 'Manager'}. Synchronizing database records.`);
    loadData();
  };

  const handleSignOut = () => {
    logout();
    setCurrentUser(null);
    setWasteLogs([]);
    setBackendError('Signed out. Please sign in with your restaurant account to view live database records.');
  };

  // Fetch food items and waste metrics from backend on mount
  const loadData = async () => {
    setIsLoadingMetrics(true);
    setBackendError(null);

    // 1. Fetch Food Items
    try {
      const items = await getFoodItems();
      if (Array.isArray(items) && items.length > 0) {
        setFoodItems(items);
        setFormData(prev => ({
          ...prev,
          itemName: prev.itemName || items[0].name,
          foodItemId: prev.foodItemId || items[0].id
        }));
      }
    } catch (err) {
      console.warn("Falling back to local food items cache:", err.message);
      const fallbackItems = apiService.getFoodItems() || [];
      setFoodItems(fallbackItems);
    }

    // 2. Check Authentication before querying protected waste endpoints
    if (!isAuthenticated()) {
      setBackendError('Authentication required. Please sign in with your restaurant account to view live database records and audit history.');
      const localData = apiService.getWasteData();
      setWasteMetrics(localData);
      setWasteLogs([]);
      setIsLoadingMetrics(false);
      return;
    }

    // 3. Fetch Waste Metrics & Database Logs
    try {
      const metrics = await getWasteMetrics();
      setWasteMetrics(metrics);
      if (Array.isArray(metrics.wasteLogs)) {
        setWasteLogs(metrics.wasteLogs);
      }
    } catch (err) {
      console.error("Error fetching waste metrics from backend:", err);
      setBackendError(err.message || 'Unable to connect to backend waste service.');
      const localData = apiService.getWasteData();
      setWasteMetrics(localData);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleLoginEvent = (e) => {
      setCurrentUser(e.detail?.user || getCurrentUser());
      loadData();
    };
    const handleLogoutEvent = () => {
      setCurrentUser(null);
      setWasteLogs([]);
      setBackendError('Signed out. Please sign in to view live database records.');
    };
    const handleUnauthorizedEvent = () => {
      setCurrentUser(null);
      setBackendError('Session expired or authentication required. Please sign in to access this feature.');
    };

    window.addEventListener('auth:login', handleLoginEvent);
    window.addEventListener('auth:logout', handleLogoutEvent);
    window.addEventListener('auth:unauthorized', handleUnauthorizedEvent);

    return () => {
      window.removeEventListener('auth:login', handleLoginEvent);
      window.removeEventListener('auth:logout', handleLogoutEvent);
      window.removeEventListener('auth:unauthorized', handleUnauthorizedEvent);
    };
  }, []);

  // Update item selection and recalculate cost estimate
  const handleItemSelect = (itemName) => {
    const selected = foodItems.find(i => i.name === itemName);
    const costPerUnit = selected ? (selected.cost || 80) : 80;
    const qtyNum = Number(formData.qty) || 1;
    setFormData(prev => ({
      ...prev,
      itemName: itemName,
      foodItemId: selected ? selected.id : null,
      unit: selected?.unit || prev.unit || 'portions',
      estimatedCost: String(Math.round(costPerUnit * qtyNum))
    }));
    if (formErrors.itemName) {
      setFormErrors(prev => ({ ...prev, itemName: undefined }));
    }
  };

  // Update quantity and recalculate cost
  const handleQtyChange = (val) => {
    const qtyNum = Number(val);
    const selected = foodItems.find(i => i.name === formData.itemName);
    const costPerUnit = selected ? (selected.cost || 80) : 80;
    setFormData(prev => ({
      ...prev,
      qty: val,
      estimatedCost: (!isNaN(qtyNum) && qtyNum > 0) ? String(Math.round(costPerUnit * qtyNum)) : prev.estimatedCost
    }));
    if (formErrors.qty) {
      setFormErrors(prev => ({ ...prev, qty: undefined }));
    }
  };

  // Form Validation
  const validateWasteForm = (data) => {
    const errors = {};
    if (!data.itemName || !data.itemName.trim()) {
      errors.itemName = 'Please select a food item.';
    }
    const qtyNum = Number(data.qty);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      errors.qty = 'Quantity must be a valid positive number (> 0).';
    }
    if (!data.unit || !data.unit.trim()) {
      errors.unit = 'Please select a measurement unit.';
    }
    if (!data.reason || !data.reason.trim()) {
      errors.reason = 'Please specify a reason for waste.';
    }
    if (!data.date) {
      errors.date = 'Valid date is required.';
    }
    if (!data.time) {
      errors.time = 'Valid time is required.';
    }
    return errors;
  };

  // Submission handler
  const handleRecordWasteSubmit = async (e) => {
    e.preventDefault();
    const errors = validateWasteForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setErrorMessage('Please address the highlighted form fields before submitting.');
      return;
    }

    if (!isAuthenticated()) {
      setErrorMessage('Authentication required. Please sign in with your restaurant account to record waste entries.');
      setIsAuthModalOpen(true);
      return;
    }

    setFormErrors({});
    setIsSubmittingWaste(true);
    setErrorMessage('');

    const qtyNum = Number(formData.qty);
    const costNum = Number(formData.estimatedCost) || 0;

    try {
      // Log to backend API and database
      await logWasteRecord({
        foodItemId: formData.foodItemId,
        itemName: formData.itemName,
        quantity: qtyNum,
        unit: formData.unit,
        reason: formData.reason,
        financialLoss: costNum,
        date: formData.date,
        time: formData.time || '14:30',
        notes: formData.notes
      });

      // Also sync to local state
      apiService.recordWasteEntry({
        itemName: formData.itemName,
        qty: qtyNum,
        unit: formData.unit,
        financialLoss: costNum,
        reason: formData.reason,
        date: formData.date
      });

      // Reload real telemetry from backend
      const updatedMetrics = await getWasteMetrics();
      setWasteMetrics(updatedMetrics);
      if (Array.isArray(updatedMetrics.wasteLogs)) {
        setWasteLogs(updatedMetrics.wasteLogs);
      }

      setIsRecordModalOpen(false);
      setSuccessToast(`✓ Waste record of ${qtyNum} ${formData.unit} for "${formData.itemName}" saved to database successfully!`);

      // Reset form to clean default
      setFormData({
        itemName: foodItems[0]?.name || 'Paneer Butter Masala',
        foodItemId: foodItems[0]?.id || 'item-002',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        qty: '1',
        unit: foodItems[0]?.unit || 'portions',
        reason: 'Over-preparation',
        estimatedCost: String(foodItems[0]?.cost || '85'),
        notes: ''
      });
    } catch (err) {
      console.error('Failed to save waste record:', err);
      if (err.message && (err.message.includes('Session expired') || err.message.includes('authentication required') || err.message.includes('401'))) {
        setIsAuthModalOpen(true);
      }
      setErrorMessage(`❌ Failed to record waste: ${err.message || 'Server error'}`);
    } finally {
      setIsSubmittingWaste(false);
      setTimeout(() => setSuccessToast(''), 5000);
    }
  };

  // Delete a waste log entry with backend confirmation
  const handleDeleteWasteLog = async (logId, itemName) => {
    if (!isAuthenticated()) {
      setErrorMessage('Authentication required. Please sign in to remove waste audit records.');
      setIsAuthModalOpen(true);
      return;
    }

    if (!window.confirm(`Are you sure you want to remove the waste audit record for "${itemName}"?`)) {
      return;
    }
    setDeletingId(logId);
    try {
      await deleteWasteRecord(logId);
      const updatedMetrics = await getWasteMetrics();
      setWasteMetrics(updatedMetrics);
      if (Array.isArray(updatedMetrics.wasteLogs)) {
        setWasteLogs(updatedMetrics.wasteLogs);
      }
      setSuccessToast(`✓ Waste entry for "${itemName}" removed successfully.`);
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err) {
      console.error('Failed to delete waste log:', err);
      if (err.message && (err.message.includes('Session expired') || err.message.includes('authentication required') || err.message.includes('401'))) {
        setIsAuthModalOpen(true);
      }
      setErrorMessage(`❌ Failed to delete waste entry: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
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

  // Top 5 Highest Waste Foods: prioritize backend data if available
  const topWasteFoods = (wasteMetrics?.mostWastedItems && wasteMetrics.mostWastedItems.length > 0)
    ? wasteMetrics.mostWastedItems.map((item, idx) => ({
        name: item.name,
        qty: item.wastedQty || item.qty || 0,
        cost: item.financialLoss || item.loss || 0,
        risk: idx === 0 ? 'HIGH' : idx < 3 ? 'MEDIUM' : 'LOW',
        color: idx === 0 ? "bg-[#1b4332]" : idx === 1 ? "bg-[#2d6a4f]" : idx === 2 ? "bg-[#d4af37]" : "bg-orange-500",
        progress: Math.max(25, 90 - idx * 15),
        aiNote: `${item.name} accumulated ${item.wastedQty || item.qty} ${item.unit || 'portions'} in waste audit logs.`
      }))
    : [
        { name: "Paneer Curry", qty: 18, cost: 540, risk: "HIGH", color: "bg-[#1b4332]", progress: 85, aiNote: "Over-prepared weekday lunch batch by 18 portions." },
        { name: "Veg Biryani", qty: 12, cost: 420, risk: "MEDIUM", color: "bg-[#2d6a4f]", progress: 60, aiNote: "Night dinner shift overflow buffer." },
        { name: "Cold Coffee", qty: 10, cost: 350, risk: "MEDIUM", color: "bg-[#d4af37]", progress: 50, aiNote: "Rainy afternoon reduced cold beverage demand." },
        { name: "Fresh Garden Salad", qty: 8, cost: 240, risk: "HIGH", color: "bg-orange-500", progress: 40, aiNote: "High perishability on Monday salad batching." },
        { name: "Garlic Naan", qty: 6, cost: 180, risk: "LOW", color: "bg-[#10b981]", progress: 25, aiNote: "Unclaimed dinner side orders." }
      ];

  // Root Cause Breakdown: prioritize backend breakdown if available
  const rootCauses = (wasteMetrics?.wasteByReason && wasteMetrics.wasteByReason.length > 0)
    ? wasteMetrics.wasteByReason.map(item => ({
        cause: item.reason,
        percentage: item.percentage,
        color: item.color || "#6b7280",
        barWidth: `${Math.min(100, item.percentage * 2)}%`
      }))
    : [
        { cause: "Over-preparation", percentage: 46, color: "#ef4444", barWidth: "92%" },
        { cause: "Demand Prediction Error", percentage: 27, color: "#f97316", barWidth: "54%" },
        { cause: "Low Customer Demand", percentage: 16, color: "#eab308", barWidth: "32%" },
        { cause: "Kitchen Variance", percentage: 11, color: "#3b82f6", barWidth: "22%" }
      ];

  // Dynamic Metrics values
  const todayWasteDisplay = wasteMetrics?.todayWasteKg !== undefined ? wasteMetrics.todayWasteKg : 49;
  const weeklyWasteDisplay = wasteMetrics?.monthlyWasteKg !== undefined ? wasteMetrics.monthlyWasteKg : 286;
  const financialLossDisplay = wasteMetrics?.financialLoss || "₹7,420";

  // Filtered waste logs for history table
  const filteredWasteLogs = wasteLogs.filter(log => {
    const matchesSearch = !historySearch || 
      log.item_name.toLowerCase().includes(historySearch.toLowerCase()) ||
      (log.notes && log.notes.toLowerCase().includes(historySearch.toLowerCase()));
    const matchesReason = historyReasonFilter === 'All' || log.reason === historyReasonFilter;
    return matchesSearch && matchesReason;
  });

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

  const getReasonBadgeClass = (reason) => {
    switch (reason) {
      case 'Over-preparation':
        return 'bg-red-100 text-red-900 border-red-200';
      case 'Spoilage':
      case 'Ingredient Spoilage':
        return 'bg-orange-100 text-orange-900 border-orange-200';
      case 'Low Demand':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'Cooking Error':
      case 'Preparation Error':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'Customer Return':
      case 'Plate Unconsumed':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
              "AI-powered insights to reduce unnecessary preparation, save costs, and eliminate kitchen waste."
            </p>
          </div>

          {/* Hero Sustainability Highlight Card */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/15 text-center lg:text-right shrink-0 space-y-2 shadow-inner">
            <span className="text-xs text-gray-300 font-bold uppercase tracking-wider block">Potential Waste Reduction</span>
            <p className="text-4xl md:text-5xl font-extrabold font-heading text-[#d4af37] tracking-tight">
              23%
            </p>
            <p className="text-[11px] text-gray-300 max-w-xs">
              "Based on recent preparation, sales and waste patterns."
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 pt-1">
              {currentUser ? (
                <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-emerald-500/40 text-[11px] text-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="truncate max-w-[130px] font-semibold">{currentUser.name || currentUser.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="ml-1 text-[#d4af37] hover:text-amber-300 underline font-bold cursor-pointer"
                    title="Sign out of restaurant account"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#d4af37] text-xs font-bold border border-[#d4af37]/40 transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" /> Staff Sign In
                </button>
              )}
              <button
                id="record-waste-hero-btn"
                onClick={() => setIsRecordModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Record Waste Entry
              </button>
              <button
                onClick={() => document.getElementById('waste-form-panel')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer"
                title="Scroll down to inline waste logging form"
              >
                Jump to Form ↓
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recoverable Backend Error Banner */}
      {backendError && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 font-medium text-xs md:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              <strong>Backend Notice:</strong> {backendError}
            </span>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {(!currentUser || backendError.toLowerCase().includes('sign in') || backendError.toLowerCase().includes('authentication') || backendError.toLowerCase().includes('session')) && (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-[#d4af37]" /> Sign In
              </button>
            )}
            <button 
              onClick={loadData}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Connection
            </button>
          </div>
        </div>
      )}

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

      {/* General Error Message Toast */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-600 text-white font-bold text-xs md:text-sm flex items-center justify-between gap-3 animate-fade-in shadow-xl border border-red-400/40">
          <div className="flex items-center gap-2.5">
            <AlertOctagon className="w-5 h-5 text-red-200 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-white/80 hover:text-white text-xs underline cursor-pointer">
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
            <AnimatedCounter value={Number(todayWasteDisplay) || 0} suffix=" portions" />
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
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Weekly / Monthly Waste</span>
          <p className="text-3xl font-extrabold font-heading text-amber-800 tracking-tight">
            <AnimatedCounter value={Number(weeklyWasteDisplay) || 0} suffix=" portions" />
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
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Waste Financial Loss</span>
          <p className="text-3xl font-extrabold font-heading text-red-600 tracking-tight">
            {typeof financialLossDisplay === 'string' && financialLossDisplay.startsWith('₹') 
              ? financialLossDisplay 
              : `₹${financialLossDisplay}`}
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
              <p className="text-xs text-gray-500">Items driving preparation and storage losses</p>
            </div>
            <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
              Telemetry Audit
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
              "Over-preparation accounts for the majority of recorded food waste. Dynamic batch sizes reduce this risk significantly."
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
            💡 <strong>AI Insight:</strong> "Demand prediction aligns actual consumption with kitchen prep directly, reducing landfill waste."
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
          10. WASTE RECORDING FORM (Clean Form Panel)
      -------------------------------------------------- */}
      <div id="waste-form-panel" className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-2">
          <div>
            <h3 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#1b4332]" /> Add Waste Record
            </h3>
            <p className="text-xs text-gray-500 font-medium">Log food waste to synchronize real-time analytics and optimize prep algorithms</p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            Direct Database Sync
          </span>
        </div>

        <form onSubmit={handleRecordWasteSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Food Item */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Food Item <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.itemName}
              onChange={(e) => handleItemSelect(e.target.value)}
              className={`w-full bg-[#f4f6f0] border rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] ${
                formErrors.itemName ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
              }`}
            >
              {(foodItems || []).map(i => (
                <option key={i.id || i.name} value={i.name}>
                  {i.name} ({i.category || 'Kitchen'})
                </option>
              ))}
            </select>
            {formErrors.itemName && (
              <p className="text-[11px] text-red-600 font-semibold mt-1">{formErrors.itemName}</p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0.1"
              step="any"
              value={formData.qty}
              onChange={(e) => handleQtyChange(e.target.value)}
              placeholder="e.g. 5"
              className={`w-full bg-[#f4f6f0] border rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] ${
                formErrors.qty ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
              }`}
            />
            {formErrors.qty && (
              <p className="text-[11px] text-red-600 font-semibold mt-1">{formErrors.qty}</p>
            )}
          </div>

          {/* Unit */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Unit <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className={`w-full bg-[#f4f6f0] border rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] ${
                formErrors.unit ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
              }`}
            >
              <option value="portions">portions</option>
              <option value="plates">plates</option>
              <option value="kg">kg</option>
              <option value="liters">liters</option>
              <option value="bowls">bowls</option>
            </select>
            {formErrors.unit && (
              <p className="text-[11px] text-red-600 font-semibold mt-1">{formErrors.unit}</p>
            )}
          </div>

          {/* Reason for Waste */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Reason for Waste <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className={`w-full bg-[#f4f6f0] border rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] ${
                formErrors.reason ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
              }`}
            >
              <option value="Over-preparation">Over-preparation</option>
              <option value="Spoilage">Spoilage</option>
              <option value="Low Demand">Low Demand</option>
              <option value="Cooking Error">Cooking Error</option>
              <option value="Customer Return">Customer Return</option>
              <option value="Other">Other</option>
            </select>
            {formErrors.reason && (
              <p className="text-[11px] text-red-600 font-semibold mt-1">{formErrors.reason}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full bg-[#f4f6f0] border rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] ${
                formErrors.date ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
              }`}
            />
            {formErrors.date && (
              <p className="text-[11px] text-red-600 font-semibold mt-1">{formErrors.date}</p>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className={`w-full bg-[#f4f6f0] border rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] ${
                formErrors.time ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
              }`}
            />
            {formErrors.time && (
              <p className="text-[11px] text-red-600 font-semibold mt-1">{formErrors.time}</p>
            )}
          </div>

          {/* Estimated Cost Loss */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">Estimated Cost Loss (₹)</label>
            <input
              type="number"
              min="0"
              step="any"
              value={formData.estimatedCost}
              onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
              className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            />
          </div>

          {/* Kitchen Notes */}
          <div className="md:col-span-2">
            <label className="block font-bold text-gray-700 mb-1">Kitchen Notes (Optional)</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Shift details, incident note, or reason..."
              className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            />
          </div>

          {/* Actions */}
          <div className="md:col-span-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
            {!currentUser ? (
              <span className="text-xs text-amber-800 font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" /> Sign in required to save entries to the database
              </span>
            ) : (
              <span className="text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Authenticated as {currentUser.name || currentUser.email}
              </span>
            )}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormErrors({});
                  setFormData({
                    itemName: foodItems[0]?.name || 'Paneer Butter Masala',
                    foodItemId: foodItems[0]?.id || 'item-002',
                    date: new Date().toISOString().split('T')[0],
                    time: new Date().toTimeString().slice(0, 5),
                    qty: '1',
                    unit: foodItems[0]?.unit || 'portions',
                    reason: 'Over-preparation',
                    estimatedCost: String(foodItems[0]?.cost || '85'),
                    notes: ''
                  });
                }}
                className="px-4 py-2.5 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 cursor-pointer transition-all"
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={isSubmittingWaste}
                className="px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" /> {isSubmittingWaste ? 'Saving to Database...' : 'Record Waste'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* --------------------------------------------------
          11. PERSISTED WASTE AUDIT RECORDS TABLE & HISTORY
      -------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 gap-4">
          <div>
            <h3 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#1b4332]" /> Waste Audit Records & History
            </h3>
            <p className="text-xs text-gray-500 font-medium">Live synchronized database logs of verified kitchen food waste entries</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search food item or notes..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#f4f6f0] border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] w-48 sm:w-60"
              />
            </div>

            {/* Filter by Reason */}
            <select
              value={historyReasonFilter}
              onChange={(e) => setHistoryReasonFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#f4f6f0] border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            >
              <option value="All">All Reasons</option>
              <option value="Over-preparation">Over-preparation</option>
              <option value="Spoilage">Spoilage</option>
              <option value="Low Demand">Low Demand</option>
              <option value="Cooking Error">Cooking Error</option>
              <option value="Customer Return">Customer Return</option>
              <option value="Other">Other</option>
            </select>

            {/* Refresh from Backend Button */}
            <button
              onClick={loadData}
              disabled={isLoadingMetrics}
              className="p-2 rounded-xl bg-[#f4f6f0] hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer border border-gray-200"
              title="Refresh records from database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMetrics ? 'animate-spin text-[#1b4332]' : ''}`} />
            </button>
          </div>
        </div>

        {/* History Table Container */}
        <div className="overflow-x-auto">
          {isLoadingMetrics && wasteLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500 font-medium flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#1b4332]" />
              Fetching waste audit records from database...
            </div>
          ) : !currentUser ? (
            <div className="p-8 text-center rounded-2xl bg-[#f4f6f0] border border-gray-200 space-y-3">
              <Lock className="w-8 h-8 text-[#1b4332] mx-auto opacity-70" />
              <p className="text-sm font-bold text-gray-800">Staff Authentication Required</p>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Sign in with your restaurant account to view live database waste logs, track verified audits, and manage recorded entries.
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-[#d4af37]" /> Sign In to View Records
              </button>
            </div>
          ) : filteredWasteLogs.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#f4f6f0] border border-gray-200 space-y-2">
              <Trash2 className="w-8 h-8 text-gray-400 mx-auto opacity-70" />
              <p className="text-sm font-bold text-gray-800">No waste audit records found</p>
              <p className="text-xs text-gray-500">
                {historySearch || historyReasonFilter !== 'All' 
                  ? "No entries match your search criteria. Try clearing the filter."
                  : "Use the form above or the 'Record Waste Entry' button to add your first entry."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Food Item</th>
                  <th className="py-3 px-3">Wasted Quantity</th>
                  <th className="py-3 px-3">Reason</th>
                  <th className="py-3 px-3">Cost Loss</th>
                  <th className="py-3 px-3">Kitchen Notes</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filteredWasteLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#f4f6f0]/70 transition-colors group">
                    <td className="py-3.5 px-3 font-mono text-[11px] text-gray-600 whitespace-nowrap">
                      <div className="font-bold text-gray-900">{log.date}</div>
                      <div className="text-[10px] text-gray-400">{log.time || '12:00'}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-gray-900 font-heading text-sm">{log.item_name}</div>
                      {log.food_item_id && (
                        <div className="text-[10px] font-mono text-emerald-700">ID: {log.food_item_id}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-red-600 whitespace-nowrap">
                      {log.quantity} <span className="text-[11px] text-gray-500 font-normal">{log.unit}</span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getReasonBadgeClass(log.reason)}`}>
                        {log.reason}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-extrabold text-gray-900 whitespace-nowrap">
                      ₹{log.financial_loss}
                    </td>
                    <td className="py-3.5 px-3 max-w-xs truncate text-gray-500 text-[11px]" title={log.notes}>
                      {log.notes || '—'}
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteWasteLog(log.id, log.item_name)}
                        disabled={deletingId === log.id}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete waste entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
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

      {/* Record Waste Entry Modal (Bug 1 & Bug 2 Fix) */}
      {isRecordModalOpen && (
        <Modal
          isOpen={isRecordModalOpen}
          onClose={() => {
            setIsRecordModalOpen(false);
            setFormErrors({});
          }}
          title="Record Food Waste Entry"
        >
          <form onSubmit={handleRecordWasteSubmit} className="space-y-4 text-xs">
            <div className="bg-[#081c15] text-white p-3.5 rounded-2xl border border-[#1b4332] space-y-1">
              <span className="text-[10px] text-[#d4af37] uppercase font-bold tracking-wider">Kitchen Telemetry Audit</span>
              <p className="text-gray-300 font-medium leading-relaxed">
                Log verified food waste to synchronize real-time analytics and optimize prep algorithms.
              </p>
            </div>

            {/* Food Item Field */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Food Item <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.itemName}
                onChange={(e) => handleItemSelect(e.target.value)}
                className={`w-full bg-[#f4f6f0] border rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] ${
                  formErrors.itemName ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                }`}
              >
                {(foodItems || []).map(i => (
                  <option key={i.id || i.name} value={i.name}>
                    {i.name} ({i.category || 'Kitchen'})
                  </option>
                ))}
              </select>
              {formErrors.itemName && (
                <p className="text-[11px] text-red-600 font-semibold mt-1">{formErrors.itemName}</p>
              )}
            </div>

            {/* Quantity and Unit Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={formData.qty}
                  onChange={(e) => handleQtyChange(e.target.value)}
                  placeholder="e.g. 5"
                  className={`w-full bg-[#f4f6f0] border rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] ${
                    formErrors.qty ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                  }`}
                />
                {formErrors.qty && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">{formErrors.qty}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Unit <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className={`w-full bg-[#f4f6f0] border rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] ${
                    formErrors.unit ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                  }`}
                >
                  <option value="portions">portions</option>
                  <option value="plates">plates</option>
                  <option value="kg">kg</option>
                  <option value="liters">liters</option>
                  <option value="bowls">bowls</option>
                </select>
                {formErrors.unit && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">{formErrors.unit}</p>
                )}
              </div>
            </div>

            {/* Reason for Waste */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Reason for Waste <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className={`w-full bg-[#f4f6f0] border rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] ${
                  formErrors.reason ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                }`}
              >
                <option value="Over-preparation">Over-preparation</option>
                <option value="Spoilage">Spoilage</option>
                <option value="Low Demand">Low Demand</option>
                <option value="Cooking Error">Cooking Error</option>
                <option value="Customer Return">Customer Return</option>
                <option value="Other">Other</option>
              </select>
              {formErrors.reason && (
                <p className="text-[11px] text-red-600 font-semibold mt-1">{formErrors.reason}</p>
              )}
            </div>

            {/* Date and Time Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full bg-[#f4f6f0] border rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] ${
                    formErrors.date ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                  }`}
                />
                {formErrors.date && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">{formErrors.date}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className={`w-full bg-[#f4f6f0] border rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332] ${
                    formErrors.time ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                  }`}
                />
                {formErrors.time && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">{formErrors.time}</p>
                )}
              </div>
            </div>

            {/* Estimated Cost Loss */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Estimated Cost Loss (₹)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              />
            </div>

            {/* Kitchen Notes */}
            <div>
              <label className="block font-bold text-gray-700 mb-1">Kitchen Notes (Optional)</label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Details about batch, reason, or shift incident..."
                className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl px-3.5 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setIsRecordModalOpen(false);
                  setFormErrors({});
                }}
                className="px-4 py-2 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingWaste}
                className="px-5 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-extrabold shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" /> {isSubmittingWaste ? 'Saving...' : 'Save Waste Entry'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Staff Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMessage="Staff authentication is required to access protected waste-management database records."
      />

    </div>
  );
}
