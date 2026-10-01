import { z } from 'zod';
import { Order } from '../models/Order.js';
import { Customer } from '../models/Customer.js';
import { Shipment } from '../models/Shipment.js';
import { SupportTicket } from '../models/SupportTicket.js';
import { InventoryItem } from '../models/InventoryItem.js';
import { Policy } from '../models/Policy.js';
import { Approval } from '../models/Approval.js';
import { Action } from '../models/Action.js';
import { Notification } from '../models/Notification.js';
import { AgentLog } from '../models/AgentLog.js';
import { AuditEvent } from '../models/AuditEvent.js';

// Tool Schema Definitions
export const toolSchemas = {
  getDelayedOrders: z.object({
    minDelayHours: z.number().optional().default(0),
    vipOnly: z.boolean().optional().default(false),
    limit: z.number().optional().default(50)
  }),

  getOrder: z.object({
    orderNumber: z.string().min(1, 'Order number is required')
  }),

  getCustomer: z.object({
    customerId: z.string().min(1, 'Customer ID is required')
  }),

  getCustomerHistory: z.object({
    customerId: z.string().min(1, 'Customer ID is required')
  }),

  getShipment: z.object({
    orderNumber: z.string().min(1, 'Order number is required')
  }),

  getSupportTicket: z.object({
    ticketNumber: z.string().optional(),
    orderNumber: z.string().optional()
  }),

  getInventory: z.object({
    sku: z.string().optional(),
    riskOnly: z.boolean().optional().default(false)
  }),

  getPolicies: z.object({
    category: z.string().optional()
  }),

  calculateRefund: z.object({
    orderNumber: z.string(),
    reason: z.string()
  }),

  createRefund: z.object({
    orderNumber: z.string(),
    amount: z.number().positive(),
    reason: z.string(),
    idempotencyKey: z.string()
  }),

  createReplacement: z.object({
    orderNumber: z.string(),
    reason: z.string(),
    idempotencyKey: z.string()
  }),

  updateSupportTicket: z.object({
    ticketNumber: z.string(),
    status: z.enum(['open', 'in_progress', 'resolved', 'escalated']),
    notes: z.string()
  }),

  sendCustomerNotification: z.object({
    customerId: z.string(),
    orderNumber: z.string().optional(),
    channel: z.enum(['email', 'sms', 'push']).default('email'),
    message: z.string(),
    idempotencyKey: z.string()
  }),

  createEscalation: z.object({
    targetEntity: z.string(),
    targetId: z.string(),
    reason: z.string(),
    priority: z.enum(['medium', 'high', 'critical']).default('critical')
  }),

  reserveInventory: z.object({
    sku: z.string(),
    quantity: z.number().positive()
  }),

  updateInventory: z.object({
    sku: z.string(),
    quantityDelta: z.number()
  }),

  createApprovalRequest: z.object({
    actionType: z.string(),
    orderNumber: z.string().optional(),
    customerName: z.string(),
    amount: z.number().nullable().optional(),
    reason: z.string(),
    evidence: z.array(z.string()),
    policyReference: z.string(),
    riskLevel: z.enum(['low', 'medium', 'high', 'critical']).default('high')
  }),

  verifyRefund: z.object({
    orderNumber: z.string(),
    expectedAmount: z.number()
  }),

  verifyReplacement: z.object({
    orderNumber: z.string()
  }),

  verifyTicketUpdate: z.object({
    ticketNumber: z.string(),
    expectedStatus: z.string()
  }),

  verifyNotification: z.object({
    idempotencyKey: z.string()
  })
};

// Tool Implementations
const toolImplementations = {
  async getDelayedOrders({ minDelayHours, vipOnly, limit }) {
    const query = { status: 'delayed' };
    if (minDelayHours > 0) query.delayHours = { $gte: minDelayHours };
    if (vipOnly) query.isVip = true;

    const orders = await Order.find(query).limit(limit).lean();
    return {
      count: orders.length,
      orders: orders.map(o => ({
        orderNumber: o.orderNumber,
        customerId: o.customerId,
        customerName: o.customerName,
        isVip: o.isVip,
        amount: o.amount,
        currency: o.currency,
        delayHours: o.delayHours,
        status: o.status,
        refundProcessed: o.refundProcessed,
        refundAmount: o.refundAmount,
        itemCount: o.items?.length || 0,
        items: o.items
      }))
    };
  },

  async getOrder({ orderNumber }) {
    const order = await Order.findOne({ orderNumber }).lean();
    if (!order) throw new Error(`Order ${orderNumber} not found.`);
    return order;
  },

  async getCustomer({ customerId }) {
    const customer = await Customer.findOne({ customerId }).lean();
    if (!customer) throw new Error(`Customer ${customerId} not found.`);
    return customer;
  },

  async getCustomerHistory({ customerId }) {
    const [customer, orders, tickets] = await Promise.all([
      Customer.findOne({ customerId }).lean(),
      Order.find({ customerId }).sort({ createdAt: -1 }).lean(),
      SupportTicket.find({ customerId }).sort({ createdAt: -1 }).lean()
    ]);

    if (!customer) throw new Error(`Customer ${customerId} not found.`);

    return {
      customer,
      recentOrdersCount: orders.length,
      recentOrders: orders.slice(0, 5),
      openTicketsCount: tickets.filter(t => t.status !== 'resolved').length,
      tickets: tickets.slice(0, 5)
    };
  },

  async getShipment({ orderNumber }) {
    const shipment = await Shipment.findOne({ orderNumber }).lean();
    if (!shipment) throw new Error(`Shipment for order ${orderNumber} not found.`);
    return shipment;
  },

  async getSupportTicket({ ticketNumber, orderNumber }) {
    const query = {};
    if (ticketNumber) query.ticketNumber = ticketNumber;
    if (orderNumber) query.orderNumber = orderNumber;

    const tickets = await SupportTicket.find(query).lean();
    return { count: tickets.length, tickets };
  },

  async getInventory({ sku, riskOnly }) {
    const query = {};
    if (sku) query.sku = sku;

    let items = await InventoryItem.find(query).lean();
    if (riskOnly) {
      items = items.filter(i => {
        const days = i.dailyDemand > 0 ? i.stockLevel / i.dailyDemand : 999;
        return days <= 4 || i.stockLevel <= i.reorderPoint;
      });
    }

    return {
      count: items.length,
      items: items.map(i => ({
        sku: i.sku,
        name: i.name,
        category: i.category,
        stockLevel: i.stockLevel,
        dailyDemand: i.dailyDemand,
        reorderPoint: i.reorderPoint,
        daysRemaining: Number((i.stockLevel / (i.dailyDemand || 1)).toFixed(1)),
        unitPrice: i.unitPrice,
        supplier: i.supplier
      }))
    };
  },

  async getPolicies({ category }) {
    const query = { active: true };
    if (category) query.category = category;
    const policies = await Policy.find(query).sort({ priority: 1 }).lean();
    return { count: policies.length, policies };
  },

  async calculateRefund({ orderNumber, reason }) {
    const order = await Order.findOne({ orderNumber });
    if (!order) throw new Error(`Order ${orderNumber} not found.`);

    // Check policy threshold
    const refundThreshold = 5000;
    const requiresApproval = order.amount > refundThreshold;

    return {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      isVip: order.isVip,
      orderAmount: order.amount,
      recommendedRefund: order.amount,
      currency: order.currency,
      requiresApproval,
      threshold: refundThreshold,
      reason
    };
  },

  async createRefund({ orderNumber, amount, reason, idempotencyKey }, context) {
    // 1. Idempotency check
    const existingAction = await Action.findOne({ idempotencyKey });
    if (existingAction) {
      if (existingAction.status === 'executed' || existingAction.status === 'verified') {
        return {
          idempotentReplay: true,
          status: existingAction.status,
          message: 'Operation previously executed and verified. Duplicate execution prevented.',
          result: existingAction.executionResult
        };
      }
    }

    const order = await Order.findOne({ orderNumber });
    if (!order) throw new Error(`Order ${orderNumber} not found.`);

    if (order.refundProcessed) {
      return {
        alreadyRefunded: true,
        refundAmount: order.refundAmount,
        message: `Order ${orderNumber} has already been refunded for ₹${order.refundAmount}.`
      };
    }

    // Execute state change
    order.refundProcessed = true;
    order.refundAmount = amount;
    order.status = 'refunded';
    order.lastActionTaken = `Refund ₹${amount} issued: ${reason}`;
    order.lastActionAt = new Date();
    await order.save();

    const result = {
      refundId: `RFD-${Date.now().toString().slice(-6)}`,
      orderNumber: order.orderNumber,
      amount,
      currency: order.currency,
      status: 'PROCESSED',
      timestamp: new Date().toISOString()
    };

    // Record Action
    await Action.findOneAndUpdate(
      { idempotencyKey },
      {
        workflowId: context?.workflowId,
        actionType: 'refund',
        targetEntity: 'Order',
        targetId: order.orderNumber,
        idempotencyKey,
        payload: { orderNumber, amount, reason },
        status: 'executed',
        executionResult: result,
        attempts: 1
      },
      { upsert: true, new: true }
    );

    return result;
  },

  async createReplacement({ orderNumber, reason, idempotencyKey }, context) {
    const existingAction = await Action.findOne({ idempotencyKey });
    if (existingAction && (existingAction.status === 'executed' || existingAction.status === 'verified')) {
      return {
        idempotentReplay: true,
        result: existingAction.executionResult
      };
    }

    const order = await Order.findOne({ orderNumber });
    if (!order) throw new Error(`Order ${orderNumber} not found.`);

    const replacementOrderNumber = `ORD-RPL-${order.orderNumber.replace('ORD-', '')}`;
    order.status = 'replacement_ordered';
    order.replacementOrderNumber = replacementOrderNumber;
    order.lastActionTaken = `Replacement created: ${replacementOrderNumber}`;
    order.lastActionAt = new Date();
    await order.save();

    const result = {
      replacementOrderNumber,
      originalOrderNumber: order.orderNumber,
      status: 'CREATED',
      expeditedShipping: true
    };

    await Action.findOneAndUpdate(
      { idempotencyKey },
      {
        workflowId: context?.workflowId,
        actionType: 'replace_order',
        targetEntity: 'Order',
        targetId: order.orderNumber,
        idempotencyKey,
        payload: { orderNumber, reason },
        status: 'executed',
        executionResult: result,
        attempts: 1
      },
      { upsert: true, new: true }
    );

    return result;
  },

  async updateSupportTicket({ ticketNumber, status, notes }) {
    const ticket = await SupportTicket.findOne({ ticketNumber });
    if (!ticket) throw new Error(`Ticket ${ticketNumber} not found.`);

    ticket.status = status;
    ticket.resolutionNotes = `${ticket.resolutionNotes ? ticket.resolutionNotes + ' | ' : ''}[OpsPilot Auto]: ${notes}`;
    await ticket.save();

    return {
      ticketNumber: ticket.ticketNumber,
      status: ticket.status,
      updatedAt: ticket.updatedAt
    };
  },

  async sendCustomerNotification({ customerId, orderNumber, channel, message, idempotencyKey }, context) {
    const existingAction = await Action.findOne({ idempotencyKey });
    if (existingAction && (existingAction.status === 'executed' || existingAction.status === 'verified')) {
      return {
        idempotentReplay: true,
        result: existingAction.executionResult
      };
    }

    // Recoverable failure simulation: For ORD-1032, simulate 1 transient network glitch on attempt 1!
    if (orderNumber === 'ORD-1032' && (!context?.isRetry && context?.retryCount === 0)) {
      throw new Error('GATEWAY_TIMEOUT: SMS/Email Provider gateway temporarily unreachable [504]');
    }

    const customer = await Customer.findOne({ customerId });
    const notificationId = `NTF-${Date.now().toString().slice(-6)}`;

    const result = {
      notificationId,
      customerId,
      recipient: customer?.email || customerId,
      channel,
      status: 'SENT',
      dispatchedAt: new Date().toISOString()
    };

    await Action.findOneAndUpdate(
      { idempotencyKey },
      {
        workflowId: context?.workflowId,
        actionType: 'send_customer_notification',
        targetEntity: 'Customer',
        targetId: customerId,
        idempotencyKey,
        payload: { customerId, orderNumber, channel, message },
        status: 'executed',
        executionResult: result,
        attempts: (context?.retryCount || 0) + 1
      },
      { upsert: true, new: true }
    );

    return result;
  },

  async createEscalation({ targetEntity, targetId, reason, priority }, context) {
    const ticket = await SupportTicket.findOne({
      $or: [{ orderNumber: targetId }, { ticketNumber: targetId }]
    });

    if (ticket) {
      ticket.status = 'escalated';
      ticket.priority = priority;
      ticket.resolutionNotes += ` | Escalated by OpsPilot: ${reason}`;
      await ticket.save();
    }

    await Notification.create({
      type: 'workflow_escalated',
      title: `Escalation Created: ${targetEntity} ${targetId}`,
      message: reason,
      severity: priority === 'critical' ? 'error' : 'warning',
      workflowId: context?.workflowId
    });

    return {
      escalationId: `ESC-${Date.now().toString().slice(-5)}`,
      targetEntity,
      targetId,
      priority,
      reason,
      status: 'ESCALATED',
      timestamp: new Date().toISOString()
    };
  },

  async reserveInventory({ sku, quantity }) {
    const item = await InventoryItem.findOne({ sku });
    if (!item) throw new Error(`SKU ${sku} not found.`);
    if (item.stockLevel < quantity) {
      throw new Error(`Insufficient stock for ${sku}. Available: ${item.stockLevel}, Requested: ${quantity}`);
    }

    item.reservedStock = (item.reservedStock || 0) + quantity;
    await item.save();

    return {
      sku: item.sku,
      name: item.name,
      reserved: quantity,
      remainingAvailable: item.stockLevel - item.reservedStock
    };
  },

  async updateInventory({ sku, quantityDelta }) {
    const item = await InventoryItem.findOne({ sku });
    if (!item) throw new Error(`SKU ${sku} not found.`);

    item.stockLevel += quantityDelta;
    await item.save();

    return {
      sku: item.sku,
      name: item.name,
      newStockLevel: item.stockLevel,
      daysRemaining: Number((item.stockLevel / (item.dailyDemand || 1)).toFixed(1))
    };
  },

  async createApprovalRequest({ actionType, orderNumber, customerName, amount, reason, evidence, policyReference, riskLevel }, context) {
    const approval = new Approval({
      workflowId: context?.workflowId,
      actionType,
      requestedBy: context?.agentName || 'Decision Agent',
      riskLevel: riskLevel || 'high',
      amount,
      customerName,
      orderNumber,
      reason,
      evidence,
      policyReference,
      status: 'pending'
    });

    await approval.save();

    await Notification.create({
      type: 'approval_required',
      title: `Manager Approval Required: ${actionType.toUpperCase()} (₹${amount?.toLocaleString() || 'N/A'})`,
      message: `${reason} - Order: ${orderNumber || 'N/A'}, Customer: ${customerName}`,
      severity: 'error',
      link: `/approvals`,
      workflowId: context?.workflowId
    });

    return {
      approvalId: approval._id,
      status: 'PENDING_APPROVAL',
      riskLevel: approval.riskLevel,
      amount: approval.amount,
      policyReference: approval.policyReference
    };
  },

  // Verification Tools (Directly querying actual state!)
  async verifyRefund({ orderNumber, expectedAmount }) {
    const order = await Order.findOne({ orderNumber }).lean();
    if (!order) {
      return { verified: false, reason: `Order ${orderNumber} not found in database.` };
    }

    const verified = order.refundProcessed === true && order.refundAmount === expectedAmount;
    return {
      verified,
      databaseState: {
        orderNumber: order.orderNumber,
        status: order.status,
        refundProcessed: order.refundProcessed,
        refundAmount: order.refundAmount
      },
      message: verified ? `Database verified: Order ${orderNumber} status is '${order.status}' with ₹${order.refundAmount} refunded.` : 'Verification failed: Database state mismatch.'
    };
  },

  async verifyReplacement({ orderNumber }) {
    const order = await Order.findOne({ orderNumber }).lean();
    if (!order) return { verified: false, reason: 'Order not found' };

    const verified = order.status === 'replacement_ordered' && !!order.replacementOrderNumber;
    return {
      verified,
      databaseState: {
        orderNumber: order.orderNumber,
        status: order.status,
        replacementOrderNumber: order.replacementOrderNumber
      },
      message: verified ? `Verified replacement order ${order.replacementOrderNumber} generated.` : 'Replacement state not verified.'
    };
  },

  async verifyTicketUpdate({ ticketNumber, expectedStatus }) {
    const ticket = await SupportTicket.findOne({ ticketNumber }).lean();
    if (!ticket) return { verified: false, reason: 'Ticket not found' };

    const verified = ticket.status === expectedStatus;
    return {
      verified,
      databaseState: {
        ticketNumber: ticket.ticketNumber,
        status: ticket.status
      },
      message: verified ? `Ticket status verified as ${ticket.status}.` : `Status mismatch: expected ${expectedStatus}, found ${ticket.status}.`
    };
  },

  async verifyNotification({ idempotencyKey }) {
    const action = await Action.findOne({ idempotencyKey }).lean();
    const verified = !!action && (action.status === 'executed' || action.status === 'verified');
    return {
      verified,
      actionStatus: action?.status || 'NOT_FOUND',
      message: verified ? 'Notification dispatch confirmed via action registry.' : 'Notification record not confirmed.'
    };
  }
};

// Central Tool Invoker with Validation, Logging & Auditing
export const executeTool = async (toolName, rawParams = {}, context = {}) => {
  const startTime = Date.now();
  const schema = toolSchemas[toolName];
  const implementation = toolImplementations[toolName];

  if (!schema || !implementation) {
    throw new Error(`Tool '${toolName}' is not registered in the Tool Registry.`);
  }

  // 1. Zod input validation
  const validation = schema.safeParse(rawParams);
  if (!validation.success) {
    const errorDetails = validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new Error(`Tool validation failed for '${toolName}': ${errorDetails}`);
  }

  const validParams = validation.data;

  // Log Audit Event: TOOL_CALLED
  if (context.workflowId) {
    try {
      await AuditEvent.create({
        workflowId: context.workflowId,
        agent: context.agentName || 'Investigation Agent',
        eventType: 'TOOL_CALLED',
        message: `Invoking tool '${toolName}'`,
        metadata: { tool: toolName, params: validParams },
        status: 'info'
      });
    } catch (e) {
      console.error('Audit event log error:', e.message);
    }
  }

  try {
    // 2. Execute deterministic implementation
    const result = await implementation(validParams, context);
    const durationMs = Date.now() - startTime;

    // Log AgentLog & AuditEvent: TOOL_RESULT
    if (context.workflowId) {
      try {
        await AgentLog.create({
          workflowId: context.workflowId,
          agent: context.agentName || 'Investigation Agent',
          task: `Execute ${toolName}`,
          tool: toolName,
          status: 'success',
          durationMs,
          payload: validParams,
          result: result
        });

        await AuditEvent.create({
          workflowId: context.workflowId,
          agent: context.agentName || 'Investigation Agent',
          eventType: 'TOOL_RESULT',
          message: `Tool '${toolName}' succeeded in ${durationMs}ms`,
          metadata: { tool: toolName, durationMs },
          status: 'success'
        });
      } catch (e) {
        console.error('Audit/Log error:', e.message);
      }
    }

    return {
      success: true,
      tool: toolName,
      data: result,
      durationMs
    };
  } catch (error) {
    const durationMs = Date.now() - startTime;

    if (context.workflowId) {
      try {
        await AgentLog.create({
          workflowId: context.workflowId,
          agent: context.agentName || 'Investigation Agent',
          task: `Execute ${toolName}`,
          tool: toolName,
          status: 'failed',
          durationMs,
          payload: validParams,
          result: { error: error.message }
        });

        await AuditEvent.create({
          workflowId: context.workflowId,
          agent: context.agentName || 'Investigation Agent',
          eventType: 'ACTION_FAILED',
          message: `Tool '${toolName}' failed: ${error.message}`,
          metadata: { tool: toolName, error: error.message, durationMs },
          status: 'error'
        });
      } catch (e) {
        console.error('Audit/Log error:', e.message);
      }
    }

    throw error;
  }
};
