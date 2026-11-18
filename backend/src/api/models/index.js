/*====================================
    Asociaciones de Modelos Sequelize
====================================*/

import Product from './product.models.js';
import User from './user.models.js';
import Sale from './sale.models.js';
import SaleProduct from './sale_product.models.js';

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

export {
    Product,
    User,
    Sale,
    SaleProduct
};