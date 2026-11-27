import bcrypt from 'bcrypt';
import { Product, User, Sale, LoginLog } from '../models/index.js';

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

        // Guardar log de inicio de sesión del administrador
        await LoginLog.create({
            usuario_id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            fecha: new Date()
        });

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

export const vistaObtener = (req, res) => {
    try {
        return res.render('get', {
            title: "Obtener producto"
        });
    } catch (error) {
        console.error("Error al cargar la vista de obtener:", error);
        return res.status(500).send("Error al cargar el formulario");
    }
};

export const vistaEliminar = (req, res) => {
    try {
        return res.render('delete', {
            title: "Eliminar producto"
        });
    } catch (error) {
        console.error("Error al cargar la vista de eliminar:", error);
        return res.status(500).send("Error al cargar el formulario");
    }
};

export const vistaModificar = (req, res) => {
    try {
        return res.render('put', {
            title: "Modificar producto"
        });
    } catch (error) {
        console.error("Error al cargar la vista de modificar:", error);
        return res.status(500).send("Error al cargar el formulario");
    }
};

export const vistaRegistros = async (req, res) => {
    try {
        const [todasLasVentas, todosLosProductos, logsLogin] = await Promise.all([
            Sale.findAll({
                order: [['precio_total', 'DESC']],
                include: [
                    {
                        model: Product,
                        as: 'productos',
                        attributes: ['id', 'nombre', 'tipo', 'precio'],
                        through: {
                            attributes: ['cantidad', 'precio_unitario']
                        }
                    }
                ]
            }),
            Product.findAll(),
            LoginLog.findAll({
                order: [['fecha', 'DESC']]
            })
        ]);

        // 1. Top 10 ventas más caras
        const topVentasCaras = todasLasVentas.slice(0, 10);

        // 2. Top 10 productos más vendidos + Estadística por categoría
        const acumuladoProductos = new Map();
        const statsCategorias = {
            PC: { categoria: 'PC', catalogoActivo: 0, unidadesVendidas: 0, recaudacion: 0 },
            Consola: { categoria: 'Consola', catalogoActivo: 0, unidadesVendidas: 0, recaudacion: 0 }
        };

        todosLosProductos.forEach((prod) => {
            if (!prod.activo) return;
            const claveCat = prod.tipo && prod.tipo.toLowerCase().includes('pc') ? 'PC' : 'Consola';
            statsCategorias[claveCat].catalogoActivo += 1;
        });

        todasLasVentas.forEach((venta) => {
            (venta.productos || []).forEach((prod) => {
                const cantidad = Number(prod.SaleProduct?.cantidad ?? 1);
                const precioUnit = Number(prod.SaleProduct?.precio_unitario ?? prod.precio ?? 0);
                const subtotal = cantidad * precioUnit;

                if (!acumuladoProductos.has(prod.id)) {
                    acumuladoProductos.set(prod.id, {
                        id: prod.id,
                        nombre: prod.nombre,
                        tipo: prod.tipo,
                        unidadesVendidas: 0,
                        recaudacion: 0
                    });
                }

                const item = acumuladoProductos.get(prod.id);
                item.unidadesVendidas += cantidad;
                item.recaudacion += subtotal;

                const claveCat = prod.tipo && prod.tipo.toLowerCase().includes('pc') ? 'PC' : 'Consola';
                statsCategorias[claveCat].unidadesVendidas += cantidad;
                statsCategorias[claveCat].recaudacion += subtotal;
            });
        });

        const topProductosVendidos = Array.from(acumuladoProductos.values())
            .sort((a, b) => b.unidadesVendidas - a.unidadesVendidas)
            .slice(0, 10);

        // 3. Estadística adicional de logs: resumen de accesos por administrador
        const acumuladoAdmins = new Map();
        logsLogin.forEach((log) => {
            if (!acumuladoAdmins.has(log.email)) {
                acumuladoAdmins.set(log.email, {
                    nombre: log.nombre,
                    email: log.email,
                    cantidadIngresos: 0,
                    ultimoAcceso: log.fecha
                });
            }
            const adminStat = acumuladoAdmins.get(log.email);
            adminStat.cantidadIngresos += 1;
        });

        return res.render('registros', {
            title: 'Registros y Estadísticas',
            topProductosVendidos,
            topVentasCaras,
            logsLogin,
            estadisticasCategorias: Object.values(statsCategorias),
            estadisticasAdmins: Array.from(acumuladoAdmins.values())
        });
    } catch (error) {
        console.error("Error al cargar la vista de registros:", error);
        return res.status(500).send("Error interno al cargar los registros");
    }
};