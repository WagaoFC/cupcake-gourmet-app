# Cupcake Gourmet - Projeto Integrador II

![Imagem do projeto Cupcake Gourmet](image.jfif)

Projeto acadêmico desenvolvido para a disciplina de **Projeto Integrador Transdisciplinar em Engenharia de Software II**, da Cruzeiro do Sul Virtual.

- **Aluno:** Wagner Ferreira Costa
- **RGM:** 33224293
- **Arquitetura:** MVC
- **Tecnologias:** Node.js, Express, Sequelize, MySQL, EJS e Jest

## Requisitos

- Node.js e npm

## Configuração

1. Instale as dependências: `npm install`.
2. Inicie a aplicação com `npm start` e acesse `http://localhost:3000`.

O modo padrão não requer MySQL, arquivo `.env` nem conexão com o backend. Para desenvolvimento, `npm run dev` reinicia o servidor frontend quando os arquivos mudam.

## Publicação no GitHub Pages

O workflow `.github/workflows/pages.yml` publica automaticamente o conteúdo de `public` quando há push para a branch `main`, ou quando executado manualmente em **Actions**. No GitHub, abra **Settings > Pages** e selecione **GitHub Actions** como fonte de publicação. Depois do push, consulte o resumo da execução do workflow ou **Settings > Pages** para obter a URL. O workflow inclui `image.jfif` no artefato com o nome `image.jpg`.

O Pages hospeda somente o frontend estático. A experiência baseada em `localStorage` funciona sem MySQL ou backend; o servidor Node/Express não é executado pelo GitHub Pages.

## Demonstração local

O frontend inclui catálogo com busca e filtros, detalhes de produtos, sacola com ajuste de quantidades, controle de estoque demonstrativo, confirmação e histórico de pedidos. Os dados ficam no `localStorage` deste navegador e não são enviados a um servidor.

Use somente dados fictícios. Não informe senhas, endereços ou dados de cartão. As opções de pagamento são simuladas e não processam cobranças. Os dados ficam apenas no navegador e podem ser apagados no botão **Reiniciar demonstração**.

## Backend e banco opcionais

Os arquivos Express/EJS, Sequelize e SQL continuam no repositório como referência acadêmica, mas não participam do comando padrão `npm start`. Para iniciar o servidor backend antigo, use `npm run start:backend`; esse modo depende de MySQL, `.env`, esquema instalado e dados cadastrados. O frontend com `localStorage` permanece como o caminho recomendado para a demonstração navegável.

`npm test` executa os testes Jest da camada backend e requer as dependências do projeto. Esses testes não fazem parte do fluxo de demonstração frontend.

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

O script `database/ddl_setup.sql` cria o esquema de referência. O Sequelize não cria nem altera tabelas automaticamente.
