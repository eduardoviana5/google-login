# Google Login System

Sistema web de autenticação com Google, desenvolvido com React, Vite, Node.js, Express e PostgreSQL, utilizando o Supabase para armazenamento de usuários e sessões.

O projeto permite que usuários realizem login com suas contas Google, mantenham uma sessão autenticada e encerrem o acesso com segurança.

## Funcionalidades

- Autenticação utilizando Google Identity Services.
- Validação de tokens Google no backend.
- Cadastro e atualização automática de usuários no banco de dados.
- Persistência de sessões no PostgreSQL.
- Manutenção da autenticação após atualizar a página.
- Encerramento de sessão com logout.
- Cookies HTTP-only para gerenciamento de sessões.
- Armazenamento de hashes SHA-256 dos identificadores de sessão.
- Limitação de tentativas de login.
- Verificação da origem das requisições de autenticação.

## Tecnologias utilizadas

**Frontend**
- React
- Vite
- JavaScript
- HTML5
- CSS3

**Backend**
- Node.js
- Express
- Google Auth Library
- Cookie Parser
- Express Rate Limit

**Banco de dados**
- PostgreSQL
- Supabase

## Estrutura do projeto

```text
google-login/
├── certificates/
│   └── prod-ca-2021.crt
├── public/
├── scripts/
│   └── testarConexao.js
├── server/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   ├── originMiddleware.js
│   │   └── rateLimiter.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── services/
│   │   └── googleAuthService.js
│   ├── utils/
│   │   └── sessionUtils.js
│   ├── app.js
│   └── index.js
├── src/
│   ├── assets/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## Pré-requisitos

Para executar o projeto localmente, são necessários:

- Node.js e npm instalados.
- Um projeto configurado no Supabase.
- Credenciais de cliente do Google Identity Services.
- Um banco PostgreSQL com as tabelas necessárias para usuários e sessões.

## Instalação

Clone o repositório:

```bash
git clone https://github.com/SEU-USUARIO/google-login.git
```

Entre na pasta do projeto:

```bash
cd google-login
```

Instale as dependências:

```bash
npm install
```

## Configuração das variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, utilizando `.env.example` como referência.

Configure as seguintes variáveis:

```dotenv
GOOGLE_CLIENT_ID=seu-client-id-google
VITE_GOOGLE_CLIENT_ID=seu-client-id-google
FRONTEND_ORIGIN=http://localhost:5173
DATABASE_URL=sua-string-de-conexao-postgresql
NODE_ENV=development
```

O banco de dados deve possuir as tabelas `private.app_users` e `private.app_sessions`, conforme a estrutura utilizada pelo backend.

**Importante:** o arquivo `.env` contém informações privadas e não deve ser enviado ao GitHub.

## Executando o projeto

Para iniciar o frontend e o backend simultaneamente:

```bash
npm run dev
```

O projeto estará disponível em:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Testando a conexão com o banco de dados

Execute:

```bash
node scripts/testarConexao.js
```

O comando verifica a conexão PostgreSQL e lista as tabelas disponíveis no schema `private`.

## Funcionamento da autenticação

1. O usuário acessa a interface e seleciona o login com Google.
2. O Google fornece um token de identificação.
3. O frontend envia o token ao backend.
4. O backend valida o token utilizando a biblioteca oficial do Google.
5. Os dados do usuário são cadastrados ou atualizados no PostgreSQL.
6. O servidor cria uma sessão e envia um cookie HTTP-only ao navegador.
7. Nas próximas requisições, a sessão é validada utilizando os registros do banco.
8. Ao realizar logout, a sessão é removida do banco de dados.

## Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/auth/google` | Autentica o usuário com Google |
| GET | `/api/me` | Consulta o usuário e a sessão atual |
| POST | `/api/logout` | Encerra a sessão |

## Segurança

O projeto implementa medidas como:

- Validação de tokens de identificação do Google no servidor.
- Cookies com as opções `httpOnly` e `sameSite`.
- Uso de cookies `secure` em ambiente de produção.
- Armazenamento de hashes dos identificadores de sessão.
- Consultas SQL parametrizadas.
- Verificação de origem para operações de login e logout.
- Limitação de tentativas de autenticação.
- Conexão PostgreSQL com verificação de certificado TLS.

Essas medidas contribuem para a segurança da aplicação, mas não substituem revisões e testes adicionais antes de disponibilizá-la publicamente.

## Status do projeto

O Google Login System foi desenvolvido como uma aplicação web full-stack para autenticação com contas Google.

As funcionalidades principais foram implementadas e testadas localmente, incluindo login, persistência de sessões, consulta de usuário autenticado e logout.

O projeto está preparado para a etapa de publicação no GitHub e implantação na Vercel.

## Finalidade

Projeto desenvolvido como atividade de estudo e prática de desenvolvimento web full-stack, com foco em autenticação, integração entre frontend e backend, organização de código e persistência de dados.