/*======================
    Rutas Usuario
======================*/

import { Router } from 'express';
import { createUser } from '../controllers/user.controllers.js';

const router = Router();

// POST /api/usuarios -> Crear usuario administrador
router.post('/', createUser);

export default router;