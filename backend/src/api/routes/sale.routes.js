/*======================
    Rutas Ventas
======================*/

import { Router } from 'express';
import { getSales, createSale } from '../controllers/sale.controllers.js';

const router = Router();

// GET /api/ventas -> Listado de ventas realizadas
router.get('/', getSales);

// POST /api/ventas -> Registrar nueva compra
router.post('/', createSale);

export default router;