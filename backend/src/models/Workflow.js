import mongoose from 'mongoose';

const workflowSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    goal: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: [
        'delayed_orders',
        'customer_escalation',
        'refund_processing',
        'inventory_risk',
        'sla_violations',
        'vip_prioritization',
        'custom_operation'
      ],
      default: 'custom_operation',
      index: true
    },
    status: {
      type: String,
      enum: [
        'CREATED',
        'PLANNING',
        'INVESTIGATING',
        'DECIDING',
        'POLICY_CHECK',
        'AWAITING_APPROVAL',
        'EXECUTING',
        'VERIFYING',
        'COMPLETED',
        'RETRYING',
        'FAILED',
        'ESCALATED',
        'CANCELLED'
      ],
      default: 'CREATED',
      index: true
    },
    currentStep: {
      type: String,
      default: 'Initialization'
    },
    plan: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    investigationContext: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    decision: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    },
    requiresApproval: {
      type: Boolean,
      default: false
    },
    approvalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Approval',
      default: null
    },
    metrics: {
      durationMs: { type: Number, default: 0 },
      toolsCalled: { type: Number, default: 0 },
      retryAttempts: { type: Number, default: 0 },
      aiLatencyMs: { type: Number, default: 0 },
      actionsExecuted: { type: Number, default: 0 },
      actionsVerified: { type: Number, default: 0 }
    },
    error: {
      code: { type: String, default: null },
      message: { type: String, default: null },
      step: { type: String, default: null }
    },
    retryCount: {
      type: Number,
      default: 0
    },
    maxRetries: {
      type: Number,
      default: 3
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

export const Workflow = mongoose.model('Workflow', workflowSchema);
