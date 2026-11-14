export const validateCreateUser = (req, res, next) => {
    const { nombre, email, password } = req.body;

    // Validar nombre
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2) {
        return res.status(400).json({ ok: false, message: 'El nombre es obligatorio y debe tener al menos 2 letras.' });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ ok: false, message: 'Debe ingresar un correo electrónico válido.' });
    }

    // Validar contraseña
    if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ ok: false, message: 'La contraseña es obligatoria y debe tener al menos 6 caracteres.' });
    }

    // Si todo está bien, la peticion sigue hacia el controlador.
    next();
};