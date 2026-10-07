import React, { useState } from 'react';
import { Database, Cpu, TrendingUp, ChefHat, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function VisualFlow({ onNavigate }) {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "1. Food & Context Data",
      subtitle: "Multi-Source Ingestion",
      icon: Database,
      color: "from-blue-600 to-indigo-700",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
      bgLight: "bg-blue-50/70",
      badge: "Real-time Inputs",
      details: [
        "Historical POS Sales Records",
        "Live Weather & Rainfall Radar",
        "Day-of-Week & Seasonality Factors",
        "Current Fresh Raw Inventory Levels"
      ]
    },
    {
      id: 2,
      title: "2. SmartServe AI Engine",
      subtitle: "Machine Learning & FastAPI",
      icon: Cpu,
      color: "from-[#1b4332] to-[#2d6a4f]",
      textColor: "text-[#1b4332]",
      borderColor: "border-emerald-300",
      bgLight: "bg-emerald-50/80",
      badge: "94% Accuracy",
      gold: true,
      details: [
        "Time-Series Forecasting Models",
        "Weather Sensitivity Coefficients",
        "Dynamic Waste Buffer Calculation",
        "REST API JSON Payload Generation"
      ]
    },
    {
      id: 3,
      title: "3. Demand Prediction",
      subtitle: "Itemized Hourly Output",
      icon: TrendingUp,
      color: "from-amber-600 to-yellow-600",
      textColor: "text-amber-700",
      borderColor: "border-amber-200",
      bgLight: "bg-amber-50/70",
      badge: "Forecast Confidence",
      details: [
        "Exact Plate & Portion Forecasts",
        "Item-Wise Peak Hour Demand Curves",
        "Risk Assessment (Shortage vs Waste)",
        "Confidence Interval Banding"
      ]
    },
    {
      id: 4,
      title: "4. Smart Preparation",
      subtitle: "Zero-Waste Kitchen Execution",
      icon: ChefHat,
      color: "from-emerald-700 to-teal-800",
      textColor: "text-emerald-800",
      borderColor: "border-emerald-300",
      bgLight: "bg-emerald-100/70",
      badge: "Kitchen Action",
      details: [
        "Timely Batch Cooking Schedule",
        "Approved Prep Quantities",
        "Automated Raw Reordering Alerts",
        "Up to 45% Waste Reduction"
      ]
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-emerald-950/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-100/50 via-amber-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 inline-flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Operational Intelligence Flow
          </span>
          <h3 className="text-2xl font-bold font-heading text-gray-900">
            How SmartServe AI Transforms Food Data Into Zero Waste
          </h3>
        </div>
        <p className="text-xs text-gray-500 max-w-md">
          Click on any stage below to inspect the underlying machine learning parameters and kitchen workflow execution.
        </p>
      </div>

      {/* Interactive Process Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isSelected = activeStep === step.id;

          return (
            <div key={step.id} className="relative group">
              <button
                onClick={() => setActiveStep(step.id)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative ${
                  isSelected
                    ? `${step.bgLight} ${step.borderColor} shadow-lg ring-2 ring-[#1b4332]/30 scale-[1.02]`
                    : 'bg-white border-gray-100 hover:border-emerald-200 hover:shadow-md'
                }`}
              >
                {/* Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-gray-700 border border-gray-200 shadow-2xs">
                    {step.badge}
                  </span>
                </div>

                <h4 className="text-sm font-bold font-heading text-gray-900 group-hover:text-[#1b4332] transition-colors">
                  {step.title}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{step.subtitle}</p>

                {/* Animated progress indicator */}
                {isSelected && (
                  <div className="mt-3 pt-2 border-t border-emerald-900/10 flex items-center justify-between text-[11px] font-semibold text-[#1b4332]">
                    <span>Active Stage</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                )}
              </button>

              {/* Arrow Connector (for desktop view) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-xs items-center justify-center text-gray-400">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Step Detail Panel */}
      {steps.find(s => s.id === activeStep) && (
        <div className="mt-6 p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h5 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                Stage {activeStep} Deep Dive: {steps[activeStep - 1].title}
              </h5>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-300">
              {steps[activeStep - 1].details.map((detail, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onNavigate && (
              <button
                onClick={() => onNavigate(activeStep === 3 ? 'prediction' : activeStep === 4 ? 'preparation' : 'dashboard')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] text-white text-xs font-semibold hover:brightness-110 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Launch {steps[activeStep - 1].title.split('.')[1]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
