import { Router } from 'express';
import { 
    vistaLogin, 
    procesarLogin, 
    vistaPrincipal, 
    vistaAgregar 
} from '../controllers/view.controllers.js';

const router = Router();

// Rutas de Login (http://localhost:3000/dashboard y POST /dashboard/login)
router.get('/', vistaLogin);
router.post('/login', procesarLogin);

// Vista principal (http://localhost:3000/dashboard/principal)
router.get('/principal', vistaPrincipal);

// Vista crear (http://localhost:3000/dashboard/agregar)
router.get('/agregar', vistaAgregar);

export default router;