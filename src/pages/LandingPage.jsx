import React, { useState } from 'react';
import { 
  Bot, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Leaf, 
  DollarSign, 
  CheckCircle2, 
  Layers, 
  ChevronRight,
  Zap
} from 'lucide-react';
import VisualFlow from '../components/VisualFlow';
import { apiService } from '../services/apiService';

export default function LandingPage({ onGetStarted, onNavigate }) {
  const [selectedItem, setSelectedItem] = useState('item-001');
  const [selectedWeather, setSelectedWeather] = useState('Sunny');
  const [quickPrediction, setQuickPrediction] = useState(null);

  const items = apiService.getFoodItems();

  const handleQuickPredict = (e) => {
    e.preventDefault();
    const res = apiService.predictSingleItem(selectedItem, 'Tomorrow', selectedWeather, true);
    setQuickPrediction(res);
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-br from-[#081c15] via-[#112a12] to-[#1b4332] text-white p-8 md:p-14 overflow-hidden shadow-2xl border border-emerald-800/30">
        {/* Glow backdrop circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2d6a4f]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Brand Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>AI-POWERED RESTAURANT MANAGEMENT SYSTEM</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold font-heading tracking-tight leading-tight">
            Predict Demand. <br />
            Prepare Smart. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-[#d4af37]">Reduce Waste.</span>
          </h1>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl font-normal">
            SmartServe AI transforms commercial kitchen operations by aligning daily kitchen preparation with precision AI demand forecasting. Save costs, eliminate over-prep food waste, and maximize margins.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onGetStarted}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-[#2d6a4f] hover:from-emerald-400 hover:to-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>View Executive Dashboard</span>
              <ChevronRight className="w-4 h-4 text-emerald-300" />
            </button>
          </div>

          {/* Key metrics ticker */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs">
            <div>
              <p className="text-2xl font-bold text-[#d4af37] font-heading">35%+</p>
              <p className="text-gray-400">Waste Reduction</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400 font-heading">94%</p>
              <p className="text-gray-400">Demand Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-heading">FastAPI</p>
              <p className="text-gray-400">REST Integration</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Flow Diagram Section (Data -> AI -> Prediction -> Smart Prep) */}
      <VisualFlow onNavigate={onNavigate} />

      {/* Interactive Quick AI Predictor Widget */}
      <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-emerald-900/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-flex items-center gap-1.5 mb-2">
              <Zap className="w-3.5 h-3.5 text-amber-600" /> Interactive AI Simulator
            </span>
            <h3 className="text-2xl font-bold font-heading text-gray-900">
              Try SmartServe Demand Prediction Live
            </h3>
          </div>
        </div>

        <form onSubmit={handleQuickPredict} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Select Menu Item</label>
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            >
              {items.map(item => (
                <option key={item.id} value={item.id}>{item.name} ({item.category})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Weather Context</label>
            <select
              value={selectedWeather}
              onChange={(e) => setSelectedWeather(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            >
              <option value="Sunny">Sunny & Clear</option>
              <option value="Heavy Rain">Heavy Rain & Cool</option>
              <option value="Hot Day">Hot & Humid</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#d4af37]" /> Run AI Model
            </button>
          </div>
        </form>

        {quickPrediction && (
          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-[#081c15] to-[#1b4332] text-white animate-fade-in shadow-xl grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-400">Target Item</p>
              <p className="text-lg font-bold font-heading text-emerald-400">{quickPrediction.itemName}</p>
              <span className="text-[10px] text-gray-300">{quickPrediction.targetDate} ({quickPrediction.weatherCondition})</span>
            </div>
            <div>
              <p className="text-xs text-gray-400">Predicted Demand</p>
              <p className="text-2xl font-bold font-heading text-white">{quickPrediction.predictedDemand} <span className="text-xs text-gray-300">{quickPrediction.unit}</span></p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Recommended Prep</p>
              <p className="text-2xl font-bold font-heading text-[#d4af37]">{quickPrediction.recommendedPrep} <span className="text-xs text-gray-300">({quickPrediction.expectedWaste} buffer)</span></p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Model Confidence</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold text-emerald-400">{quickPrediction.confidence}%</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">High Precision</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3 hover-card-rise">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#1b4332] flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold font-heading text-gray-900">AI Demand Forecasting</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Eliminate kitchen guesswork with time-series machine learning models that account for weather, day of week, and historical sales trends.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3 hover-card-rise">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <Leaf className="w-6 h-6 text-amber-700" />
          </div>
          <h4 className="text-lg font-bold font-heading text-gray-900">Zero Food Waste</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Track and reduce over-preparation, raw ingredient spoilage, and plate unconsumed waste with actionable operational insights.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3 hover-card-rise">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6 text-blue-700" />
          </div>
          <h4 className="text-lg font-bold font-heading text-gray-900">FastAPI Architecture</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Built ready to connect directly to FastAPI REST endpoints and custom Python scikit-learn / PyTorch prediction models.
          </p>
        </div>
      </section>
    </div>
  );
}
