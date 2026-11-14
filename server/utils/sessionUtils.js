
import crypto from 'node:crypto';

// Duração da sessão: 24 horas.
export const DURACAO_SESSAO = 24 * 60 * 60 * 1000;

// Gera um identificador de sessão aleatório.
export function gerarSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

// Gera um hash SHA-256 para armazenar no banco.
export function gerarHashSessao(sessionId) {
  return crypto
    .createHash('sha256')
    .update(sessionId)
    .digest('hex');
}

// Configurações de segurança do cookie.
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

// Converte os dados do banco para o formato usado pelo frontend.
export function formatarUsuario(registro) {
  return {
    googleUserId: registro.google_user_id,
    nome: registro.name,
    email: registro.email,
    foto: registro.photo_url,
    emailVerificado: registro.email_verified,
  };
}

// Formata as datas da sessão.
export function formatarSessao(registro) {
  return {
    criadaEm: registro.created_at.toISOString(),
    expiraEm: registro.expires_at.toISOString(),
  };
}