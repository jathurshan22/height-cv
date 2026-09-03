import { Router } from 'express';
import {
  listAllActiveTemplates,
  listFeaturedTemplates,
  listPublicTemplates,
} from '../controllers/templatesController.js';

const router = Router();

router.get('/featured', listFeaturedTemplates);
router.get('/all', listAllActiveTemplates);
router.get('/', listPublicTemplates);

export default router;
