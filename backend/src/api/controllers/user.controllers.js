/*============================
    Controladores Usuario
============================*/

import User from '../models/user.models.js';

export const createUser = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos (nombre, email, password) son obligatorios'
            });
        }

        const existente = await User.findOne({ where: { email: email.trim() } });
        if (existente) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe un usuario registrado con ese correo'
            });
        }

        const nuevoUsuario = await User.create({
            nombre: nombre.trim(),
            email: email.trim(),
            password
        });

        return res.status(201).json({
            success: true,
            message: 'Usuario administrador creado con éxito',
            data: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al crear el usuario',
            error: error.message
        });
    }
};