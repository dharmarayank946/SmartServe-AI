// SmartServe AI - Commercial AI SaaS Platform Dataset & Telemetry

export const INITIAL_FOOD_ITEMS = [
  {
    id: "item-001",
    name: "Veg Biryani",
    category: "Main Course",
    price: 240,
    cost: 85,
    avgDailySales: 82,
    currentStock: 90,
    unit: "portions",
    leadTimeHours: 1.5,
    shelfLifeDays: 1,
    aiOptimized: true,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60",
    tags: ["High Volume", "Peak Dinner"]
  },
  {
    id: "item-002",
    name: "Paneer Butter Masala",
    category: "Main Course",
    price: 280,
    cost: 95,
    avgDailySales: 64,
    currentStock: 70,
    unit: "portions",
    leadTimeHours: 1.0,
    shelfLifeDays: 2,
    aiOptimized: true,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60",
    tags: ["Bestseller", "High Margin"]
  },
  {
    id: "item-003",
    name: "Chicken Dum Biryani",
    category: "Main Course",
    price: 320,
    cost: 120,
    avgDailySales: 110,
    currentStock: 125,
    unit: "portions",
    leadTimeHours: 2.0,
    shelfLifeDays: 1,
    aiOptimized: true,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=60",
    tags: ["Weekend Spike", "Top Revenue"]
  },
  {
    id: "item-004",
    name: "Masala Dosa",
    category: "Main Course",
    price: 140,
    cost: 35,
    avgDailySales: 110,
    currentStock: 115,
    unit: "portions",
    leadTimeHours: 0.2,
    shelfLifeDays: 1,
    aiOptimized: true,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=60",
    tags: ["Breakfast Surge", "Fast Turnaround"]
  },
  {
    id: "item-005",
    name: "Cold Coffee",
    category: "Beverages",
    price: 130,
    cost: 35,
    avgDailySales: 45,
    currentStock: 50,
    unit: "glasses",
    leadTimeHours: 0.2,
    shelfLifeDays: 1,
    aiOptimized: true,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60",
    tags: ["Weather Sensitive", "High Margin"]
  },
  {
    id: "item-006",
    name: "Fresh Garden Salad",
    category: "Appetizers",
    price: 150,
    cost: 40,
    avgDailySales: 30,
    currentStock: 40,
    unit: "bowls",
    leadTimeHours: 0.5,
    shelfLifeDays: 1,
    aiOptimized: true,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60",
    tags: ["High Waste Risk", "Perishable"]
  }
];

export const INITIAL_PREDICTIONS = [
  {
    id: "pred-1",
    itemId: "item-001",
    itemName: "Veg Biryani",
    category: "Main Course",
    predictedDemand: 85,
    recommendedPrep: 90,
    confidence: 92,
    expectedWaste: 5,
    shortageRisk: "Low",
    unit: "portions",
    status: "Prepare",
    factors: ["Friday Dinner Surge (+42%)", "Sunny Weather (+11%)", "Recent Trend (+18%)"],
    explanation: "Demand is expected to increase by 12% tomorrow because Veg Biryani has shown higher sales on Friday evenings and recent sales are trending upward."
  },
  {
    id: "pred-2",
    itemId: "item-002",
    itemName: "Paneer Curry",
    category: "Main Course",
    predictedDemand: 62,
    recommendedPrep: 65,
    confidence: 91,
    expectedWaste: 3,
    shortageRisk: "Low",
    unit: "portions",
    status: "Prepare",
    factors: ["Consistent Weekly Trend", "Mild Weather"],
    explanation: "Demand remains steady with low risk of over-preparation waste."
  },
  {
    id: "pred-3",
    itemId: "item-004",
    itemName: "Masala Dosa",
    category: "Main Course",
    predictedDemand: 110,
    recommendedPrep: 116,
    confidence: 89,
    expectedWaste: 6,
    shortageRisk: "Medium",
    unit: "portions",
    status: "Review",
    factors: ["Morning Rush Spike (+18%)"],
    explanation: "Morning breakfast demand surge expected between 8:30 AM and 10:30 AM."
  }
];

export const INITIAL_AI_INSIGHTS = [
  {
    id: "ins-01",
    title: "Veg Biryani Demand Surge Expected",
    description: "Demand for Veg Biryani is expected to increase tomorrow by +18% due to Friday evening peak & corporate catering orders.",
    category: "Demand Forecast",
    impact: "High Revenue",
    type: "opportunity",
    time: "10 mins ago",
    metric: "+18% Surge",
    actionableText: "Increase prep buffer from 80 to 90 plates."
  },
  {
    id: "ins-02",
    title: "Rainy Weather Impact on Cold Beverages",
    description: "Rainy weather forecasted for tomorrow afternoon may reduce demand for Cold Beverages by 22%. Adjust milk & syrup prep down.",
    category: "Weather Alert",
    impact: "Waste Prevention",
    type: "warning",
    time: "25 mins ago",
    metric: "-22% Demand",
    actionableText: "Reduce Cold Coffee prep from 50 to 38 glasses."
  },
  {
    id: "ins-03",
    title: "Paneer Curry High Consistent Demand",
    description: "Paneer Butter Masala has shown consistently high demand this week (+34% vs last week). Consider ordering fresh cottage cheese in bulk.",
    category: "Trend Surge",
    impact: "Inventory Alert",
    type: "insight",
    time: "1 hour ago",
    metric: "+34% Sustained",
    actionableText: "Reorder 15 kg Paneer before 5 PM today."
  },
  {
    id: "ins-04",
    title: "Fresh Salad Over-Preparation Warning",
    description: "Over-preparation of Fresh Garden Salad on Mondays accounts for 40% of weekly salad waste. SmartServe recommends batching in smaller 10-bowl units.",
    category: "Waste Reduction",
    impact: "Critical Waste Alert",
    type: "critical",
    time: "2 hours ago",
    metric: "40% Waste Source",
    actionableText: "Enable dynamic 2-step batch prep for salads."
  }
];

export const REALTIME_ALERTS = [
  {
    id: "alert-1",
    type: "warning",
    iconName: "AlertTriangle",
    priority: "HIGH",
    title: "Demand Spike Warning",
    time: "2 mins ago",
    reason: "Masala Dosa breakfast demand may increase by 18% due to morning footfall pattern.",
    recommendedAction: "Prepare Batch 1 (60 portions) 15 minutes earlier."
  },
  {
    id: "alert-2",
    type: "critical",
    iconName: "Trash2",
    priority: "CRITICAL",
    title: "Waste Risk Alert",
    time: "10 mins ago",
    reason: "Paneer Curry has shown unusually high over-prep waste this week (+14%).",
    recommendedAction: "Reduce evening preparation batch by 8 portions."
  },
  {
    id: "alert-3",
    type: "opportunity",
    iconName: "CheckCircle2",
    priority: "OPPORTUNITY",
    title: "Smart Cost Opportunity",
    time: "25 mins ago",
    reason: "Reducing Fresh Salad prep batch by 8 portions saves approximately ₹420 today.",
    recommendedAction: "Enable 2-stage batch prep strategy."
  },
  {
    id: "alert-4",
    type: "shortage",
    iconName: "ShieldAlert",
    priority: "MEDIUM",
    title: "Shortage Risk Warning",
    time: "40 mins ago",
    reason: "Veg Biryani dinner stock may sell out before 8 PM at current order velocity.",
    recommendedAction: "Approve 5-portion buffer safety allocation."
  }
];

export const EXPLAINS_WHY_FACTORS = [
  { factor: "Historical Sales", percentage: 42, color: "#1b4332", width: "84%" },
  { factor: "Day Pattern", percentage: 21, color: "#2d6a4f", width: "62%" },
  { factor: "Recent Trend", percentage: 18, color: "#d4af37", width: "50%" },
  { factor: "Weather Impact", percentage: 11, color: "#3b82f6", width: "36%" },
  { factor: "Holiday / Event", percentage: 8, color: "#f97316", width: "24%" }
];

export const BUSINESS_IMPACT_METRICS = [
  { label: "Food Waste", value: "-23%", isPositive: true, subtext: "Average reduction across 30 days" },
  { label: "Preparation Accuracy", value: "+31%", isPositive: true, subtext: "Precision matching customer orders" },
  { label: "Potential Savings", value: "+₹18,400", isPositive: true, subtext: "Direct raw ingredient cost recovery" },
  { label: "Shortage Risk", value: "-17%", isPositive: true, subtext: "Stockouts prevented during peaks" }
];

export const DIGITAL_TWIN_NODES = [
  { id: 'node-1', title: 'Customers', metric: '1,248 Expected', icon: 'Users', color: 'from-blue-600 to-indigo-700' },
  { id: 'node-2', title: 'Food Demand', metric: '1,086 Portions', icon: 'TrendingUp', color: 'from-emerald-700 to-[#1b4332]' },
  { id: 'node-3', title: 'Kitchen Prep', metric: '1,135 Portions', icon: 'ChefHat', color: 'from-amber-600 to-yellow-600' },
  { id: 'node-4', title: 'Waste Monitor', metric: '49 Portions (4.2%)', icon: 'Trash2', color: 'from-red-600 to-orange-600' },
  { id: 'node-5', title: 'Weather Sensor', metric: '78% Rain Prob.', icon: 'CloudRain', color: 'from-cyan-600 to-blue-700' },
  { id: 'node-6', title: 'Revenue Telemetry', metric: '₹1,48,500 Sales', icon: 'DollarSign', color: 'from-[#d4af37] to-amber-500' }
];

export const HISTORICAL_SALES_TRENDS = [
  { day: "Mon", date: "Oct 01", actual: 340, predicted: 350, waste: 28, costSaved: 1200 },
  { day: "Tue", date: "Oct 02", actual: 380, predicted: 375, waste: 22, costSaved: 1450 },
  { day: "Wed", date: "Oct 03", actual: 410, predicted: 405, waste: 19, costSaved: 1680 },
  { day: "Thu", date: "Oct 04", actual: 440, predicted: 450, waste: 15, costSaved: 1920 },
  { day: "Fri", date: "Oct 05", actual: 590, predicted: 580, waste: 18, costSaved: 2400 },
  { day: "Sat", date: "Oct 06", actual: 680, predicted: 690, waste: 24, costSaved: 2850 },
  { day: "Sun", date: "Oct 07", actual: 640, predicted: 630, waste: 20, costSaved: 2600 }
];

export const HOURLY_DEMAND_CURVE = [
  { hour: "11 AM", predicted: 35, actual: 32 },
  { hour: "12 PM", predicted: 85, actual: 88 },
  { hour: "01 PM", predicted: 140, actual: 135 },
  { hour: "02 PM", predicted: 110, actual: 115 },
  { hour: "03 PM", predicted: 45, actual: 40 },
  { hour: "04 PM", predicted: 30, actual: 28 },
  { hour: "05 PM", predicted: 40, actual: 42 },
  { hour: "06 PM", predicted: 75, actual: 70 },
  { hour: "07 PM", predicted: 160, actual: 165 },
  { hour: "08 PM", predicted: 190, actual: 185 },
  { hour: "09 PM", predicted: 130, actual: 138 },
  { hour: "10 PM", predicted: 50, actual: 48 }
];

export const WASTE_BY_REASON = [
  { reason: "Over-preparation", percentage: 48, value: 45, color: "#ef4444" },
  { reason: "Ingredient Spoilage", percentage: 24, value: 22, color: "#f97316" },
  { reason: "Plate Unconsumed", percentage: 18, value: 17, color: "#eab308" },
  { reason: "Preparation Error", percentage: 10, value: 9, color: "#3b82f6" }
];

export const MOST_WASTED_ITEMS = [
  { name: "Fresh Garden Salad", wastedQty: 18, unit: "bowls", financialLoss: 720, co2Kg: 4.2 },
  { name: "Veg Biryani (Night Batch)", wastedQty: 12, unit: "portions", financialLoss: 1020, co2Kg: 9.6 },
  { name: "Cold Coffee Base", wastedQty: 8, unit: "liters", financialLoss: 280, co2Kg: 3.1 },
  { name: "Garlic Naan Dough", wastedQty: 15, unit: "portions", financialLoss: 225, co2Kg: 1.8 }
];

export const WEATHER_FORECAST = {
  condition: "Partly Cloudy with Rain Expected",
  tempC: 28,
  humidity: "78%",
  rainProbability: "78%",
  interpretation: "Rain may reduce cold beverage demand while increasing demand for hot meals.",
  hotMealsChange: "+14%",
  coldDrinksChange: "-22%",
  impactSummary: "Cold beverages down -22%, Hot meals & Biryanis up +14%"
};

export const RESTAURANT_PROFILE = {
  name: "SmartServe Grand Bistro",
  branchId: "HYD-BLR-04",
  cuisine: "Multi-Cuisine & Fine Dining",
  capacitySeats: 120,
  avgDailyOrders: 540,
  apiEndpoint: "http://localhost:8000/api/v1",
  useSimulatedApi: true,
  aiPrepSafetyBufferPercent: 6,
  wasteThresholdAlertKg: 10,
  currencySymbol: "₹"
};
