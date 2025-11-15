import { Router } from 'express';
import {
  generateCurriculum,
  getCurriculum,
  getTutorIntroduction,
} from '../controllers/curriculum.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All curriculum routes require authentication
router.use(authenticateToken);

router.post('/generate', generateCurriculum);
router.get('/', getCurriculum);
router.get('/intro', getTutorIntroduction);

export default router;
