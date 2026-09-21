# Execução da aplicação

## Pré-requisitos

Para executar a aplicação, é necessário ter instalado:

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)

Não é necessário instalar Node.js, npm, Prisma ou PostgreSQL localmente. As dependências da aplicação, a geração do Prisma Client e o build são realizados durante a construção da imagem Docker.

---

## Clonando o repositório

Clone o repositório e entre no diretório do projeto:

```bash
git clone https://github.com/Gabrielst27/g-orders-api.git
cd g-orders-api
```

---

## Variáveis de ambiente

_Importante_: Estou disponibilizando o arquivo `.env` publicamente no repositório, e faço intencionalmente para conceder ao recrutador acesso total à API e ao banco de dados em nuvem para o contexto do teste técnico. Estou plenamente ciente dos riscos ao expor variáveis de ambiente, e **JAMAIS FARIA ISSO** em um projeto real.

As variáveis são:

```env
DATABASE_URL="postgres://c41b80fbfd1d1b92745458b504f34aa8837b543b64f3aedeb81e23cedafd54e3:sk_nyK5SOvrvLA2SmFIHQvtS@db.prisma.io:5432/postgres?sslmode=require"

JWT_SECRET_KEY="2a12hnVbjrvWQ4iFpcLC3CiA6uszban5dwOiDFXqIL5/1v.smkV/ZVrAe"

JWT_ACCESS_TOKEN_EXPIRES_IN="60m"

API_PORT=8080
```

---

## Executando com Docker

Com o Docker em execução e o arquivo `.env` configurado, execute:

```bash
docker compose build --no-cache
docker compose up
```

O Docker realizará automaticamente:

1. Instalação das dependências;
2. Geração do Prisma Client;
3. Build da aplicação NestJS;
4. Inicialização da API.

Não é necessário executar manualmente:

```bash
npm install
npx prisma generate
npm run build
```

Após a inicialização, a API estará disponível em:

```text
http://localhost:8080
```

Para encerrar os containers:

```bash
docker compose down
```

---

## Testando a API pelo Swagger

A aplicação disponibiliza uma documentação interativa através do Swagger.

Com a API em execução, acesse:

```text
http://localhost:8080/api
```

A partir da interface do Swagger é possível consultar os endpoints disponíveis, visualizar os schemas das requisições e respostas e executar requisições diretamente contra a API.

### Fluxo sugerido para teste

1. Acesse o Swagger em `http://localhost:8080/api`;
2. Utilize o endpoint de criação de usuário para cadastrar um usuário;
3. Utilize o endpoint de autenticação para realizar o login;
4. Copie o token JWT retornado;
5. Clique em **Authorize** no Swagger;
6. Informe o token conforme solicitado;
7. Execute os endpoints protegidos da aplicação.

O Swagger permite validar o fluxo completo da API sem a necessidade de utilizar ferramentas externas como Postman ou Insomnia.

---

## Parando e reconstruindo a aplicação

Para parar os containers:

```bash
docker compose down
```

Caso sejam realizadas alterações no código ou nas dependências e seja necessário reconstruir a imagem:

```bash
docker compose up --build
```

Para reconstruir completamente os containers, removendo também os containers órfãos:

```bash
docker compose down --remove-orphans
docker compose up --build
```

# Configuração do Banco de Dados

## Tecnologias

### PostgreSQL

O PostgreSQL foi utilizado como banco de dados relacional da aplicação, uma vez que o desafio propôs uma abordagem relacional simples.

### Prisma

O Prisma foi adicionado ao projeto como ORM responsável pela comunicação entre a aplicação e o PostgreSQL.

O client é gerado no diretório:

\`\`\`text

generated/prisma

\`\`\`

---

## Modelagem

O banco atualmente é composto pelas seguintes estruturas:

\`\`\`text

USERS

  │

  │ 1\:N

  ▼

ORDERS

  │

  │ 1\:N

  ▼

ORDER_ITEMS

  │

  │ N:1

  ▼

PRODUCTS

\`\`\`

### USERS

A tabela \`USERS\` representa a identidade utilizada pela aplicação.

Ela possui os dados necessários para identificação e autenticação do usuário:

\| Campo      | Tipo         | Restrições |

\| ---------- | ------------ | ---------- |

\| ID         | UUID         | PK         |

\| USERNAME   | VARCHAR(128) | —          |

\| CPF        | VARCHAR(11)  | UNIQUE     |

\| PASSWORD   | VARCHAR(60)  | (bcrypt)   |

\| CREATED_AT | TIMESTAMPTZ  | —          |

O relacionamento com \`ORDERS\` permite associar os pedidos ao usuário responsável.

\> A entidade \`User\` é utilizada como controle de identidade e autenticação da aplicação. Não foi criada uma entidade \`Customer\` separada, evitando adicionar complexidade e controle de estado que não são necessários para o escopo atual do desafio.

---

### ORDERS

A tabela \`ORDERS\` representa os pedidos da aplicação.

\| Campo                 | Tipo         | Restrições    |

\| --------------------- | ------------ | ------------- |

\| ID                    | UUID         | PK            |

\| NUMBER                | INTEGER      | UNIQUE        |

\| DELIVERY_DATE         | TIMESTAMPTZ  | —             |

\| DELIVERY_STREET       | VARCHAR(128) | —             |

\| DELIVERY_NUMBER       | SMALLINT     | —             |

\| DELIVERY_NEIGHBORHOOD | VARCHAR(128) | —             |

\| DELIVERY_CITY         | VARCHAR(64)  | —             |

\| DELIVERY_STATE        | VARCHAR(64)  | —             |

\| DELIVERY_ZIP_CODE     | VARCHAR(8)   | —             |

\| DELIVERY_COMPLEMENT   | VARCHAR(128) | —             |

\| STATUS                | ENUM         | —             |

\| CUSTOMER_ID           | UUID         | FK → USERS.ID |

\| CREATED_AT            | TIMESTAMPTZ  | —             |

Optei por separar o endereço em campos dentro do próprio pedido, uma vez que adicionar o endereço por extenso em um único campo é um erro potencial conhecido na normalização de bancos de dados. Segundo a primeira forma normal, campos devem ser valores atômicos. Em projetos complexos eu manteria essa abordagem, porém criaria, também, uma tabela de endereços atrelada ao usuário, uma vez que a

#### Índices

Foram definidos índices para:

\`\`\`prisma

@@index([NUMBER])

@@index([STATUS])

@@index([DELIVERY_DATE])

\`\`\`

Dessa forma, é possível filtrar de forma otimizada por número do pedido, status e período.

---

### ORDER_ITEMS

A tabela \`ORDER_ITEMS\` representa os itens pertencentes a um pedido.

\| Campo                  | Tipo          | Restrições       |

\| ---------------------- | ------------- | ---------------- |

\| ID                     | UUID          | PK               |

\| ORDER_ID               | UUID          | FK → ORDERS.ID   |

\| PRODUCT_ID             | UUID          | FK → PRODUCTS.ID |

\| QUANTITY               | INTEGER       | —                |

\| UNIT_PRICE_AT_PURCHASE | DECIMAL(10,2) | —                |

\| CREATED_AT             | TIMESTAMPTZ   | —                |

A tabela estabelece a relação entre pedidos e produtos:

\`\`\`text

Order N ───── N Product

       \     /

        OrderItem

\`\`\`

A associação é implementada através das chaves estrangeiras:

\`\`\`text

ORDER_ID  → ORDERS.ID

PRODUCT_ID → PRODUCTS.ID

\`\`\`

#### Preço no momento da compra

Além da referência ao produto, \`ORDER_ITEMS\` armazena:

\`\`\`text

UNIT_PRICE_AT_PURCHASE

\`\`\`

Essa informação representa o preço do produto no momento em que o item foi adicionado ao pedido.

Isso permite preservar o histórico do pedido mesmo que o preço atual do produto seja alterado posteriormente.

Exemplo:

\`\`\`text

PRODUCTS

\--------------------------------

DESCRIPTION = Produto A

PRICE       = 150.00

ORDER_ITEMS

\--------------------------------

PRODUCT_ID             = ...

UNIT_PRICE_AT_PURCHASE = 100.00

\`\`\`

Nesse cenário, o produto atualmente custa \`150.00\`, mas o item daquele pedido foi registrado por \`100.00\`.

---

### PRODUCTS

A tabela \`PRODUCTS\` representa os produtos disponíveis para os pedidos.

\| Campo       | Tipo          | Restrições |

\| ----------- | ------------- | ---------- |

\| ID          | UUID          | PK         |

\| DESCRIPTION | VARCHAR(128)  | —          |

\| PRICE       | DECIMAL(10,2) | —          |

\| CREATED_AT  | TIMESTAMPTZ   | —          |

O preço utiliza \`DECIMAL(10,2)\` para representar valores monetários sem utilizar ponto flutuante.

---

### Relacionamentos

Os relacionamentos definidos no schema são:

\`\`\`text

USERS

  │

  │ 1\:N

  ▼

ORDERS

  │

  │ 1\:N

  ▼

ORDER_ITEMS

  │

  │ N:1

  ▼

PRODUCTS

\`\`\`

Em termos de chaves estrangeiras:

\`\`\`text

ORDERS.CUSTOMER_ID

        │

        └──> USERS.ID

ORDER_ITEMS.ORDER_ID

        │

        └──> ORDERS.ID

ORDER_ITEMS.PRODUCT_ID

        │

        └──> PRODUCTS.ID

\`\`\`

---

### Tipos monetários

Os campos relacionados a valores monetários utilizam:

\`\`\`prisma

Decimal @db.Decimal(10, 2)

\`\`\`

Atualmente:

\`\`\`text

PRODUCTS.PRICE

ORDER_ITEMS.UNIT_PRICE_AT_PURCHASE

\`\`\`

O preço atual do produto e o preço praticado no pedido são tratados como informações distintas.

---

### Identificadores

As entidades utilizam UUID como identificador primário:

\`\`\`prisma

ID String @id @db.Uuid

\`\`\`

A geração dos identificadores será realizada pela camada de domínio da aplicação, enquanto o Prisma será responsável pela persistência dos valores gerados.

---
