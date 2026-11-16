const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente');
const Cupcake = require('./Cupcake');
const ItemPedido = require('./ItemPedido');

const Pedido = sequelize.define('Pedido', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    data_pedido: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    valor_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 }
    },
    taxa_entrega: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 }
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'Pendente'
    },
    forma_pagamento: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'pedidos',
    timestamps: false
});

Cliente.hasMany(Pedido, { as: 'pedidos', foreignKey: 'cliente_id', onDelete: 'CASCADE' });
Pedido.belongsTo(Cliente, { as: 'cliente', foreignKey: 'cliente_id', onDelete: 'CASCADE' });
Pedido.hasMany(ItemPedido, { as: 'itens', foreignKey: 'pedido_id', onDelete: 'CASCADE' });
ItemPedido.belongsTo(Pedido, { as: 'pedido', foreignKey: 'pedido_id', onDelete: 'CASCADE' });
Cupcake.hasMany(ItemPedido, { as: 'itensPedido', foreignKey: 'cupcake_id', onDelete: 'RESTRICT' });
ItemPedido.belongsTo(Cupcake, { as: 'cupcake', foreignKey: 'cupcake_id', onDelete: 'RESTRICT' });

module.exports = Pedido;