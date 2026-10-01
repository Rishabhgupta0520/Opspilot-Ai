import mongoose from 'mongoose';

const policySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['refund', 'shipping', 'vip', 'inventory', 'sla', 'security'],
      required: true,
      index: true
    },
    thresholdValue: {
      type: Number,
      default: null
    },
    rules: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    active: {
      type: Boolean,
      default: true,
      index: true
    },
    description: {
      type: String,
      required: true
    },
    requiresApproval: {
      type: Boolean,
      default: false
    },
    priority: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

export const Policy = mongoose.model('Policy', policySchema);
