# Configuração do Banco de Dados

## Tecnologias

### PostgreSQL

O PostgreSQL foi utilizado como banco de dados relacional da aplicação, uma vez que o desafio propôs uma abordagem relacional simples.

### Prisma

O Prisma foi adicionado ao projeto como ORM responsável pela comunicação entre a aplicação e o PostgreSQL.

O client é gerado no diretório:

```text
generated/prisma
```

---

# Modelagem

O banco atualmente é composto pelas seguintes estruturas:

```text
USERS
  │
  │ 1:N
  ▼
ORDERS
  │
  │ 1:N
  ▼
ORDER_ITEMS
  │
  │ N:1
  ▼
PRODUCTS
```

## USERS

A tabela `USERS` representa a identidade utilizada pela aplicação.

Ela possui os dados necessários para identificação e autenticação do usuário:

| Campo      | Tipo         | Restrições |
| ---------- | ------------ | ---------- |
| ID         | UUID         | PK         |
| USERNAME   | VARCHAR(128) | —          |
| CPF        | VARCHAR(11)  | UNIQUE     |
| PASSWORD   | VARCHAR(60)  | (bcrypt)   |
| CREATED_AT | TIMESTAMPTZ  | —          |

O relacionamento com `ORDERS` permite associar os pedidos ao usuário responsável.

> A entidade `User` é utilizada como controle de identidade e autenticação da aplicação. Não foi criada uma entidade `Customer` separada, evitando adicionar complexidade e controle de estado que não são necessários para o escopo atual do desafio.

---

## ORDERS

A tabela `ORDERS` representa os pedidos da aplicação.

| Campo                 | Tipo         | Restrições    |
| --------------------- | ------------ | ------------- |
| ID                    | UUID         | PK            |
| NUMBER                | INTEGER      | UNIQUE        |
| DELIVERY_DATE         | TIMESTAMPTZ  | —             |
| DELIVERY_STREET       | VARCHAR(128) | —             |
| DELIVERY_NUMBER       | SMALLINT     | —             |
| DELIVERY_NEIGHBORHOOD | VARCHAR(128) | —             |
| DELIVERY_CITY         | VARCHAR(64)  | —             |
| DELIVERY_STATE        | VARCHAR(64)  | —             |
| DELIVERY_ZIP_CODE     | VARCHAR(8)   | —             |
| DELIVERY_COMPLEMENT   | VARCHAR(128) | —             |
| STATUS                | ENUM         | —             |
| CUSTOMER_ID           | UUID         | FK → USERS.ID |
| CREATED_AT            | TIMESTAMPTZ  | —             |

Optei por separar o endereço em campos dentro do próprio pedido, uma vez que adicionar o endereço por extenso em um único campo é um erro potencial conhecido na normalização de bancos de dados. Segundo a primeira forma normal, campos devem ser valores atômicos. Em projetos complexos eu manteria essa abordagem, porém criaria, também, uma tabela de endereços atrelada ao usuário, uma vez que a

### Índices

Foram definidos índices para:

```prisma
@@index([NUMBER])
@@index([STATUS])
@@index([DELIVERY_DATE])
```

Dessa forma, é possível filtrar de forma otimizada por número do pedido, status e período.

---

# ORDER_ITEMS

A tabela `ORDER_ITEMS` representa os itens pertencentes a um pedido.

| Campo                  | Tipo          | Restrições       |
| ---------------------- | ------------- | ---------------- |
| ID                     | UUID          | PK               |
| ORDER_ID               | UUID          | FK → ORDERS.ID   |
| PRODUCT_ID             | UUID          | FK → PRODUCTS.ID |
| QUANTITY               | INTEGER       | —                |
| UNIT_PRICE_AT_PURCHASE | DECIMAL(10,2) | —                |
| CREATED_AT             | TIMESTAMPTZ   | —                |

A tabela estabelece a relação entre pedidos e produtos:

```text
Order N ───── N Product
       \     /
        OrderItem
```

A associação é implementada através das chaves estrangeiras:

```text
ORDER_ID  → ORDERS.ID
PRODUCT_ID → PRODUCTS.ID
```

### Preço no momento da compra

Além da referência ao produto, `ORDER_ITEMS` armazena:

```text
UNIT_PRICE_AT_PURCHASE
```

Essa informação representa o preço do produto no momento em que o item foi adicionado ao pedido.

Isso permite preservar o histórico do pedido mesmo que o preço atual do produto seja alterado posteriormente.

Exemplo:

```text
PRODUCTS
--------------------------------
DESCRIPTION = Produto A
PRICE       = 150.00

ORDER_ITEMS
--------------------------------
PRODUCT_ID             = ...
UNIT_PRICE_AT_PURCHASE = 100.00
```

Nesse cenário, o produto atualmente custa `150.00`, mas o item daquele pedido foi registrado por `100.00`.

---

# PRODUCTS

A tabela `PRODUCTS` representa os produtos disponíveis para os pedidos.

| Campo       | Tipo          | Restrições |
| ----------- | ------------- | ---------- |
| ID          | UUID          | PK         |
| DESCRIPTION | VARCHAR(128)  | —          |
| PRICE       | DECIMAL(10,2) | —          |
| CREATED_AT  | TIMESTAMPTZ   | —          |

O preço utiliza `DECIMAL(10,2)` para representar valores monetários sem utilizar ponto flutuante.

---

# Relacionamentos

Os relacionamentos definidos no schema são:

```text
USERS
  │
  │ 1:N
  ▼
ORDERS
  │
  │ 1:N
  ▼
ORDER_ITEMS
  │
  │ N:1
  ▼
PRODUCTS
```

Em termos de chaves estrangeiras:

```text
ORDERS.CUSTOMER_ID
        │
        └──> USERS.ID

ORDER_ITEMS.ORDER_ID
        │
        └──> ORDERS.ID

ORDER_ITEMS.PRODUCT_ID
        │
        └──> PRODUCTS.ID
```

---

# Tipos monetários

Os campos relacionados a valores monetários utilizam:

```prisma
Decimal @db.Decimal(10, 2)
```

Atualmente:

```text
PRODUCTS.PRICE
ORDER_ITEMS.UNIT_PRICE_AT_PURCHASE
```

O preço atual do produto e o preço praticado no pedido são tratados como informações distintas.

---

# Identificadores

As entidades utilizam UUID como identificador primário:

```prisma
ID String @id @db.Uuid
```

A geração dos identificadores será realizada pela camada de domínio da aplicação, enquanto o Prisma será responsável pela persistência dos valores gerados.

---
