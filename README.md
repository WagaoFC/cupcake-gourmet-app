# Cupcake Gourmet - Projeto Integrador II

Projeto acadêmico desenvolvido para a disciplina de **Projeto Integrador Transdisciplinar em Engenharia de Software II**, da Cruzeiro do Sul Virtual.

- **Aluno:** Wagner Ferreira Costa
- **RGM:** 33224293
- **Arquitetura:** MVC
- **Tecnologias:** Node.js, Express, Sequelize, MySQL, EJS e Jest

## Requisitos

- Node.js e npm
- MySQL

## Configuração

1. Instale as dependências: `npm install`.
2. Copie `.env.example` para `.env` e configure `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` e `DB_PASSWORD`.
3. Execute `database/ddl_setup.sql` no MySQL. O script cria o banco `cupcake_gourmet_db` e as tabelas.
4. Cadastre ao menos uma categoria e um cupcake para preencher a vitrine. O script não inclui dados iniciais; cupcakes precisam de uma categoria existente.
5. Inicie a aplicação com `npm start` e acesse `http://localhost:3000`.

Para desenvolvimento, `npm run dev` inicia o servidor com reinicialização ao alterar arquivos. `npm test` executa os testes Jest.

## Funcionalidades e estado atual

A rota `GET /` consulta cupcakes ativos e renderiza a vitrine. A rota `GET /cupcake/:id` está declarada para exibir os detalhes de um produto.

O fluxo de carrinho e pedido ainda não está integrado às rotas atuais: as views `carrinho.ejs` e `confirma-pedido.ejs` existem, mas `src/routes/web.js` não declara endpoints para elas. Além disso, a rota de detalhes tenta renderizar `detalhe.ejs`, que ainda não existe. Portanto, no estado atual, a navegação para detalhes e o checkout não estão completos.

O teste em `tests/cupcake.test.js` também precisa de ajuste antes de `npm test`: seu import aponta para `../models/Cupcake`, mas o model fica em `src/models/Cupcake.js`.

## Estrutura

- `src/config`: configuração de conexão Sequelize.
- `src/controllers`: lógica das requisições da aplicação.
- `src/models`: models `Cliente`, `Categoria`, `Cupcake`, `Pedido` e `ItemPedido`.
- `src/routes`: rotas Express.
- `src/views`: templates EJS existentes.
- `public`: arquivos estáticos, como CSS e JavaScript.
- `database/ddl_setup.sql`: criação do banco e tabelas.
- `docs/dicionario_dados.md`: dicionário de dados.
- `tests`: testes automatizados.

O Sequelize não cria nem altera tabelas automaticamente. O esquema usado pela aplicação deve ser preparado pelo script SQL.
