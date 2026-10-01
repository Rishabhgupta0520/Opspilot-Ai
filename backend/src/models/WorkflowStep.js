import mongoose from 'mongoose';

const workflowStepSchema = new mongoose.Schema(
  {
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      required: true,
      index: true
    },
    stepNumber: {
      type: Number,
      required: true
    },
    agent: {
      type: String,
      enum: ['planner', 'investigation', 'decision', 'policy_engine', 'approval', 'action', 'verification', 'orchestrator'],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'failed', 'waiting_approval', 'retrying'],
      default: 'pending'
    },
    input: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    output: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    durationMs: {
      type: Number,
      default: 0
    },
    startedAt: {
      type: Date,
      default: null
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

workflowStepSchema.index({ workflowId: 1, stepNumber: 1 });

export const WorkflowStep = mongoose.model('WorkflowStep', workflowStepSchema);
