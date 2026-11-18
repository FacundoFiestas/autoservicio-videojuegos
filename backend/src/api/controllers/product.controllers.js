/*============================
    Controladores producto
============================*/

import Product from '../models/product.models.js';

////////////////////////////////
// Obtener todos los productos
export const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        return res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener los productos',
            error: error.message
        });
    }
};

////////////////////////////////
// Crear producto nuevo
export const createProduct = async (req, res) => {
    try {
        const { nombre, precio, descripcion, imagen, tipo } = req.body;

        const newProduct = await Product.create({
            nombre,
            precio,
            descripcion,
            imagen,
            tipo
        });

        return res.status(201).json({
            success: true,
            message: 'Producto creado con éxito',
            data: newProduct
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al crear el producto',
            error: error.message
        });
    }
};