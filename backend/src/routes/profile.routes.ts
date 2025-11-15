import { Router } from 'express';
import { createOrUpdateProfile, getProfile } from '../controllers/profile.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All profile routes require authentication
router.use(authenticateToken);

router.post('/', createOrUpdateProfile);
router.get('/', getProfile);

export default router;
