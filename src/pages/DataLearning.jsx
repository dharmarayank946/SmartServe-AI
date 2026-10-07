import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { 
  Database, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  FileSpreadsheet, 
  Server, 
  BrainCircuit, 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Cpu, 
  TrendingUp, 
  Check, 
  Sliders, 
  ArrowRight,
  Zap,
  Info,
  Layers,
  Activity,
  XCircle,
  FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';

export default function DataLearning({ onNavigate }) {
  // Page State
  const [engineStatus, setEngineStatus] = useState(null);
  const [connectedSources, setConnectedSources] = useState([]);
  const [selectedDataType, setSelectedDataType] = useState('Sales');
  const [requiredColumns, setRequiredColumns] = useState([]);
  
  // Upload & Validation State
  const [isDragging, setIsDragging] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgressStep, setValidationProgressStep] = useState(0);
  const [validationResult, setValidationResult] = useState(null);

  // Data Quality Metrics
  const [qualityMetrics, setQualityMetrics] = useState(null);
  const [isCleaningData, setIsCleaningData] = useState(false);

  // Data Preview State
  const [previewRecords, setPreviewRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Feature Engineering
  const [featuresList, setFeaturesList] = useState([]);

  // Model Retraining State
  const [learningStatus, setLearningStatus] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainProgress, setTrainProgress] = useState(0);
  const [trainStepText, setTrainStepText] = useState('');
  const [trainingSuccess, setTrainingSuccess] = useState(false);

  // Performance Charts
  const [timeRange, setTimeRange] = useState('7 Days');
  const [performanceCharts, setPerformanceCharts] = useState([]);

  // Impact Flow & Insights & Alerts
  const [impactNodes, setImpactNodes] = useState([]);
  const [learningInsight, setLearningInsight] = useState(null);
  const [healthAlerts, setHealthAlerts] = useState([]);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, [selectedDataType, timeRange]);

  const loadData = () => {
    const status = apiService.getDataEngineStatus();
    setEngineStatus(status);

    const sources = apiService.getConnectedDataSources();
    setConnectedSources(sources);

    const columns = apiService.getRequiredColumns(selectedDataType);
    setRequiredColumns(columns);

    const quality = apiService.getDataQualityMetrics();
    setQualityMetrics(quality);

    const records = apiService.getDataPreviewRecords(selectedDataType);
    setPreviewRecords(records);

    const features = apiService.getAiFeatureEngineeringList();
    setFeaturesList(features);

    const learnStat = apiService.getModelLearningStatus();
    setLearningStatus(learnStat);

    const charts = apiService.getModelPerformanceCharts(timeRange);
    setPerformanceCharts(charts);

    const nodes = apiService.getDataImpactFlowNodes();
    setImpactNodes(nodes);

    const ins = apiService.getAiLearningInsight();
    setLearningInsight(ins);

    const alerts = apiService.getDataHealthAlerts();
    setHealthAlerts(alerts);
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
      "Checking Required Columns...",
      "Detecting Missing Values...",
      "Detecting Duplicate Entries...",
      "Checking Data Types...",
      "Validating Records..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setValidationProgressStep(currentStep);
      } else {
        clearInterval(interval);
        setIsValidating(false);
        const result = apiService.validateUploadedData(selectedDataType, fileName);
        setValidationResult(result);
        showToast(`✓ Data Validation Complete: ${result.validRecords.toLocaleString()} valid records!`);
      }
    }, 600);
  };

  const handleSampleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      requiredColumns.join(",") + "\n" +
      "2026-10-06,Veg Biryani,85,240,Monday,No,Sunny\n" +
      "2026-10-06,Masala Dosa,110,140,Monday,No,Sunny\n" +
      "2026-10-06,Paneer Curry,62,280,Monday,No,Sunny\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smartserve_${selectedDataType.toLowerCase()}_sample.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`📥 Downloaded sample ${selectedDataType} CSV template`);
  };

  const handleImproveQuality = () => {
    setIsCleaningData(true);
    setTimeout(() => {
      setIsCleaningData(false);
      setQualityMetrics(prev => ({
        ...prev,
        completeness: 99,
        accuracy: 97,
        consistency: 98,
        duplicates: 0.1,
        missingValues: 0.3,
        overallQuality: 98
      }));
      showToast('✨ AI Data Imputation complete: Duplicates removed & missing values filled!');
    }, 1500);
  };

  const handleRetrainModel = () => {
    setIsTraining(true);
    setTrainingSuccess(false);
    setTrainProgress(0);

    const trainSteps = [
      { pct: 20, text: "Preparing clean dataset & normalizers..." },
      { pct: 45, text: "Training Neural LSTM Demand Model (Epoch 40/150)..." },
      { pct: 75, text: "Training Neural LSTM Demand Model (Epoch 120/150)..." },
      { pct: 90, text: "Evaluating prediction loss & residual errors..." },
      { pct: 100, text: "Updating production weights & deploying model..." }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < trainSteps.length) {
        setTrainProgress(trainSteps[stepIdx].pct);
        setTrainStepText(trainSteps[stepIdx].text);
        stepIdx++;
      } else {
        clearInterval(interval);
        setIsTraining(false);
        setTrainingSuccess(true);
        setLearningStatus(prev => ({
          ...prev,
          lastModelUpdate: "Just Now",
          modelAccuracy: "96.8%",
          predictionError: "3.2%"
        }));
        showToast('🧠 SmartServe AI Model successfully retrained! Accuracy improved to 96.8%');
      }
    }, 800);
  };

  // Filtering & Pagination for Data Preview
  const filteredRecords = previewRecords.filter(rec => {
    const matchesSearch = rec.foodItem.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          rec.weather.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
              <Database className="w-3.5 h-3.5 text-emerald-400" /> Continuous Learning Pipeline
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading text-white">
              Data & AI Learning Center
            </h1>
            <p className="text-gray-300 text-sm md:text-base mt-1 max-w-2xl">
              Feed SmartServe AI with restaurant data and continuously improve prediction accuracy.
            </p>
          </div>

          {/* Data Engine Status Panel */}
          <div className="bg-[#040d09]/80 backdrop-blur-md p-4 rounded-2xl border border-[#d4af37]/30 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-emerald-400">{engineStatus?.status || 'DATA ENGINE ONLINE'}</span>
            </div>
            <div className="h-6 w-px bg-gray-700 hidden sm:block" />
            <div>
              <span className="text-gray-400 block text-[10px]">DATA QUALITY</span>
              <span className="text-amber-300 font-bold text-sm">{engineStatus?.qualityPercent}%</span>
            </div>
            <div className="h-6 w-px bg-gray-700 hidden sm:block" />
            <div>
              <span className="text-gray-400 block text-[10px]">LAST UPDATE</span>
              <span className="text-white font-medium">{engineStatus?.lastUpdate}</span>
            </div>
            <div className="h-6 w-px bg-gray-700 hidden sm:block" />
            <div>
              <span className="text-gray-400 block text-[10px]">MODEL STATUS</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                {engineStatus?.modelStatus || 'Ready'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONNECTED DATA SOURCES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-700" /> Connected Data Sources
          </h2>
          <span className="text-xs text-gray-500">{connectedSources.length} Active Data Feeds</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {connectedSources.map((source) => (
            <div 
              key={source.id} 
              className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-emerald-500/40 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {source.status}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm group-hover:text-emerald-800 transition-colors">
                {source.name}
              </h3>
              <p className="text-lg font-extrabold text-emerald-950 mt-1">
                {source.records.toLocaleString()} <span className="text-xs font-normal text-gray-500">records</span>
              </p>
              <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1">
                <Activity className="w-3 h-3 text-emerald-600" /> {source.lastUpdated}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3 & 4. DATA TYPE SELECTION & CSV UPLOAD CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Data Type Selection */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-700" /> Select Data Category
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Select dataset type before uploading your CSV</p>
          </div>

          <div className="space-y-2">
            {['Sales', 'Waste', 'Food', 'Customer'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedDataType(type)}
                className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  selectedDataType === type 
                    ? 'bg-[#081c15] text-white border border-[#d4af37]/40 shadow-md' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>{type} Data</span>
                {selectedDataType === type && <Check className="w-4 h-4 text-[#d4af37]" />}
              </button>
            ))}
          </div>

          {/* Required Schema Columns Box */}
          <div className="p-4 rounded-2xl bg-[#f4f6f0] border border-gray-200 space-y-2">
            <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
              Required Schema Columns ({selectedDataType}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {requiredColumns.map((col, idx) => (
                <span key={idx} className="text-[10px] bg-white text-emerald-950 font-medium px-2 py-1 rounded-md border border-gray-200 shadow-2xs">
                  {col}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CSV Drag & Drop Upload Zone */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Upload className="w-5 h-5 text-emerald-700" /> Upload Restaurant Data
                </h3>
                <p className="text-xs text-gray-500">Upload CSV files containing historical sales, food or waste records.</p>
              </div>
              <button
                onClick={handleSampleDownload}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download Sample CSV
              </button>
            </div>

            {/* Drag & Drop Area */}
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
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 shadow-inner">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-gray-800">
                Drag & Drop CSV file here
              </p>
              <p className="text-xs text-gray-500 mt-1">or click to browse from your computer</p>

              <label className="mt-4 inline-block">
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileInputChange} 
                  className="hidden" 
                />
                <span className="bg-[#081c15] hover:bg-[#1b4332] text-white text-xs font-semibold px-4 py-2 rounded-xl border border-[#d4af37]/30 shadow-md cursor-pointer transition-colors inline-flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" /> Browse Files
                </span>
              </label>

              <p className="text-[10px] text-gray-400 mt-3">
                Supported: CSV • Maximum file size: 10 MB
              </p>
            </div>
          </div>

          {uploadFile && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between text-emerald-900">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-semibold truncate">{uploadFile.name}</span>
                <span className="text-gray-500">({(uploadFile.size / 1024).toFixed(1)} KB)</span>
              </div>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Uploaded</span>
            </div>
          )}
        </div>
      </div>

      {/* 5. DATA VALIDATION (ANIMATED PROCESS) */}
      {(isValidating || validationResult) && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-emerald-700" /> AI Data Validation Engine
            </h3>
            {validationResult && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Data Quality: {validationResult.dataQuality}%
              </span>
            )}
          </div>

          {/* Step Flow Animation */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[
              "Reading File",
              "Checking Columns",
              "Missing Values",
              "Duplicates",
              "Data Types",
              "Validating Records"
            ].map((stepName, idx) => {
              const isDone = validationResult ? true : idx < validationProgressStep;
              const isCurrent = isValidating && idx === validationProgressStep;

              return (
                <div 
                  key={idx} 
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isDone 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                      : isCurrent 
                        ? 'bg-amber-50 border-amber-400 text-amber-900 animate-pulse' 
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  <div className="w-6 h-6 mx-auto mb-1.5 flex items-center justify-center">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />
                    ) : (
                      <span className="text-xs font-bold text-gray-400">{idx + 1}</span>
                    )}
                  </div>
                  <span className="text-xs font-semibold block leading-tight">{stepName}</span>
                </div>
              );
            })}
          </div>

          {/* Summary Stat Counter */}
          {validationResult && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2">
              <div className="bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200 text-center">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Total Records</span>
                <span className="text-xl font-extrabold text-gray-900">{validationResult.totalRecords.toLocaleString()}</span>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center">
                <span className="text-[10px] text-emerald-700 font-bold uppercase block">Valid</span>
                <span className="text-xl font-extrabold text-emerald-700">{validationResult.validRecords.toLocaleString()}</span>
              </div>
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center">
                <span className="text-[10px] text-amber-700 font-bold uppercase block">Warnings</span>
                <span className="text-xl font-extrabold text-amber-700">{validationResult.warningsCount}</span>
              </div>
              <div className="bg-red-50 p-4 rounded-2xl border border-red-200 text-center">
                <span className="text-[10px] text-red-700 font-bold uppercase block">Errors</span>
                <span className="text-xl font-extrabold text-red-700">{validationResult.errorsCount}</span>
              </div>
              <div className="bg-[#081c15] text-white p-4 rounded-2xl border border-[#d4af37]/30 text-center">
                <span className="text-[10px] text-[#d4af37] font-bold uppercase block">Data Quality</span>
                <span className="text-xl font-extrabold text-amber-300">{validationResult.dataQuality}%</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. DATA QUALITY CENTER */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" /> Data Quality Center
            </h2>
            <p className="text-xs text-gray-500">Live health metrics evaluating integrity before model training</p>
          </div>

          <button
            onClick={handleImproveQuality}
            disabled={isCleaningData}
            className="bg-[#081c15] hover:bg-[#1b4332] text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-[#d4af37]/30 shadow-md flex items-center gap-2 cursor-pointer transition-colors"
          >
            {isCleaningData ? (
              <>
                <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                Running Imputation Pipeline...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                Improve Data Quality
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: 'Completeness', value: qualityMetrics?.completeness || 96, color: 'text-emerald-700', barBg: 'bg-emerald-500' },
            { label: 'Accuracy', value: qualityMetrics?.accuracy || 93, color: 'text-emerald-700', barBg: 'bg-emerald-500' },
            { label: 'Consistency', value: qualityMetrics?.consistency || 95, color: 'text-emerald-700', barBg: 'bg-emerald-500' },
            { label: 'Duplicates', value: `${qualityMetrics?.duplicates || 1.2}%`, color: 'text-amber-700', barBg: 'bg-amber-500', isBad: true },
            { label: 'Missing Values', value: `${qualityMetrics?.missingValues || 2.8}%`, color: 'text-amber-700', barBg: 'bg-amber-500', isBad: true }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200 space-y-2">
              <span className="text-[11px] font-bold text-gray-600 block">{item.label}</span>
              <p className={`text-2xl font-extrabold ${item.color}`}>
                {typeof item.value === 'number' ? `${item.value}%` : item.value}
              </p>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${item.barBg}`} 
                  style={{ width: typeof item.value === 'number' ? `${item.value}%` : `${parseFloat(item.value) * 10}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. DATA PREVIEW TABLE */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-700" /> Data Records Preview
            </h3>
            <p className="text-xs text-gray-500">Search, filter and inspect uploaded records</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Search items..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-emerald-600 w-44"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#081c15] text-white">
                <th className="p-3 rounded-l-xl">Date</th>
                <th className="p-3">Food Item</th>
                <th className="p-3">Quantity Sold</th>
                <th className="p-3">Price (₹)</th>
                <th className="p-3">Weather Factor</th>
                <th className="p-3">Holiday</th>
                <th className="p-3 rounded-r-xl">Waste (portions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedRecords.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-semibold text-gray-800">{row.date}</td>
                  <td className="p-3 font-bold text-emerald-950">{row.foodItem}</td>
                  <td className="p-3 font-semibold text-gray-700">{row.quantity}</td>
                  <td className="p-3 font-medium text-gray-600">₹{row.price}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                      {row.weather}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-semibold ${row.holiday !== 'No' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>
                      {row.holiday}
                    </span>
                  </td>
                  <td className="p-3 text-orange-700 font-bold">{row.waste}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
          <span>Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} entries</span>
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

      {/* 8. AI FEATURE ENGINEERING */}
      <div className="bg-[#040d09] text-white p-6 md:p-8 rounded-3xl border border-[#1b4332] shadow-2xl space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4332] text-amber-300 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5 text-amber-400" /> Automated ML Pipelines
          </div>
          <h2 className="text-2xl font-bold font-heading text-white">
            AI Features Generated From Your Data
          </h2>
          <p className="text-gray-300 text-xs mt-1">
            SmartServe AI automatically extracts non-linear time series signals and environmental vectors from raw CSVs.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {featuresList.map((feat, idx) => (
            <div 
              key={idx} 
              className="bg-[#081c15] p-4 rounded-2xl border border-[#1b4332] hover:border-[#d4af37]/40 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1b4332] text-amber-300 border border-[#d4af37]/20">
                  {feat.impact} Impact
                </span>
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                {feat.name}
              </h4>
              <p className="text-[10px] text-gray-400">{feat.category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 9. MODEL LEARNING STATUS & RETRAINING */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-emerald-700" /> AI Learning Status
            </h2>
            <p className="text-xs text-gray-500">Model training history and accuracy metrics</p>
          </div>

          <button
            onClick={handleRetrainModel}
            disabled={isTraining}
            className="bg-[#081c15] hover:bg-[#1b4332] text-white text-xs font-semibold px-5 py-2.5 rounded-xl border border-[#d4af37]/30 shadow-md flex items-center gap-2 cursor-pointer transition-colors"
          >
            {isTraining ? (
              <>
                <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                Training Model...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-[#d4af37]" />
                Retrain AI Model
              </>
            )}
          </button>
        </div>

        {/* Retraining Progress Bar */}
        {isTraining && (
          <div className="bg-[#040d09] text-white p-5 rounded-2xl border border-[#1b4332] space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-bold flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                {trainStepText}
              </span>
              <span className="font-extrabold text-white">{trainProgress}%</span>
            </div>
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-[#d4af37] transition-all duration-300"
                style={{ width: `${trainProgress}%` }}
              />
            </div>
          </div>
        )}

        {trainingSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Model Updated Successfully ✓ (New Accuracy: 96.8%)
            </span>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">Active</span>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200">
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Training Dataset</span>
            <span className="text-xl font-extrabold text-gray-900">{learningStatus?.trainingDatasetRecords.toLocaleString()}</span>
            <span className="text-[10px] text-gray-500 block">records</span>
          </div>
          <div className="bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200">
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Training Status</span>
            <span className="text-lg font-extrabold text-emerald-700">{learningStatus?.trainingStatus}</span>
            <span className="text-[10px] text-gray-500 block">Epochs: {learningStatus?.epochsCompleted}</span>
          </div>
          <div className="bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200">
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Last Model Update</span>
            <span className="text-sm font-extrabold text-gray-900 block mt-1">{learningStatus?.lastModelUpdate}</span>
          </div>
          <div className="bg-[#081c15] text-white p-4 rounded-2xl border border-[#d4af37]/30">
            <span className="text-[10px] text-[#d4af37] font-bold uppercase block">Model Accuracy</span>
            <span className="text-2xl font-extrabold text-amber-300">{learningStatus?.modelAccuracy}</span>
          </div>
          <div className="bg-[#f4f6f0] p-4 rounded-2xl border border-gray-200">
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Prediction Error</span>
            <span className="text-xl font-extrabold text-emerald-800">{learningStatus?.predictionError}</span>
            <span className="text-[10px] text-gray-500 block">MAE loss</span>
          </div>
        </div>
      </div>

      {/* 10. MODEL PERFORMANCE CHARTS */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-heading text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-700" /> Model Performance Charts
            </h2>
            <p className="text-xs text-gray-500">Actual vs Predicted demand convergence over time</p>
          </div>

          <div className="flex items-center gap-1 bg-[#f4f6f0] p-1 rounded-xl border border-gray-200">
            {['7 Days', '30 Days', '90 Days'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  timeRange === range 
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
            <AreaChart data={performanceCharts}>
              <defs>
                <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="gradPred" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#081c15', borderRadius: '12px', border: '1px solid #d4af37', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="actual" name="Actual Sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#gradActual)" />
              <Area type="monotone" dataKey="predicted" name="AI Predicted Demand" stroke="#d4af37" strokeWidth={3} strokeDasharray="4 4" fillOpacity={1} fill="url(#gradPred)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 11 & 12. DATA IMPACT FLOW & AI LEARNING INSIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Data Impact Connected Nodes */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-700" /> How Data Improves AI
          </h3>
          <p className="text-xs text-gray-500">Connected intelligence flow from raw ingestion to operational gain</p>

          <div className="space-y-3">
            {impactNodes.map((node, idx) => (
              <div 
                key={idx} 
                className="p-3.5 rounded-2xl bg-[#f4f6f0] border border-gray-200 flex items-center justify-between gap-3 text-xs"
              >
                <span className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" /> {node.step}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="font-extrabold text-emerald-950 bg-white px-3 py-1 rounded-xl border border-gray-200 shadow-2xs">
                  {node.result}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Learning Insight Highlight */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#081c15] to-[#1b4332] text-white p-6 rounded-3xl border border-[#d4af37]/40 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#d4af37]/20 text-amber-300 text-[10px] font-bold border border-[#d4af37]/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> New Pattern Discovered
            </div>
            <h3 className="font-bold text-white text-base">
              {learningInsight?.title}
            </h3>
            <p className="text-gray-200 text-xs mt-2 leading-relaxed">
              "{learningInsight?.insightText}"
            </p>
          </div>

          <div className="space-y-3 pt-3 border-t border-[#1b4332]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Model Confidence:</span>
              <span className="text-amber-300 font-extrabold">{learningInsight?.confidence}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#040d09]/80 border border-emerald-500/30 text-xs">
              <span className="text-emerald-400 font-bold block mb-1">Recommended Action:</span>
              <p className="text-gray-300">{learningInsight?.recommendation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 13. DATA HEALTH ALERTS */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" /> Data Health Alerts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {healthAlerts.map((alt) => (
            <div 
              key={alt.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between space-y-2 ${
                alt.type === 'warning' 
                  ? 'bg-amber-50/60 border-amber-200 text-amber-950' 
                  : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs flex items-center gap-2">
                  {alt.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {alt.text}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${alt.type === 'warning' ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'}`}>
                  {alt.action}
                </span>
              </div>
              <p className="text-[11px] text-gray-600">{alt.impact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 14. DATA PRIVACY */}
      <div className="bg-[#f4f6f0] p-6 rounded-3xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-800 shrink-0" />
          <div>
            <h4 className="font-bold text-gray-900">Data Privacy & Security Standard</h4>
            <p className="text-[11px] text-gray-500">Restaurant data is used strictly for analytics, demand prediction, and operational insights.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 font-semibold text-gray-700 text-[10px]">Controlled Access</span>
          <span className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 font-semibold text-gray-700 text-[10px]">Protected API</span>
          <span className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 font-semibold text-gray-700 text-[10px]">Isolated Tenant</span>
        </div>
      </div>
    </div>
  );
}
