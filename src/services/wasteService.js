import { fetchApi, USE_MOCK_DATA } from './api';
import { WASTE_BY_REASON, MOST_WASTED_ITEMS } from './mockData';

export async function getWasteMetrics() {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi('/waste');
    if (res.success && res.data) return res.data;
    throw new Error(res.error || 'Failed to fetch waste metrics from backend API.');
  }

  return {
    todayWasteKg: 4.8,
    monthlyWasteKg: 142.5,
    financialLoss: "₹12,450",
    reductionVsLastMonth: "-23%",
    wasteByReason: WASTE_BY_REASON,
    mostWastedItems: MOST_WASTED_ITEMS,
    wasteLogs: []
  };
}

export async function logWasteRecord(wasteData) {
  if (!USE_MOCK_DATA) {
    const payload = {
      food_item_id: wasteData.food_item_id || wasteData.foodItemId || null,
      item_name: wasteData.item_name || wasteData.itemName || "Paneer Curry",
      date: wasteData.date || new Date().toISOString().split('T')[0],
      time: wasteData.time || "14:30",
      quantity: Number(wasteData.quantity ?? wasteData.qty ?? 1),
      unit: wasteData.unit || "portions",
      reason: wasteData.reason || "Over-preparation",
      financial_loss: Number(wasteData.financial_loss ?? wasteData.financialLoss ?? wasteData.estimatedCost ?? 0),
      notes: wasteData.notes || ""
    };
    const res = await fetchApi('/waste', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res.success && res.data) return res.data;
    throw new Error(res.error || 'Failed to record waste entry.');
  }

  return { 
    success: true, 
    message: "Waste audit entry logged into database.", 
    wasteData: {
      id: `w-${Date.now()}`,
      food_item_id: wasteData.foodItemId || null,
      itemName: wasteData.itemName || "Paneer Curry",
      date: wasteData.date || new Date().toISOString().split('T')[0],
      time: wasteData.time || "14:30",
      qty: Number(wasteData.qty || 1),
      unit: wasteData.unit || "portions",
      reason: wasteData.reason || "Over-preparation",
      financialLoss: Number(wasteData.estimatedCost || 0),
      notes: wasteData.notes || ""
    }
  };
}

export async function deleteWasteRecord(logId) {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi(`/waste/${logId}`, {
      method: 'DELETE'
    });
    if (res.success) return res.data;
    throw new Error(res.error || 'Failed to delete waste record.');
  }
  return { success: true, message: "Waste entry deleted.", deleted_id: logId };
}
