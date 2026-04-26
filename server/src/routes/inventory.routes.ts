import { Router } from 'express';
import * as inventoryController from '../controllers/inventory.controller';

const router = Router();

router.get('/', inventoryController.getAllItems);
router.post('/', inventoryController.createItem);

export default router;
