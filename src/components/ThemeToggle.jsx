
import { useEffect, useState } from 'react';

function obterTemaInicial() {
  try {
    const temaSalvo = localStorage.getItem('google-login-theme');

    if (temaSalvo === 'light' || temaSalvo === 'dark') {
      return temaSalvo;
    }
  } catch {
    // Mantém o tema padrão se o armazenamento estiver indisponível.
  }

  return 'light';
}

export default function ThemeToggle() {
  const [tema, setTema] = useState(obterTemaInicial);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);

    try {
      localStorage.setItem('google-login-theme', tema);
    } catch {
      // O botão continua funcionando mesmo sem armazenamento.
    }
  }, [tema]);

  function alternarTema() {
    setTema((atual) => (atual === 'light' ? 'dark' : 'light'));
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={alternarTema}
      aria-label={
        tema === 'light'
          ? 'Ativar modo escuro'
          : 'Ativar modo claro'
      }
      aria-pressed={tema === 'dark'}
      title={
        tema === 'light'
          ? 'Ativar modo escuro'
          : 'Ativar modo claro'
      }
    >
      <span aria-hidden="true">
        {tema === 'light' ? '☾' : '☀'}
      </span>
    </button>
  );
}