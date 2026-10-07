import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Calendar, 
  User, 
  Cpu, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Utensils,
  TrendingUp,
  FileText,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { apiService } from '../services/apiService';

export default function Navbar({ activeTab, onSearchChange, searchTerm, setActiveTab }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [testingApi, setTestingApi] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const config = apiService.getConfig();
  const insights = apiService.getAiInsights();
  const foodItems = apiService.getFoodItems();

  const handleTestApi = async () => {
    setTestingApi(true);
    const res = await apiService.testFastApiConnection();
    setApiResult(res);
    setTestingApi(false);
    setTimeout(() => setApiResult(null), 4000);
  };

  const pageInfoMap = {
    landing: { title: 'SmartServe AI Platform', subtitle: 'Real-time AI Restaurant Intelligence System' },
    controlroom: { title: 'AI Control Room', subtitle: 'Live Operational Monitoring & Digital Twin' },
    dashboard: { title: 'Executive Dashboard', subtitle: 'Real-time Restaurant Performance & AI Overview' },
    network: { title: 'Restaurant Network', subtitle: 'Multi-location Command Center & Chain Analytics' },
    prediction: { title: 'Demand Prediction Engine', subtitle: 'Machine Learning Demand Forecasts' },
    preparation: { title: 'Preparation Management', subtitle: 'Optimal Prep Schedules & Kitchen Directives' },
    datalearning: { title: 'Data & AI Learning Center', subtitle: 'Dataset Management & Model Accuracy' },
    menu: { title: 'Food & Menu Management', subtitle: 'Menu Items, Margins & Portions' },
    sales: { title: 'Sales Intelligence', subtitle: 'Revenue Trends & Hourly Patterns' },
    waste: { title: 'Waste Tracking & Reduction', subtitle: 'Waste Analytics & Prevention' },
    analytics: { title: 'Analytics & Financial ROI', subtitle: 'Cost Savings & Operational Efficiency' },
    insights: { title: 'AI Insights & Recommendations', subtitle: 'Automated Operations Intelligence' },
    notifications: { title: 'Notifications & Alerts', subtitle: 'Important Events & Risk Detection' },
    settings: { title: 'Restaurant Settings', subtitle: 'AI Model & System Parameters' },
    profile: { title: 'Restaurant Profile', subtitle: 'Branch Credentials & Manager Details' }
  };

  const pagesList = [
    { id: 'controlroom', name: 'AI Control Room', desc: 'Live digital twin & decision engine' },
    { id: 'dashboard', name: 'Executive Dashboard', desc: 'KPIs & operational summary' },
    { id: 'prediction', name: 'Demand Prediction', desc: 'AI demand forecasts & factors' },
    { id: 'preparation', name: 'Preparation Management', desc: 'Kitchen prep schedules & batching' },
    { id: 'sales', name: 'Sales Intelligence', desc: 'Revenue analytics & POS logs' },
    { id: 'waste', name: 'Waste Tracking', desc: 'Food waste audits & prevention' },
    { id: 'analytics', name: 'Analytics & Financial ROI', desc: 'Cost recovery & profit impact' },
    { id: 'datalearning', name: 'Data & AI Learning', desc: 'Data quality & model retraining' },
    { id: 'network', name: 'Restaurant Network', desc: 'Multi-location management' },
    { id: 'notifications', name: 'Notifications & Alerts', desc: 'Real-time system risk alerts' },
    { id: 'settings', name: 'Restaurant Settings', desc: 'Configurations & API setup' }
  ];

  const currentInfo = pageInfoMap[activeTab] || {
    title: 'SmartServe AI Platform',
    subtitle: 'Real-time Operational Intelligence'
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  // Calculate search results
  const term = (searchTerm || '').trim().toLowerCase();
  const matchingPages = term ? pagesList.filter(p => p.name.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term)) : [];
  const matchingItems = term ? foodItems.filter(i => i.name.toLowerCase().includes(term) || i.category.toLowerCase().includes(term)) : [];
  const matchingInsights = term ? insights.filter(ins => ins.title.toLowerCase().includes(term) || ins.description.toLowerCase().includes(term)) : [];

  const hasSearchQuery = term.length > 0;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-emerald-950/10 sticky top-0 z-30 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-2xs">
      {/* Page Title & Subtitle */}
      <div className="min-w-0 pr-4">
        <h1 className="text-lg md:text-xl font-extrabold font-heading text-gray-900 truncate tracking-tight">
          {currentInfo.title}
        </h1>
        <p className="text-xs text-gray-500 font-medium flex items-center gap-2 mt-0.5 truncate">
          <span className="hidden sm:inline text-gray-400">{currentInfo.subtitle}</span>
          <span className="hidden sm:inline text-gray-300">•</span>
          <span className="flex items-center gap-1 text-emerald-800 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            {formattedDate}
          </span>
        </p>
      </div>

      {/* Center Search Bar with Dropdown Results Overlay */}
      <div className="hidden lg:block relative w-80">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search items, pages, insights..."
            value={searchTerm || ''}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b4332] transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => onSearchChange && onSearchChange('')}
              className="absolute right-2.5 top-2 text-xs text-gray-400 hover:text-gray-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Results Dropdown Overlay */}
        {searchFocused && hasSearchQuery && (
          <div className="absolute top-11 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 z-50 animate-fade-in max-h-96 overflow-y-auto space-y-3">
            {/* Matching Pages */}
            {matchingPages.length > 0 && (
              <div>
                <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider px-2 block mb-1">System Pages</span>
                <div className="space-y-1">
                  {matchingPages.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActiveTab(p.id);
                        onSearchChange && onSearchChange('');
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-emerald-50 flex items-center justify-between text-xs transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#1b4332]" />
                        <span className="font-bold text-gray-900">{p.name}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1b4332]" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Food Items */}
            {matchingItems.length > 0 && (
              <div>
                <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider px-2 block mb-1">Food Items</span>
                <div className="space-y-1">
                  {matchingItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab('prediction');
                        onSearchChange && onSearchChange('');
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-amber-50 flex items-center justify-between text-xs transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <Utensils className="w-3.5 h-3.5 text-[#d4af37]" />
                        <div>
                          <p className="font-bold text-gray-900">{item.name}</p>
                          <p className="text-[10px] text-gray-500">{item.category} • Avg {item.avgDailySales} sales</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#1b4332] bg-emerald-100 px-2 py-0.5 rounded-full">Predict</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matching AI Insights */}
            {matchingInsights.length > 0 && (
              <div>
                <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider px-2 block mb-1">AI Insights & Alerts</span>
                <div className="space-y-1">
                  {matchingInsights.map(ins => (
                    <button
                      key={ins.id}
                      onClick={() => {
                        setActiveTab('notifications');
                        onSearchChange && onSearchChange('');
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-emerald-50 text-xs transition-colors cursor-pointer"
                    >
                      <p className="font-bold text-gray-900 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{ins.title}</span>
                      </p>
                      <p className="text-[10px] text-gray-500 line-clamp-1">{ins.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {matchingPages.length === 0 && matchingItems.length === 0 && matchingInsights.length === 0 && (
              <div className="p-4 text-center text-xs text-gray-500 font-medium">
                No results found for "{searchTerm}". Try searching "Biryani", "Sales", or "Prediction".
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Tools & Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* REST API Status Ping Badge */}
        <button
          onClick={handleTestApi}
          disabled={testingApi}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer bg-[#081c15] text-white border-emerald-900/60 hover:bg-[#1b4332]"
          title="Test connection to FastAPI REST backend"
        >
          <Cpu className={`w-3.5 h-3.5 ${testingApi ? 'animate-spin text-amber-400' : 'text-emerald-400'}`} />
          <span>{config.useSimulatedApi ? 'FastAPI Ready' : 'FastAPI Live'}</span>
          <RefreshCw className="w-3 h-3 text-gray-400" />
        </button>

        {apiResult && (
          <div className="absolute top-16 right-20 bg-[#081c15] text-white text-xs p-3 rounded-xl shadow-xl border border-emerald-900/80 flex items-center gap-2 z-50 animate-fade-in">
            {apiResult.status === 'connected' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400" />
            )}
            <span>{apiResult.message}</span>
          </div>
        )}

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-[#f4f6f0] text-gray-700 border border-gray-200 hover:bg-emerald-50 hover:text-[#1b4332] transition-colors relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-2.5">
                <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">AI Operations Alerts</h4>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">8 Unread</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {insights.slice(0, 4).map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50/50 border border-gray-100 text-xs transition-colors">
                    <p className="font-bold text-gray-900">{item.title}</p>
                    <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-2">{item.description}</p>
                    <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">{item.time}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                  setShowNotifications(false);
                  setActiveTab && setActiveTab('notifications');
                }}
                className="w-full mt-3 pt-2 border-t border-gray-100 text-center text-xs text-[#1b4332] font-bold hover:text-emerald-700 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>View Notification Center</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Restaurant Profile Avatar */}
        <button
          onClick={() => setActiveTab && setActiveTab('profile')}
          className="flex items-center gap-2.5 pl-2 border-l border-gray-200 cursor-pointer group"
          title="View Restaurant Profile"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1b4332] to-[#081c15] text-white flex items-center justify-center font-bold text-xs shadow-xs border border-emerald-500/30 group-hover:scale-105 transition-transform">
            SB
          </div>
          <div className="hidden xl:block text-left min-w-0">
            <p className="text-xs font-bold text-gray-900 leading-none truncate">{config.name}</p>
            <span className="text-[10px] text-emerald-700 font-semibold block truncate">Bistro HYD-04</span>
          </div>
        </button>
      </div>
    </header>
  );
}
