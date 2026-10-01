import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  getCustomers,
  getCustomerById,
  getShipments,
  getTickets,
  getInventory,
  getPolicies,
  togglePolicy,
  getAgentActivity,
  getNotifications,
  markNotificationRead,
  getAnalytics,
  resetDemo
} from '../controllers/operationsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Operational Entities
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderById);

router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerById);

router.get('/shipments', getShipments);
router.get('/tickets', getTickets);
router.get('/inventory', getInventory);

router.get('/policies', getPolicies);
router.patch('/policies/:id/toggle', authenticate, authorize('admin', 'manager'), togglePolicy);

// Agent Activity & Analytics
router.get('/agents/activity', getAgentActivity);
router.get('/analytics', getAnalytics);

// Notifications
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

// Demo Reset (Open or Authenticated for instant reset in Hackathon)
router.post('/demo/reset', resetDemo);

export default router;
