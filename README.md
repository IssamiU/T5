# T5

## Descrição do Projeto

Esta atividade consiste em uma aplicação full stack dividida em dois módulos principais: um **backend** Node.js com integração ao banco de dados MySQL via Prisma, e um **frontend** React utilizando Vite para desenvolvimento moderno e rápido.

---

## Estrutura do Repositório

```
/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   ├── .env # (deve ser criado manualmente)
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── README.md
└── ...
```

---

## Versões Importantes Utilizadas

### Backend

| Dependência         | Versão              |
|---------------------|---------------------|
| Node.js             | 18.x (obrigatório)  |
| express             | ^5.1.0              |
| prisma              | ^6.10.1             |
| @prisma/client      | ^6.10.1             |
| typescript          | ^5.8.3              |
| ts-node-dev         | ^2.0.0              |
| ts-node             | ^10.9.2             |
| cors                | ^2.8.5              |

### Frontend

| Dependência         | Versão              |
|---------------------|---------------------|
| Node.js             | 18.x (obrigatório)  |
| Vite                | ^5.0.8              |
| React               | ^18.2.0             |
| React DOM           | ^18.2.0             |
| React Router DOM    | ^6.8.0              |
| TailwindCSS         | ^3.4.0              |
| Axios               | ^1.10.0             |

### Banco de Dados

- **MySQL Workbench:** 8.0.38 Community (local)
- **Prisma ORM:** ^6.10.1

---

## Pré-requisitos

- **Node.js:** Versão 18.x (obrigatório para backend e frontend)
- **npm:** Compatível com Node 18.x
- **MySQL:** Versão 8.0.38 Community rodando localmente
- **Vite:** Versão ^5.0.8 (já incluída nas dependências do frontend)
- **Prisma:** ^6.10.1 (já incluída nas dependências do backend)

> **Atenção:** O projeto exige Node.js 18.x. Versões diferentes podem causar erros de incompatibilidade, especialmente com Vite, Prisma e outras dependências.

---

## Configuração do Ambiente

1. **Banco de Dados MySQL**
   - Certifique-se de que o MySQL está rodando localmente na porta padrão (`localhost:3306`).

2. **Variáveis de Ambiente**
   - O arquivo `.env` **deve ser criado manualmente** na pasta `backend/` com o seguinte conteúdo (ajuste usuário, senha e banco conforme sua configuração):

     DATABASE_URL="mysql://root:password@localhost:3306/petlovers?connection_limit=5"

---

## Instalação e Execução

### Backend

```
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Frontend

```
cd frontend
npm install
npm run dev
```

---

## Observações Importantes

- **Node.js 18.x é obrigatório** para ambos backend e frontend. Outras versões podem causar incompatibilidades.
- **Vite** é utilizado no frontend. Certifique-se de que está usando a versão correta (já incluída nas dependências).
- **Prisma** é utilizado para integração com o banco de dados. Sempre execute `npx prisma generate` e `npx prisma migrate dev` após alterações no schema.
- O arquivo `.env` nunca deve ser versionado no Git (está no `.gitignore`). Sempre crie manualmente em cada ambiente.
- O MySQL deve estar rodando localmente e acessível conforme configurado no `.env`.


