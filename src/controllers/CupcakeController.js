const Cupcake = require('../models/Cupcake');

module.exports = {
    // Exibe a vitrine de Cupcakes para o usuário
    async listarVitrine(req, res) {
        try {
            const cupcakes = await Cupcake.findAll({ where: { ativo: true } });
            return res.render('catalogo', { cupcakes });
        } catch (error) {
            console.error("Erro ao carregar vitrine:", error);
            return res.status(500).render('erro', { mensagem: 'Não foi possível carregar os deliciosos cupcakes. Tente novamente mais tarde!' });
        }
    },

    // Exibe os detalhes de um cupcake específico
    async verDetalhes(req, res) {
        try {
            const { id } = req.params;
            const cupcake = await Cupcake.findOne({
                where: { id, ativo: true }
            });
            if (!cupcake) {
                return res.status(404).render('erro', { mensagem: 'Cupcake Gourmet não encontrado!' });
            }
            return res.render('detalhe', { cupcake });
        } catch (error) {
            console.error('Erro ao carregar detalhes:', error);
            return res.status(500).render('erro', { mensagem: 'Ocorreu um erro ao carregar o produto.' });
        }
    },

    async mostrarCarrinho(req, res) {
        try {
            const cupcake = await Cupcake.findOne({
                where: { id: req.params.id, ativo: true }
            });
            if (!cupcake) {
                return res.status(404).render('erro', { mensagem: 'Cupcake Gourmet não encontrado!' });
            }
            if (cupcake.estoque < 1) {
                return res.status(400).render('erro', { mensagem: 'Este cupcake está esgotado no momento.' });
            }
            return res.render('carrinho', { cupcake });
        } catch (error) {
            console.error('Erro ao carregar carrinho:', error);
            return res.status(500).render('erro', { mensagem: 'Ocorreu um erro ao preparar seu pedido.' });
        }
    }
};