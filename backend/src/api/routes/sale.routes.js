/*======================
    Rutas Ventas
======================*/

import { Router } from 'express';
import { getSales, createSale, exportSalesExcel } from '../controllers/sale.controllers.js';

const router = Router();

// GET /api/ventas -> Listado de ventas realizadas
router.get('/', getSales);

// POST /api/ventas -> Registrar nueva compra
router.post('/', createSale);

//GET -> EXCEL
router.get('/excel', exportSalesExcel);

export default router;