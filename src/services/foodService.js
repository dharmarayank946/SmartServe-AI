import { fetchApi, USE_MOCK_DATA } from './api';
import { INITIAL_FOOD_ITEMS } from './mockData';

export async function getFoodItems() {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi('/food-items');
    if (res.success && res.data) {
      // Normalize field names if backend returns camelCase or snake_case
      return res.data.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        cost: item.cost,
        avgDailySales: item.avg_daily_sales ?? item.avgDailySales ?? 30,
        currentStock: item.current_stock ?? item.currentStock ?? 40,
        unit: item.unit || 'portions',
        leadTimeHours: item.lead_time_hours ?? item.leadTimeHours ?? 1.0,
        shelfLifeDays: item.shelf_life_days ?? item.shelfLifeDays ?? 1,
        aiOptimized: item.ai_optimized ?? item.aiOptimized ?? true,
        tags: item.tags || []
      }));
    }
    throw new Error(res.error || 'Failed to fetch food items from backend API.');
  }
  return INITIAL_FOOD_ITEMS;
}

export async function addFoodItem(newItem) {
  if (!USE_MOCK_DATA) {
    const payload = {
      name: newItem.name,
      category: newItem.category,
      price: Number(newItem.price),
      cost: Number(newItem.cost),
      avgDailySales: Number(newItem.avgDailySales || 30),
      currentStock: Number(newItem.currentStock || 40),
      unit: newItem.unit || 'portions',
      leadTimeHours: Number(newItem.leadTimeHours || 1.0),
      shelfLifeDays: Number(newItem.shelfLifeDays || 1),
      tags: newItem.tags || ["AI Monitored"]
    };
    const res = await fetchApi('/food-items', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res.success && res.data) return res.data;
    throw new Error(res.error || 'Failed to add food item to backend API.');
  }
  return {
    id: `item-${Date.now().toString().slice(-4)}`,
    ...newItem
  };
}

export async function updateFoodItem(id, updatedFields) {
  if (!USE_MOCK_DATA) {
    const payload = {
      ...(updatedFields.name ? { name: updatedFields.name } : {}),
      ...(updatedFields.category ? { category: updatedFields.category } : {}),
      ...(updatedFields.price !== undefined ? { price: Number(updatedFields.price) } : {}),
      ...(updatedFields.cost !== undefined ? { cost: Number(updatedFields.cost) } : {}),
      ...(updatedFields.avgDailySales !== undefined ? { avgDailySales: Number(updatedFields.avgDailySales) } : {}),
      ...(updatedFields.currentStock !== undefined ? { currentStock: Number(updatedFields.currentStock) } : {}),
      ...(updatedFields.unit ? { unit: updatedFields.unit } : {})
    };
    const res = await fetchApi(`/food-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    if (res.success && res.data) return res.data;
    throw new Error(res.error || 'Failed to update food item on backend API.');
  }
  return { id, ...updatedFields };
}

export async function deleteFoodItem(id) {
  if (!USE_MOCK_DATA) {
    const res = await fetchApi(`/food-items/${id}`, { method: 'DELETE' });
    if (res.success) return true;
    throw new Error(res.error || 'Failed to delete food item from backend API.');
  }
  return true;
}
