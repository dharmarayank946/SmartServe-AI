import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { 
  Bell, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Search, 
  Check, 
  X, 
  Zap, 
  TrendingUp, 
  CloudRain, 
  Trash2, 
  ShieldAlert, 
  Database, 
  ChefHat, 
  RefreshCw, 
  Sliders, 
  ArrowRight, 
  Info,
  ChevronRight
} from 'lucide-react';

export default function NotificationsAlerts({ onNavigate }) {
  // Page State
  const [summaryMetrics, setSummaryMetrics] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [selectedFilterTab, setSelectedFilterTab] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('Newest');

  // Detail Panel / Modal State
  const [selectedNotifDetail, setSelectedNotifDetail] = useState(null);

  // Real-time AI & Activity Stream & History
  const [aiDetectedAlert, setAiDetectedAlert] = useState(null);
  const [activityTimeline, setActivityTimeline] = useState([]);
  const [alertHistory, setAlertHistory] = useState([]);
  const [todayBriefing, setTodayBriefing] = useState(null);

  // Compact Preferences State
  const [preferences, setPreferences] = useState({
    demandAlerts: true,
    wasteAlerts: true,
    shortageAlerts: true,
    weatherAlerts: true,
    dailyBriefing: true,
    predictionUpdates: true,
    channels: { dashboard: true, email: true, browser: true }
  });

  // Action Status Feedback
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    loadNotificationsData();
  }, [selectedFilterTab, selectedCategory, sortOrder]);

  const loadNotificationsData = () => {
    const summary = apiService.getNotificationsSummaryMetrics();
    setSummaryMetrics(summary);

    const list = apiService.getNotificationsList();
    setNotifications(list);

    const aiAlert = apiService.getRealtimeAiDetectedAlert();
    setAiDetectedAlert(aiAlert);

    const timeline = apiService.getNotificationActivityTimeline();
    setActivityTimeline(timeline);

    const history = apiService.getAlertHistoryData();
    setAlertHistory(history);

    const briefing = apiService.getTodayAiBriefingSummary();
    setTodayBriefing(briefing);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
    setSummaryMetrics(prev => ({ ...prev, unread: 0 }));
    showToast("✓ All notifications marked as read!");
  };

  const handleAction = (id, actionName) => {
    if (actionName === 'Dismiss') {
      setNotifications(prev => prev.filter(n => n.id !== id));
      showToast("Notification dismissed");
      if (selectedNotifDetail?.id === id) setSelectedNotifDetail(null);
      return;
    }

    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isUnread: false } : n));
    showToast(`✓ Action completed: "${actionName}" applied!`);
    if (selectedNotifDetail?.id === id) setSelectedNotifDetail(null);
  };

  // Filter & Search Logic
  const filteredNotifications = notifications.filter(n => {
    // Filter Tab (All, Unread, Critical, AI Insights, Operations)
    if (selectedFilterTab === 'Unread' && !n.isUnread) return false;
    if (selectedFilterTab === 'Critical' && !n.isCritical) return false;
    if (selectedFilterTab === 'AI Insights' && n.category !== 'AI') return false;
    if (selectedFilterTab === 'Operations' && (n.category === 'AI' || n.category === 'System')) return false;

    // Category Pill Filter
    if (selectedCategory !== 'All' && n.category !== selectedCategory) return false;

    // Search Query
    if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) && !n.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

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
              <Bell className="w-3.5 h-3.5 text-emerald-400" /> Operational Alert System
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading text-white">
              Notifications & Alerts
            </h1>
            <p className="text-gray-300 text-sm md:text-base mt-1 max-w-2xl">
              Important events, AI insights and operational alerts in one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkAllRead}
              className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-xs px-4 py-2.5 rounded-2xl border border-emerald-500/30 shadow-md flex items-center gap-2 cursor-pointer transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Mark All as Read
            </button>
          </div>
        </div>

        {/* Header Tabs (All, Unread, Critical, AI Insights, Operations) */}
        <div className="flex items-center gap-2 pt-6 border-t border-[#1b4332] overflow-x-auto text-xs font-semibold relative z-10">
          {['All', 'Unread', 'Critical', 'AI Insights', 'Operations'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedFilterTab(tab)}
              className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedFilterTab === tab 
                  ? 'bg-[#d4af37] text-gray-950 font-bold shadow-sm' 
                  : 'text-gray-300 hover:text-white hover:bg-[#1b4332]/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 2. ALERT SUMMARY (4 CLEAN METRICS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Unread Alerts</span>
            <span className="text-2xl font-extrabold text-gray-900">{summaryMetrics?.unread || 0}</span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Critical Alerts</span>
            <span className="text-2xl font-extrabold text-red-600">{summaryMetrics?.critical || 0}</span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase block">AI Insights</span>
            <span className="text-2xl font-extrabold text-emerald-800">{summaryMetrics?.aiInsights || 0}</span>
          </div>
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Resolved</span>
            <span className="text-2xl font-extrabold text-gray-600">{summaryMetrics?.resolved || 0}</span>
          </div>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
      </div>

      {/* 3. PRIORITY ALERTS */}
      <div className="bg-gradient-to-r from-red-950/90 via-[#081c15] to-[#1b4332] text-white p-6 rounded-3xl border border-red-500/40 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400 bg-red-500/20 px-3 py-1 rounded-full border border-red-500/40 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> HIGH PRIORITY ALERT
          </span>
          <span className="text-xs font-mono text-gray-400">10 mins ago</span>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white font-heading">
            Masala Dosa demand may exceed current preparation by 11 portions.
          </h2>
          <p className="text-xs text-gray-300 mt-1">
            Reason: Evening demand is increasing during dinner peak shift.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#040d09]/80 border border-emerald-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-emerald-300 font-semibold">
            Recommended Action: Prepare additional 15 portions before 7:00 PM.
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate && onNavigate('prediction')}
              className="px-3.5 py-1.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold border border-emerald-500/30 cursor-pointer"
            >
              View Prediction
            </button>
            <button
              onClick={() => handleAction('notif-1', 'Take Action')}
              className="px-4 py-1.5 rounded-xl bg-[#d4af37] text-gray-950 text-xs font-extrabold hover:bg-amber-400 cursor-pointer shadow-md"
            >
              Take Action
            </button>
          </div>
        </div>
      </div>

      {/* 5. REAL-TIME AI ALERT ("SmartServe AI Detected") */}
      <div className="bg-[#040d09] text-white p-6 rounded-3xl border border-[#1b4332] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4332] text-amber-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> SmartServe AI Detected
            </div>
            <h3 className="text-lg font-bold font-heading text-white">
              {aiDetectedAlert?.title}
            </h3>
            <p className="text-xs text-gray-300 mt-0.5">
              Recommendation: {aiDetectedAlert?.recommendation}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="bg-[#081c15] px-3 py-1.5 rounded-xl border border-[#1b4332] text-center">
              <span className="text-gray-400 text-[10px] block">EXPECTED SURGE</span>
              <span className="font-extrabold text-amber-300">{aiDetectedAlert?.expectedIncrease}</span>
            </div>
            <div className="bg-[#081c15] px-3 py-1.5 rounded-xl border border-[#1b4332] text-center">
              <span className="text-gray-400 text-[10px] block">CONFIDENCE</span>
              <span className="font-extrabold text-emerald-400">{aiDetectedAlert?.confidence}</span>
            </div>
            <button
              onClick={() => handleAction('notif-3', 'Apply Recommendation')}
              className="px-4 py-2 rounded-xl bg-[#d4af37] text-gray-950 font-bold hover:bg-amber-400 cursor-pointer shadow-md"
            >
              Apply Recommendation
            </button>
          </div>
        </div>
      </div>

      {/* 7 & 4 & 8. NOTIFICATION LIST & FILTERS & DETAIL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Notification Feed */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Search notifications..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-emerald-600"
              />
            </div>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-[#f4f6f0] border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold"
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="Highest Priority">Highest Priority</option>
            </select>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['All', 'Preparation', 'Waste', 'AI', 'Weather', 'System'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl font-semibold cursor-pointer whitespace-nowrap transition-all ${
                  selectedCategory === cat ? 'bg-[#081c15] text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Notification List */}
          {filteredNotifications.length === 0 ? (
            /* 14. EMPTY STATE */
            <div className="p-8 text-center space-y-3 bg-[#f4f6f0] rounded-2xl border border-gray-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-gray-900 text-sm">You're all caught up!</h4>
              <p className="text-xs text-gray-500">SmartServe AI has no new unread alerts for your restaurant.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notif) => {
                const isSelected = selectedNotifDetail?.id === notif.id;

                return (
                  <div
                    key={notif.id}
                    onClick={() => setSelectedNotifDetail(notif)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected 
                        ? 'bg-emerald-50 border-emerald-500 shadow-md' 
                        : notif.isUnread 
                          ? 'bg-white border-gray-300 font-semibold' 
                          : 'bg-gray-50/60 border-gray-200 opacity-90'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {notif.isUnread && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />}
                        <span className="font-extrabold text-gray-900">{notif.type}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          notif.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {notif.priority}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">{notif.time}</span>
                    </div>

                    <h4 className="font-bold text-gray-900 text-xs leading-snug">{notif.title}</h4>
                    <p className="text-[11px] text-gray-600 line-clamp-2">{notif.description}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Notification Detail Panel */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 sticky top-6">
          {selectedNotifDetail ? (
            <div className="space-y-4 text-xs animate-fadeIn">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="font-bold text-emerald-800 uppercase tracking-wider">{selectedNotifDetail.type} Telemetry</span>
                <button onClick={() => setSelectedNotifDetail(null)} className="text-gray-400 hover:text-gray-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-bold text-gray-900 text-base leading-tight">{selectedNotifDetail.title}</h3>
              <p className="text-gray-600">{selectedNotifDetail.description}</p>

              <div className="p-3.5 rounded-2xl bg-[#f4f6f0] border border-gray-200 space-y-2">
                <div>
                  <span className="font-bold text-gray-900 block">Why it matters?</span>
                  <p className="text-gray-700 text-[11px] mt-0.5">{selectedNotifDetail.whyItMatters}</p>
                </div>
                <div>
                  <span className="font-bold text-gray-900 block">AI Analysis & Model Confidence</span>
                  <p className="text-gray-700 text-[11px] mt-0.5">{selectedNotifDetail.aiAnalysis}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#081c15] text-white border border-[#1b4332] space-y-1">
                <span className="text-amber-300 font-bold block">Recommended Action:</span>
                <p className="text-gray-200">{selectedNotifDetail.recommendation}</p>
                <p className="text-emerald-400 font-semibold text-[10px] mt-1">Impact: {selectedNotifDetail.impact}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                {selectedNotifDetail.actions.map((act, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAction(selectedNotifDetail.id, act)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-2xs ${
                      act === 'Take Action' || act === 'Apply Recommendation'
                        ? 'bg-[#081c15] text-white hover:bg-[#1b4332]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400 space-y-2">
              <Info className="w-8 h-8 mx-auto text-gray-300" />
              <p className="text-xs font-semibold">Select any alert from the list to view full AI analysis & details</p>
            </div>
          )}
        </div>
      </div>

      {/* 6. LIVE ACTIVITY FEED TIMELINE */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-700" /> Real-Time Activity Feed Stream
        </h3>

        <div className="space-y-3">
          {activityTimeline.map((item, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-[#f4f6f0] border border-gray-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  item.type === 'warning' ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
                }`}>
                  {item.icon}
                </span>
                <span className="font-semibold text-gray-800">{item.text}</span>
              </div>
              <span className="font-mono text-gray-400 text-[10px]">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 11 & 12. TODAY'S AI BRIEFING & COMPACT NOTIFICATION PREFERENCES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's AI Briefing */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#081c15] to-[#1b4332] text-white p-6 rounded-3xl border border-[#d4af37]/40 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4332] text-amber-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Executive AI Briefing
            </div>
            <h3 className="font-bold text-white text-lg">Today's Executive AI Briefing</h3>
            <p className="text-xs text-gray-300 mt-1">{todayBriefing?.countText}</p>

            <div className="space-y-2 pt-3">
              {todayBriefing?.bullets.map((b, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#040d09]/80 border border-emerald-500/20 text-xs text-gray-200 font-medium">
                  {idx + 1}. {b}
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => showToast("Opening Full AI Executive Briefing")}
            className="w-full py-2.5 rounded-xl bg-[#d4af37] text-gray-950 font-bold text-xs hover:bg-amber-400 cursor-pointer shadow-md text-center"
          >
            View Full Briefing
          </button>
        </div>

        {/* Compact Notification Preferences */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-700" /> Notification Alert Preferences
          </h3>

          <div className="space-y-2 text-xs">
            {[
              { key: 'demandAlerts', label: 'Demand Spike Alerts' },
              { key: 'wasteAlerts', label: 'Waste Risk Alerts' },
              { key: 'shortageAlerts', label: 'Shortage Risk Alerts' },
              { key: 'weatherAlerts', label: 'Weather Impact Alerts' },
              { key: 'dailyBriefing', label: 'Daily AI Briefing' },
              { key: 'predictionUpdates', label: 'Prediction Model Updates' }
            ].map((pref) => (
              <div key={pref.key} className="p-2.5 rounded-xl bg-[#f4f6f0] border border-gray-200 flex items-center justify-between">
                <span className="font-semibold text-gray-800">{pref.label}</span>
                <input 
                  type="checkbox" 
                  checked={preferences[pref.key]}
                  onChange={(e) => {
                    setPreferences({ ...preferences, [pref.key]: e.target.checked });
                    showToast("Alert preference updated");
                  }}
                  className="w-4 h-4 accent-emerald-700 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 10. ALERT HISTORY TABLE */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-700" /> Alert History Log
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#081c15] text-white">
                <th className="p-3 rounded-l-xl">Date</th>
                <th className="p-3">Alert Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3 rounded-r-xl">Action Taken</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alertHistory.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-semibold text-gray-800">{row.date}</td>
                  <td className="p-3 font-bold text-gray-900">{row.alert}</td>
                  <td className="p-3 text-gray-600">{row.category}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${row.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'}`}>
                      {row.priority}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-emerald-800">{row.status}</td>
                  <td className="p-3 text-gray-600">{row.actionTaken}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
