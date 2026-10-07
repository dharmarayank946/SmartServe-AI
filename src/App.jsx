import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AiChatFloatingBot from './components/AiChatFloatingBot';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AiControlRoom from './pages/AiControlRoom';
import DemandPrediction from './pages/DemandPrediction';
import PrepRecommendation from './pages/PrepRecommendation';
import FoodManagement from './pages/FoodManagement';
import SalesData from './pages/SalesData';
import WasteTracking from './pages/WasteTracking';
import Analytics from './pages/Analytics';
import AiInsights from './pages/AiInsights';
import DataLearning from './pages/DataLearning';
import RestaurantNetwork from './pages/RestaurantNetwork';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import NotificationsAlerts from './pages/NotificationsAlerts';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('controlroom');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage onGetStarted={() => setActiveTab('controlroom')} onNavigate={(tab) => setActiveTab(tab)} />;
      case 'controlroom':
        return <AiControlRoom onNavigate={(tab) => setActiveTab(tab)} />;
      case 'dashboard':
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case 'network':
        return <RestaurantNetwork onNavigate={(tab) => setActiveTab(tab)} />;
      case 'prediction':
        return <DemandPrediction onNavigate={(tab) => setActiveTab(tab)} />;
      case 'preparation':
        return <PrepRecommendation />;
      case 'datalearning':
        return <DataLearning onNavigate={(tab) => setActiveTab(tab)} />;
      case 'menu':
        return <FoodManagement />;
      case 'sales':
        return <SalesData />;
      case 'waste':
        return <WasteTracking />;
      case 'analytics':
        return <Analytics />;
      case 'insights':
        return <AiInsights onNavigate={(tab) => setActiveTab(tab)} />;
      case 'notifications':
        return <NotificationsAlerts onNavigate={(tab) => setActiveTab(tab)} />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      default:
        return <AiControlRoom onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f0] flex font-sans antialiased text-gray-800 selection:bg-[#1b4332] selection:text-white relative">
      {/* Sidebar for Desktop */}
      <div className={`hidden md:block ${isSidebarCollapsed ? 'w-20' : 'w-64'} shrink-0 transition-all duration-300`}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex transition-opacity animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="w-64 h-full bg-[#081c15] text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileMenuOpen(false);
              }} 
            />
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-4 text-white hover:text-gray-300 self-start"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Navbar with Menu Toggle */}
        <div className="md:hidden bg-[#081c15] text-white p-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg bg-[#1b4332] text-white hover:bg-[#2d6a4f] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-extrabold text-base font-heading flex items-center gap-1.5">
              SmartServe <span className="text-[#d4af37] text-xs font-semibold px-1 rounded bg-[#d4af37]/20">AI</span>
            </h1>
          </div>
          <button
            onClick={() => setActiveTab('profile')}
            className="w-7 h-7 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-bold text-xs border border-emerald-500/30"
          >
            SB
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <Navbar 
            activeTab={activeTab} 
            searchTerm={globalSearch} 
            onSearchChange={setGlobalSearch}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Dynamic Page View Container */}
        <main className="flex-1 p-3 sm:p-5 md:p-8 max-w-7xl w-full mx-auto page-fade-in">
          {renderActiveView()}
        </main>
      </div>

      {/* Universal Floating AI Copilot Assistant */}
      <AiChatFloatingBot />
    </div>
  );
}
