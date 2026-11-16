// tests/cupcake.test.js
const Cupcake = require('../models/Cupcake');

describe('Testes Unitários do Domínio Cupcake', () => {
    test('Não deve permitir a criação de um cupcake sem nome ou sem preço', async () => {
        try {
            await Cupcake.create({
                descricao: 'Incompleto'
            });
            fail('A criação deveria ter falhado por falta de campos obrigatórios.');
        } catch (error) {
            expect(error.name).toBe('SequelizeValidationError');
        }
    });

    test('Deve permitir cadastrar e obter um cupcake gourmet com sucesso', async () => {
        const cupcake = await Cupcake.build({
            nome: 'Gourmet de Nozes',
            preco: 14.50,
            estoque: 10,
            ativo: true
        });

        expect(cupcake.nome).toBe('Gourmet de Nozes');
        expect(cupcake.preco).toBe(14.50);
        expect(cupcake.estoque).toBe(10);
    });
});