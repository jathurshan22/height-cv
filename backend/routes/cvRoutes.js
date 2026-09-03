import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { listCVs,getCV,createCV,updateCV,deleteCV } from '../controllers/cvController.js';
const router=Router(); router.use(protect); router.get('/',listCVs); router.get('/:id',getCV); router.post('/',createCV); router.put('/:id',updateCV); router.delete('/:id',deleteCV); export default router;
