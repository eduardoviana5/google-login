
import { rateLimit } from 'express-rate-limit';

export const loginLimiter = rateLimit({
  // Intervalo de 15 minutos.
  windowMs: 15 * 60 * 1000,

  // Máximo de 10 tentativas por intervalo.
  limit: 10,

  // Cabeçalhos modernos de limite de requisições.
  standardHeaders: true,
  legacyHeaders: false,

  // Mensagem exibida quando o limite é atingido.
  message: {
    erro: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  },
});