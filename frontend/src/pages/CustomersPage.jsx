import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Search, ShieldAlert, Award } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all');

  const fetchCustomers = async () => {
    try {
      const res = await api.get(`/customers?tier=${tierFilter}&search=${search}`);
      setCustomers(res.data.data.customers || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [tierFilter, search]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Users className="h-6 w-6 text-brand-cyan" />
          <span>Customer Intelligence Registry</span>
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          VIP accounts, dispute velocity, and operational SLA impact
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, or ID..."
            className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-cyan"
          />
        </div>

        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan w-full sm:w-auto"
        >
          <option value="all">All Tiers</option>
          <option value="VIP">VIP Tier</option>
          <option value="Enterprise">Enterprise</option>
          <option value="Standard">Standard</option>
        </select>
      </div>

      <div className="p-5 rounded-2xl glass-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="text-[11px] text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Tier</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3">Lifetime Value</th>
                <th className="pb-3">Orders</th>
                <th className="pb-3">Open Tickets</th>
                <th className="pb-3 text-right">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-mono">
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pr-3 font-medium text-white">
                      <div>
                        <span>{c.name}</span>
                        <span className="block text-[10px] font-mono text-slate-500">{c.customerId}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        c.tier === 'VIP'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : c.tier === 'Enterprise'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {c.tier}
                      </span>
                    </td>
                    <td className="py-3.5 pr-3 font-mono text-slate-400 text-[11px]">
                      {c.email}
                    </td>
                    <td className="py-3.5 pr-3 font-mono text-white">
                      ₹{c.lifetimeValue?.toLocaleString() || 0}
                    </td>
                    <td className="py-3.5 pr-3 font-mono text-slate-300">
                      {c.totalOrders || 0}
                    </td>
                    <td className="py-3.5 pr-3 font-mono">
                      {c.openTickets > 0 ? (
                        <span className="text-amber-400 font-bold">{c.openTickets} open</span>
                      ) : (
                        <span className="text-slate-500">0</span>
                      )}
                    </td>
                    <td className="py-3.5 text-right font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.riskLevel === 'high'
                          ? 'text-rose-400 bg-rose-950/40'
                          : c.riskLevel === 'medium'
                          ? 'text-amber-400 bg-amber-950/40'
                          : 'text-emerald-400 bg-emerald-950/40'
                      }`}>
                        {c.riskLevel}
                      </span>
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
