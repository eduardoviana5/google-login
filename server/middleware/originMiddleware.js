
const origensPermitidas = (
  process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
)
  .split(',')
  .map((origem) => origem.trim())
  .filter(Boolean);

export function verificarOrigem(req, res, next) {
  const origem = req.get('Origin');

  if (!origem || !origensPermitidas.includes(origem)) {
    return res.status(403).json({
      erro: 'Origem da requisição não autorizada.',
    });
  }

  next();
}