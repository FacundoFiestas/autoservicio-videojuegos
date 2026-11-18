import { Router } from 'express';
import { vistaPrincipal, vistaAgregar } from '../controllers/view.controllers.js';

const router = Router();

// Vista principal
router.get('/principal', vistaPrincipal);

// Vista crear
router.get("/agregar", vistaAgregar)

export default router;