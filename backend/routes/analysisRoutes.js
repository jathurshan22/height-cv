import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { ats, ai, jobMatch } from '../controllers/analysisController.js';
const router=Router(); router.use(protect); router.post('/ats/analyze',ats); router.post('/ai/improve',ai); router.post('/jobs/match',jobMatch); export default router;
