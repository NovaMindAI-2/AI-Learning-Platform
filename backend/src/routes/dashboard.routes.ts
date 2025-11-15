import { Router } from 'express';
import { getDashboardData, getKnowledgeBase } from '../controllers/dashboard.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All dashboard routes require authentication
router.use(authenticateToken);

router.get('/', getDashboardData);
router.get('/knowledge', getKnowledgeBase);

export default router;
