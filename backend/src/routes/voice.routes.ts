import { Router } from 'express';
import {
  textToSpeech,
  textToSpeechStream,
  getVoices,
  getStatus,
} from '../controllers/voice.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All voice routes require authentication
router.use(authenticateToken);

// Text-to-speech endpoints
router.post('/tts', textToSpeech);
router.post('/tts/stream', textToSpeechStream);

// Voice management
router.get('/voices', getVoices);
router.get('/status', getStatus);

export default router;
