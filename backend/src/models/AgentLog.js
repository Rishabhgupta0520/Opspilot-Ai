import mongoose from 'mongoose';

const agentLogSchema = new mongoose.Schema(
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
    task: {
      type: String,
      required: true
    },
    tool: {
      type: String,
      default: null,
      index: true
    },
    status: {
      type: String,
      enum: ['started', 'success', 'warning', 'failed', 'retrying'],
      default: 'success'
    },
    durationMs: {
      type: Number,
      default: 0
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: true }
);

export const AgentLog = mongoose.model('AgentLog', agentLogSchema);
