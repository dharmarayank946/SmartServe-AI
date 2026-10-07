import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { 
  Settings as SettingsIcon, 
  Building2, 
  UtensilsCrossed, 
  Sliders, 
  BrainCircuit, 
  Bell, 
  Database, 
  Users, 
  Palette, 
  ShieldCheck, 
  Search, 
  Save, 
  RotateCcw, 
  Check, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  Sun, 
  Moon, 
  Monitor, 
  Layers, 
  X, 
  Mail, 
  Lock, 
  Cpu, 
  Download, 
  FileSpreadsheet, 
  Zap, 
  Info,
  ChevronRight
} from 'lucide-react';

export default function Settings() {
  // Navigation State
  const [activeSection, setActiveSection] = useState('profile');
  const [searchQuery, setSearchQuery] = useState('');

  // Main Settings State (Loaded from apiService)
  const [settings, setSettings] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Menu Management State
  const [menuItems, setMenuItems] = useState([]);
  const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    category: 'Main Course',
    price: 120,
    prepTimeMins: 20,
    avgDemand: 50,
    minPrep: 20,
    maxPrep: 100
  });

  // Integrations State
  const [integrations, setIntegrations] = useState([]);
  const [testingIntId, setTestingIntId] = useState(null);
  const [testResult, setTestResult] = useState(null);

  // Team State
  const [teamMembers, setTeamMembers] = useState([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newTeamForm, setNewTeamForm] = useState({ name: '', email: '', role: 'Kitchen Manager', access: 'Manager' });

  // Confirmation Dialog State (for destructive actions)
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = () => {
    const data = apiService.getRestaurantSettings();
    setSettings(data);

    const items = apiService.getMenuItemsList();
    setMenuItems(items);

    const ints = apiService.getIntegrationsList();
    setIntegrations(ints);

    const members = apiService.getTeamMembersList();
    setTeamMembers(members);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const updateSettingField = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = () => {
    apiService.updateRestaurantSettings(settings);
    setHasUnsavedChanges(false);
    showToast("✓ Settings saved successfully!");
  };

  const handleDiscardChanges = () => {
    loadSettingsData();
    setHasUnsavedChanges(false);
    showToast("Changes discarded");
  };

  // Menu Item Handlers
  const handleAddMenuSubmit = (e) => {
    e.preventDefault();
    if (!newMenuItem.name) return;

    const added = apiService.addMenuItem(newMenuItem);
    setMenuItems(prev => [added, ...prev]);
    setIsAddMenuModalOpen(false);
    setNewMenuItem({ name: '', category: 'Main Course', price: 120, prepTimeMins: 20, avgDemand: 50, minPrep: 20, maxPrep: 100 });
    showToast(`🍲 Food item "${added.name}" added successfully.`);
  };

  const toggleMenuItemActive = (id) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, active: !item.active } : item));
    showToast("Menu status updated");
  };

  const handleDeleteMenuItem = (id, name) => {
    setConfirmDialog({
      title: `Delete ${name}?`,
      message: `Are you sure you want to delete ${name} from the active menu? This action cannot be undone.`,
      actionLabel: "Delete Item",
      onConfirm: () => {
        setMenuItems(prev => prev.filter(item => item.id !== id));
        setConfirmDialog(null);
        showToast(`Item "${name}" removed from menu.`);
      }
    });
  };

  // Integration Test Handler
  const handleTestIntegration = (id) => {
    setTestingIntId(id);
    setTimeout(() => {
      const res = apiService.testIntegrationConnection(id);
      setTestingIntId(null);
      setTestResult(res);
      showToast(`✓ ${res.message}`);
    }, 1200);
  };

  // Team Invite Handler
  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!newTeamForm.name || !newTeamForm.email) return;

    const invited = apiService.inviteTeamMember(newTeamForm);
    setTeamMembers(prev => [...prev, invited]);
    setIsInviteModalOpen(false);
    setNewTeamForm({ name: '', email: '', role: 'Kitchen Manager', access: 'Manager' });
    showToast(`✉️ Invitation sent to ${invited.email}`);
  };

  // Operating Hours Handler
  const handleApplyToAllWeekdays = () => {
    if (!settings) return;
    const mon = settings.weeklySchedule[0];
    const updated = settings.weeklySchedule.map(item => {
      if (item.day === 'Saturday' || item.day === 'Sunday') return item;
      return { ...item, open: mon.open, start: mon.start, end: mon.end };
    });
    setSettings(prev => ({ ...prev, weeklySchedule: updated }));
    setHasUnsavedChanges(true);
    showToast("Applied Monday schedule to all weekdays!");
  };

  // Navigation Items
  const navItems = [
    { id: 'profile', label: 'Restaurant Profile', icon: Building2 },
    { id: 'hours', label: 'Operating Hours', icon: Clock },
    { id: 'menu', label: 'Food & Menu', icon: UtensilsCrossed },
    { id: 'prediction', label: 'Prediction Settings', icon: Sliders },
    { id: 'aiprefs', label: 'AI Preferences', icon: BrainCircuit, badge: 'AI Mode' },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Data & Integrations', icon: Database },
    { id: 'team', label: 'Team & Access', icon: Users },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security & Privacy', icon: ShieldCheck }
  ];

  const filteredNavItems = navItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!settings) return <div className="p-8 text-center text-gray-500">Loading Restaurant Settings...</div>;

  return (
    <div className="space-y-8 pb-20 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#081c15] text-white border border-[#d4af37]/50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-[#d4af37]" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#040d09] via-[#081c15] to-[#1b4332] p-6 md:p-8 rounded-3xl text-white shadow-2xl border border-[#1b4332]/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4332]/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <SettingsIcon className="w-3.5 h-3.5 text-emerald-400" /> Executive Configuration Center
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading text-white">
            Restaurant Settings
          </h1>
          <p className="text-gray-300 text-sm md:text-base mt-1 max-w-xl">
            Configure SmartServe AI parameters, menu catalog, prediction safety margins, and team permissions.
          </p>
        </div>

        {/* Top Search Bar */}
        <div className="w-full md:w-72 relative z-10">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input 
              type="text" 
              placeholder="Search settings..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#040d09]/80 border border-[#1b4332] text-white pl-10 pr-4 py-2.5 rounded-2xl text-xs focus:outline-none focus:border-[#d4af37] transition-all"
            />
          </div>
        </div>
      </div>

      {/* SETTINGS LAYOUT (LEFT NAV + MAIN CONTENT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-3 bg-white p-3 rounded-3xl border border-gray-200 shadow-sm space-y-1 sticky top-6">
          <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Configuration Navigation
          </div>
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#081c15] text-white border border-[#d4af37]/30 shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#d4af37]' : 'text-emerald-700'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#d4af37]/20 text-amber-300 border border-[#d4af37]/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Settings Content View */}
        <div className="lg:col-span-9 space-y-8">
          {/* SECTION 1: RESTAURANT PROFILE */}
          {activeSection === 'profile' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-700" /> Restaurant Operational Profile
                  </h2>
                  <p className="text-xs text-gray-500">General commercial details, location, and capacity</p>
                </div>
              </div>

              {/* Logo Preview & Upload */}
              <div className="flex items-center gap-6 p-4 rounded-2xl bg-[#f4f6f0] border border-gray-200">
                <img 
                  src={settings.profile.logoUrl} 
                  alt="Restaurant Logo" 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shadow-md"
                />
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-xs">Restaurant Brand Logo</h4>
                  <p className="text-[11px] text-gray-500">PNG, JPG or SVG up to 2 MB</p>
                  <button 
                    onClick={() => showToast("Logo upload tool opened")}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 cursor-pointer mt-1"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload New Logo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Restaurant Name</label>
                  <input 
                    type="text" 
                    value={settings.profile.name}
                    onChange={(e) => updateSettingField('profile', 'name', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 font-semibold text-gray-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Restaurant Type</label>
                  <select 
                    value={settings.profile.type}
                    onChange={(e) => updateSettingField('profile', 'type', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 font-semibold text-gray-800 bg-white"
                  >
                    <option value="Fine Dining">Fine Dining</option>
                    <option value="Casual Dining">Casual Dining</option>
                    <option value="Quick Service">Quick Service</option>
                    <option value="Cloud Kitchen">Cloud Kitchen</option>
                    <option value="Express Kitchen">Express Kitchen</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Cuisine Type</label>
                  <input 
                    type="text" 
                    value={settings.profile.cuisine}
                    onChange={(e) => updateSettingField('profile', 'cuisine', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 font-semibold text-gray-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Location Address</label>
                  <input 
                    type="text" 
                    value={settings.profile.location}
                    onChange={(e) => updateSettingField('profile', 'location', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 font-semibold text-gray-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Contact Email</label>
                  <input 
                    type="email" 
                    value={settings.profile.email}
                    onChange={(e) => updateSettingField('profile', 'email', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 font-semibold text-gray-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Seating Capacity (Seats)</label>
                  <input 
                    type="number" 
                    value={settings.profile.seats}
                    onChange={(e) => updateSettingField('profile', 'seats', Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 font-semibold text-gray-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: OPERATING HOURS */}
          {activeSection === 'hours' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-700" /> Operating Hours & Service Schedule
                  </h2>
                  <p className="text-xs text-gray-500">Set weekly opening times used by AI for daily service period predictions</p>
                </div>

                <button
                  onClick={handleApplyToAllWeekdays}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 cursor-pointer flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-700" /> Apply Monday to All Weekdays
                </button>
              </div>

              <div className="space-y-3">
                {settings.weeklySchedule.map((sched, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#f4f6f0] border border-gray-200 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3 w-32">
                      <input 
                        type="checkbox" 
                        checked={sched.open}
                        onChange={(e) => {
                          const updated = [...settings.weeklySchedule];
                          updated[idx].open = e.target.checked;
                          setSettings(prev => ({ ...prev, weeklySchedule: updated }));
                          setHasUnsavedChanges(true);
                        }}
                        className="w-4 h-4 accent-emerald-700 cursor-pointer"
                      />
                      <span className="font-bold text-gray-900">{sched.day}</span>
                    </div>

                    {sched.open ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          value={sched.start}
                          onChange={(e) => {
                            const updated = [...settings.weeklySchedule];
                            updated[idx].start = e.target.value;
                            setSettings(prev => ({ ...prev, weeklySchedule: updated }));
                            setHasUnsavedChanges(true);
                          }}
                          className="p-1.5 rounded-lg border border-gray-300 bg-white font-semibold text-center w-24"
                        />
                        <span className="text-gray-400">to</span>
                        <input 
                          type="text" 
                          value={sched.end}
                          onChange={(e) => {
                            const updated = [...settings.weeklySchedule];
                            updated[idx].end = e.target.value;
                            setSettings(prev => ({ ...prev, weeklySchedule: updated }));
                            setHasUnsavedChanges(true);
                          }}
                          className="p-1.5 rounded-lg border border-gray-300 bg-white font-semibold text-center w-24"
                        />
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-red-600 px-3 py-1 rounded bg-red-50 border border-red-200">
                        Closed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: FOOD & MENU SETTINGS */}
          {activeSection === 'menu' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-emerald-700" /> Menu Catalog & Preparation Parameters
                  </h2>
                  <p className="text-xs text-gray-500">Manage active food items, preparation thresholds, and prices</p>
                </div>

                <button
                  onClick={() => setIsAddMenuModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#081c15] text-white border border-[#d4af37]/30 text-xs font-bold hover:bg-[#1b4332] shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#d4af37]" /> + Add Food Item
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#081c15] text-white">
                      <th className="p-3 rounded-l-xl">Food Item</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price (₹)</th>
                      <th className="p-3">Prep Time</th>
                      <th className="p-3">Daily Demand</th>
                      <th className="p-3">Active</th>
                      <th className="p-3 rounded-r-xl text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-bold text-gray-900">{item.name}</td>
                        <td className="p-3 text-gray-600">{item.category}</td>
                        <td className="p-3 font-semibold text-emerald-950">₹{item.price}</td>
                        <td className="p-3 text-gray-600">{item.prepTimeMins} mins</td>
                        <td className="p-3 font-medium text-gray-700">{item.avgDemand} portions</td>
                        <td className="p-3">
                          <button 
                            onClick={() => toggleMenuItemActive(item.id)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                              item.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {item.active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => showToast(`Editing ${item.name}`)}
                              className="p-1 rounded text-gray-500 hover:text-emerald-700 cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteMenuItem(item.id, item.name)}
                              className="p-1 rounded text-gray-500 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 4: PREDICTION SETTINGS */}
          {activeSection === 'prediction' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 animate-fadeIn">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-700" /> AI Prediction Preferences
                </h2>
                <p className="text-xs text-gray-500">Fine-tune demand forecast horizon, safety buffers, and risk thresholds</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-[#f4f6f0] border border-gray-200">
                  <div>
                    <label className="font-bold text-gray-900 text-xs block mb-1">Forecast Horizon</label>
                    <select 
                      value={settings.predictionPreferences.forecastHorizon}
                      onChange={(e) => updateSettingField('predictionPreferences', 'forecastHorizon', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 bg-white font-semibold text-xs text-gray-800"
                    >
                      <option value="1 Day">1 Day (Short Term)</option>
                      <option value="3 Days">3 Days (Mid Range)</option>
                      <option value="7 Days">7 Days (Full Week)</option>
                    </select>
                  </div>
                  <div className="flex items-center text-xs text-gray-600 italic">
                    <Info className="w-4 h-4 text-emerald-700 mr-2 shrink-0" />
                    "Determines how far ahead SmartServe AI projects daily preparation targets."
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-[#f4f6f0] border border-gray-200">
                  <div>
                    <label className="font-bold text-gray-900 text-xs block mb-1">Safety Buffer Margin</label>
                    <select 
                      value={settings.predictionPreferences.safetyBuffer}
                      onChange={(e) => updateSettingField('predictionPreferences', 'safetyBuffer', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 bg-white font-semibold text-xs text-gray-800"
                    >
                      <option value="5%">5% (Aggressive Zero Waste)</option>
                      <option value="10%">10% (Recommended Standard)</option>
                      <option value="15%">15% (High Spike Defense)</option>
                    </select>
                  </div>
                  <div className="flex items-center text-xs text-gray-600 italic">
                    <Info className="w-4 h-4 text-emerald-700 mr-2 shrink-0" />
                    "Safety Buffer adds a small preparation margin to reduce food shortage risk."
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-[#f4f6f0] border border-gray-200">
                  <div>
                    <label className="font-bold text-gray-900 text-xs block mb-1">Risk Sensitivity</label>
                    <select 
                      value={settings.predictionPreferences.riskSensitivity}
                      onChange={(e) => updateSettingField('predictionPreferences', 'riskSensitivity', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 bg-white font-semibold text-xs text-gray-800"
                    >
                      <option value="Low">Low (Fewer Alert Trigger)</option>
                      <option value="Medium">Medium (Balanced Alerts)</option>
                      <option value="High">High (Strict Thresholds)</option>
                    </select>
                  </div>
                  <div className="flex items-center text-xs text-gray-600 italic">
                    <Info className="w-4 h-4 text-emerald-700 mr-2 shrink-0" />
                    "Controls how aggressively AI flags waste & shortage warnings."
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: AI PREFERENCE CENTER */}
          {activeSection === 'aiprefs' && (
            <div className="bg-[#040d09] text-white p-6 md:p-8 rounded-3xl border border-[#1b4332] shadow-2xl space-y-6 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4332] text-amber-300 text-xs font-semibold mb-2">
                  <BrainCircuit className="w-3.5 h-3.5 text-amber-400" /> Strategic Optimization Engine
                </div>
                <h2 className="text-2xl font-bold font-heading text-white">
                  How should SmartServe AI optimize?
                </h2>
                <p className="text-gray-300 text-xs mt-1">
                  Select the primary operational strategy for your kitchen.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 'MINIMIZE WASTE',
                    title: 'MINIMIZE WASTE',
                    desc: 'Prioritize lower preparation quantities to drive waste down to absolute zero.',
                    icon: Trash2,
                    badge: 'Zero Waste Focus'
                  },
                  {
                    id: 'BALANCED',
                    title: 'BALANCED',
                    desc: 'Balance food waste reduction with customer shortage prevention.',
                    icon: BrainCircuit,
                    badge: 'Recommended'
                  },
                  {
                    id: 'AVOID SHORTAGES',
                    title: 'AVOID SHORTAGES',
                    desc: 'Maintain a larger safety buffer to ensure zero menu item stockouts during peak hours.',
                    icon: ShieldCheck,
                    badge: 'High Availability'
                  }
                ].map((strat) => {
                  const Icon = strat.icon;
                  const isSelected = settings.aiStrategy === strat.id;

                  return (
                    <div 
                      key={strat.id}
                      onClick={() => {
                        setSettings(prev => ({ ...prev, aiStrategy: strat.id }));
                        setHasUnsavedChanges(true);
                      }}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                        isSelected 
                          ? 'bg-[#1b4332] border-[#d4af37] shadow-xl scale-[1.02]' 
                          : 'bg-[#081c15] border-[#1b4332] hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-[#d4af37]' : 'text-emerald-400'}`} />
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-white text-sm">{strat.title}</h4>
                        <p className="text-gray-300 text-xs mt-1 leading-relaxed">{strat.desc}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded inline-block ${
                        isSelected ? 'bg-[#d4af37] text-gray-950 font-extrabold' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {strat.badge}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 6: NOTIFICATIONS & DAILY BRIEFING */}
          {activeSection === 'notifications' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 animate-fadeIn">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-emerald-700" /> Notifications & AI Daily Briefing
                </h2>
                <p className="text-xs text-gray-500">Manage real-time alert triggers and executive briefing delivery</p>
              </div>

              {/* Notification Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {[
                  { key: 'demandSpike', label: 'Demand Spike Alerts', desc: 'Notify when sudden surge > 20% is predicted' },
                  { key: 'wasteRisk', label: 'Waste Risk Alerts', desc: 'Notify when item over-prep waste risk is detected' },
                  { key: 'shortageAlerts', label: 'Shortage Alerts', desc: 'Notify when kitchen stock is predicted to run out' },
                  { key: 'predictionUpdates', label: 'Prediction Updates', desc: 'Notify when AI updates model weights' },
                  { key: 'dailyBriefing', label: 'Daily AI Briefing', desc: 'Receive executive briefing summary each morning' },
                  { key: 'weatherImpact', label: 'Weather Impact Alerts', desc: 'Notify when rain forecast alters demand targets' }
                ].map((notif) => (
                  <div key={notif.key} className="p-4 rounded-2xl bg-[#f4f6f0] border border-gray-200 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-gray-900">{notif.label}</p>
                      <p className="text-[10px] text-gray-500">{notif.desc}</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.notifications[notif.key]}
                      onChange={(e) => updateSettingField('notifications', notif.key, e.target.checked)}
                      className="w-5 h-5 accent-emerald-700 cursor-pointer shrink-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 7: DATA & INTEGRATIONS */}
          {activeSection === 'integrations' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 animate-fadeIn">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-700" /> Connected Services & Data Management
                </h2>
                <p className="text-xs text-gray-500">Live API integrations and data export/import utilities</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((int) => (
                  <div key={int.id} className="p-4 rounded-2xl bg-[#f4f6f0] border border-gray-200 flex flex-col justify-between space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">{int.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {int.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500">Last Sync: {int.lastSync}</p>
                    <button 
                      onClick={() => handleTestIntegration(int.id)}
                      disabled={testingIntId === int.id}
                      className="w-full py-2 rounded-xl bg-[#081c15] text-white font-bold hover:bg-[#1b4332] cursor-pointer flex items-center justify-center gap-2"
                    >
                      {testingIntId === int.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" /> : 'Test Connection'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Data Import / Export */}
              <div className="p-5 rounded-2xl bg-[#040d09] text-white border border-[#1b4332] space-y-4">
                <h4 className="font-bold text-white text-xs flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-amber-400" /> Restaurant Data Import & Export
                </h4>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => showToast("📥 Downloaded Restaurant Data CSV")}
                    className="px-4 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold border border-[#d4af37]/30 hover:bg-emerald-900 cursor-pointer flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download Restaurant CSV
                  </button>
                  <button 
                    onClick={() => setConfirmDialog({
                      title: "Reset Demo Data?",
                      message: "Are you sure you want to reset demo data back to default baseline?",
                      actionLabel: "Reset Data",
                      onConfirm: () => {
                        setConfirmDialog(null);
                        showToast("Demo data reset to default.");
                      }
                    })}
                    className="px-4 py-2 rounded-xl bg-red-950 text-red-300 text-xs font-bold border border-red-800 hover:bg-red-900 cursor-pointer flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset Demo Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: TEAM & ACCESS */}
          {activeSection === 'team' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-700" /> Team Members & Role Permissions
                  </h2>
                  <p className="text-xs text-gray-500">Manage user access for restaurant managers, kitchen chefs, and analysts</p>
                </div>

                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#081c15] text-white text-xs font-bold hover:bg-[#1b4332] flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#d4af37]" /> + Invite Team Member
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {teamMembers.map((member) => (
                  <div key={member.id} className="p-4 rounded-2xl bg-[#f4f6f0] border border-gray-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#081c15] text-[#d4af37] flex items-center justify-center font-bold text-xs border border-[#d4af37]/30">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{member.name}</p>
                        <p className="text-[10px] text-gray-500">{member.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-700 bg-white px-3 py-1 rounded-lg border border-gray-200">
                        {member.role} ({member.access})
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        {member.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 9: APPEARANCE */}
          {activeSection === 'appearance' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 animate-fadeIn">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-emerald-700" /> UI Appearance & Theme
                </h2>
                <p className="text-xs text-gray-500">Configure visual themes, compact mode, and animation density</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'Light', label: 'Light Theme', icon: Sun },
                  { id: 'Dark', label: 'Dark Mode', icon: Moon },
                  { id: 'System', label: 'System Default', icon: Monitor }
                ].map((th) => {
                  const Icon = th.icon;
                  const isSelected = settings.appearance.theme === th.id;

                  return (
                    <div 
                      key={th.id}
                      onClick={() => updateSettingField('appearance', 'theme', th.id)}
                      className={`p-4 rounded-2xl border text-center cursor-pointer transition-all space-y-2 ${
                        isSelected 
                          ? 'bg-[#081c15] text-white border-[#d4af37]' 
                          : 'bg-[#f4f6f0] text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto ${isSelected ? 'text-[#d4af37]' : 'text-gray-600'}`} />
                      <span className="font-bold text-xs block">{th.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 10: SECURITY & PRIVACY */}
          {activeSection === 'security' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 animate-fadeIn">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" /> Security & Session Management
                </h2>
                <p className="text-xs text-gray-500">Active browser sessions, API communication tokens, and access logs</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#f4f6f0] border border-gray-200 space-y-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-700" /> Active Session
                  </h4>
                  <p className="text-gray-600">Current Login: Chrome on Windows 11 (Bengaluru, IN)</p>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded inline-block">
                    Current Device
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#081c15] text-white border border-[#1b4332] space-y-2">
                  <h4 className="font-bold text-amber-300">Secure API Communication Protocol</h4>
                  <p className="text-gray-300 text-[11px]">
                    All REST data endpoints pass through tokenized headers with isolated tenant encryption.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 16. STICKY SAVE BAR */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-6 right-6 left-6 md:left-72 z-40 bg-[#081c15] text-white p-4 rounded-2xl border border-[#d4af37]/60 shadow-2xl flex items-center justify-between gap-4 animate-slideUp">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-bold text-amber-300">Unsaved Changes Detected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDiscardChanges}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={handleSaveChanges}
              className="px-5 py-2 rounded-xl bg-[#d4af37] text-gray-950 text-xs font-extrabold hover:bg-amber-400 cursor-pointer shadow-lg flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-gray-950" /> Save Changes
            </button>
          </div>
        </div>
      )}

      {/* MODAL: ADD FOOD ITEM */}
      {isAddMenuModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-emerald-700" /> Add Food Item to Menu
              </h3>
              <button onClick={() => setIsAddMenuModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMenuSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Food Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Malai Kofta" 
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category</label>
                  <select 
                    value={newMenuItem.category}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="Main Course">Main Course</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Appetizers">Appetizers</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={newMenuItem.price}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Prep Time (Mins)</label>
                  <input 
                    type="number" 
                    value={newMenuItem.prepTimeMins}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, prepTimeMins: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Typical Daily Demand</label>
                  <input 
                    type="number" 
                    value={newMenuItem.avgDemand}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, avgDemand: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddMenuModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#081c15] text-white font-bold border border-[#d4af37]/30 hover:bg-[#1b4332] shadow-md cursor-pointer"
                >
                  Save Food Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INVITE TEAM MEMBER */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" /> Invite Team Member
              </h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Vikram Verma" 
                  value={newTeamForm.name}
                  onChange={(e) => setNewTeamForm({ ...newTeamForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. vikram@smartservebistro.com" 
                  value={newTeamForm.email}
                  onChange={(e) => setNewTeamForm({ ...newTeamForm, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Role Title</label>
                  <input 
                    type="text" 
                    value={newTeamForm.role}
                    onChange={(e) => setNewTeamForm({ ...newTeamForm, role: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Access Level</label>
                  <select 
                    value={newTeamForm.access}
                    onChange={(e) => setNewTeamForm({ ...newTeamForm, access: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#081c15] text-white font-bold border border-[#d4af37]/30 hover:bg-[#1b4332] shadow-md cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG (DESTRUCTIVE ACTIONS) */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-sm w-full p-6 space-y-4 shadow-2xl relative text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">{confirmDialog.title}</h3>
            <p className="text-xs text-gray-600">{confirmDialog.message}</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button 
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 cursor-pointer shadow-md"
              >
                {confirmDialog.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
