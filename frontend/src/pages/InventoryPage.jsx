import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Boxes, AlertTriangle, CheckCircle2, TrendingDown, ArrowRight } from 'lucide-react';

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [riskOnly, setRiskOnly] = useState(false);

  const fetchInventory = async () => {
    try {
      const res = await api.get(`/inventory?riskOnly=${riskOnly}`);
      setItems(res.data.data.items || []);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [riskOnly]);

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'critical':
        return 'bg-rose-950/70 text-rose-300 border-rose-500/50 animate-pulse';
      case 'high':
        return 'bg-amber-950/70 text-amber-300 border-amber-500/50';
      case 'medium':
        return 'bg-blue-950/60 text-blue-300 border-blue-500/40';
      default:
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Boxes className="h-6 w-6 text-brand-cyan" />
            <span>Inventory Stock-Out Risk Radar</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Predictive stock burn rates & autonomous purchase requisition triggers
          </p>
        </div>

        <button
          onClick={() => setRiskOnly(!riskOnly)}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
            riskOnly
              ? 'bg-rose-950/80 text-rose-300 border-rose-500/50'
              : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
          }`}
        >
          {riskOnly ? 'Showing High Risk Items Only' : 'Filter At-Risk Products'}
        </button>
      </div>

      <div className="p-5 rounded-2xl glass-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="text-[11px] text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="pb-3">Product Name</th>
                <th className="pb-3">SKU</th>
                <th className="pb-3">Current Stock</th>
                <th className="pb-3">Daily Demand</th>
                <th className="pb-3">Days Remaining</th>
                <th className="pb-3">Stockout Risk</th>
                <th className="pb-3 text-right">Autonomous Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-mono">
                    Loading inventory telemetry...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No items matching filter.
                  </td>
                </tr>
              ) : (
                items.map((i) => (
                  <tr key={i._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pr-3 font-medium text-white max-w-xs truncate">
                      {i.name}
                    </td>
                    <td className="py-3.5 pr-3 font-mono text-brand-cyan">
                      {i.sku}
                    </td>
                    <td className="py-3.5 pr-3 font-mono text-white">
                      {i.stockLevel} units
                    </td>
                    <td className="py-3.5 pr-3 font-mono text-slate-300">
                      {i.dailyDemand}/day
                    </td>
                    <td className="py-3.5 pr-3 font-mono font-bold">
                      <span className={i.daysRemaining <= 3 ? 'text-rose-400' : 'text-slate-300'}>
                        {i.daysRemaining} days
                      </span>
                    </td>
                    <td className="py-3.5 pr-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getRiskBadge(i.riskLevel)}`}>
                        {i.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-mono text-xs">
                      {i.daysRemaining <= 3 ? (
                        <span className="text-amber-400 font-bold bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
                          Expedited Reorder
                        </span>
                      ) : (
                        <span className="text-slate-500">Normal Buffer</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
