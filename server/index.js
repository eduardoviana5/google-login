
import 'dotenv/config';

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();

if (!googleClientId) {
  console.error('ERRO: GOOGLE_CLIENT_ID não configurado.');
  process.exit(1);
}

process.env.GOOGLE_CLIENT_ID = googleClientId;

// Importa o aplicativo somente após validar as configurações.
const { default: app } = await import('./app.js');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor Express rodando na porta ${PORT}`);
});