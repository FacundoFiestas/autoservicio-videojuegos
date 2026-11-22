/*============================
    Middlewares de validación
============================*/

import fs from "fs";
import multer from "multer";
import path from "path";

const uploadDir = path.resolve("src/public/uploads/productos");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}${ext}`);
    }
});

export const uploadImagen = multer({ storage });

export const validateId = (req, res, next) => {
    const { id } = req.params;

    if (!id || isNaN(Number(id)) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
        return res.status(400).json({
            success: false,
            message: 'El ID proporcionado debe ser un número entero positivo'
        });
    }

    next();
};

export const validateProduct = (req, res, next) => {
    const { nombre, precio, tipo } = req.body;

    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2) {
        return res.status(400).json({
            success: false,
            message: 'El nombre del producto es obligatorio y debe tener al menos 2 caracteres'
        });
    }

    const precioNum = Number(precio);
    if (precio === undefined || precio === null || precio === '' || isNaN(precioNum) || precioNum <= 0) {
        return res.status(400).json({
            success: false,
            message: 'El precio es obligatorio y debe ser un número mayor a 0'
        });
    }

    if (!tipo || typeof tipo !== 'string' || tipo.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'El tipo de producto es obligatorio (ej: PC o Consola)'
        });
    }
    
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'La imagen del producto es obligatoria'
        });
    }

    next();
};

export const validateProductUpdate = (req, res, next) => {
    const { nombre, precio, imagen, tipo, activo } = req.body;

    const camposEnviados = [nombre, precio, imagen, tipo, activo, req.file].some(
        (valor) => valor !== undefined
    );

    if (!camposEnviados) {
        return res.status(400).json({
            success: false,
            message: 'Debés enviar al menos un campo para actualizar'
        });
    }

    if (nombre !== undefined) {
        if (typeof nombre !== 'string' || nombre.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'El nombre del producto debe tener al menos 2 caracteres'
            });
        }
    }

    if (precio !== undefined) {
        const precioNum = Number(precio);
        if (precio === null || precio === '' || Number.isNaN(precioNum) || precioNum <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El precio debe ser un número mayor a 0'
            });
        }
    }

    if (imagen !== undefined) {
        if (typeof imagen !== 'string' || imagen.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'La imagen no puede estar vacía'
            });
        }
    }

    if (tipo !== undefined) {
        if (typeof tipo !== 'string' || tipo.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El tipo de producto no puede estar vacío'
            });
        }
    }

    next();
};