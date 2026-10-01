import { Router } from 'express';
import {
  getApprovals,
  getApprovalById,
  approveAction,
  rejectAction
} from '../controllers/approvalController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getApprovals);
router.get('/:id', getApprovalById);

// Approvals require manager or admin authorization
router.post('/:id/approve', authenticate, authorize('admin', 'manager'), approveAction);
router.post('/:id/reject', authenticate, authorize('admin', 'manager'), rejectAction);

export default router;
