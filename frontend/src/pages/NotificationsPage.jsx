import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Bell, CheckCircle2, AlertTriangle, ShieldAlert, Check, ArrowRight } from 'lucide-react';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data.notifications || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Bell className="h-6 w-6 text-brand-cyan" />
          <span>Operational Notifications</span>
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Real-time alerts generated across autonomous agent workflows
        </p>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-slate-400 font-mono text-xs">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl">
            No notifications recorded.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => {
                if (n.workflowId) navigate(`/workflows/${n.workflowId}`);
                else if (n.link) navigate(n.link);
              }}
              className={`p-4 rounded-xl glass-panel border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                !n.read ? 'border-brand-cyan/40 bg-brand-cyan/5' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {n.severity === 'error' ? (
                    <ShieldAlert className="h-5 w-5 text-rose-400" />
                  ) : n.severity === 'warning' ? (
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{n.title}</h3>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-brand-cyan"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{n.message}</p>
                  <span className="text-[10px] font-mono text-slate-400 mt-2 block">
                    {new Date(n.createdAt).toLocaleTimeString()} &bull; Type: {n.type}
                  </span>
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={(e) => handleMarkRead(n._id, e)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex-shrink-0"
                  title="Mark as read"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
