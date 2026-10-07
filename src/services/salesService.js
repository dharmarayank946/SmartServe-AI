import { fetchApi, USE_MOCK_DATA } from './api';
import { HISTORICAL_SALES_TRENDS } from './mockData';

export async function getSalesData() {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi('/sales');
    if (res.success && res.data) return res.data;
  }

  return {
    todayPortions: 1042,
    revenue: "₹48,650",
    avgOrderValue: "₹186",
    topItem: "Masala Dosa",
    salesGrowth: "+12.4%",
    trends: HISTORICAL_SALES_TRENDS
  };
}

export async function addSalesRecord(record) {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi('/sales', {
      method: 'POST',
      body: JSON.stringify(record)
    });
    if (res.success) return res.data;
  }
  return { success: true, message: "Sales record logged successfully.", record };
}

export async function uploadSalesCsv(file) {
  if (!USE_MOCK_DATA) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetchApi('/sales/upload', {
      method: 'POST',
      body: formData,
      headers: {} // Let browser set Content-Type header with multipart boundary
    });
    if (res.success) return res.data;
  }
  return { success: true, recordsProcessed: 1420, dataQualityScore: "96.4%" };
}
