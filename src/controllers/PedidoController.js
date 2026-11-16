const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
const Cliente = require('../models/Cliente');
const Cupcake = require('../models/Cupcake');
const ItemPedido = require('../models/ItemPedido');
const Pedido = require('../models/Pedido');

async function create(req, res, next) {
    const cupcakeId = Number(req.body.cupcakeId);
    const quantidade = Number(req.body.quantidade);
    const nome = String(req.body.nome || '').trim();
    const email = String(req.body.email || '').trim();
    const senha = String(req.body.senha || '');
    const telefone = String(req.body.telefone || '').trim();
    const endereco = String(req.body.endereco_padrao || '').trim();
    const formaPagamento = String(req.body.forma_pagamento || '').trim();

    if (!Number.isInteger(cupcakeId) || !Number.isInteger(quantidade) || quantidade < 1 ||
        !nome || !email || senha.length < 8 || !endereco || !formaPagamento) {
        return res.status(400).send('Confira seus dados e informe uma senha com pelo menos 8 caracteres.');
    }

    let transaction;
    try {
        transaction = await sequelize.transaction();
        const cupcake = await Cupcake.findByPk(cupcakeId, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });
        if (!cupcake || !cupcake.ativo) {
            await transaction.rollback();
            return res.status(404).send('Cupcake nao encontrado.');
        }
        if (cupcake.estoque < quantidade) {
            await transaction.rollback();
            return res.status(400).send('Estoque insuficiente para essa quantidade.');
        }

        let cliente = await Cliente.findOne({ where: { email }, transaction });
        if (cliente) {
            const senhaValida = await bcrypt.compare(senha, cliente.senha);
            if (!senhaValida) {
                await transaction.rollback();
                return res.status(401).send('E-mail ou senha incorretos.');
            }
        } else {
            cliente = await Cliente.create({
                nome,
                email,
                senha: await bcrypt.hash(senha, 12),
                telefone: telefone || null,
                endereco_padrao: endereco
            }, { transaction });
        }

        const precoUnitario = Number(cupcake.preco);
        const taxaEntrega = 0;
        const pedido = await Pedido.create({
            cliente_id: cliente.id,
            valor_total: precoUnitario * quantidade + taxaEntrega,
            taxa_entrega: taxaEntrega,
            forma_pagamento: formaPagamento
        }, { transaction });

        await ItemPedido.create({
            pedido_id: pedido.id,
            cupcake_id: cupcake.id,
            quantidade,
            preco_unitario: precoUnitario
        }, { transaction });
        await cupcake.decrement('estoque', { by: quantidade, transaction });

        await transaction.commit();
        return res.redirect(`/pedidos/${pedido.id}/confirmacao`);
    } catch (error) {
        if (transaction && !transaction.finished) {
            await transaction.rollback();
        }
        return next(error);
    }
}

async function confirmation(req, res, next) {
    try {
        const pedido = await Pedido.findByPk(req.params.pedidoId, {
            include: [
                { model: Cliente, as: 'cliente' },
                {
                    model: ItemPedido,
                    as: 'itens',
                    include: [{ model: Cupcake, as: 'cupcake' }]
                }
            ]
        });
        if (!pedido) {
            return res.status(404).send('Pedido nao encontrado.');
        }
        return res.render('confirma-pedido', { pedido });
    } catch (error) {
        return next(error);
    }
}

module.exports = { create, confirmation };