import { Router } from 'express';

import {
  protect,
  adminOnly,
} from '../middleware/auth.js';

import {
  validateObjectId,
} from '../middleware/security.js';

import {
  stats,
  analytics,
  users,
  updateUser,
  deleteUser,
  cvs,
  deleteCV,
  templates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  logs,
  settings,
  updateSettings,
} from '../controllers/adminController.js';

const router = Router();

/*
|--------------------------------------------------------------------------
| ADMIN SECURITY
|--------------------------------------------------------------------------
|
| Every /admin API requires:
|
| 1. Valid JWT
| 2. Existing user
| 3. Active user
| 4. Admin role
|
|--------------------------------------------------------------------------
*/

router.use(
  protect,
  adminOnly
);

/*
|--------------------------------------------------------------------------
| DASHBOARD
|--------------------------------------------------------------------------
*/

router.get(
  '/stats',
  stats
);

router.get(
  '/analytics',
  analytics
);

/*
|--------------------------------------------------------------------------
| USERS
|--------------------------------------------------------------------------
*/

router.get(
  '/users',
  users
);

router.patch(
  '/users/:id',
  validateObjectId,
  updateUser
);

router.delete(
  '/users/:id',
  validateObjectId,
  deleteUser
);

/*
|--------------------------------------------------------------------------
| CV MANAGEMENT
|--------------------------------------------------------------------------
*/

router.get(
  '/cvs',
  cvs
);

router.delete(
  '/cvs/:id',
  validateObjectId,
  deleteCV
);

/*
|--------------------------------------------------------------------------
| TEMPLATE MANAGEMENT
|--------------------------------------------------------------------------
*/

router.get(
  '/templates',
  templates
);

router.post(
  '/templates',
  createTemplate
);

router.patch(
  '/templates/:id',
  validateObjectId,
  updateTemplate
);

router.delete(
  '/templates/:id',
  validateObjectId,
  deleteTemplate
);

/*
|--------------------------------------------------------------------------
| AUDIT LOGS
|--------------------------------------------------------------------------
*/

router.get(
  '/logs',
  logs
);

/*
|--------------------------------------------------------------------------
| SYSTEM SETTINGS
|--------------------------------------------------------------------------
*/

router.get(
  '/settings',
  settings
);

router.put(
  '/settings',
  updateSettings
);

export default router;