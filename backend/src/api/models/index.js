/*====================================
    Asociaciones de Modelos Sequelize
====================================*/

import Product from './product.models.js';
import User from './user.models.js';
import Sale from './sale.models.js';
import SaleProduct from './sale_product.models.js';
import Survey from './survey.models.js';
import LoginLog from './loginLog.models.js';

// Relación N:M entre Ventas y Productos
Sale.belongsToMany(Product, {
    through: SaleProduct,
    foreignKey: 'venta_id',
    otherKey: 'producto_id',
    as: 'productos'
});

Product.belongsToMany(Sale, {
    through: SaleProduct,
    foreignKey: 'producto_id',
    otherKey: 'venta_id',
    as: 'ventas'
});

// Relación 1:N entre Usuario Administrador y Logs de Inicio de Sesión
User.hasMany(LoginLog, {
    foreignKey: 'usuario_id',
    as: 'logs'
});

LoginLog.belongsTo(User, {
    foreignKey: 'usuario_id',
    as: 'usuario'
});

export {
    Product,
    User,
    Sale,
    SaleProduct,
    Survey,
    LoginLog
};