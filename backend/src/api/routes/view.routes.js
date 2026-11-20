import { Router } from 'express';
import {
    vistaLogin,
    procesarLogin,
    vistaPrincipal,
    vistaAgregar,
    vistaObtener,
    vistaEliminar,
    vistaModificar
} from '../controllers/view.controllers.js';

const router = Router();

// Login: GET /dashboard y POST /dashboard/login
router.get('/', vistaLogin);
router.post('/login', procesarLogin);

// Dashboard: GET /dashboard/principal
router.get('/principal', vistaPrincipal);

// Formulario alta: GET /dashboard/agregar
router.get('/agregar', vistaAgregar);

// Formulario alta: GET /dashboard/obtener
router.get('/obtener', vistaObtener);

// Formulario alta: GET /dashboard/eliminar
router.get('/eliminar', vistaEliminar);

// Formulario alta: GET /dashboard/modificar
router.get('/modificar', vistaModificar);

export default router;