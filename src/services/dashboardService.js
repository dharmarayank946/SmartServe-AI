import { fetchApi, USE_MOCK_DATA } from './api';
import { BUSINESS_IMPACT_METRICS, DIGITAL_TWIN_NODES } from './mockData';

export async function getDashboardData() {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi('/dashboard');
    if (res.success && res.data) return res.data;
  }

  // Fallback / Mock Data Mode
  return {
    todaySales: "₹1,48,500",
    predictedSales: "₹1,56,000",
    portionsPrepared: 1135,
    expectedWaste: "49 portions (4.2%)",
    wasteSavingsThisMonth: "₹42,800",
    impactMetrics: BUSINESS_IMPACT_METRICS,
    digitalTwinNodes: DIGITAL_TWIN_NODES,
  };
}
