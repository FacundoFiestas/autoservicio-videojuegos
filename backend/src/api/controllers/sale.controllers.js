/*============================
    Controladores Ventas
============================*/
import ExcelJS from "exceljs"
import sequelize from '../database/db.js';
import { Sale, Product, SaleProduct } from '../models/index.js';

////////////////////////////////
// Obtener todas las ventas con sus productos
export const getSales = async (req, res) => {
    try {
        const ventas = await Sale.findAll({
            order: [['fecha', 'DESC']],
            include: [
                {
                    model: Product,
                    as: 'productos',
                    attributes: ['id', 'nombre', 'tipo'],
                    through: {
                        attributes: ['cantidad', 'precio_unitario']
                    }
                }
            ]
        });

        return res.status(200).json({
            success: true,
            data: ventas
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener el historial de ventas',
            error: error.message
        });
    }
};

////////////////////////////////
// Registrar una nueva venta desde el carrito
export const createSale = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { nombre_usuario, fecha, precio_total, productos } = req.body;

        if (!nombre_usuario || typeof nombre_usuario !== 'string' || nombre_usuario.trim() === '') {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'El nombre del cliente es obligatorio'
            });
        }

        if (!Array.isArray(productos) || productos.length === 0) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'La venta debe incluir al menos un producto'
            });
        }

        // Crear cabecera de la venta
        const nuevaVenta = await Sale.create({
            nombre_usuario: nombre_usuario.trim(),
            fecha: fecha ? new Date(fecha) : new Date(),
            precio_total: Number(precio_total)
        }, { transaction: t });

        // Armar filas de la tabla intermedia ventas_productos
        const detalleProductos = productos.map(item => ({
            venta_id: nuevaVenta.id,
            producto_id: Number(item.id_producto),
            cantidad: Number(item.cantidad),
            precio_unitario: Number(item.precio)
        }));

        await SaleProduct.bulkCreate(detalleProductos, { transaction: t });

        await t.commit();

        return res.status(201).json({
            success: true,
            message: 'Venta registrada con éxito',
            data: nuevaVenta
        });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({
            success: false,
            message: 'Error al registrar la venta',
            error: error.message
        });
    }

    
};
export const exportSalesExcel = async (req, res) => {
    try {
        const ventas = await Sale.findAll({
            order: [['fecha', 'DESC']],
            include: [
                {
                    model: Product,
                    as: 'productos',
                    attributes: ['id', 'nombre', 'tipo'],
                    through: {
                        attributes: ['cantidad', 'precio_unitario']
                    }
                }
            ]
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Ventas AutoGames');

        worksheet.columns = [
            { header: 'ID Venta', key: 'id', width: 12 },
            { header: 'Fecha', key: 'fecha', width: 22 },
            { header: 'Cliente', key: 'cliente', width: 25 },
            { header: 'Detalle de Productos', key: 'productos', width: 55 },
            { header: 'Total ($)', key: 'total', width: 16 }
        ];

        // Encabezado en negrita
        worksheet.getRow(1).font = { bold: true };

        ventas.forEach((venta) => {
            const detalle = (venta.productos || [])
                .map((p) => {
                    const cant = p.SaleProduct?.cantidad ?? 1;
                    const precioUnit = Number(p.SaleProduct?.precio_unitario ?? p.precio);
                    return `${cant}x ${p.nombre} ($${precioUnit.toLocaleString('es-AR')})`;
                })
                .join(' | ');

            worksheet.addRow({
                id: venta.id,
                fecha: new Date(venta.fecha).toLocaleString('es-AR'),
                cliente: venta.nombre_usuario,
                productos: detalle || 'Sin detalle',
                total: Number(venta.precio_total)
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="Ventas_AutoGames.xlsx"'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error al generar Excel:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al generar el archivo Excel',
            error: error.message
        });
    }
};