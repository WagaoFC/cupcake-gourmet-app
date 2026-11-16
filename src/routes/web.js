const express = require('express');
const router = express.Router();
const CupcakeController = require('../controllers/CupcakeController');
const PedidoController = require('../controllers/PedidoController');

// Rota principal do aplicativo (Vitrine/Catálogo)
router.get('/', CupcakeController.listarVitrine);

// Rota para detalhes de um sabor específico de cupcake
router.get('/cupcake/:id', CupcakeController.verDetalhes);
router.get('/carrinho/:id', CupcakeController.mostrarCarrinho);
router.post('/pedidos', PedidoController.create);
router.get('/pedidos/:pedidoId/confirmacao', PedidoController.confirmation);

router.use((error, req, res, next) => {
    console.error('Erro ao processar requisição:', error);
    if (res.headersSent) {
        return next(error);
    }
    return res.status(500).render('erro', {
        mensagem: 'Não foi possível concluir sua solicitação. Confira a conexão com o banco e tente novamente.'
    });
});

module.exports = router;