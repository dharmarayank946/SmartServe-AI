import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Check, 
  DollarSign,
  Tag,
  TrendingUp,
  Clock,
  HelpCircle,
  BarChart2,
  AlertTriangle,
  ChevronRight,
  PieChart
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import Modal from '../components/Modal';
import { apiService } from '../services/apiService';
import { getFoodItems, addFoodItem, updateFoodItem, deleteFoodItem } from '../services/foodService';

export default function FoodManagement({ onNavigate }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  
  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'Main Course',
    price: '',
    cost: '',
    avgDailySales: '',
    currentStock: '',
    unit: 'portions'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getFoodItems();
      setItems(data);
    } catch (err) {
      setItems(apiService.getFoodItems());
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const categories = ['All', 'Main Course', 'Appetizers', 'Beverages', 'Desserts'];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Main Course',
      price: '250',
      cost: '80',
      avgDailySales: '50',
      currentStock: '60',
      unit: 'portions'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e, item) => {
    e.stopPropagation();
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      cost: item.cost,
      avgDailySales: item.avgDailySales,
      currentStock: item.currentStock,
      unit: item.unit || 'portions'
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await updateFoodItem(editingItem.id, {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        cost: Number(formData.cost),
        avgDailySales: Number(formData.avgDailySales),
        currentStock: Number(formData.currentStock),
        unit: formData.unit
      });
    } else {
      await addFoodItem({
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        cost: Number(formData.cost),
        avgDailySales: Number(formData.avgDailySales),
        currentStock: Number(formData.currentStock),
        unit: formData.unit
      });
    }
    await loadData();
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      await deleteFoodItem(deleteConfirmId);
      await loadData();
      setDeleteConfirmId(null);
    }
  };


  // Mock 7-day sales trend data for detail drawer
  const detailTrendData = [
    { day: "Mon", actual: 72, predicted: 75 },
    { day: "Tue", actual: 78, predicted: 76 },
    { day: "Wed", actual: 80, predicted: 82 },
    { day: "Thu", actual: 84, predicted: 85 },
    { day: "Fri", actual: 95, predicted: 92 },
    { day: "Sat", actual: 110, predicted: 108 },
    { day: "Sun", actual: 102, predicted: 100 }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#040d09] via-[#081c15] to-[#1b4332] rounded-3xl p-6 md:p-8 text-white shadow-xl border border-emerald-800/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37] bg-[#d4af37]/10 px-3.5 py-1 rounded-full border border-[#d4af37]/30 inline-flex items-center gap-1.5 mb-2">
            <UtensilsCrossed className="w-3.5 h-3.5 text-[#d4af37]" /> AI FOOD CATALOG INTELLIGENCE
          </span>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white">
            Food Intelligence
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
            Understand every food item through AI-powered demand and performance insights.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-2xl bg-[#d4af37] hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" /> Add Food Item
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search food item by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#f4f6f0] border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#1b4332] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Food Intelligence Table */}
      <div className="bg-white rounded-3xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 text-xs text-gray-500 font-medium">
          💡 Click any row to open full AI item telemetry, 7-day trend curve, and peak selling hours.
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#081c15] text-gray-200 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-4">Food Item</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Avg Daily Sales</th>
                <th className="px-5 py-4 text-emerald-400">Predicted Demand</th>
                <th className="px-5 py-4 text-amber-300">Recommended Prep</th>
                <th className="px-5 py-4 text-red-400">Waste %</th>
                <th className="px-5 py-4">Demand Trend</th>
                <th className="px-5 py-4">Risk Level</th>
                <th className="px-5 py-4">AI Recommendation</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
              {filteredItems.map(item => {
                const predicted = Math.round(item.avgDailySales * 1.08);
                const prep = Math.round(predicted * 1.06);
                const wastePct = "4.8%";
                const trend = "↑ 12%";
                const risk = "Low";

                return (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedItemDetail(item)}
                    className="hover:bg-emerald-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4 font-bold text-gray-900 flex items-center gap-3">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-9 h-9 rounded-xl object-cover border border-gray-200" />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-[#1b4332] text-white flex items-center justify-center font-bold">
                          {item.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <span className="text-[10px] text-gray-400 font-medium">₹{item.price} • {item.unit || 'portions'}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 font-bold text-[10px]">
                        {item.category}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-bold text-gray-900">{item.avgDailySales} {item.unit || 'portions'}</td>
                    <td className="px-5 py-4 font-extrabold text-[#1b4332] text-sm">{predicted} {item.unit || 'portions'}</td>
                    <td className="px-5 py-4 font-extrabold text-[#d4af37] text-sm">{prep} {item.unit || 'portions'}</td>
                    <td className="px-5 py-4 font-bold text-red-600">{wastePct}</td>
                    <td className="px-5 py-4 font-bold text-emerald-700">{trend}</td>
                    
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {risk} Risk
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-[#1b4332] text-white text-[10px] font-bold">
                        Prepare {prep}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleOpenEdit(e, item)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-[#1b4332] transition-colors cursor-pointer"
                        title="Edit Item"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(item.id); }}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Food Intelligence Drawer/Modal when Row Clicked */}
      {selectedItemDetail && (
        <Modal
          isOpen={!!selectedItemDetail}
          onClose={() => setSelectedItemDetail(null)}
          title={`Food Intelligence Deep-Dive: ${selectedItemDetail.name}`}
        >
          <div className="space-y-4 text-xs">
            <div className="bg-[#081c15] text-white p-5 rounded-2xl border border-[#1b4332] space-y-2">
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">AI Operational Intelligence</span>
              <h3 className="text-xl font-bold font-heading text-white">{selectedItemDetail.name} ({selectedItemDetail.category})</h3>
              <p className="text-gray-300 leading-relaxed font-normal">
                💡 "Veg Biryani demand is expected to increase by 12% tomorrow due to Friday evening footfall surge and favorable sunny weather. Preparing 90 portions is recommended."
              </p>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-[#f4f6f0] p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-semibold uppercase">Predicted Demand</span>
                <p className="text-lg font-bold text-gray-900 font-heading">85 Portions</p>
              </div>

              <div className="bg-[#f4f6f0] p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] text-amber-800 font-bold uppercase">Recommended Prep</span>
                <p className="text-lg font-bold text-[#d4af37] font-heading">90 Portions</p>
              </div>

              <div className="bg-[#f4f6f0] p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-semibold uppercase">Waste History</span>
                <p className="text-lg font-bold text-red-600 font-heading">4.8% Waste</p>
              </div>

              <div className="bg-[#f4f6f0] p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 font-semibold uppercase">Peak Selling Hours</span>
                <p className="text-sm font-bold text-emerald-800 font-heading">7:00 PM – 9:30 PM</p>
              </div>
            </div>

            {/* 7-Day Trend Line Chart */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
              <span className="font-bold text-gray-900 block">7-Day Sales & Demand Trajectory</span>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={detailTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#081c15', borderRadius: '10px', color: '#fff', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="actual" name="Actual Sales" stroke="#1b4332" strokeWidth={2} />
                    <Line type="monotone" dataKey="predicted" name="AI Predicted" stroke="#d4af37" strokeWidth={2} strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedItemDetail(null);
                  if (onNavigate) onNavigate('prediction');
                }}
                className="px-4 py-2 rounded-xl bg-[#d4af37] text-slate-950 font-bold text-xs shadow-xs"
              >
                View AI Analysis Engine
              </button>
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <Modal
          isOpen={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId(null)}
          title="Confirm Item Deletion"
        >
          <div className="space-y-4 text-xs">
            <p className="text-gray-700 font-semibold">
              Are you sure you want to remove this item from AI prediction models? This will untrack historical sales for this dish.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? `Edit Item: ${editingItem.name}` : "Add New Food Item"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Item Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-[#f4f6f0] border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-[#f4f6f0] border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              >
                <option value="Main Course">Main Course</option>
                <option value="Appetizers">Appetizers</option>
                <option value="Beverages">Beverages</option>
                <option value="Desserts">Desserts</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Serving Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                className="w-full bg-[#f4f6f0] border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              >
                <option value="portions">Portions</option>
                <option value="plates">Plates</option>
                <option value="glasses">Glasses</option>
                <option value="bowls">Bowls</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Selling Price (₹)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full bg-[#f4f6f0] border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Avg Daily Sales</label>
              <input
                type="number"
                required
                value={formData.avgDailySales}
                onChange={(e) => setFormData({...formData, avgDailySales: e.target.value})}
                className="w-full bg-[#f4f6f0] border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Save Item
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
