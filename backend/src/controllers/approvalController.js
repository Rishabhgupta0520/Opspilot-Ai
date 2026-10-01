import { Approval } from '../models/Approval.js';
import { WorkflowEngine } from '../orchestrator/workflowEngine.js';

export const getApprovals = async (req, res) => {
  try {
    const { status = 'all', riskLevel } = req.query;
    const query = {};

    if (status !== 'all') {
      query.status = status;
    }
    if (riskLevel && riskLevel !== 'all') {
      query.riskLevel = riskLevel;
    }

    const approvals = await Approval.find(query).sort({ createdAt: -1 }).lean();
    return res.json({
      success: true,
      data: {
        count: approvals.length,
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

export const getApprovalById = async (req, res) => {
  try {
    const { id } = req.params;
    const approval = await Approval.findById(id).lean();
    if (!approval) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Approval request not found.' }
      });
    }

    return res.json({
      success: true,
      data: { approval }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message: err.message }
    });
  }
};

export const approveAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const result = await WorkflowEngine.handleApprovalDecision({
      approvalId: id,
      decision: 'approved',
      notes: notes || 'Approved by operations manager following evidence verification.',
      user: req.user
    });

    return res.json({
      success: true,
      data: result
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: { code: 'APPROVAL_ERROR', message: err.message }
    });
  }
};

export const rejectAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const result = await WorkflowEngine.handleApprovalDecision({
      approvalId: id,
      decision: 'rejected',
      notes: notes || 'Rejected by operations manager.',
      user: req.user
    });

    return res.json({
      success: true,
      data: result
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: { code: 'APPROVAL_ERROR', message: err.message }
    });
  }
};
