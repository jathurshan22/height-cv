import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { updateProfile, updatePreferences, changePassword, updateAvatar, deleteAccount } from '../controllers/userController.js';
const router=Router(); router.use(protect);
router.put('/profile', updateProfile); router.put('/preferences', updatePreferences); router.put('/password', changePassword); router.put('/avatar', updateAvatar); router.delete('/account', deleteAccount);
export default router;
