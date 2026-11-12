/*======================
    Rutas producto
======================*/

import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/product.controllers.js';

const router = Router();

// GET all products - Endpoint: /api/productos
router.get('/', getProducts);

// POST product - Endpoint: /api/productos
router.post('/', createProduct);

export default router;