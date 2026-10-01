import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShoppingBag, Search, Filter, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [vipFilter, setVipFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/orders?status=${statusFilter}&isVip=${vipFilter}&search=${search}`);
      setOrders(res.data.data.orders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, vipFilter, search]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-brand-cyan" />
            <span>Orders Directory</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Monitored transactions across fulfillment networks ({orders.length} total)
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer name..."
            className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-cyan"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan w-full sm:w-auto"
        >
          <option value="all">All Statuses</option>
          <option value="delayed">Delayed (17)</option>
          <option value="delivered">Delivered</option>
          <option value="processing">Processing</option>
          <option value="refunded">Refunded</option>
        </select>

        <select
          value={vipFilter}
          onChange={(e) => setVipFilter(e.target.value)}
          className="bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan w-full sm:w-auto"
        >
          <option value="all">All Tiers</option>
          <option value="true">VIP Only</option>
          <option value="false">Standard Only</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="p-5 rounded-2xl glass-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="text-[11px] text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Delay (hrs)</th>
                <th className="pb-3">Policy Eligibility</th>
                <th className="pb-3 text-right">Last Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-mono">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No orders matching filters.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pr-3 font-mono font-bold text-brand-cyan">
                      {o.orderNumber}
                    </td>
                    <td className="py-3.5 pr-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-slate-200">{o.customerName}</span>
                        {o.isVip && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            VIP
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 pr-3 font-mono text-white">
                      ₹{o.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 pr-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        o.status === 'delayed'
                          ? 'bg-amber-950/60 text-amber-400 border-amber-500/40'
                          : o.status === 'refunded'
                          ? 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                          : o.status === 'delivered'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 pr-3 font-mono">
                      {o.delayHours > 0 ? (
                        <span className={`font-bold ${o.delayHours > 48 ? 'text-rose-400' : 'text-amber-400'}`}>
                          {o.delayHours}h
                        </span>
                      ) : (
                        <span className="text-slate-500">On Time</span>
                      )}
                    </td>
                    <td className="py-3.5 pr-3">
                      {o.amount <= 5000 ? (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                          AUTO-REFUND ELIGIBLE
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-amber-300 bg-amber-950/40 border border-amber-500/30 px-1.5 py-0.5 rounded">
                          APPROVAL MANDATE (&gt;₹5k)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right font-mono text-slate-400 text-[11px] truncate max-w-xs">
                      {o.lastActionTaken || 'None'}
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
