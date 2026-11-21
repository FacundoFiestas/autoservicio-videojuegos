/*======================
    Rutas producto
======================*/

import { Router } from 'express';

import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    toggleProductStatus,
    deleteProduct
} from '../controllers/product.controllers.js';

import { 
    validateId, 
    validateProduct, 
    validateProductUpdate,
    uploadImagen
} from '../middlewares/middlewares.js';

const router = Router();

// GET /api/productos -> Obtener todos los productos
router.get('/', getProducts);

// GET /api/productos/:id -> Obtener un producto por ID
router.get('/:id', validateId, getProductById);

// POST /api/productos -> Crear producto nuevo
router.post('/', uploadImagen.single('imagen'), validateProduct, createProduct);

// PUT /api/productos/:id -> Modificar producto
router.put('/:id', validateId, validateProductUpdate, updateProduct);

// PATCH /api/productos/:id/estado -> Activar o desactivar producto
router.patch('/:id/estado', validateId, toggleProductStatus);

// DELETE /api/productos/:id -> Baja lógica del producto
router.delete('/:id', validateId, deleteProduct);

export default router;