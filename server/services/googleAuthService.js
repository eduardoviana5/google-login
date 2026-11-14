
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verificarIdToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const dados = ticket.getPayload();

  if (!dados || typeof dados.sub !== 'string' || !dados.sub) {
    throw new Error('Dados de identificação do Google inválidos.');
  }

  if (dados.email_verified !== true) {
    throw new Error('E-mail da conta Google não foi verificado.');
  }

  if (typeof dados.email !== 'string' || !dados.email) {
    throw new Error('E-mail não encontrado nos dados do Google.');
  }

  return {
    googleUserId: dados.sub,
    nome: dados.name,
    email: dados.email,
    foto: dados.picture,
    emailVerificado: dados.email_verified,
  };
}