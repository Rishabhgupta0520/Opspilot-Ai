import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WorkflowsPage from './pages/WorkflowsPage';
import WorkflowDetailPage from './pages/WorkflowDetailPage';
import ApprovalCenterPage from './pages/ApprovalCenterPage';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import InventoryPage from './pages/InventoryPage';
import PoliciesPage from './pages/PoliciesPage';
import AgentActivityPage from './pages/AgentActivityPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import MotionLightCursor from './components/motion/MotionLightCursor';
import OpsPilotAssistantChatbot from './components/chat/OpsPilotAssistantChatbot';

// All routes are publicly accessible — no auth gate on the dashboard.
// Visitors can explore the full demo experience immediately without registering.

export default function App() {
  return (
    <AuthProvider>
      <MotionLightCursor />
      <BrowserRouter>
        <OpsPilotAssistantChatbot />
        <Routes>
          {/* Public Landing & Auth */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Console / Dashboard Shell — fully public for demo */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/workflows" element={<WorkflowsPage />} />
            <Route path="/workflows/:id" element={<WorkflowDetailPage />} />
            <Route path="/approvals" element={<ApprovalCenterPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/policies" element={<PoliciesPage />} />
            <Route path="/agents" element={<AgentActivityPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
