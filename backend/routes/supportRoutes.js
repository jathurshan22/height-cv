import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { listFaqs, createTicket, myTickets, allTickets, updateTicket } from '../controllers/supportController.js';

const router = Router();
router.use(protect);

router.get('/faqs', listFaqs);
router.get('/tickets', myTickets);
router.post('/tickets', createTicket);

// Admin
router.get('/admin/tickets', adminOnly, allTickets);
router.patch('/admin/tickets/:id', adminOnly, updateTicket);

export default router;
