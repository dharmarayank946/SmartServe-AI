import { fetchApi, USE_MOCK_DATA } from './api';

export async function getRestaurantNetwork() {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi('/restaurants');
    if (res.success && res.data) return res.data;
  }

  return {
    totalRestaurantsConnected: 12,
    activeLocations: 10,
    aiModelsActive: 12,
    totalRecords: 184620,
    locations: [
      { id: "loc-1", city: "Bengaluru", branch: "Indiranagar Flagship", status: "Active", dailySales: "₹1,85,400", wastePct: "3.8%", accuracy: "95.6%" },
      { id: "loc-2", city: "Hyderabad", branch: "SmartServe Bistro Gachibowli", status: "Active", dailySales: "₹1,48,500", wastePct: "4.2%", accuracy: "94.2%" },
      { id: "loc-3", city: "Kalaburagi", branch: "Super Bazar Branch", status: "Active", dailySales: "₹82,300", wastePct: "4.9%", accuracy: "93.1%" },
      { id: "loc-4", city: "Mysuru", branch: "Palace Road Kitchen", status: "Active", dailySales: "₹96,100", wastePct: "4.5%", accuracy: "93.8%" },
      { id: "loc-5", city: "Mumbai", branch: "Bandra Cloud Kitchen", status: "Maintenance", dailySales: "₹2,10,000", wastePct: "5.1%", accuracy: "92.4%" }
    ]
  };
}
