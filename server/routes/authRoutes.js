
import { Router } from 'express';

import {
  loginGoogle,
  consultarSessao,
  logout,
} from '../controllers/authController.js';

import { verificarOrigem } from '../middleware/originMiddleware.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Autenticação com Google.
router.post(
  '/auth/google',
  verificarOrigem,
  loginLimiter,
  loginGoogle
);

// Consulta o usuário autenticado.
router.get('/me', consultarSessao);

// Encerra a sessão do usuário.
router.post('/logout', verificarOrigem, logout);

export default router;