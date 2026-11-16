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
            const cupcake = await Cupcake.findByPk(id);
            if (!cupcake) {
                return res.status(404).render('erro', { mensagem: 'Cupcake Gourmet não encontrado!' });
            }
            return res.render('detalhe', { cupcake });
        } catch (error) {
            return res.status(500).render('erro', { mensagem: 'Ocorreu um erro ao carregar o produto.' });
        }
    }
};