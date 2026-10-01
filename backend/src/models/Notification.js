import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'approval_required',
        'workflow_completed',
        'workflow_escalated',
        'action_failed',
        'verification_failed',
        'vip_issue_detected',
        'recovery_success'
      ],
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'error', 'success'],
      default: 'info'
    },
    read: {
      type: Boolean,
      default: false,
      index: true
    },
    link: {
      type: String,
      default: null
    },
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      default: null
    }
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
