
import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [sessao, setSessao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState('');

  const googleInitializedRef = useRef(false);
  const credentialCallbackRef = useRef(null);
  const botaoGoogleRef = useRef(null);

  // Recupera a sessão existente
  useEffect(() => {
    async function verificarSessao() {
      try {
        const res = await fetch('/api/me', {
          credentials: 'same-origin',
        });

        if (res.ok) {
          const dados = await res.json();

          setUsuario(dados.usuario);
          setSessao(dados.sessao || null);
        }
      } catch {
        setErro('Não foi possível conectar ao servidor.');
      } finally {
        setCarregando(false);
      }
    }

    verificarSessao();
  }, []);

  // Login Google
  useEffect(() => {
    if (carregando || usuario) return;

    let ativo = true;
    let timer;

    function inicializarGoogle() {
      if (
        !ativo ||
        !window.google?.accounts?.id ||
        !botaoGoogleRef.current
      ) {
        return;
      }

      // Inicializa o Google somente uma vez
      if (!googleInitializedRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: (response) => {
            credentialCallbackRef.current?.(response);
          },
        });

        googleInitializedRef.current = true;
      }

      // Renderiza o botão sempre que a tela de login aparecer
      const container = botaoGoogleRef.current;

      // Evita duplicar o botão
      container.innerHTML = '';

      window.google.accounts.id.renderButton(
        container,
        {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          width: Math.min(container.clientWidth, 350),
          locale: 'pt-BR',
        }
      );
    }

    if (window.google?.accounts?.id) {
      inicializarGoogle();
    } else {
      timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(timer);
          inicializarGoogle();
        }
      }, 200);
    }

    return () => {
      ativo = false;
      clearInterval(timer);
    };
  }, [carregando, usuario]);

  // Processa o login
  async function handleCredentialResponse({ credential }) {
    setErro('');
    setProcessando(true);

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ id_token: credential }),
      });

      const dados = await res.json();

      if (!res.ok) {
        throw new Error(
          dados.erro || 'Falha na autenticação.'
        );
      }

      setUsuario(dados.usuario);

      // Busca os dados atualizados da sessão
      try {
        const sessaoRes = await fetch('/api/me', {
          credentials: 'same-origin',
        });

        if (sessaoRes.ok) {
          const dadosSessao = await sessaoRes.json();
          setSessao(dadosSessao.sessao || null);
        } else {
          setSessao(null);
        }
      } catch {
        setSessao(null);
      }
    } catch (error) {
      setErro(
        error.message || 'Não foi possível realizar o login.'
      );
    } finally {
      setProcessando(false);
    }
  }

  // Mantém o callback atualizado
  // Mantém o callback atualizado após a renderização.
  useEffect(() => {
    credentialCallbackRef.current = handleCredentialResponse;
  });

  // Encerra a sessão
  async function handleLogout() {
    setErro('');
    setProcessando(true);

    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });

      if (!res.ok) {
        throw new Error(
          'Não foi possível encerrar a sessão.'
        );
      }

      window.google?.accounts?.id?.disableAutoSelect();

      setUsuario(null);
      setSessao(null);
    } catch (error) {
      setErro(error.message);
    } finally {
      setProcessando(false);
    }
  }

  // Formata as datas da sessão
  function formatarData(data) {
    if (!data) return 'Não disponível';

    const dataFormatada = new Date(data);

    if (Number.isNaN(dataFormatada.getTime())) {
      return 'Não disponível';
    }

    return dataFormatada.toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }

  // Tela de carregamento
  if (carregando) {
    return (
      <main className="loading-screen">
        <div className="loading-spinner" />
        <p>Verificando sua sessão...</p>
      </main>
    );
  }

  return (
    <main className="app-container">
      <header className="topbar">
        <a href="/" className="brand">
          <span className="brand-icon">G</span>
          <span>
            Auth<span className="brand-light">Studio</span>
          </span>
        </a>

        <span className="topbar-label">
          AUTENTICAÇÃO SEGURA
        </span>
      </header>

      <section className="main-content">
        {!usuario ? (
          // TELA DE LOGIN
          <div className="login-layout">

            <div className="presentation">
              <span className="eyebrow">
                <span className="status-dot" />
                GOOGLE IDENTITY SERVICES
              </span>

              <h1>
                Sua identidade.
                <br />
                <span>Seu acesso.</span>
                <br />
                Sua segurança.
              </h1>

              <p className="presentation-text">
                Entre com sua conta Google e tenha acesso
                a uma experiência de autenticação simples,
                moderna e protegida.
              </p>

              <div className="feature-list">
                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>
                    Identidade verificada pelo Google
                  </span>
                </div>

                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>
                    Sessão protegida por cookie HttpOnly
                  </span>
                </div>

                <div className="feature">
                  <span className="feature-icon">✓</span>
                  <span>
                    Autenticação validada no servidor
                  </span>
                </div>
              </div>
            </div>

            <div className="login-card">
              <div className="card-symbol">
                <span>G</span>
              </div>

              <h2>Bem-vindo!</h2>

              <p className="card-description">
                Entre para continuar utilizando o sistema.
              </p>

              <div className="login-divider">
                <span>ACESSE SUA CONTA</span>
              </div>

              <div
                ref={botaoGoogleRef}
                className="google-button"
              />

              {processando && (
                <p className="processing-message">
                  Autenticando sua conta...
                </p>
              )}

              {erro && (
                <div className="error-message" role="alert">
                  {erro}
                </div>
              )}

              <div className="security-note">
                <span>🔒</span>
                Sua autenticação é protegida pelo Google.
              </div>
            </div>

          </div>
        ) : (
          // DASHBOARD
          <div className="dashboard">
            <div className="dashboard-heading">
              <span className="eyebrow">
                ÁREA AUTENTICADA
              </span>

              <h1>
                Olá, {usuario.nome?.split(' ')[0]}!
              </h1>

              <p>Você está conectado com sucesso.</p>
            </div>

            <section className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  {usuario.foto ? (
                    <img
                      src={usuario.foto}
                      alt="Foto do perfil"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>
                      {usuario.nome?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>

                <div className="profile-info">
                  <h2>{usuario.nome}</h2>
                  <p>{usuario.email}</p>
                </div>

                <span className="authenticated-badge">
                  <span /> Autenticado
                </span>
              </div>

              <div className="profile-divider" />

              <div className="account-details">
                <div className="detail-item">
                  <span>PROVEDOR</span>
                  <strong>Google Identity Services</strong>
                </div>

                <div className="detail-item">
                  <span>VERIFICAÇÃO DE E-MAIL</span>
                  <strong>
                    {usuario.emailVerificado
                      ? 'Verificado'
                      : 'Não verificado'}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>IDENTIFICADOR GOOGLE (SUB)</span>
                  <strong className="user-id">
                    {usuario.googleUserId}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>STATUS DA SESSÃO</span>
                  <strong className="active-status">
                    {sessao?.status === 'ativa'
                      ? 'Sessão ativa'
                      : 'Indisponível'}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>SESSÃO CRIADA EM</span>
                  <strong>
                    {formatarData(sessao?.criadaEm)}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>EXPIRA EM</span>
                  <strong>
                    {formatarData(sessao?.expiraEm)}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>ÚLTIMO ACESSO</span>
                  <strong>
                    {formatarData(sessao?.ultimoAcesso)}
                  </strong>
                </div>
              </div>

              {erro && (
                <div className="error-message" role="alert">
                  {erro}
                </div>
              )}

              <button
                className="logout-button"
                onClick={handleLogout}
                disabled={processando}
              >
                {processando
                  ? 'Encerrando...'
                  : 'Encerrar sessão'}
              </button>
            </section>
          </div>
        )}
      </section>
    
    <footer className="footer">
      <span>AuthStudio © 2026</span>
      <a href="/privacidade" className="footer-privacy-link">
        Política de Privacidade
      </a>
      <span>Projeto de autenticação com Google GIS</span>
    </footer>

    </main>
  );
}

export default App;