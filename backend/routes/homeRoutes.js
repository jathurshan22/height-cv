import { Router } from 'express';
import { homeStats } from '../controllers/homeController.js';

const router = Router();
router.get('/stats', homeStats);

export default router;
