
import 'dotenv/config';

import express from 'express';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';

const app = express();
// Evita divulgar o framework utilizado pelo servidor.
app.disable('x-powered-by');
// Permite que o Express interprete requisições JSON.
// Limita o tamanho do corpo da requisição a 10 KB.
app.use(express.json({ limit: '10kb' }));

// Permite acessar os cookies enviados pelo navegador.
app.use(cookieParser());

// Impede que respostas da API sejam armazenadas em cache.
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Registra as rotas de autenticação.
// Exemplo: /api/auth/google, /api/me e /api/logout.
app.use('/api', authRoutes);

// Tratamento de erros de requisições.
app.use((erro, req, res, next) => {
  void next;
  
  if (erro.type === 'entity.too.large') {
    return res.status(413).json({
      erro: 'A requisição excedeu o limite de 10 KB.',
    });
  }

  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({
      erro: 'O JSON enviado é inválido.',
    });
  }

  console.error('Erro não tratado na API:', erro);

  return res.status(500).json({
    erro: 'Ocorreu um erro interno no servidor.',
  });
});

export default app;