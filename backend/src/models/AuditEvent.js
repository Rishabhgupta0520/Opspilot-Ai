import mongoose from 'mongoose';

const auditEventSchema = new mongoose.Schema(
  {
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      required: true,
      index: true
    },
    agent: {
      type: String,
      required: true,
      index: true
    },
    eventType: {
      type: String,
      enum: [
        'GOAL_RECEIVED',
        'PLAN_CREATED',
        'TASK_STARTED',
        'TOOL_CALLED',
        'TOOL_RESULT',
        'POLICY_EVALUATED',
        'DECISION_CREATED',
        'APPROVAL_REQUESTED',
        'APPROVAL_GRANTED',
        'APPROVAL_REJECTED',
        'ACTION_STARTED',
        'ACTION_COMPLETED',
        'ACTION_FAILED',
        'RETRY_STARTED',
        'VERIFICATION_STARTED',
        'VERIFICATION_PASSED',
        'VERIFICATION_FAILED',
        'ESCALATION_CREATED',
        'WORKFLOW_COMPLETED',
        'WORKFLOW_FAILED'
      ],
      required: true,
      index: true
    },
    message: {
      type: String,
      required: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    status: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info'
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: true }
);

export const AuditEvent = mongoose.model('AuditEvent', auditEventSchema);
