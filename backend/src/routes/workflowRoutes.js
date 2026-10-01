import { Router } from 'express';
import {
  createWorkflow,
  getWorkflows,
  getWorkflowById,
  cancelWorkflow,
  retryWorkflow
} from '../controllers/workflowController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Allow reading workflows openly or authenticated; creation and manipulation require authentication (with fallback guest)
router.get('/', getWorkflows);
router.get('/:id', getWorkflowById);

router.post('/', (req, res, next) => {
  // If authorization header present, authenticate, otherwise allow guest creation
  if (req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
}, createWorkflow);

router.post('/:id/cancel', authenticate, cancelWorkflow);
router.post('/:id/retry', authenticate, retryWorkflow);

export default router;
