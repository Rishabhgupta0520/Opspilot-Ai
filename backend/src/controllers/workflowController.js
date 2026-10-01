import { Workflow } from '../models/Workflow.js';
import { WorkflowStep } from '../models/WorkflowStep.js';
import { AgentLog } from '../models/AgentLog.js';
import { AuditEvent } from '../models/AuditEvent.js';
import { Approval } from '../models/Approval.js';
import { WorkflowEngine } from '../orchestrator/workflowEngine.js';
import { z } from 'zod';

const createWorkflowSchema = z.object({
  goal: z.string().min(5, 'Goal must be at least 5 characters')
});

export const createWorkflow = async (req, res) => {
  try {
    const parse = createWorkflowSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parse.error.errors.map(e => e.message).join(', ') }
      });
    }

    const { goal } = parse.data;
    const workflow = await WorkflowEngine.startWorkflow({
      goal,
      userId: req.user?._id || null
    });

    return res.status(201).json({
      success: true,
      data: { workflow }
    });
  } catch (err) {
    console.error('Create workflow error:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
    });
  }
};

export const getWorkflows = async (req, res) => {
  try {
    const { status, category, search, limit = 50, page = 1 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { goal: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [workflows, total] = await Promise.all([
      Workflow.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Workflow.countDocuments(query)
    ]);

    return res.json({
      success: true,
      data: {
        workflows,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
    });
  }
};

export const getWorkflowById = async (req, res) => {
  try {
    const { id } = req.params;
    const workflow = await Workflow.findById(id).lean();
    if (!workflow) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Workflow not found.' }
      });
    }

    const [steps, logs, auditEvents, approvals] = await Promise.all([
      WorkflowStep.find({ workflowId: id }).sort({ stepNumber: 1 }).lean(),
      AgentLog.find({ workflowId: id }).sort({ timestamp: 1 }).lean(),
      AuditEvent.find({ workflowId: id }).sort({ timestamp: 1 }).lean(),
      Approval.find({ workflowId: id }).lean()
    ]);

    return res.json({
      success: true,
      data: {
        workflow,
        steps,
        logs,
        auditEvents,
        approvals
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
    });
  }
};

export const cancelWorkflow = async (req, res) => {
  try {
    const { id } = req.params;
    const workflow = await Workflow.findById(id);
    if (!workflow) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Workflow not found.' }
      });
    }

    workflow.status = 'CANCELLED';
    workflow.currentStep = 'Cancelled by user request';
    await workflow.save();

    await AuditEvent.create({
      workflowId: workflow._id,
      agent: 'orchestrator',
      eventType: 'WORKFLOW_FAILED',
      message: `Workflow cancelled manually by user ${req.user?.username || 'Operator'}`,
      status: 'warning'
    });

    return res.json({
      success: true,
      data: { workflow }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
    });
  }
};

export const retryWorkflow = async (req, res) => {
  try {
    const { id } = req.params;
    const workflow = await Workflow.findById(id);
    if (!workflow) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Workflow not found.' }
      });
    }

    workflow.retryCount += 1;
    workflow.status = 'RETRYING';
    workflow.currentStep = `Retrying execution (Attempt #${workflow.retryCount})`;
    await workflow.save();

    setImmediate(() => {
      WorkflowEngine.executeWorkflow(workflow._id).catch(err => {
        console.error('Retry workflow error:', err);
      });
    });

    return res.json({
      success: true,
      data: { workflow }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
    });
  }
};
