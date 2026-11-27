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

const uploadEncuestaDir = path.resolve("src/public/uploads/encuestas");

const storageEncuesta = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync(uploadEncuestaDir, { recursive: true });
        cb(null, uploadEncuestaDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}${ext}`);
    }
});

const imageFileFilter = (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("El archivo debe ser una imagen válida (JPG, PNG, WEBP, etc.)"), false);
    }
};

export const uploadImagenEncuesta = multer({
    storage: storageEncuesta,
    fileFilter: imageFileFilter
});

export const validateSurvey = (req, res, next) => {
    const { email, opinion, puntuacion } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
        return res.status(400).json({
            success: false,
            message: "Debés ingresar un correo electrónico válido"
        });
    }

    if (!opinion || typeof opinion !== "string" || opinion.trim().length < 5) {
        return res.status(400).json({
            success: false,
            message: "La opinión es obligatoria y debe tener al menos 5 caracteres"
        });
    }

    const puntNum = Number(puntuacion);
    if (
        puntuacion === undefined ||
        puntuacion === null ||
        puntuacion === "" ||
        !Number.isInteger(puntNum) ||
        puntNum < 1 ||
        puntNum > 10
    ) {
        return res.status(400).json({
            success: false,
            message: "La puntuación debe ser un número entero entre 1 y 10"
        });
    }

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Debés adjuntar una imagen válida para enviar la encuesta"
        });
    }

    next();
};