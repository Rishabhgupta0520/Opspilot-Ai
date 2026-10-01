import { Router } from 'express';
import { handleAssistantQuery } from '../controllers/assistantController.js';

const router = Router();

router.post('/', handleAssistantQuery);

export default router;
