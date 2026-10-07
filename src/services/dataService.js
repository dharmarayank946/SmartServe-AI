import { fetchApi, USE_MOCK_DATA } from './api';

export async function getConnectedDataSources() {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi('/data/sources');
    if (res.success && res.data) return res.data;
  }

  return {
    dataEngineStatus: "ONLINE",
    overallQualityScore: "94.2%",
    lastDataUpdate: "Today, 6:42 PM",
    modelStatus: "Ready",
    sources: [
      { id: "ds-1", name: "Sales Data (POS)", records: 12480, status: "Connected", lastSync: "10 mins ago", quality: "98%" },
      { id: "ds-2", name: "Food & Menu Data", records: 48, status: "Connected", lastSync: "1 hour ago", quality: "100%" },
      { id: "ds-3", name: "Waste Audit Data", records: 3420, status: "Connected", lastSync: "Today, 4:15 PM", quality: "92%" },
      { id: "ds-4", name: "Weather Radar API", records: 8760, status: "Connected", lastSync: "Live Sync", quality: "99%" },
      { id: "ds-5", name: "Holiday & Event Calendar", records: 365, status: "Connected", lastSync: "Yesterday", quality: "95%" }
    ]
  };
}

export async function triggerModelTraining() {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi('/data/retrain', { method: 'POST' });
    if (res.success) return res.data;
  }

  return {
    success: true,
    message: "SmartServe AI model retrained on 184,620 historical records.",
    newAccuracy: "94.8%"
  };
}
