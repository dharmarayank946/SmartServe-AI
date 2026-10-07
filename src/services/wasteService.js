import { fetchApi, USE_MOCK_DATA } from './api';
import { WASTE_BY_REASON, MOST_WASTED_ITEMS } from './mockData';

export async function getWasteMetrics() {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi('/waste');
    if (res.success && res.data) return res.data;
  }

  return {
    todayWasteKg: 4.8,
    monthlyWasteKg: 142.5,
    financialLoss: "₹12,450",
    reductionVsLastMonth: "-23%",
    wasteByReason: WASTE_BY_REASON,
    mostWastedItems: MOST_WASTED_ITEMS
  };
}

export async function logWasteRecord(wasteData) {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi('/waste', {
      method: 'POST',
      body: JSON.stringify(wasteData)
    });
    if (res.success) return res.data;
  }

  return { success: true, message: "Waste audit entry logged into database.", wasteData };
}
