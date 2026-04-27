import React, { useState } from 'react';
import { useInventory, useItemForecast } from '../hooks/useInventory';
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  MoreVertical, 
  Loader2,
  Box,
  MapPin
} from 'lucide-react';
import { clsx } from 'clsx';

const InventoryTable = () => {
  const { items, isLoading } = useInventory();
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Item Details</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">SKU</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm font-mono text-slate-600">{item.sku}</td>
              <td className="px-6 py-4">
                <span className={clsx(
                  "font-bold",
                  item.quantity < 10 ? "text-rose-600" : "text-slate-900"
                )}>
                  {item.quantity} units
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {item.location}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={clsx(
                  "px-2.5 py-1 rounded-full text-xs font-bold",
                  item.quantity < 10 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                )}>
                  {item.quantity < 10 ? 'Low Stock' : 'In Stock'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => setSelectedItem(item.id)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Run AI Forecast"
                  >
                    <TrendingUp className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {selectedItem && <ForecastModal id={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
};

const ForecastModal = ({ id, onClose }: { id: number; onClose: () => void }) => {
  const { data: forecast, isLoading } = useItemForecast(id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">×</button>
        </div>
        
        {isLoading ? (
          <div className="py-12 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm font-medium text-slate-500">ML Service calculating demand...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{forecast?.item_name}</h3>
              <p className="text-sm text-slate-500">AI Demand Prediction</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs font-bold text-slate-400 uppercase">Current</p>
                <p className="text-xl font-bold">{forecast?.current_quantity}</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <p className="text-xs font-bold text-indigo-400 uppercase">Forecasted</p>
                <p className="text-xl font-bold text-indigo-600">{forecast?.forecasted_demand}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Confidence Score</span>
                <span className="font-bold text-emerald-600">{Math.round((forecast?.confidence_score ?? 0) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-1000" 
                  style={{ width: `${(forecast?.confidence_score ?? 0) * 100}%` }}
                />
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest">
              Powered by {forecast?.model_used}
            </p>

            <button 
              onClick={onClose}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              Back to Inventory
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Inventory = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory Control</h1>
          <p className="text-slate-500 mt-1">Real-time stock management with ML forecasting.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by SKU or Name..." 
              className="bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none w-64"
            />
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Item
          </button>
        </div>
      </div>

      <InventoryTable />
    </div>
  );
};

export default Inventory;
