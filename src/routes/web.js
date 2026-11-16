const express = require('express');
const router = express.Router();
const CupcakeController = require('../controllers/CupcakeController');

// Rota principal do aplicativo (Vitrine/Catálogo)
router.get('/', CupcakeController.listarVitrine);

// Rota para detalhes de um sabor específico de cupcake
router.get('/cupcake/:id', CupcakeController.verDetalhes);

module.exports = router;