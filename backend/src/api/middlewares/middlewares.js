/*============================
    Middlewares de validación
============================*/

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

    next();
};