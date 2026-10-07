import { fetchApi, USE_MOCK_DATA } from './api';

export async function getPreparationSchedule() {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi('/preparation');
    if (res.success && res.data) return res.data;
  }

  return {
    totalRecommended: 1135,
    prepared: 980,
    remaining: 155,
    expectedWaste: 49,
    accuracy: "94.2%",
    batches: [
      { id: "batch-1", item: "Veg Biryani", batchSize: 60, prepareTime: "11:30 AM", status: "Completed", station: "Station A" },
      { id: "batch-2", item: "Veg Biryani", batchSize: 30, prepareTime: "06:30 PM", status: "Scheduled", station: "Station A" },
      { id: "batch-3", item: "Paneer Curry", batchSize: 40, prepareTime: "11:45 AM", status: "Completed", station: "Station B" },
      { id: "batch-4", item: "Masala Dosa Batter", batchSize: 115, prepareTime: "07:30 AM", status: "Completed", station: "Station C" }
    ]
  };
}

export async function updatePreparationPlan(updateData) {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi('/preparation/update', {
      method: 'POST',
      body: JSON.stringify(updateData)
    });
    if (res.success) return res.data;
  }

  return { success: true, message: "Preparation plan updated & dispatched to kitchen screen." };
}
