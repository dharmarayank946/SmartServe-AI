// SmartServe AI - Unified REST API & Simulated AI Model Layer

import { 
  INITIAL_FOOD_ITEMS, 
  INITIAL_PREDICTIONS, 
  INITIAL_AI_INSIGHTS, 
  HISTORICAL_SALES_TRENDS,
  HOURLY_DEMAND_CURVE,
  WASTE_BY_REASON,
  MOST_WASTED_ITEMS,
  WEATHER_FORECAST,
  RESTAURANT_PROFILE,
  REALTIME_ALERTS,
  EXPLAINS_WHY_FACTORS,
  BUSINESS_IMPACT_METRICS,
  DIGITAL_TWIN_NODES
} from './mockData';

class ApiService {
  constructor() {
    // Read from localStorage if stored, else use initial values
    const storedConfig = localStorage.getItem('smartserve_config');
    this.config = storedConfig ? JSON.parse(storedConfig) : { ...RESTAURANT_PROFILE };

    this.foodItems = this.loadState('smartserve_food_items', INITIAL_FOOD_ITEMS);
    this.predictions = this.loadState('smartserve_predictions', INITIAL_PREDICTIONS);
    this.insights = this.loadState('smartserve_insights', INITIAL_AI_INSIGHTS);
    this.salesHistory = this.loadState('smartserve_sales', HISTORICAL_SALES_TRENDS);
    this.wasteLog = this.loadState('smartserve_waste', MOST_WASTED_ITEMS);
  }

  loadState(key, fallback) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  }

  saveState(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Configuration management
  getConfig() {
    return this.config;
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('smartserve_config', JSON.stringify(this.config));
    return this.config;
  }

  // Test Connection to FastAPI Backend
  async testFastApiConnection(endpointUrl) {
    const target = endpointUrl || this.config.apiEndpoint;
    try {
      const response = await fetch(`${target}/health`, { 
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000)
      });
      if (response.ok) {
        const data = await response.json();
        return { status: 'connected', message: 'Successfully connected to FastAPI AI Backend', data };
      }
      return { status: 'error', message: `FastAPI responded with HTTP status ${response.status}` };
    } catch (err) {
      return { 
        status: 'simulated', 
        message: `FastAPI server offline at ${target}. Using built-in SmartServe AI Engine (Demo Mode).`,
        details: err.message 
      };
    }
  }

  // Telemetry APIs
  getRealtimeAlerts() {
    return REALTIME_ALERTS;
  }

  getExplainableFactors() {
    return EXPLAINS_WHY_FACTORS;
  }

  getBusinessImpactMetrics() {
    return BUSINESS_IMPACT_METRICS;
  }

  getDigitalTwinNodes() {
    return DIGITAL_TWIN_NODES;
  }

  // Food Items
  getFoodItems() {
    return this.foodItems;
  }

  addFoodItem(newItem) {
    const item = {
      id: `item-${Date.now().toString().slice(-4)}`,
      avgDailySales: newItem.avgDailySales || 30,
      currentStock: newItem.currentStock || 40,
      aiOptimized: true,
      ...newItem
    };
    this.foodItems = [item, ...this.foodItems];
    this.saveState('smartserve_food_items', this.foodItems);
    return item;
  }

  updateFoodItem(id, updatedFields) {
    this.foodItems = this.foodItems.map(item => item.id === id ? { ...item, ...updatedFields } : item);
    this.saveState('smartserve_food_items', this.foodItems);
    return this.foodItems.find(i => i.id === id);
  }

  deleteFoodItem(id) {
    this.foodItems = this.foodItems.filter(item => item.id !== id);
    this.saveState('smartserve_food_items', this.foodItems);
    return true;
  }

  // Demand Prediction Engine
  getPredictions() {
    return this.predictions;
  }

  predictSingleItem(itemId, targetDate, weatherCondition = 'Sunny', isWeekend = false, options = {}) {
    const item = this.foodItems.find(i => i.id === itemId) || this.foodItems[0];
    const baseDemand = options.historicalSales ? Number(options.historicalSales) : item.avgDailySales;
    
    let multiplier = 1.0;
    const factorImpacts = [];

    factorImpacts.push({ name: "Historical Sales", impact: "High Impact", level: "high", color: "bg-[#1b4332] text-white" });

    if (isWeekend || options.dayOfWeek === 'Friday' || options.dayOfWeek === 'Saturday' || options.dayOfWeek === 'Sunday') {
      multiplier += 0.18;
      factorImpacts.push({ name: "Day Pattern (Weekend Peak)", impact: "High Impact", level: "high", color: "bg-[#1b4332] text-white" });
    } else {
      factorImpacts.push({ name: "Day Pattern (Weekday Regular)", impact: "Medium Impact", level: "medium", color: "bg-blue-100 text-blue-900" });
    }

    if (options.holidayEvent && options.holidayEvent !== 'None') {
      multiplier += 0.25;
      factorImpacts.push({ name: `Holiday/Event (${options.holidayEvent})`, impact: "High Impact", level: "high", color: "bg-[#1b4332] text-white" });
    } else {
      factorImpacts.push({ name: "Holiday/Event (Regular Day)", impact: "Low Impact", level: "low", color: "bg-gray-100 text-gray-700" });
    }

    const rainProb = options.rainProb !== undefined ? Number(options.rainProb) : (weatherCondition.includes('Rain') ? 75 : 15);
    if (rainProb > 50 || weatherCondition.includes('Rain')) {
      if (item.category === 'Beverages') {
        multiplier -= 0.22;
        factorImpacts.push({ name: "Weather (Rain / Cool - Beverage Dip)", impact: "High Impact", level: "high", color: "bg-orange-100 text-orange-900" });
      } else {
        multiplier += 0.15;
        factorImpacts.push({ name: "Weather (Rain / Cool - Hot Meal Surge)", impact: "Medium Impact", level: "medium", color: "bg-[#d4af37]/20 text-amber-900" });
      }
    } else {
      factorImpacts.push({ name: "Weather (Clear & Pleasant)", impact: "Medium Impact", level: "medium", color: "bg-[#d4af37]/20 text-amber-900" });
    }

    const predictedDemand = Math.max(10, Math.round(baseDemand * multiplier));
    const bufferPercent = (this.config.aiPrepSafetyBufferPercent || 6) / 100;
    const recommendedPrep = Math.round(predictedDemand * (1 + bufferPercent));
    const expectedWaste = Math.max(2, Math.round(recommendedPrep - predictedDemand));
    const confidence = Math.min(96, Math.max(88, 92 + (Math.sin(predictedDemand) * 3)));
    const trendPercent = Math.round(((predictedDemand - baseDemand) / baseDemand) * 100);

    const explanation = `Demand is expected to ${trendPercent >= 0 ? 'increase' : 'decrease'} because ${item.name} has shown ${trendPercent >= 0 ? 'higher' : 'lower'} sales on similar ${options.dayOfWeek || 'weekdays'} (${weatherCondition} weather factor applied) and recent sales are trending ${trendPercent >= 0 ? 'upward' : 'downward'}.`;

    return {
      itemId: item.id,
      itemName: item.name,
      category: item.category,
      predictedDemand,
      recommendedPrep,
      confidence: Math.round(confidence),
      expectedWaste,
      shortageRisk: expectedWaste < 5 ? "Low" : "Medium",
      unit: item.unit || "Portions",
      trendPercent: trendPercent >= 0 ? `+${trendPercent}%` : `${trendPercent}%`,
      trendIsUp: trendPercent >= 0,
      factorImpacts,
      explanation,
      targetDate,
      weatherCondition
    };
  }

  // Preparation Recommendations
  getPrepRecommendations() {
    return this.predictions.map(pred => {
      const item = this.foodItems.find(i => i.id === pred.itemId);
      return {
        ...pred,
        itemPrice: item ? item.price : 200,
        itemCost: item ? item.cost : 70
      };
    });
  }

  // Sales Log & CSV Simulator
  getSalesTrends() {
    return this.salesHistory;
  }

  addSalesEntry(entry) {
    const newEntry = {
      day: entry.day || "Today",
      date: entry.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      actual: Number(entry.actual),
      predicted: Number(entry.predicted || entry.actual),
      waste: Number(entry.waste || 15),
      costSaved: Math.round(Number(entry.actual) * 3.5)
    };
    this.salesHistory = [...this.salesHistory, newEntry];
    this.saveState('smartserve_sales', this.salesHistory);
    return newEntry;
  }

  // Waste Log
  getWasteData() {
    return {
      wasteByReason: WASTE_BY_REASON,
      mostWastedItems: this.wasteLog,
      totalWasteKg: this.wasteLog.reduce((acc, curr) => acc + curr.wastedQty, 0),
      totalLossRupees: this.wasteLog.reduce((acc, curr) => acc + curr.financialLoss, 0),
      totalCo2SavedKg: 142.5
    };
  }

  recordWasteEntry(entry) {
    const newWaste = {
      name: entry.itemName,
      wastedQty: Number(entry.qty),
      unit: entry.unit || "plates",
      financialLoss: Number(entry.financialLoss || entry.qty * 80),
      co2Kg: Number((entry.qty * 0.45).toFixed(1)),
      reason: entry.reason,
      date: new Date().toLocaleDateString()
    };
    this.wasteLog = [newWaste, ...this.wasteLog];
    this.saveState('smartserve_waste', this.wasteLog);
    return newWaste;
  }

  getSustainabilityScore() {
    return {
      overallScore: 78,
      status: "Good — your restaurant is moving toward smarter preparation.",
      metrics: {
        wasteReduction: 82,
        preparationAccuracy: 76,
        resourceEfficiency: 75
      }
    };
  }

  getWasteHeatmap() {
    return {
      byDay: [
        { name: "Monday", level: "Low", value: 15, intensity: "bg-emerald-100 text-emerald-900 border-emerald-300" },
        { name: "Tuesday", level: "Medium", value: 24, intensity: "bg-amber-100 text-amber-900 border-amber-300" },
        { name: "Wednesday", level: "High", value: 42, intensity: "bg-orange-100 text-orange-900 border-orange-300" },
        { name: "Thursday", level: "Low", value: 18, intensity: "bg-emerald-100 text-emerald-900 border-emerald-300" },
        { name: "Friday", level: "High", value: 48, intensity: "bg-orange-100 text-orange-900 border-orange-300" },
        { name: "Saturday", level: "Very High", value: 65, intensity: "bg-red-100 text-red-900 border-red-300" },
        { name: "Sunday", level: "Medium", value: 32, intensity: "bg-amber-100 text-amber-900 border-amber-300" }
      ],
      byTime: [
        { name: "Breakfast (8-11 AM)", level: "Medium", value: 25, intensity: "bg-amber-100 text-amber-900 border-amber-300" },
        { name: "Lunch Rush (12-3 PM)", level: "Very High", value: 62, intensity: "bg-red-100 text-red-900 border-red-300" },
        { name: "Afternoon Slump (3-5 PM)", level: "High", value: 45, intensity: "bg-orange-100 text-orange-900 border-orange-300" },
        { name: "Dinner Rush (7-10 PM)", level: "High", value: 40, intensity: "bg-orange-100 text-orange-900 border-orange-300" },
        { name: "Late Night (10 PM+)", level: "Low", value: 12, intensity: "bg-emerald-100 text-emerald-900 border-emerald-300" }
      ],
      byItem: [
        { name: "Paneer Curry", level: "High", value: 48, intensity: "bg-red-100 text-red-900 border-red-300" },
        { name: "Veg Biryani", level: "Medium", value: 30, intensity: "bg-amber-100 text-amber-900 border-amber-300" },
        { name: "Cold Coffee", level: "Medium", value: 26, intensity: "bg-amber-100 text-amber-900 border-amber-300" },
        { name: "Fresh Salad", level: "High", value: 42, intensity: "bg-orange-100 text-orange-900 border-orange-300" },
        { name: "Masala Dosa", level: "Low", value: 14, intensity: "bg-emerald-100 text-emerald-900 border-emerald-300" }
      ]
    };
  }

  getTomorrowWasteRisk() {
    return [
      { name: "Veg Biryani", risk: "LOW", score: 18, predictedWaste: 3, action: "Maintain 5-portion safety buffer", color: "bg-emerald-100 text-emerald-900 border-emerald-300" },
      { name: "Paneer Curry", risk: "HIGH", score: 78, predictedWaste: 12, action: "Reduce prep by 8 portions", color: "bg-red-100 text-red-900 border-red-300" },
      { name: "Masala Dosa", risk: "MEDIUM", score: 45, predictedWaste: 6, action: "Shift to 2-stage dynamic batching", color: "bg-amber-100 text-amber-900 border-amber-300" },
      { name: "Cold Coffee", risk: "MEDIUM", score: 52, predictedWaste: 5, action: "Reduce milk base prep due to rain", color: "bg-amber-100 text-amber-900 border-amber-300" }
    ];
  }

  getPredictionVsWasteData() {
    return [
      { day: "Mon", predicted: 350, actual: 340, prepared: 368, wasted: 28 },
      { day: "Tue", predicted: 375, actual: 380, prepared: 402, wasted: 22 },
      { day: "Wed", predicted: 405, actual: 410, prepared: 429, wasted: 19 },
      { day: "Thu", predicted: 450, actual: 440, prepared: 455, wasted: 15 },
      { day: "Fri", predicted: 580, actual: 590, prepared: 608, wasted: 18 },
      { day: "Sat", predicted: 690, actual: 680, prepared: 704, wasted: 24 },
      { day: "Sun", predicted: 630, actual: 640, prepared: 660, wasted: 20 }
    ];
  }

  // AI Insights
  getAiInsights() {
    return this.insights;
  }

  addAiInsight(insight) {
    const newIns = {
      id: `ins-${Date.now().toString().slice(-4)}`,
      time: "Just now",
      ...insight
    };
    this.insights = [newIns, ...this.insights];
    this.saveState('smartserve_insights', this.insights);
    return newIns;
  }

  // Hourly curve & Weather
  getHourlyDemand() {
    return HOURLY_DEMAND_CURVE;
  }

  getWeatherForecast() {
    return WEATHER_FORECAST;
  }

  getRestaurantIntelligenceScore() {
    return {
      overallScore: 86,
      status: "Excellent — restaurant operating with high predictive precision",
      metrics: {
        demandAccuracy: 94,
        wasteEfficiency: 78,
        preparationEfficiency: 91,
        forecastReliability: 89
      }
    };
  }

  getFoodPerformanceMatrix() {
    return [
      { name: "Veg Biryani", demand: 85, growth: "↑12%", growthIsUp: true, accuracy: 96, waste: "Low", profitImpact: "High", action: "Increase", category: "Main Course", cost: 85, price: 240, aiExplanation: "High Friday dinner footfall pattern. Recommended prep: 90 portions." },
      { name: "Paneer Curry", demand: 62, growth: "↓4%", growthIsUp: false, accuracy: 88, waste: "High", profitImpact: "Medium", action: "Reduce", category: "Main Course", cost: 95, price: 280, aiExplanation: "Preparation has consistently exceeded actual demand during weekdays." },
      { name: "Masala Dosa", demand: 110, growth: "↑18%", growthIsUp: true, accuracy: 94, waste: "Low", profitImpact: "High", action: "Increase", category: "Main Course", cost: 35, price: 140, aiExplanation: "Surge in breakfast orders between 8:30-10:30 AM." },
      { name: "Cold Coffee", demand: 42, growth: "↓15%", growthIsUp: false, accuracy: 90, waste: "High", profitImpact: "Medium", action: "Reduce", category: "Beverages", cost: 35, price: 130, aiExplanation: "Evening rainfall forecast reduces cold beverage demand by ~22%." },
      { name: "Chicken Dum Biryani", demand: 125, growth: "↑25%", growthIsUp: true, accuracy: 97, waste: "Low", profitImpact: "High", action: "Increase", category: "Main Course", cost: 120, price: 320, aiExplanation: "Weekend peak revenue driver." },
      { name: "Fresh Garden Salad", demand: 30, growth: "↓10%", growthIsUp: false, accuracy: 82, waste: "High", profitImpact: "Low", action: "Reduce", category: "Appetizers", cost: 40, price: 150, aiExplanation: "Batching in smaller 10-bowl units prevents Monday over-prep waste." }
    ];
  }

  getComparisonThisVsLastWeek() {
    return [
      { metric: "Revenue (₹)", thisWeek: 348500, lastWeek: 312000, change: "+11.7%", isPositive: true },
      { metric: "Food Demand (portions)", thisWeek: 7590, lastWeek: 7100, change: "+6.9%", isPositive: true },
      { metric: "Food Waste (portions)", thisWeek: 286, lastWeek: 348, change: "-17.8%", isPositive: true },
      { metric: "Prep Accuracy (%)", thisWeek: 94.2, lastWeek: 87.4, change: "+6.8%", isPositive: true },
      { metric: "Savings Recovered (₹)", thisWeek: 18400, lastWeek: 14200, change: "+29.5%", isPositive: true }
    ];
  }

  generateAnalyticsReport() {
    return {
      title: "SmartServe AI - Executive Restaurant Intelligence Report",
      generatedAt: new Date().toLocaleString(),
      restaurant: "SmartServe Grand Bistro",
      branch: "HYD-BLR-04",
      period: "Last 30 Days",
      executiveSummary: {
        totalRevenue: "₹3,48,500",
        totalOrders: "7,590 portions",
        predictionAccuracy: "94.2%",
        wasteReductionRate: "23%",
        totalSavings: "₹18,400"
      },
      topRecommendations: [
        "Increase Veg Biryani prep by 8 portions during Friday dinner peak",
        "Reduce Paneer Curry weekday prep batch by 10 portions",
        "Implement 2-stage batching for Cold Coffee on rainy afternoons"
      ]
    };
  }

  getSimulationHistory() {
    return this.loadState('smartserve_sim_history', [
      { date: "Oct 06", food: "Veg Biryani", scenario: "Weekend Festival", predicted: 92, recommended: 98, confidence: "94%" },
      { date: "Oct 05", food: "Paneer Curry", scenario: "Weekday Lunch", predicted: 62, recommended: 65, confidence: "91%" },
      { date: "Oct 04", food: "Cold Coffee", scenario: "Rainy Afternoon", predicted: 36, recommended: 40, confidence: "89%" },
      { date: "Oct 03", food: "Masala Dosa", scenario: "Morning Rush", predicted: 110, recommended: 116, confidence: "95%" }
    ]);
  }

  saveSimulationScenario(scenario) {
    const history = this.getSimulationHistory();
    const updated = [scenario, ...history];
    this.saveState('smartserve_sim_history', updated);
    return updated;
  }

  simulateScenario(options) {
    const baseSales = options.historicalSales ? Number(options.historicalSales) : 80;
    const customers = options.expectedCustomers ? Number(options.expectedCustomers) : 120;
    let multiplier = (customers / 100) * 0.7 + (baseSales / 80) * 0.3;

    if (options.day === 'Friday' || options.day === 'Saturday' || options.day === 'Sunday') {
      multiplier += 0.12;
    }
    if (options.holiday !== 'No' && options.holiday !== 'None') {
      multiplier += 0.25;
    }
    if (options.specialEvent && options.specialEvent !== 'None') {
      multiplier += 0.18;
    }

    const rainProb = options.rainProb !== undefined ? Number(options.rainProb) : 10;
    if (options.weather === 'Heavy Rain' || rainProb > 50) {
      if (options.foodName && options.foodName.includes('Coffee')) {
        multiplier -= 0.22;
      } else {
        multiplier += 0.14;
      }
    }

    const predictedDemand = Math.max(15, Math.round(baseSales * multiplier));
    const recommendedPrep = Math.round(predictedDemand * 1.06);
    const expectedWaste = Math.max(2, Math.round(recommendedPrep - predictedDemand));
    const confidence = Math.min(96, Math.max(88, 92 + Math.round(Math.random() * 4)));

    const factors = [
      { name: "Customer Count", change: `+${Math.round((customers / 100 - 1) * 100)}%`, width: "88%", color: "#1b4332" },
      { name: "Weekend Pattern", change: "+12%", width: "64%", color: "#2d6a4f" },
      { name: "Event Impact", change: options.specialEvent !== 'None' ? "+18%" : "+0%", width: "48%", color: "#d4af37" },
      { name: "Weather Factor", change: rainProb > 50 ? "+14%" : "-3%", width: "32%", color: "#3b82f6" }
    ];

    return {
      predictedDemand,
      recommendedPrep,
      expectedWaste,
      shortageRisk: expectedWaste < 5 ? "LOW" : "MEDIUM",
      confidence,
      factors,
      aiDecisionText: `Prepare approximately ${recommendedPrep} portions.`,
      aiExplanation: `This recommendation provides a 6% safety buffer (${recommendedPrep - predictedDemand} portions) while keeping expected waste low.`
    };
  }

  runStressTest(testType) {
    switch (testType) {
      case 'Demand Spike':
        return {
          title: "DEMAND SPIKE SIMULATION",
          predictedChange: "+32%",
          predictedDemand: 118,
          recommendedPrep: 125,
          kitchenCapacity: "78%",
          shortageRisk: "HIGH",
          recommendation: "Increase preparation and kitchen capacity immediately.",
          aiInsight: "Under severe demand spike, pre-allocate batch 1 by 15 mins to prevent order queue backup."
        };
      case 'Heavy Rain':
        return {
          title: "HEAVY RAIN SIMULATION",
          predictedChange: "-22% Beverages / +14% Hot Meals",
          predictedDemand: 72,
          recommendedPrep: 78,
          kitchenCapacity: "62%",
          shortageRisk: "LOW",
          recommendation: "Scale down cold beverage prep base and shift capacity to hot soups & biryanis.",
          aiInsight: "Heavy rain shifts customer preference to hot comfort dishes."
        };
      case 'Festival':
        return {
          title: "FESTIVAL SURGE SIMULATION",
          predictedChange: "+45%",
          predictedDemand: 135,
          recommendedPrep: 142,
          kitchenCapacity: "92%",
          shortageRisk: "HIGH",
          recommendation: "Pre-order raw ingredients and schedule extra kitchen prep staff.",
          aiInsight: "Festivals double family dine-in orders; increase prep safety buffer to 8%."
        };
      case 'Sudden Drop':
        return {
          title: "SUDDEN FOOTFALL DROP SIMULATION",
          predictedChange: "-30%",
          predictedDemand: 56,
          recommendedPrep: 60,
          kitchenCapacity: "45%",
          shortageRisk: "VERY LOW",
          recommendation: "Shift kitchen prep to 2-stage dynamic batching to avoid over-prep waste.",
          aiInsight: "Dynamic batching prevents 15+ portions from spoiling."
        };
      case 'Weekend Rush':
        return {
          title: "WEEKEND DINNER RUSH SIMULATION",
          predictedChange: "+28%",
          predictedDemand: 112,
          recommendedPrep: 118,
          kitchenCapacity: "85%",
          shortageRisk: "MEDIUM",
          recommendation: "Pre-marinate batch 1 and pre-heat griddles by 6:30 PM.",
          aiInsight: "Weekend dinner peak requires fast turnaround times."
        };
      default:
        return this.runStressTest('Demand Spike');
    }
  }

  getKitchenStatus() {
    return {
      status: "KITCHEN SYSTEM ONLINE",
      currentService: "Dinner Shift",
      currentTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      lastAiUpdate: "2 minutes ago",
      customerDemand: "HIGH",
      kitchenCapacity: 82,
      prepProgress: 68,
      shortageRisk: "LOW",
      wasteRisk: "MEDIUM"
    };
  }

  getKitchenPreparationPlan(servicePeriod = 'Dinner') {
    const plans = {
      Breakfast: [
        { id: "kp-1", food: "Masala Dosa", predictedDemand: 110, recommendedPrep: 115, prepared: 82, risk: "MEDIUM", action: "Prepare More", color: "bg-amber-50 border-amber-200" },
        { id: "kp-2", food: "Cold Coffee", predictedDemand: 30, recommendedPrep: 35, prepared: 30, risk: "LOW", action: "On Track", color: "bg-[#f4f6f0] border-gray-200" },
        { id: "kp-3", food: "Fresh Garden Salad", predictedDemand: 15, recommendedPrep: 18, prepared: 15, risk: "LOW", action: "On Track", color: "bg-[#f4f6f0] border-gray-200" }
      ],
      Lunch: [
        { id: "kp-4", food: "Veg Biryani", predictedDemand: 85, recommendedPrep: 90, prepared: 70, risk: "LOW", action: "On Track", color: "bg-[#f4f6f0] border-gray-200" },
        { id: "kp-5", food: "Paneer Curry", predictedDemand: 62, recommendedPrep: 65, prepared: 60, risk: "HIGH", action: "Prepare Now", color: "bg-red-50 border-red-200" },
        { id: "kp-6", food: "Chicken Dum Biryani", predictedDemand: 125, recommendedPrep: 130, prepared: 100, risk: "LOW", action: "On Track", color: "bg-[#f4f6f0] border-gray-200" }
      ],
      Evening: [
        { id: "kp-7", food: "Masala Dosa", predictedDemand: 110, recommendedPrep: 115, prepared: 82, risk: "MEDIUM", action: "Prepare More", color: "bg-amber-50 border-amber-200" },
        { id: "kp-8", food: "Cold Coffee", predictedDemand: 42, recommendedPrep: 45, prepared: 40, risk: "MEDIUM", action: "Monitor", color: "bg-amber-50 border-amber-200" }
      ],
      Dinner: [
        { id: "kp-9", food: "Veg Biryani", predictedDemand: 85, recommendedPrep: 90, prepared: 70, risk: "LOW", action: "On Track", color: "bg-[#f4f6f0] border-gray-200" },
        { id: "kp-10", food: "Masala Dosa", predictedDemand: 110, recommendedPrep: 115, prepared: 82, risk: "MEDIUM", action: "Prepare More", color: "bg-amber-50 border-amber-200" },
        { id: "kp-11", food: "Paneer Curry", predictedDemand: 62, recommendedPrep: 65, prepared: 60, risk: "HIGH", action: "Prepare Now", color: "bg-red-50 border-red-200" },
        { id: "kp-12", food: "Cold Coffee", predictedDemand: 42, recommendedPrep: 45, prepared: 40, risk: "MEDIUM", action: "Monitor", color: "bg-amber-50 border-amber-200" },
        { id: "kp-13", food: "Chicken Dum Biryani", predictedDemand: 125, recommendedPrep: 130, prepared: 100, risk: "LOW", action: "On Track", color: "bg-[#f4f6f0] border-gray-200" },
        { id: "kp-14", food: "Fresh Garden Salad", predictedDemand: 30, recommendedPrep: 32, prepared: 28, risk: "HIGH", action: "Prepare Now", color: "bg-red-50 border-red-200" }
      ]
    };
    return plans[servicePeriod] || plans.Dinner;
  }

  getKitchenPriorityQueue() {
    return [
      { id: 1, food: "Paneer Curry", priority: "HIGH", icon: "🔴", reason: "Only 5 portions remaining.", action: "Prepare 5 portions now" },
      { id: 2, food: "Masala Dosa", priority: "MEDIUM", icon: "🟠", reason: "Evening demand is increasing.", action: "Increase prep by 15 portions" },
      { id: 3, food: "Veg Biryani", priority: "LOW", icon: "🟢", reason: "Preparation is currently on track.", action: "Maintain current batch rate" }
    ];
  }

  getKitchenShortages() {
    return [
      {
        food: "Masala Dosa",
        estimatedShortageTime: "7:45 PM",
        predictedRemainingDemand: 23,
        currentAvailability: 12,
        recommendedAction: "Prepare 15 additional portions.",
        urgency: "HIGH"
      }
    ];
  }

  getKitchenWastePrevention() {
    return [
      { food: "Paneer Curry", prepared: 65, predictedSales: 62, expectedWaste: 3, status: "OPTIMAL", action: "Maintain prep limit", badgeColor: "bg-emerald-100 text-emerald-900" },
      { food: "Cold Coffee", prepared: 80, predictedSales: 48, expectedWaste: 32, status: "HIGH RISK", action: "Reduce preparation by 20 portions.", badgeColor: "bg-red-100 text-red-900" }
    ];
  }

  getKitchenBriefing() {
    return [
      "Demand is expected to peak between 7 PM and 9 PM.",
      "Masala Dosa and Veg Biryani require additional preparation.",
      "Paneer Curry preparation should remain controlled to avoid waste.",
      "Current kitchen capacity is sufficient for expected demand."
    ];
  }

  getPredictionAccuracyMetrics() {
    return {
      today: "96.2%",
      thisWeek: "94.1%",
      thisMonth: "92.8%",
      chartData: [
        { day: "Mon", predicted: 350, actual: 340, accuracy: 97.1 },
        { day: "Tue", predicted: 375, actual: 380, accuracy: 98.6 },
        { day: "Wed", predicted: 405, actual: 410, accuracy: 98.7 },
        { day: "Thu", predicted: 450, actual: 440, accuracy: 97.7 },
        { day: "Fri", predicted: 580, actual: 590, accuracy: 98.3 },
        { day: "Sat", predicted: 690, actual: 680, accuracy: 98.5 },
        { day: "Sun", predicted: 630, actual: 640, accuracy: 98.4 }
      ]
    };
  }

  getAiDailyBriefing() {
    return [
      "Demand is expected to peak between 7 PM and 9 PM.",
      "Masala Dosa requires additional preparation (+15 portions).",
      "Paneer Curry shows elevated waste risk (-8 portions recommended).",
      "Current kitchen capacity is sufficient for expected demand."
    ];
  }

  // Data & AI Learning Center APIs
  getDataEngineStatus() {
    return {
      status: "DATA ENGINE ONLINE",
      qualityPercent: 94,
      lastUpdate: "Today, 6:42 PM",
      modelStatus: "Ready",
      totalRecords: 12480,
      connectedSourcesCount: 5
    };
  }

  getConnectedDataSources() {
    return [
      { id: "ds-sales", name: "Sales Data", records: 12480, lastUpdated: "Updated today, 6:40 PM", status: "Connected", isConnected: true, type: "Sales" },
      { id: "ds-menu", name: "Food/Menu Data", records: 48, lastUpdated: "Updated yesterday", status: "Connected", isConnected: true, type: "Food" },
      { id: "ds-waste", name: "Waste Data", records: 3240, lastUpdated: "Updated today, 5:15 PM", status: "Connected", isConnected: true, type: "Waste" },
      { id: "ds-weather", name: "Weather Data", records: 890, lastUpdated: "Live API Feed", status: "Connected", isConnected: true, type: "Weather" },
      { id: "ds-events", name: "Holiday & Event Data", records: 120, lastUpdated: "Updated 3 days ago", status: "Connected", isConnected: true, type: "Event" }
    ];
  }

  getRequiredColumns(dataType = 'Sales') {
    const schemas = {
      Sales: ["Date", "Food Item", "Quantity Sold", "Price", "Day", "Holiday", "Weather"],
      Waste: ["Date", "Food Item", "Quantity Wasted", "Reason", "Cost"],
      Food: ["Food Item", "Category", "Cost", "Price", "Prep Time (mins)", "Shelf Life"],
      Customer: ["Date", "Time", "Customer Count", "Dine-In / Delivery", "Avg Ticket Size"]
    };
    return schemas[dataType] || schemas.Sales;
  }

  validateUploadedData(dataCategory = 'Sales', fileName = 'restaurant_sales_oct.csv') {
    return {
      fileName,
      category: dataCategory,
      totalRecords: 12480,
      validRecords: 12120,
      warningsCount: 320,
      errorsCount: 40,
      dataQuality: 94,
      steps: [
        { step: "Reading File", done: true },
        { step: "Checking Columns", done: true },
        { step: "Detecting Missing Values", done: true },
        { step: "Detecting Duplicates", done: true },
        { step: "Checking Data Types", done: true },
        { step: "Validating Records", done: true }
      ]
    };
  }

  getDataQualityMetrics() {
    return {
      completeness: 96,
      accuracy: 93,
      consistency: 95,
      duplicates: 1.2,
      missingValues: 2.8,
      overallQuality: 94
    };
  }

  getDataPreviewRecords(category = 'Sales') {
    return [
      { id: 1, date: "2026-10-06", foodItem: "Veg Biryani", quantity: 85, price: 240, weather: "Sunny", holiday: "No", waste: 5 },
      { id: 2, date: "2026-10-06", foodItem: "Masala Dosa", quantity: 110, price: 140, weather: "Sunny", holiday: "No", waste: 2 },
      { id: 3, date: "2026-10-06", foodItem: "Paneer Curry", quantity: 62, price: 280, weather: "Sunny", holiday: "No", waste: 8 },
      { id: 4, date: "2026-10-05", foodItem: "Cold Coffee", quantity: 42, price: 130, weather: "Light Rain", holiday: "No", waste: 6 },
      { id: 5, date: "2026-10-05", foodItem: "Chicken Dum Biryani", quantity: 125, price: 320, weather: "Light Rain", holiday: "No", waste: 4 },
      { id: 6, date: "2026-10-04", foodItem: "Veg Biryani", quantity: 94, price: 240, weather: "Clear", holiday: "Weekend", waste: 3 },
      { id: 7, date: "2026-10-04", foodItem: "Paneer Butter Masala", quantity: 70, price: 290, weather: "Clear", holiday: "Weekend", waste: 7 }
    ];
  }

  getAiFeatureEngineeringList() {
    return [
      { name: "Day of Week", enabled: true, category: "Temporal Pattern", impact: "High" },
      { name: "Weekend Pattern", enabled: true, category: "Temporal Pattern", impact: "High" },
      { name: "Historical Demand", enabled: true, category: "Baseline", impact: "Critical" },
      { name: "Rolling Average", enabled: true, category: "Smoothing", impact: "High" },
      { name: "Demand Trend", enabled: true, category: "Trend", impact: "High" },
      { name: "Weather Impact", enabled: true, category: "Exogenous", impact: "Medium" },
      { name: "Holiday Impact", enabled: true, category: "Exogenous", impact: "High" },
      { name: "Waste Pattern", enabled: true, category: "Optimization", impact: "Critical" }
    ];
  }

  getModelLearningStatus() {
    return {
      trainingDatasetRecords: 12480,
      trainingStatus: "READY",
      lastModelUpdate: "Today, 6:42 PM",
      modelAccuracy: "94.2%",
      predictionError: "5.8%",
      epochsCompleted: 150,
      learningRate: "0.001 (Adaptive AdamW)"
    };
  }

  getModelPerformanceCharts(timeRange = '7 Days') {
    const dataByRange = {
      '7 Days': [
        { day: "Mon", actual: 340, predicted: 350, accuracy: 97.1, error: 2.9 },
        { day: "Tue", actual: 380, predicted: 375, accuracy: 98.6, error: 1.4 },
        { day: "Wed", actual: 410, predicted: 405, accuracy: 98.7, error: 1.3 },
        { day: "Thu", actual: 440, predicted: 450, accuracy: 97.7, error: 2.3 },
        { day: "Fri", actual: 590, predicted: 580, accuracy: 98.3, error: 1.7 },
        { day: "Sat", actual: 680, predicted: 690, accuracy: 98.5, error: 1.5 },
        { day: "Sun", actual: 640, predicted: 630, accuracy: 98.4, error: 1.6 }
      ],
      '30 Days': [
        { day: "Week 1", actual: 2450, predicted: 2420, accuracy: 98.7, error: 1.3 },
        { day: "Week 2", actual: 2680, predicted: 2650, accuracy: 98.8, error: 1.2 },
        { day: "Week 3", actual: 2890, predicted: 2930, accuracy: 98.6, error: 1.4 },
        { day: "Week 4", actual: 3100, predicted: 3080, accuracy: 99.3, error: 0.7 }
      ],
      '90 Days': [
        { day: "Month 1", actual: 9800, predicted: 9650, accuracy: 98.4, error: 1.6 },
        { day: "Month 2", actual: 10400, predicted: 10320, accuracy: 99.2, error: 0.8 },
        { day: "Month 3", actual: 11200, predicted: 11150, accuracy: 99.5, error: 0.5 }
      ]
    };
    return dataByRange[timeRange] || dataByRange['7 Days'];
  }

  getDataImpactFlowNodes() {
    return [
      { step: "More Sales Data", result: "Better Demand Patterns", color: "from-emerald-500 to-teal-600" },
      { step: "More Waste Data", result: "Better Waste Predictions", color: "from-amber-500 to-orange-600" },
      { step: "More Weather Data", result: "Better Weather Impact", color: "from-blue-500 to-indigo-600" },
      { step: "More Historical Data", result: "Better Forecast Accuracy", color: "from-purple-500 to-emerald-600" }
    ];
  }

  getAiLearningInsight() {
    return {
      title: "SmartServe AI learned something new.",
      insightText: "Friday evening demand for Veg Biryani is consistently 24% higher than the weekly baseline.",
      confidence: "91%",
      impact: "High",
      recommendation: "Increase Friday preparation batch by +12 portions starting from 6 PM."
    };
  }

  getDataHealthAlerts() {
    return [
      { id: "alt-1", type: "warning", text: "Missing weather data for 3 days", problem: "Missing 3-day weather API updates", impact: "Reduces weather correlation accuracy by ~4%", action: "Sync Weather API" },
      { id: "alt-2", type: "warning", text: "42 duplicate sales records detected", problem: "Duplicate transaction IDs in POS upload", impact: "Risk of artificially inflating Friday demand", action: "Clean Duplicates" },
      { id: "alt-3", type: "success", text: "Food item data is complete", problem: "None", impact: "All 48 menu items contain recipe weights & prices", action: "Verified" },
      { id: "alt-4", type: "success", text: "Waste records are up to date", problem: "None", impact: "Daily kitchen waste logging active", action: "Verified" }
    ];
  }

  // Restaurant Network APIs
  getNetworkSummary() {
    return {
      status: "NETWORK ONLINE",
      restaurantsConnected: 12,
      activeLocations: 10,
      aiModelsCount: 12,
      totalDataRecords: 184620,
      metrics: {
        todayDemandPortions: 12480,
        demandChange: "+12.4%",
        todayPreparationPortions: 13020,
        prepChange: "+11.2%",
        todayWastePortions: 540,
        wasteChange: "-16.2%",
        estimatedSavings: 42800,
        savingsChange: "+23.5%",
        avgPredictionAccuracy: 93.8,
        accuracyChange: "+2.4%"
      },
      networkImpact: {
        totalWasteReduced: "23%",
        totalEstimatedSavings: "₹4.2 Lakh",
        predictionAccuracy: "93.8%",
        restaurantsOptimized: 12
      }
    };
  }

  getRestaurantsList(locationFilter = 'All Locations') {
    const allLocations = [
      { id: "rest-1", name: "Central Kitchen", city: "Bengaluru", type: "Central Kitchen", demand: 3200, demandTrend: "↑12%", prepared: 3350, waste: 42, wasteTrend: "↓18%", accuracy: 95.2, savings: 12400, risk: "Low", status: "Healthy", statusColor: "emerald", coords: { x: 35, y: 55 } },
      { id: "rest-2", name: "City Center Bistro", city: "Bengaluru", type: "Fine Dining", demand: 1850, demandTrend: "↑18%", prepared: 1980, waste: 95, wasteTrend: "↑7%", accuracy: 89.4, savings: 4100, risk: "High", status: "Attention", statusColor: "amber", coords: { x: 42, y: 48 } },
      { id: "rest-3", name: "Airport Branch", city: "Bengaluru", type: "Express Kitchen", demand: 2400, demandTrend: "↑5%", prepared: 2480, waste: 52, wasteTrend: "↓11%", accuracy: 94.1, savings: 6800, risk: "Low", status: "Healthy", statusColor: "emerald", coords: { x: 50, y: 38 } },
      { id: "rest-4", name: "Kalaburagi Express", city: "Kalaburagi", type: "Quick Service", demand: 1450, demandTrend: "↑8%", prepared: 1520, waste: 48, wasteTrend: "↓8%", accuracy: 92.8, savings: 3900, risk: "Low", status: "Healthy", statusColor: "emerald", coords: { x: 25, y: 28 } },
      { id: "rest-5", name: "Mysuru Heritage Diner", city: "Mysuru", type: "Casual Dining", demand: 1200, demandTrend: "↑14%", prepared: 1260, waste: 38, wasteTrend: "↓15%", accuracy: 93.5, savings: 4200, risk: "Low", status: "Healthy", statusColor: "emerald", coords: { x: 28, y: 72 } },
      { id: "rest-6", name: "Hyderabad Cloud Kitchen", city: "Hyderabad", type: "Cloud Kitchen", demand: 2100, demandTrend: "↑22%", prepared: 2200, waste: 85, wasteTrend: "↑4%", accuracy: 91.2, savings: 5400, risk: "Medium", status: "Attention", statusColor: "amber", coords: { x: 65, y: 32 } },
      { id: "rest-7", name: "Mumbai Gourmet Bistro", city: "Mumbai", type: "Fine Dining", demand: 2800, demandTrend: "↑15%", prepared: 2950, waste: 110, wasteTrend: "↑12%", accuracy: 88.6, savings: 6000, risk: "Critical", status: "Critical", statusColor: "red", coords: { x: 18, y: 42 } }
    ];

    if (!locationFilter || locationFilter === 'All Locations' || locationFilter === 'All Restaurants') {
      return allLocations;
    }
    return allLocations.filter(r => r.city.toLowerCase() === locationFilter.toLowerCase() || r.name.toLowerCase().includes(locationFilter.toLowerCase()));
  }

  addRestaurant(newRest) {
    const newEntry = {
      id: `rest-${Date.now().toString().slice(-4)}`,
      name: newRest.name || "New Branch",
      city: newRest.location || "Bengaluru",
      type: newRest.type || "Quick Service",
      demand: 800,
      demandTrend: "↑10%",
      prepared: 840,
      waste: 20,
      wasteTrend: "↓5%",
      accuracy: 94.0,
      savings: 2500,
      risk: "Low",
      status: "Healthy",
      statusColor: "emerald",
      coords: { x: Math.floor(Math.random() * 60) + 20, y: Math.floor(Math.random() * 60) + 20 }
    };
    return newEntry;
  }

  getNetworkAnalytics(timeRange = 'Today', locationFilter = 'All Locations') {
    const dataByTime = {
      'Today': [
        { time: "8 AM", actual: 800, predicted: 820, prep: 850 },
        { time: "11 AM", actual: 1900, predicted: 1950, prep: 2020 },
        { time: "2 PM", actual: 3800, predicted: 3750, prep: 3900 },
        { time: "5 PM", actual: 2400, predicted: 2450, prep: 2520 },
        { time: "8 PM", actual: 4200, predicted: 4100, prep: 4300 }
      ],
      '7 Days': [
        { day: "Mon", actual: 11200, predicted: 11000, prep: 11500 },
        { day: "Tue", actual: 11800, predicted: 11900, prep: 12200 },
        { day: "Wed", actual: 12100, predicted: 12000, prep: 12400 },
        { day: "Thu", actual: 12800, predicted: 12900, prep: 13200 },
        { day: "Fri", actual: 14500, predicted: 14400, prep: 14900 },
        { day: "Sat", actual: 15800, predicted: 15900, prep: 16400 },
        { day: "Sun", actual: 14200, predicted: 14300, prep: 14700 }
      ],
      '30 Days': [
        { week: "Week 1", actual: 78000, predicted: 77500, prep: 80000 },
        { week: "Week 2", actual: 82000, predicted: 81800, prep: 84500 },
        { week: "Week 3", actual: 86000, predicted: 85900, prep: 88200 },
        { week: "Week 4", actual: 91000, predicted: 90500, prep: 93000 }
      ]
    };
    return dataByTime[timeRange] || dataByTime['7 Days'];
  }

  getNetworkAlerts() {
    return [
      { id: "net-alt-1", type: "critical", title: "High Demand Spike Warning", location: "Airport Branch", text: "Airport Branch may exceed kitchen capacity by 18% tonight between 7:30 PM - 9:30 PM.", icon: "🔴" },
      { id: "net-alt-2", type: "warning", title: "Elevated Waste Risk Detected", location: "City Center Bistro", text: "City Center waste increased by 18% over 4 consecutive days due to over-prep of curry bases.", icon: "🟠" },
      { id: "net-alt-3", type: "success", title: "High Precision Milestone", location: "Central Kitchen", text: "Central Kitchen achieved 96.2% demand prediction accuracy this week.", icon: "🟢" }
    ];
  }

  getNetworkInsights() {
    return [
      { id: 1, text: "Friday evening demand is consistently 18% higher across 7 urban locations.", impact: "High Impact", confidence: "94%", action: "Increase pre-prep shift allocation on Fridays by +15%" },
      { id: 2, text: "3 locations show above-average food waste due to fixed batch preparation.", impact: "Medium Impact", confidence: "91%", action: "Deploy dynamic 2-stage batching system" },
      { id: 3, text: "Central Kitchen has the highest preparation accuracy (95.2%) in the network.", impact: "High Impact", confidence: "98%", action: "Replicate central batching playbook to City Center" },
      { id: 4, text: "Airport Branch may experience a sudden +25% demand spike tomorrow.", impact: "Critical Impact", confidence: "92%", action: "Pre-order raw ingredients & prepare extra buffers" }
    ];
  }

  getWasteBenchmarking() {
    return [
      { rank: 1, name: "Central Kitchen", score: 92, status: "Optimal", wastePct: "1.3%", color: "text-[#10b981]" },
      { rank: 2, name: "Mysuru Heritage Diner", score: 87, status: "Good", wastePct: "2.1%", color: "text-[#10b981]" },
      { rank: 3, name: "Kalaburagi Express", score: 81, status: "Good", wastePct: "2.8%", color: "text-[#f59e0b]" },
      { rank: 4, name: "Airport Branch", score: 79, status: "Moderate", wastePct: "3.1%", color: "text-[#f59e0b]" },
      { rank: 5, name: "City Center Bistro", score: 72, status: "Attention Needed", wastePct: "4.8%", color: "text-[#ef4444]" }
    ];
  }

  getNetworkRecommendationsByLocation() {
    return [
      { location: "Bengaluru Central", food: "Veg Biryani", action: "Increase Veg Biryani preparation by 10%.", urgency: "High", reason: "Evening demand spike expected." },
      { location: "Kalaburagi Branch", food: "Paneer Curry", action: "Reduce Paneer Curry preparation by 8 portions.", urgency: "Medium", reason: "Historical weekday surplus." },
      { location: "Mysuru Branch", food: "Masala Dosa", action: "Monitor evening demand; maintain safety buffer.", urgency: "Low", reason: "Current prep is optimal." },
      { location: "Airport Branch", food: "Cold Coffee", action: "Scale up cold beverages by 15% for hot afternoon.", urgency: "High", reason: "Temperature surge forecast." }
    ];
  }

  getGlobalAiBriefing() {
    return [
      "Across all 12 locations, network demand is expected to increase by 11% tomorrow.",
      "Three locations (Airport Branch, City Center, Hyderabad Cloud) require increased prep allocation.",
      "Two locations (City Center & Mumbai Bistro) show elevated waste risk.",
      "Overall network prediction confidence remains strong at 93.8%."
    ];
  }

  getNetworkComparison(selectedIds = ['rest-1', 'rest-2', 'rest-3']) {
    const list = this.getRestaurantsList('All Locations');
    const selected = list.filter(r => selectedIds.includes(r.id));
    
    return selected.map(r => ({
      name: r.name,
      demand: r.demand,
      waste: r.waste,
      accuracy: r.accuracy,
      savings: r.savings,
      revenue: Math.round(r.demand * 220)
    }));
  }

  // Restaurant Settings Center APIs
  getRestaurantSettings() {
    const stored = this.loadState('smartserve_full_settings', null);
    if (stored) return stored;

    return {
      profile: {
        name: "SmartServe Grand Bistro",
        type: "Fine Dining",
        cuisine: "North Indian, South Indian & Fusion",
        location: "Indiranagar, Bengaluru",
        email: "manager@smartservebistro.com",
        operatingHours: "07:00 AM - 11:00 PM",
        seats: 120,
        avgDailyCustomers: 350,
        logoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150"
      },
      weeklySchedule: [
        { day: "Monday", open: true, start: "07:00 AM", end: "10:00 PM" },
        { day: "Tuesday", open: true, start: "07:00 AM", end: "10:00 PM" },
        { day: "Wednesday", open: true, start: "07:00 AM", end: "10:00 PM" },
        { day: "Thursday", open: true, start: "07:00 AM", end: "10:00 PM" },
        { day: "Friday", open: true, start: "07:00 AM", end: "11:00 PM" },
        { day: "Saturday", open: true, start: "07:00 AM", end: "11:00 PM" },
        { day: "Sunday", open: true, start: "07:00 AM", end: "11:00 PM" }
      ],
      predictionPreferences: {
        forecastHorizon: "7 Days",
        safetyBuffer: "10%",
        riskSensitivity: "Medium",
        predictionFrequency: "Hourly"
      },
      aiStrategy: "BALANCED", // MINIMIZE WASTE | BALANCED | AVOID SHORTAGES
      notifications: {
        demandSpike: true,
        wasteRisk: true,
        shortageAlerts: true,
        predictionUpdates: true,
        dailyBriefing: true,
        weeklyReport: true,
        weatherImpact: true,
        channels: { email: true, dashboard: true, browser: true }
      },
      briefingSettings: {
        briefingTime: "Morning (07:30 AM)",
        demandForecast: true,
        wasteAnalysis: true,
        prepRecommendations: true,
        weatherImpact: true,
        businessImpact: true
      },
      appearance: {
        theme: "System",
        compactMode: false,
        animations: true,
        chartDensity: "Standard"
      }
    };
  }

  updateRestaurantSettings(newSettings) {
    this.saveState('smartserve_full_settings', newSettings);
    return newSettings;
  }

  getMenuItemsList() {
    return [
      { id: "m-1", name: "Veg Biryani", category: "Main Course", price: 120, prepTimeMins: 35, active: true, avgDemand: 85, minPrep: 50, maxPrep: 120 },
      { id: "m-2", name: "Paneer Curry", category: "Main Course", price: 140, prepTimeMins: 30, active: true, avgDemand: 62, minPrep: 40, maxPrep: 90 },
      { id: "m-3", name: "Masala Dosa", category: "Breakfast", price: 80, prepTimeMins: 15, active: true, avgDemand: 110, minPrep: 80, maxPrep: 150 },
      { id: "m-4", name: "Cold Coffee", category: "Beverages", price: 130, prepTimeMins: 10, active: true, avgDemand: 42, minPrep: 25, maxPrep: 70 },
      { id: "m-5", name: "Chicken Dum Biryani", category: "Main Course", price: 320, prepTimeMins: 45, active: true, avgDemand: 125, minPrep: 80, maxPrep: 180 },
      { id: "m-6", name: "Fresh Garden Salad", category: "Appetizers", price: 150, prepTimeMins: 10, active: false, avgDemand: 30, minPrep: 15, maxPrep: 50 }
    ];
  }

  addMenuItem(newItem) {
    const item = {
      id: `m-${Date.now().toString().slice(-4)}`,
      name: newItem.name,
      category: newItem.category || "Main Course",
      price: Number(newItem.price),
      prepTimeMins: Number(newItem.prepTimeMins || 20),
      active: true,
      avgDemand: Number(newItem.avgDemand || 50),
      minPrep: Number(newItem.minPrep || 20),
      maxPrep: Number(newItem.maxPrep || 100)
    };
    return item;
  }

  getIntegrationsList() {
    return [
      { id: "int-weather", name: "Weather API (OpenWeatherMap)", type: "Weather Feed", status: "Connected", isConnected: true, lastSync: "2 minutes ago" },
      { id: "int-[#10b981]", name: "Holiday & Event Database", type: "Event API", status: "Connected", isConnected: true, lastSync: "1 hour ago" },
      { id: "int-pos", name: "Restaurant POS Database", type: "POS Sync", status: "Connected", isConnected: true, lastSync: "Live Stream" },
      { id: "int-ai", name: "SmartServe AI Prediction Engine", type: "Neural Core", status: "Active", isConnected: true, lastSync: "Real-time" }
    ];
  }

  testIntegrationConnection(id) {
    return {
      id,
      status: "Connected",
      latencyMs: Math.floor(Math.random() * 40) + 15,
      message: "API latency optimal. Telemetry payload verified successfully ✓"
    };
  }

  getTeamMembersList() {
    return [
      { id: "u-1", name: "Suresh Kumar", email: "suresh@smartservebistro.com", role: "Restaurant Owner", access: "Admin", status: "Active", avatar: "SK" },
      { id: "u-2", name: "Chef Ramesh Rao", email: "ramesh@smartservebistro.com", role: "Kitchen Manager", access: "Manager", status: "Active", avatar: "RR" },
      { id: "u-[#10b981]", name: "Ananya Sharma", email: "ananya@smartservebistro.com", role: "Data Analyst", access: "Viewer", status: "Active", avatar: "AS" }
    ];
  }

  inviteTeamMember(member) {
    return {
      id: `u-${Date.now().toString().slice(-4)}`,
      name: member.name,
      email: member.email,
      role: member.role || "Staff",
      access: member.access || "Viewer",
      status: "Invited (Pending)",
      avatar: member.name.slice(0, 2).toUpperCase()
    };
  }

  // Sales Intelligence Center APIs
  getSalesIntelligenceSummary() {
    return {
      status: "DATA SYNCED",
      lastUpdate: "Today, 6:42 PM",
      totalRecords: 12480,
      dataQuality: 94,
      todaySalesPortions: 1042,
      todaySalesGrowth: "+12.4%",
      revenue: 48650,
      revenueGrowth: "+15.2%",
      avgOrderValue: 186,
      avgOrderGrowth: "+4.1%",
      topSellingItem: "Masala Dosa",
      topSellingQty: 110,
      overallSalesGrowth: "+12.4%"
    };
  }

  getSalesTrendChart(timeRange = '7 Days', metricType = 'Quantity') {
    const dataByRange = {
      'Today': [
        { time: "8 AM", actual: 85, predicted: 90, revenue: 10200 },
        { time: "11 AM", actual: 180, predicted: 175, revenue: 21600 },
        { time: "2 PM", actual: 320, predicted: 310, revenue: 38400 },
        { time: "5 PM", actual: 195, predicted: 200, revenue: 23400 },
        { time: "8 PM", actual: 262, predicted: 250, revenue: 31440 }
      ],
      '7 Days': [
        { label: "Mon", actual: 920, predicted: 910, revenue: 41400 },
        { label: "Tue", actual: 980, predicted: 970, revenue: 44100 },
        { label: "Wed", actual: 1010, predicted: 1000, revenue: 45450 },
        { label: "Thu", actual: 1050, predicted: 1060, revenue: 47250 },
        { label: "Fri", actual: 1220, predicted: 1200, revenue: 54900 },
        { label: "Sat", actual: 1350, predicted: 1340, revenue: 60750 },
        { label: "Sun", actual: 1280, predicted: 1290, revenue: 57600 }
      ],
      '30 Days': [
        { label: "Week 1", actual: 6800, predicted: 6750, revenue: 306000 },
        { label: "Week 2", actual: 7100, predicted: 7050, revenue: 319500 },
        { label: "Week 3", actual: 7400, predicted: 7450, revenue: 333000 },
        { label: "Week 4", actual: 7900, predicted: 7850, revenue: 355500 }
      ],
      '90 Days': [
        { label: "Month 1", actual: 28500, predicted: 28200, revenue: 1282500 },
        { label: "Month 2", actual: 30200, predicted: 30000, revenue: 1359000 },
        { label: "Month 3", actual: 32400, predicted: 32100, revenue: 1458000 }
      ]
    };
    return dataByRange[timeRange] || dataByRange['7 Days'];
  }

  getFoodWiseSalesPerformance() {
    return [
      { id: "f-1", foodItem: "Veg Biryani", unitsSold: 85, revenue: 10200, growth: "↑12%", demandTrend: "Increasing", aiStatus: "High Demand", todaySales: 85, avg7Day: 78, avg30Day: 74, wastePortions: 5, accuracy: 96, recommendation: "Demand is trending upward. Consider increasing tomorrow's preparation." },
      { id: "f-2", foodItem: "Masala Dosa", unitsSold: 110, revenue: 8800, growth: "↑18%", demandTrend: "Increasing", aiStatus: "High Demand", todaySales: 110, avg7Day: 95, avg30Day: 90, wastePortions: 2, accuracy: 95, recommendation: "Breakfast peak demand surging. Maintain 10-portion prep safety buffer." },
      { id: "f-3", foodItem: "Paneer Curry", unitsSold: 62, revenue: 8680, growth: "↓4%", demandTrend: "Declining", aiStatus: "Monitor", todaySales: 62, avg7Day: 70, avg30Day: 72, wastePortions: 8, accuracy: 89, recommendation: "Reduce weekday prep by 8 portions to prevent over-prep waste." },
      { id: "f-4", foodItem: "Cold Coffee", unitsSold: 42, revenue: 5460, growth: "↓15%", demandTrend: "Declining", aiStatus: "Rain Dip", todaySales: 42, avg7Day: 55, avg30Day: 58, wastePortions: 6, accuracy: 91, recommendation: "Evening rain forecast reduces cold beverage demand." },
      { id: "f-5", foodItem: "Chicken Dum Biryani", unitsSold: 125, revenue: 40000, growth: "↑25%", demandTrend: "Increasing", aiStatus: "Peak Driver", todaySales: 125, avg7Day: 110, avg30Day: 105, wastePortions: 4, accuracy: 97, recommendation: "Weekend peak revenue driver. Pre-marinate batch 1 by 5:30 PM." }
    ];
  }

  getPeakSalesHoursData() {
    return [
      { hour: "8 AM", portions: 85, level: "Moderate" },
      { hour: "10 AM", portions: 120, level: "Moderate" },
      { hour: "12 PM", portions: 240, level: "High" },
      { hour: "2 PM", portions: 280, level: "High" },
      { hour: "5 PM", portions: 150, level: "Moderate" },
      { hour: "7 PM", portions: 420, level: "Peak" },
      { hour: "9 PM", portions: 350, level: "Peak" },
      { hour: "10 PM", portions: 110, level: "Low" }
    ];
  }

  getWeeklySalesPatternData() {
    return [
      { day: "Monday", sales: 920, demand: 910, revenue: 41400 },
      { day: "Tuesday", sales: 980, demand: 970, revenue: 44100 },
      { day: "Wednesday", sales: 1010, demand: 1000, revenue: 45450 },
      { day: "Thursday", sales: 1050, demand: 1060, revenue: 47250 },
      { day: "Friday", sales: 1220, demand: 1200, revenue: 54900 },
      { day: "Saturday", sales: 1350, demand: 1340, revenue: 60750 },
      { day: "Sunday", sales: 1280, demand: 1290, revenue: 57600 }
    ];
  }

  validateSalesCsv(fileName = 'sales_october_pos.csv') {
    return {
      fileName,
      totalRecords: 5240,
      validRecords: 5110,
      warningsCount: 100,
      errorsCount: 30,
      dataQuality: 94,
      steps: [
        { step: "Reading File", done: true },
        { step: "Checking Columns", done: true },
        { step: "Checking Missing Values", done: true },
        { step: "Checking Duplicates", done: true },
        { step: "Validating Data", done: true }
      ]
    };
  }

  getRecentTransactionsList() {
    return [
      { id: "tx-101", date: "2026-10-06", time: "08:15 PM", foodItem: "Veg Biryani", qty: 4, revenue: 960, status: "Completed" },
      { id: "tx-102", date: "2026-10-06", time: "08:12 PM", foodItem: "Masala Dosa", qty: 3, revenue: 420, status: "Completed" },
      { id: "tx-103", date: "2026-10-06", time: "08:05 PM", foodItem: "Chicken Dum Biryani", qty: 2, revenue: 640, status: "Completed" },
      { id: "tx-104", date: "2026-10-06", time: "07:55 PM", foodItem: "Paneer Curry", qty: 2, revenue: 560, status: "Completed" },
      { id: "tx-105", date: "2026-10-06", time: "07:48 PM", foodItem: "Cold Coffee", qty: 5, revenue: 650, status: "Completed" },
      { id: "tx-106", date: "2026-10-06", time: "07:30 PM", foodItem: "Veg Biryani", qty: 6, revenue: 1440, status: "Completed" }
    ];
  }

  getAiSalesInsights() {
    return [
      { id: 1, text: "Masala Dosa sales increased 18% this week during morning breakfast hours.", impact: "High", confidence: "92%", recommendation: "Increase preparation during morning peak hours (8:30 - 10:30 AM)." },
      { id: 2, text: "Friday evening demand for Veg Biryani surges by 24% over weekday baseline.", impact: "High", confidence: "95%", recommendation: "Schedule additional batch prep at 6:00 PM on Fridays." },
      { id: 3, text: "Paneer Curry weekday sales show consistent 4% decline.", impact: "Medium", confidence: "88%", recommendation: "Reduce preparation batch by 8 portions to avoid waste." },
      { id: 4, text: "Average Order Value rose to ₹186 due to combo side-dish recommendations.", impact: "High", confidence: "94%", recommendation: "Maintain cross-sell pairings on POS." }
    ];
  }

  addSalesRecord(record) {
    const newRecord = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      date: record.date || new Date().toISOString().split('T')[0],
      time: record.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      foodItem: record.foodItem || "Veg Biryani",
      qty: Number(record.qty || 1),
      revenue: Number(record.revenue || (record.qty * 120)),
      status: "Completed"
    };
    return newRecord;
  }

  // Preparation Management Center APIs
  getPreparationSummary() {
    return {
      status: "AI PLAN READY",
      lastUpdate: "2 minutes ago",
      currentService: "Lunch / Dinner",
      totalRecommended: 1135,
      prepared: 980,
      remaining: 155,
      expectedWaste: 49,
      prepAccuracy: 94.2,
      kitchenCapacityCurrent: 82,
      kitchenCapacityPeak: 94,
      availableCapacity: 18
    };
  }

  getPrepTimeline() {
    return [
      { time: "5:00 PM", title: "Start Preparation", desc: "Begin base ingredient pre-marination for dinner shift.", status: "Done", isDone: true },
      { time: "6:00 PM", title: "Demand Increasing", desc: "Customer footfall trend picks up. Heat griddles for Dosa batter.", status: "Done", isDone: true },
      { time: "7:00 PM", title: "Peak Preparation", desc: "Prepare 15 additional Masala Dosa portions & Biryani batch 2.", status: "Current", isCurrent: true },
      { time: "8:00 PM", title: "Peak Demand", desc: "Highest order velocity window. Maintain fast pass assembly.", status: "Upcoming", isUpcoming: true },
      { time: "9:30 PM", title: "Reduce Preparation", desc: "Shift to dynamic 2-stage mini-batching to eliminate leftover waste.", status: "Upcoming", isUpcoming: true },
      { time: "10:00 PM", title: "Final Service", desc: "Complete dinner orders and record final waste audit.", status: "Upcoming", isUpcoming: true }
    ];
  }

  getPrepVsActualChartData() {
    return [
      { day: "Mon", recommended: 1100, prepared: 1120, sales: 1080 },
      { day: "Tue", recommended: 1120, prepared: 1130, sales: 1110 },
      { day: "Wed", recommended: 1140, prepared: 1150, sales: 1135 },
      { day: "Thu", recommended: 1180, prepared: 1175, sales: 1160 },
      { day: "Fri", recommended: 1280, prepared: 1290, sales: 1270 },
      { day: "Sat", recommended: 1380, prepared: 1390, sales: 1375 },
      { day: "Sun", recommended: 1320, prepared: 1315, sales: 1300 }
    ];
  }

  getPrepInsights() {
    return [
      { id: 1, title: "Friday Evening Masala Dosa Surge", reason: "Cyclical weekend dinner rush increases dosa orders by 18%.", impact: "High Impact", recommendation: "Increase Masala Dosa preparation by 15 portions before 7 PM." },
      { id: 2, title: "Paneer Curry Weekday Over-Prep", reason: "Paneer Curry is consistently prepared +8 portions above actual demand.", impact: "Medium Impact", recommendation: "Reduce weekday prep limit from 70 to 62 portions." },
      { id: 3, title: "Veg Biryani Prep Accuracy Optimal", reason: "Current preparation batch rate matches actual customer orders within 96% accuracy.", impact: "Optimal", recommendation: "Maintain current 90-portion batch prep rate." }
    ];
  }

  generateOptimizedKitchenSequence(selectedItems = ['Veg Biryani', 'Paneer Curry', 'Masala Dosa']) {
    return [
      { step: 1, item: "Veg Biryani", qty: 90, prepTimeMins: 45, priority: "High", startAt: "5:15 PM", reasoning: "Longest prep time; highest evening demand volume." },
      { step: 2, item: "Paneer Curry", qty: 65, prepTimeMins: 30, priority: "Medium", startAt: "6:00 PM", reasoning: "Simmer curry base before peak dinner rush." },
      { step: 3, item: "Masala Dosa", qty: 115, prepTimeMins: 15, priority: "High", startAt: "6:30 PM", reasoning: "Short prep time; fast turnaround for evening peak." }
    ];
  }

  // Notifications & Alerts Center APIs
  getNotificationsSummaryMetrics() {
    return {
      unread: 8,
      critical: 2,
      aiInsights: 4,
      resolved: 16
    };
  }

  getNotificationsList() {
    return [
      {
        id: "notif-1",
        title: "Masala Dosa demand may exceed current preparation",
        type: "Shortage Risk",
        category: "Preparation",
        priority: "HIGH",
        isCritical: true,
        isUnread: true,
        time: "10 mins ago",
        date: "2026-10-06 06:35 PM",
        description: "Evening footfall surge is expected to increase Masala Dosa orders by 11 portions above prepared stock.",
        whyItMatters: "Current stock of 12 portions will run out before 7:45 PM during peak dinner service.",
        aiAnalysis: "Model confidence 92%. Friday evening dinner velocity multiplier (+18%) applied.",
        recommendation: "Prepare 15 additional portions before 7:00 PM.",
        impact: "Prevents 11 lost customer orders (~₹1,540 revenue)",
        confidence: "92%",
        actions: ["Take Action", "View Prediction", "Dismiss"]
      },
      {
        id: "notif-2",
        title: "Paneer Curry waste risk is elevated",
        type: "Waste Risk",
        category: "Waste",
        priority: "HIGH",
        isCritical: font => true,
        isUnread: true,
        time: "25 mins ago",
        date: "2026-10-06 06:20 PM",
        description: "Actual preparation (70 portions) has exceeded actual sales for 4 consecutive days.",
        whyItMatters: "Unconsumed curry base spoils at end-of-day resulting in direct financial loss.",
        aiAnalysis: "Weekday sales baseline shows 62 portions. 8 portions expected excess.",
        recommendation: "Reduce tomorrow's preparation limit by 8 portions.",
        impact: "Saves ~₹1,120 in food cost",
        confidence: "89%",
        actions: ["Apply Recommendation", "Review", "Snooze"]
      },
      {
        id: "notif-3",
        title: "Unusually high demand detected for Veg Biryani",
        type: "Demand Spike",
        category: "AI",
        priority: "MEDIUM",
        isCritical: false,
        isUnread: true,
        time: "42 mins ago",
        date: "2026-10-06 06:00 PM",
        description: "AI detected a +17% surge in Veg Biryani dinner prep orders.",
        whyItMatters: "High customer velocity window opening between 7:00 - 9:00 PM.",
        aiAnalysis: "Model confidence 91%. Ingested corporate dinner booking signals.",
        recommendation: "Increase preparation batch by 10 portions.",
        impact: "Optimizes peak turnaround time",
        confidence: "91%",
        actions: ["Apply Recommendation", "Review"]
      },
      {
        id: "notif-4",
        title: "Evening rainfall forecast update",
        type: "Weather Impact",
        category: "Weather",
        priority: "LOW",
        isCritical: false,
        isUnread: true,
        time: "1 hour ago",
        date: "2026-10-06 05:40 PM",
        description: "Rain probability updated to 78% for 6:30 PM - 9:00 PM.",
        whyItMatters: "Reduces cold beverage demand by 22% and increases hot meal demand by 14%.",
        aiAnalysis: "Weather impact factor dynamically adjusted.",
        recommendation: "Reduce Cold Coffee prep base and shift capacity to hot soups & biryanis.",
        impact: "Prevents milk base spoilage",
        confidence: "94%",
        actions: ["Review", "Dismiss"]
      },
      {
        id: "notif-5",
        title: "AI demand prediction model weights updated",
        type: "Prediction Update",
        category: "System",
        priority: "LOW",
        isCritical: false,
        isUnread: false,
        time: "2 hours ago",
        date: "2026-10-06 04:30 PM",
        description: "Retrained model with latest POS CSV ingestion. Prediction accuracy reached 96.2%.",
        whyItMatters: "Improves daily safety buffer calculation precision.",
        aiAnalysis: "MAE loss reduced to 5.8%.",
        recommendation: "None required — model running in active production mode.",
        impact: "Increases forecast accuracy",
        confidence: "96.2%",
        actions: ["Dismiss"]
      }
    ];
  }

  getRealtimeAiDetectedAlert() {
    return {
      title: "SmartServe AI Detected: Veg Biryani Demand Surge",
      expectedIncrease: "+17%",
      confidence: "91%",
      recommendation: "Increase Veg Biryani preparation by 10 portions before 7:00 PM.",
      impact: "High Impact"
    };
  }

  getNotificationActivityTimeline() {
    return [
      { time: "6:42 PM", text: "Sales data synchronized successfully.", icon: "✓", type: "success" },
      { time: "6:40 PM", text: "AI demand prediction model updated.", icon: "✓", type: "success" },
      { time: "6:35 PM", text: "Waste risk detected for Paneer Curry.", icon: "⚠", type: "warning" },
      { time: "6:30 PM", text: "Weather API feed synchronized (Rain 78%).", icon: "✓", type: "success" },
      { time: "6:25 PM", text: "Preparation recommendation generated (+15 Dosa).", icon: "✓", type: "success" }
    ];
  }

  getAlertHistoryData() {
    return [
      { date: "2026-10-06", alert: "Masala Dosa Shortage Warning", category: "Preparation", priority: "HIGH", status: "Active", actionTaken: "Pending" },
      { date: "2026-10-06", alert: "Paneer Curry Waste Risk", category: "Waste", priority: "HIGH", status: "Active", actionTaken: "Reviewing" },
      { date: "2026-10-05", alert: "Rainfall Cold Beverage Dip", category: "Weather", priority: "LOW", status: "Resolved", actionTaken: "Prep Reduced" },
      { date: "2026-10-05", alert: "POS Transactions Data Synced", category: "Sales", priority: "LOW", status: "Resolved", actionTaken: "Auto Synced" },
      { date: "2026-10-04", alert: "Central Kitchen 96.2% Accuracy", category: "System", priority: "LOW", status: "Resolved", actionTaken: "Logged" }
    ];
  }

  getTodayAiBriefingSummary() {
    return {
      countText: "3 important things require your attention today:",
      bullets: [
        "Demand is expected to peak between 7:00 PM and 9:00 PM.",
        "Paneer Curry shows elevated waste risk due to weekday over-prep.",
        "Current kitchen capacity (82%) is sufficient for expected dinner demand."
      ]
    };
  }
}

export const apiService = new ApiService();




