import mongoose from 'mongoose';

const approvalSchema = new mongoose.Schema(
  {
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      required: true,
      index: true
    },
    actionType: {
      type: String,
      required: true
    },
    requestedBy: {
      type: String,
      default: 'Decision Agent'
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'high',
      index: true
    },
    amount: {
      type: Number,
      default: null
    },
    currency: {
      type: String,
      default: 'INR'
    },
    customerName: {
      type: String,
      default: 'N/A'
    },
    orderNumber: {
      type: String,
      default: null,
      index: true
    },
    reason: {
      type: String,
      required: true
    },
    evidence: [
      {
        type: String
      }
    ],
    policyReference: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },
    decisionNotes: {
      type: String,
      default: ''
    },
    decidedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    decidedByName: {
      type: String,
      default: null
    },
    decidedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export const Approval = mongoose.model('Approval', approvalSchema);
