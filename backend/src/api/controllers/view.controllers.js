import Product from '../models/product.models.js';

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