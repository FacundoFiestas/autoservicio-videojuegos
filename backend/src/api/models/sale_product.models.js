/*=========================================
    Modelo Intermedio Ventas - Productos
=========================================*/

import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const SaleProduct = sequelize.define('SaleProduct', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    venta_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'ventas_productos',
    timestamps: false
});

export default SaleProduct;