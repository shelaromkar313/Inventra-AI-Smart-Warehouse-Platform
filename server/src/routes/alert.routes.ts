import { Router } from 'express';
import * as alertController from '../controllers/alert.controller';

const router = Router();

router.get('/', alertController.getAlerts);
router.put('/:id/read', alertController.markRead);

export default router;
