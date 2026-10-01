import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ScrollText, ShieldCheck, Check, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';

export default function PoliciesPage() {
  const { user } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  const canToggle = user?.role === 'admin' || user?.role === 'manager';

  const fetchPolicies = async () => {
    try {
      const res = await api.get('/policies');
      setPolicies(res.data.data.policies || []);
    } catch (err) {
      console.error('Failed to load policies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleToggle = async (policyId) => {
    if (!canToggle) return;
    try {
      await api.patch(`/policies/${policyId}/toggle`);
      await fetchPolicies();
    } catch (err) {
      alert(`Policy update failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <ScrollText className="h-6 w-6 text-brand-cyan" />
          <span>Deterministic Policy Engine Rules</span>
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Immutable business boundaries enforced by application logic (LLMs cannot bypass)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policies.map((p) => (
          <div
            key={p._id}
            className={`p-5 rounded-2xl glass-panel border transition-all flex flex-col justify-between ${
              p.active ? 'border-slate-800' : 'border-slate-800/40 opacity-60'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded">
                  {p.code}
                </span>
                <div className="flex items-center gap-2">
                  {p.requiresApproval && (
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold">
                      APPROVAL MANDATE
                    </span>
                  )}
                  {canToggle ? (
                    <button
                      onClick={() => handleToggle(p._id)}
                      className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
                    >
                      {p.active ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-bold">
                          <Check className="h-3.5 w-3.5" /> ACTIVE
                        </span>
                      ) : (
                        <span className="text-slate-500">DISABLED</span>
                      )}
                    </button>
                  ) : (
                    <span className={`text-[10px] font-mono ${p.active ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {p.active ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-base font-bold text-white">{p.name}</h2>
              <p className="text-xs text-slate-300 leading-relaxed">{p.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Category: <strong className="text-slate-200 uppercase">{p.category}</strong></span>
              {p.thresholdValue !== null && (
                <span>Threshold: <strong className="text-brand-cyan">
                  {p.category === 'refund' ? `₹${p.thresholdValue.toLocaleString()}` : `${p.thresholdValue}h`}
                </strong></span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
