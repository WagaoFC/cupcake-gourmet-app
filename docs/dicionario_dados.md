# Dicionario de Dados

Banco: `cupcake_gourmet_db`

## clientes

| Campo           | Tipo         | Regras              | Descricao                  |
| --------------- | ------------ | ------------------- | -------------------------- |
| id              | INT          | PK, auto incremento | Identificador do cliente   |
| nome            | VARCHAR(100) | Obrigatorio         | Nome do cliente            |
| email           | VARCHAR(100) | Obrigatorio, unico  | E-mail de acesso           |
| senha           | VARCHAR(255) | Obrigatorio         | Hash da senha do cliente   |
| telefone        | VARCHAR(20)  | Opcional            | Telefone para contato      |
| endereco_padrao | VARCHAR(255) | Obrigatorio         | Endereco padrao de entrega |

## categorias

| Campo     | Tipo         | Regras              | Descricao                  |
| --------- | ------------ | ------------------- | -------------------------- |
| id        | INT          | PK, auto incremento | Identificador da categoria |
| nome      | VARCHAR(50)  | Obrigatorio         | Nome da categoria          |
| descricao | VARCHAR(255) | Opcional            | Descricao da categoria     |

## cupcakes

| Campo        | Tipo          | Regras                             | Descricao                     |
| ------------ | ------------- | ---------------------------------- | ----------------------------- |
| id           | INT           | PK, auto incremento                | Identificador do cupcake      |
| categoria_id | INT           | FK para categorias.id, obrigatorio | Categoria do produto          |
| nome         | VARCHAR(100)  | Obrigatorio                        | Nome exibido no catalogo      |
| descricao    | TEXT          | Opcional                           | Descricao do produto          |
| preco        | DECIMAL(10,2) | Obrigatorio                        | Preco unitario                |
| imagem_url   | VARCHAR(255)  | Opcional                           | Caminho ou URL da imagem      |
| estoque      | INT           | Obrigatorio, padrao 0              | Quantidade disponivel         |
| ativo        | TINYINT(1)    | Obrigatorio, padrao 1              | Indica se aparece no catalogo |

## pedidos

| Campo           | Tipo          | Regras                           | Descricao                     |
| --------------- | ------------- | -------------------------------- | ----------------------------- |
| id              | INT           | PK, auto incremento              | Identificador do pedido       |
| cliente_id      | INT           | FK para clientes.id, obrigatorio | Cliente que realizou o pedido |
| data_pedido     | DATETIME      | Obrigatorio, padrao atual        | Data e hora do pedido         |
| valor_total     | DECIMAL(10,2) | Obrigatorio                      | Total do pedido               |
| taxa_entrega    | DECIMAL(10,2) | Obrigatorio, padrao 0.00         | Valor da entrega              |
| status          | VARCHAR(50)   | Obrigatorio, padrao Pendente     | Situacao do pedido            |
| forma_pagamento | VARCHAR(50)   | Obrigatorio                      | Meio de pagamento selecionado |

## itens_pedido

| Campo          | Tipo          | Regras                           | Descricao                                   |
| -------------- | ------------- | -------------------------------- | ------------------------------------------- |
| id             | INT           | PK, auto incremento              | Identificador do item                       |
| pedido_id      | INT           | FK para pedidos.id, obrigatorio  | Pedido ao qual o item pertence              |
| cupcake_id     | INT           | FK para cupcakes.id, obrigatorio | Cupcake solicitado                          |
| quantidade     | INT           | Obrigatorio, maior que zero      | Unidades do produto                         |
| preco_unitario | DECIMAL(10,2) | Obrigatorio                      | Preco no momento da compra                  |
| subtotal       | DECIMAL(10,2) | Calculado pelo banco             | Quantidade multiplicada pelo preco unitario |

## Relacionamentos e exclusao

- Uma categoria possui varios cupcakes; a categoria nao pode ser removida enquanto houver produtos associados (`RESTRICT`).
- Um cliente pode possuir varios pedidos; remover o cliente remove seus pedidos (`CASCADE`).
- Um pedido possui varios itens; remover o pedido remove os itens (`CASCADE`).
- Um cupcake pode aparecer em varios itens de pedido e nao pode ser removido se estiver associado (`RESTRICT`).
