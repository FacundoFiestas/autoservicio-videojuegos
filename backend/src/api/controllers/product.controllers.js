/*============================
    Controladores producto
============================*/

import Product from '../models/product.models.js';

import fs from 'fs/promises';
import path from 'path';
import { __dirname, join } from '../utils/index.js';

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
// Obtener producto por ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: `No se encontró ningún producto con ID ${id}`
            });
        }

        return res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener el producto',
            error: error.message
        });
    }
};

////////////////////////////////
// Crear producto nuevo
export const createProduct = async (req, res) => {
    try {
        const { nombre, precio, tipo } = req.body;

        const rutaImagen = `/uploads/productos/${req.file.filename}`;

        const nuevoProducto = await Product.create({
            nombre: nombre.trim(),
            precio: Number(precio),
            tipo: tipo.trim(),
            imagen: rutaImagen
        });

        return res.status(201).json({
            success: true,
            message: 'Producto creado con éxito',
            data: nuevoProducto
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al crear el producto',
            error: error.message
        });
    }
};

////////////////////////////////
// Actualizar producto existente
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, imagen, tipo, activo } = req.body;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: `No se encontró ningún producto con ID ${id}`
            });
        }

        const nuevaRutaImagen = req.file
            ? `/uploads/productos/${req.file.filename}`
            : product.imagen;

        await product.update({
            nombre: nombre !== undefined ? String(nombre).trim() : product.nombre,
            precio: precio !== undefined ? Number(precio) : product.precio,
            imagen: nuevaRutaImagen,
            tipo: tipo !== undefined ? String(tipo).trim() : product.tipo,
            activo: activo !== undefined
                ? (typeof activo === "string" ? activo === "true" : Boolean(activo))
                : product.activo
        });

        return res.status(200).json({
            success: true,
            message: 'Producto actualizado con éxito',
            data: product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar el producto',
            error: error.message
        });
    }
};

////////////////////////////////
// Activar o desactivar producto (Baja / Reactivación lógica)
export const toggleProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: `No se encontró ningún producto con ID ${id}`
            });
        }

        const nuevoEstado = req.body?.activo !== undefined
            ? Boolean(req.body.activo)
            : !product.activo;

        await product.update({ activo: nuevoEstado });

        return res.status(200).json({
            success: true,
            message: nuevoEstado
                ? 'Producto reactivado con éxito'
                : 'Producto dado de baja con éxito',
            data: product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al cambiar el estado del producto',
            error: error.message
        });
    }
};

////////////////////////////////
// Borrar definitivamente el producto DELETE
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: `No se encontró ningún producto con ID ${id}`
            });
        }

        const rutaImagen = product.imagen;

        await product.destroy();

        if (rutaImagen && typeof rutaImagen === 'string' && rutaImagen.startsWith('/uploads/productos/')) {
            const nombreArchivo = path.basename(rutaImagen);
            const carpetaUploads = path.resolve(join(__dirname, 'src/public/uploads/productos'));
            const rutaCompleta = path.resolve(carpetaUploads, nombreArchivo);

            if (rutaCompleta.startsWith(carpetaUploads + path.sep)) {
                try {
                    await fs.unlink(rutaCompleta);
                } catch (err) {
                    if (err.code !== 'ENOENT') {
                        console.error('No se pudo eliminar el archivo de imagen:', err);
                    }
                }
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Producto eliminado correctamente'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar el producto',
            error: error.message
        });
    }
};