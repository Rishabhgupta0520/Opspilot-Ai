import { Order } from '../models/Order.js';
import { Customer } from '../models/Customer.js';
import { Shipment } from '../models/Shipment.js';
import { SupportTicket } from '../models/SupportTicket.js';
import { InventoryItem } from '../models/InventoryItem.js';
import { Policy } from '../models/Policy.js';
import { AgentLog } from '../models/AgentLog.js';
import { Workflow } from '../models/Workflow.js';
import { Action } from '../models/Action.js';
import { Approval } from '../models/Approval.js';
import { Notification } from '../models/Notification.js';
import { seedDatabase } from '../seed/seed.js';

// --- ORDERS ---
export const getOrders = async (req, res) => {
  try {
    const { status, isVip, minDelay, search } = req.query;
    const query = {};

    if (status && status !== 'all') query.status = status;
    if (isVip !== undefined && isVip !== 'all') query.isVip = isVip === 'true';
    if (minDelay) query.delayHours = { $gte: Number(minDelay) };
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query).sort({ delayHours: -1, createdAt: -1 }).lean();
    return res.json({ success: true, data: { count: orders.length, orders } });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: err.message } });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderNumber: id }] }).lean();
    if (!order) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });

    const [shipment, customer, ticket, actions] = await Promise.all([
      Shipment.findOne({ orderNumber: order.orderNumber }).lean(),
      Customer.findOne({ customerId: order.customerId }).lean(),
      SupportTicket.findOne({ orderNumber: order.orderNumber }).lean(),
      Action.find({ targetId: order.orderNumber }).lean()
    ]);

    return res.json({
      success: true,
      data: { order, shipment, customer, ticket, actions }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: err.message } });
  }
};

// --- CUSTOMERS ---
export const getCustomers = async (req, res) => {
  try {
    const { tier, riskLevel, search } = req.query;
    const query = {};
    if (tier && tier !== 'all') query.tier = tier;
    if (riskLevel && riskLevel !== 'all') query.riskLevel = riskLevel;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { customerId: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(query).sort({ lifetimeValue: -1 }).lean();
    return res.json({ success: true, data: { count: customers.length, customers } });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: err.message } });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findOne({ $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { customerId: id }] }).lean();
    if (!customer) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Customer not found' } });

    const [orders, tickets] = await Promise.all([
      Order.find({ customerId: customer.customerId }).sort({ createdAt: -1 }).lean(),
      SupportTicket.find({ customerId: customer.customerId }).sort({ createdAt: -1 }).lean()
    ]);

    return res.json({ success: true, data: { customer, orders, tickets } });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: err.message } });
  }
};

// --- SHIPMENTS ---
export const getShipments = async (req, res) => {
  try {
    const { status, carrier } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (carrier && carrier !== 'all') query.carrier = carrier;

    const shipments = await Shipment.find(query).sort({ delayHours: -1 }).lean();
    return res.json({ success: true, data: { count: shipments.length, shipments } });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: err.message } });
  }
};

// --- TICKETS ---
export const getTickets = async (req, res) => {
  try {
    const { status, priority } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;

    const tickets = await SupportTicket.find(query).sort({ slaHoursRemaining: 1 }).lean();
    return res.json({ success: true, data: { count: tickets.length, tickets } });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: err.message } });
  }
};

// --- INVENTORY ---
export const getInventory = async (req, res) => {
  try {
    const { category, riskOnly } = req.query;
    const query = {};
    if (category && category !== 'all') query.category = category;

    let items = await InventoryItem.find(query).sort({ stockLevel: 1 });
    const formatted = items.map(i => ({
      ...i.toJSON(),
      daysRemaining: i.daysRemaining,
      riskLevel: i.riskLevel
    }));

    const result = riskOnly === 'true'
      ? formatted.filter(i => i.riskLevel === 'critical' || i.riskLevel === 'high')
      : formatted;

    return res.json({ success: true, data: { count: result.length, items: result } });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: err.message } });
  }
};

// --- POLICIES ---
export const getPolicies = async (req, res) => {
  try {
    const { category, active } = req.query;
    const query = {};
    if (category && category !== 'all') query.category = category;
    if (active !== undefined && active !== 'all') query.active = active === 'true';

    const policies = await Policy.find(query).sort({ priority: 1 }).lean();
    return res.json({ success: true, data: { count: policies.length, policies } });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: err.message } });
  }
};

export const togglePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await Policy.findById(id);
    if (!policy) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Policy not found' } });

    policy.active = !policy.active;
    await policy.save();

    return res.json({ success: true, data: { policy } });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: err.message } });
  }
};

// --- AGENT ACTIVITY ---
export const getAgentActivity = async (req, res) => {
  try {
    const { agent, status, limit = 50 } = req.query;
    const query = {};
    if (agent && agent !== 'all') query.agent = agent;
    if (status && status !== 'all') query.status = status;

    const logs = await AgentLog.find(query).sort({ timestamp: -1 }).limit(Number(limit)).lean();
    return res.json({ success: true, data: { count: logs.length, logs } });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: err.message } });
  }
};

// --- NOTIFICATIONS ---
export const getNotifications = async (req, res) => {
  try {
    const { unreadOnly } = req.query;
    const query = {};
    if (unreadOnly === 'true') query.read = false;

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(40).lean();
    const unreadCount = await Notification.countDocuments({ read: false });

    return res.json({
      success: true,
      data: {
        count: notifications.length,
        unreadCount,
        notifications
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: err.message } });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: err.message } });
  }
};

// --- ANALYTICS ---
export const getAnalytics = async (req, res) => {
  try {
    const [
      totalWorkflows,
      completedWorkflows,
      failedWorkflows,
      escalatedWorkflows,
      awaitingApprovalWorkflows,
      totalActions,
      verifiedActions,
      pendingApprovals,
      approvedApprovals,
      totalOrders,
      delayedOrdersCount
    ] = await Promise.all([
      Workflow.countDocuments(),
      Workflow.countDocuments({ status: 'COMPLETED' }),
      Workflow.countDocuments({ status: 'FAILED' }),
      Workflow.countDocuments({ status: 'ESCALATED' }),
      Workflow.countDocuments({ status: 'AWAITING_APPROVAL' }),
      Action.countDocuments(),
      Action.countDocuments({ status: 'verified' }),
      Approval.countDocuments({ status: 'pending' }),
      Approval.countDocuments({ status: 'approved' }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'delayed' })
    ]);

    const automatedWorkflows = Math.max(0, completedWorkflows - approvedApprovals);
    const automationRate = totalWorkflows > 0 ? Number(((automatedWorkflows / totalWorkflows) * 100).toFixed(1)) : 88.5;
    const verificationSuccessRate = totalActions > 0 ? Number(((verifiedActions / totalActions) * 100).toFixed(1)) : 98.4;
    const failureRecoveryRate = 94.2; // demo recovery rate
    const avgResolutionTimeMs = 1420; // 1.4s autonomous average

    // Volume timeline mock/aggregate
    const volumeTimeline = [
      { time: '09:00', workflows: 4, automated: 4, humanReview: 0 },
      { time: '10:00', workflows: 8, automated: 7, humanReview: 1 },
      { time: '11:00', workflows: 15, automated: 13, humanReview: 2 },
      { time: '12:00', workflows: 12, automated: 11, humanReview: 1 },
      { time: '13:00', workflows: 19, automated: 17, humanReview: 2 },
      { time: '14:00', workflows: 22, automated: 20, humanReview: 2 }
    ];

    const agentBreakdown = [
      { name: 'Planner Agent', calls: 38, avgDurationMs: 310 },
      { name: 'Investigation Agent', calls: 86, avgDurationMs: 145 },
      { name: 'Policy Engine', calls: 92, avgDurationMs: 42 },
      { name: 'Decision Agent', calls: 84, avgDurationMs: 280 },
      { name: 'Action Agent', calls: 65, avgDurationMs: 190 },
      { name: 'Verification Agent', calls: 65, avgDurationMs: 110 }
    ];

    return res.json({
      success: true,
      data: {
        totalWorkflows: totalWorkflows || 1,
        completedWorkflows: completedWorkflows || 1,
        failedWorkflows,
        escalatedWorkflows,
        awaitingApprovalWorkflows,
        activeApprovals: pendingApprovals,
        totalActions,
        verifiedActions,
        automationRate,
        verificationSuccessRate,
        failureRecoveryRate,
        avgResolutionTimeMs,
        totalOrders,
        delayedOrdersCount,
        volumeTimeline,
        agentBreakdown
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: err.message } });
  }
};

// --- DEMO RESET ---
export const resetDemo = async (req, res) => {
  try {
    const counts = await seedDatabase();
    return res.json({
      success: true,
      message: 'Demo dataset successfully reset to deterministic seed baseline.',
      data: counts
    });
  } catch (err) {
    console.error('Demo reset error:', err);
    return res.status(500).json({ success: false, error: { code: 'RESET_FAILED', message: err.message } });
  }
};
