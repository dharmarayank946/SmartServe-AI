import { fetchApi, USE_MOCK_DATA } from './api';

export async function getAnalyticsData() {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi('/analytics');
    if (res.success && res.data) return res.data;
  }

  return {
    roiPercent: "+340%",
    totalCostSaved: "₹1,42,800",
    foodWastePreventedKg: 412,
    predictionAccuracy: "94.2%",
    monthlyBreakdown: [
      { month: "May", savings: 18400, wasteKg: 68 },
      { month: "Jun", savings: 24200, wasteKg: 54 },
      { month: "Jul", savings: 29800, wasteKg: 46 },
      { month: "Aug", savings: 34500, wasteKg: 38 },
      { month: "Sep", savings: 35900, wasteKg: 32 }
    ]
  };
}
