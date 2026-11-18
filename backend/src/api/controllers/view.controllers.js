import bcrypt from 'bcrypt';
import Product from '../models/product.models.js';
import User from '../models/user.models.js';

export const vistaLogin = (req, res) => {
    return res.render('login', { error: null });
};

export const procesarLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('login', { error: 'Completá ambos campos para ingresar.' });
        }

        const usuario = await User.findOne({ where: { email: email.trim() } });
        if (!usuario) {
            return res.render('login', { error: 'Correo o contraseña incorrectos.' });
        }

        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.render('login', { error: 'Correo o contraseña incorrectos.' });
        }

        return res.redirect('/dashboard/principal');
    } catch (error) {
        console.error("Error al procesar el login:", error);
        return res.status(500).render('login', { error: 'Error interno del servidor al iniciar sesión.' });
    }
};

export const vistaPrincipal = async (req, res) => {
    try {
        const listaProductos = await Product.findAll();
        return res.render('index', { listaProductos });
    } catch (error) {
        console.error("Error al cargar el dashboard:", error);
        return res.status(500).send("Error interno al cargar el panel");
    }
};

export const vistaAgregar = (req, res) => {
    try {
        return res.render('post', {
            title: "Crear producto"
        });
    } catch (error) {
        console.error("Error al cargar la vista de creación:", error);
        return res.status(500).send("Error al cargar el formulario");
    }
};