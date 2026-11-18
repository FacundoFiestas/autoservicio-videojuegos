import { Router } from 'express';
import {
    vistaLogin,
    procesarLogin,
    vistaPrincipal,
    vistaAgregar
} from '../controllers/view.controllers.js';

const router = Router();

// Login: GET /dashboard y POST /dashboard/login
router.get('/', vistaLogin);
router.post('/login', procesarLogin);

// Dashboard: GET /dashboard/principal
router.get('/principal', vistaPrincipal);

// Formulario alta: GET /dashboard/agregar
router.get('/agregar', vistaAgregar);

export default router;