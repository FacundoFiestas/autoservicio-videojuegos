import { Router } from 'express';
import { createAdminUser } from '../controllers/user.controllers.js';
import { validateCreateUser } from '../middlewares/middlewares.js';

const router = Router();

// Cuando hagan un POST a esta ruta, primero pasa por validateCreateUser, y si está todo bien, ejecuta createAdminUser
router.post('/', validateCreateUser, createAdminUser);

export default router;