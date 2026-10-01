import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  LayoutDashboard,
  GitBranch,
  ShieldCheck,
  ShoppingBag,
  Users,
  Boxes,
  ScrollText,
  Cpu,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchBadges = async () => {
    try {
      const [appRes, notifRes] = await Promise.all([
        api.get('/approvals?status=pending'),
        api.get('/notifications?unreadOnly=true')
      ]);
      setPendingApprovals(appRes.data.data.count || 0);
      setUnreadNotifications(notifRes.data.data.unreadCount || 0);
    } catch {
      // Ignore background badge errors
    }
  };

  useEffect(() => {
    fetchBadges();
    const interval = setInterval(fetchBadges, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleDemoReset = async () => {
    setIsResetting(true);
    setResetMessage(null);
    try {
      await api.post('/demo/reset');
      setResetMessage('Demo dataset reset to baseline!');
      setTimeout(() => setResetMessage(null), 3500);
      fetchBadges();
      // Reload current page data if needed
      window.dispatchEvent(new CustomEvent('opspilot:demo_reset'));
    } catch (err) {
      setResetMessage('Reset failed: ' + err.message);
    } finally {
      setIsResetting(false);
    }
  };

  const navItems = [
    { label: 'Command Center', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Workflows', path: '/workflows', icon: GitBranch },
    { label: 'Approval Center', path: '/approvals', icon: ShieldCheck, badge: pendingApprovals },
    { label: 'Orders', path: '/orders', icon: ShoppingBag },
    { label: 'Customers', path: '/customers', icon: Users },
    { label: 'Inventory Risk', path: '/inventory', icon: Boxes },
    { label: 'Policies', path: '/policies', icon: ScrollText },
    { label: 'Agent Activity', path: '/agents', icon: Cpu },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Notifications', path: '/notifications', icon: Bell, badge: unreadNotifications },
    { label: 'System & Demo', path: '/settings', icon: Settings },
  ];

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-900/40 text-purple-300 border-purple-700/50';
      case 'manager':
        return 'bg-amber-900/40 text-amber-300 border-amber-700/50';
      case 'operator':
        return 'bg-blue-900/40 text-blue-300 border-blue-700/50';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800/80 bg-dark-900/95 backdrop-blur-md z-20">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-brand-blue via-brand-cyan to-indigo-500 p-0.5 shadow-lg shadow-brand-cyan/20">
              <div className="h-full w-full bg-dark-950 rounded-[7px] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-brand-cyan animate-pulse-subtle" />
              </div>
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-base">OpsPilot</span>
              <span className="text-brand-cyan font-semibold text-xs ml-1 px-1.5 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/20">AI</span>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">AGENTIC OPS</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            OPERATIONS CONSOLE
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive: active }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
                    active || isActive
                      ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/25 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-brand-cyan' : 'text-slate-400 group-hover:text-slate-300'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    item.label.includes('Approval')
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Quick Demo Reset & User Status */}
        <div className="p-3 border-t border-slate-800/80 bg-dark-950/60 space-y-2">
          {resetMessage && (
            <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
              <span>{resetMessage}</span>
            </div>
          )}

          <button
            onClick={handleDemoReset}
            disabled={isResetting}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-amber-300 bg-amber-950/30 hover:bg-amber-950/60 border border-amber-500/30 transition-all disabled:opacity-50"
            title="Reset to 17 delayed orders, 12 auto-resolvable, 3 approval required, 1 failure recovery"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Resetting Demo...' : 'Reset Demo Dataset'}</span>
          </button>

          <div className="pt-2 flex items-center justify-between px-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300">
                {user?.username ? user.username.slice(0, 2).toUpperCase() : 'OP'}
              </div>
              <div className="truncate">
                <p className="text-xs font-medium text-slate-200 truncate">{user?.username || 'Operator'}</p>
                <span className={`inline-block text-[9px] uppercase px-1.5 py-0.2 rounded border font-mono font-bold ${getRoleBadge(user?.role)}`}>
                  {user?.role || 'operator'}
                </span>
              </div>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800/80 bg-dark-900/70 backdrop-blur-md px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wide">SYSTEM OPERATIONAL</span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">THE LLM REASONS &bull; APPLICATION CONTROLS</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-cyan animate-ping"></span>
              )}
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-blue to-brand-cyan hover:opacity-90 text-dark-950 font-semibold text-xs transition-all shadow-md shadow-brand-cyan/10"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>New Goal</span>
            </button>
          </div>
        </header>

        {/* Viewport for Child Route */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-dark-950 to-dark-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
