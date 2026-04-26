import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';

const router = Router();

router.post('/query', aiController.processQuery);
router.post('/analyze-image', aiController.analyzeImage);

export default router;
