import mongoose from 'mongoose';

const actionSchema = new mongoose.Schema(
  {
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      required: true,
      index: true
    },
    actionType: {
      type: String,
      enum: [
        'refund',
        'replace_order',
        'update_ticket',
        'send_customer_notification',
        'create_escalation',
        'update_inventory',
        'reserve_inventory',
        'prioritize'
      ],
      required: true
    },
    targetEntity: {
      type: String,
      required: true
    },
    targetId: {
      type: String,
      required: true,
      index: true
    },
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    status: {
      type: String,
      enum: ['pending', 'executed', 'failed', 'verified'],
      default: 'pending',
      index: true
    },
    executionResult: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    verificationResult: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    attempts: {
      type: Number,
      default: 0
    },
    maxAttempts: {
      type: Number,
      default: 3
    },
    lastError: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

export const Action = mongoose.model('Action', actionSchema);
