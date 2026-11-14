import User from '../models/user.models.js';

export const createAdminUser = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Verificar si el mail existe en la base de datos.
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ ok: false, message: 'El correo electrónico ya está registrado.' });
        }

        // Crea el usuario.
        const newUser = await User.create({
            nombre: nombre.trim(),
            email: email.trim().toLowerCase(),
            password: password,
            es_admin: true // Lo forzamos a true porque es el endpoint de administradores
        });

        //Quita la contraseña antes de devolver los datos al cliente (por seguridad)
        const { password: _, ...userWithoutPassword } = newUser.toJSON();

        return res.status(201).json({
            ok: true,
            message: 'Administrador creado con éxito.',
            data: userWithoutPassword
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        return res.status(500).json({ ok: false, message: 'Error interno del servidor.' });
    }
};