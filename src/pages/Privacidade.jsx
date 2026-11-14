import ThemeToggle from '../components/ThemeToggle';
import './Privacidade.css';

export default function Privacidade() {
  return (
    <main className="privacy-page">
      <div className="privacy-container">
        <header className="privacy-header">
          <div className="privacy-header-actions">
            <a href="/" className="privacy-back">
              ← Voltar ao início
            </a>
            
            <ThemeToggle />
          </div>

          <span className="privacy-label">
            Google <span className="brand-light">Login System</span>
          </span>

          <h1>Política de Privacidade</h1>

          <p>
            Saiba como suas informações são utilizadas
            e protegidas ao acessar nossa aplicação.
          </p>
        </header>

        <div className="privacy-content">
          <section>
            <h2>1. Sobre o projeto</h2>
            <p>
              O Google Login System é uma aplicação
              educacional desenvolvida para demonstrar
              a autenticação de usuários utilizando
              contas Google.
            </p>
          </section>

          <section>
            <h2>2. Informações coletadas</h2>
            <p>
              Ao realizar login, a aplicação recebe
              informações básicas disponibilizadas
              pelo Google:
            </p>

            <ul>
              <li>Nome da conta Google.</li>
              <li>Endereço de e-mail.</li>
              <li>Foto de perfil, quando disponível.</li>
              <li>Identificador único da conta Google.</li>
              <li>Status de verificação do e-mail.</li>
              <li>Datas de criação e atualização do cadastro.</li>
              <li>Data do último login realizado na aplicação.</li>
            </ul>
          </section>

          <section>
            <h2>3. Finalidade do uso dos dados</h2>
            <p>
              As informações são utilizadas para
              identificar o usuário, permitir o acesso
              ao dashboard e manter uma sessão
              autenticada.
            </p>
          </section>

          <section>
            <h2>4. Armazenamento</h2>
            <p>
              Os dados de usuários e sessões são
              armazenados em um banco PostgreSQL
              hospedado no Supabase.
            </p>

            <p>
              A aplicação utiliza identificadores
              aleatórios de sessão e armazena no
              banco apenas seus hashes SHA-256.
            </p>

            <p>
              Para gerenciar a autenticação, o sistema
              também armazena registros de sessão
              associados ao identificador Google do usuário.
              Esses registros incluem o hash do identificador
              da sessão e as datas de criação, expiração
              e último acesso.
            </p>
          </section>

          <section>
            <h2>5. Cookies</h2>
            <p>
              O sistema utiliza um cookie de
              autenticação com a configuração HttpOnly,
              que impede sua leitura diretamente
              por JavaScript no navegador.
            </p>

            <p>
              O cookie possui duração de até 24 horas
              e utiliza a opção Secure no ambiente
              de produção.
            </p>
          </section>

          <section>
            <h2>6. Serviços utilizados</h2>
            <p>
              A aplicação utiliza serviços externos
              necessários ao seu funcionamento,
              incluindo Google Identity Services
              para autenticação, Supabase para
              armazenamento de dados e Vercel
              para hospedagem.
            </p>
          </section>

          <section>
            <h2>7. Encerramento da sessão</h2>
            <p>
              Ao selecionar a opção de encerrar sessão,
              o sistema remove o registro da sessão
              correspondente no banco de dados e
              solicita a remoção do cookie de
              autenticação do navegador.
            </p>

            <p>
              O encerramento da sessão não implica
              a exclusão automática dos dados
              cadastrais do usuário.
            </p>
          </section>

          
         <section>
          <h2>8. Solicitações sobre dados pessoais</h2>
          <p>
           O usuário pode solicitar informações,
           correção ou exclusão dos dados pessoais
           associados à sua conta.
          </p>
          <p>
           Para realizar uma solicitação, entre em
           contato pelo endereço de e-mail informado
           na seção 10 desta política.
          </p>
          <p>
           Antes de realizar alterações ou excluir
           informações, poderá ser necessária a
           confirmação da identidade do solicitante
           para proteger seus dados.
          </p>
          <p>
           As solicitações serão analisadas conforme
           a legislação aplicável. O encerramento
           da sessão não exclui automaticamente
           o cadastro do usuário.
          </p>
         </section>


          <section>
            <h2>9. Atualizações desta política</h2>
            <p>
              Esta política poderá ser atualizada
              caso ocorram alterações no funcionamento
              da aplicação ou no tratamento de dados.
            </p>
          </section>

          
          <section>
            <h2>10. Contato</h2>
            <p>
             Para dúvidas, solicitações de acesso, correção
             ou exclusão de dados pessoais, entre em contato
             pelo e-mail:
            </p>
            <p>
            <a href="mailto:dudumav05@gmail.com">
             dudumav05@gmail.com
            </a>
            </p>
          </section>
    </div>

        <footer className="privacy-footer">
          <span>Google Login System © 2026</span>
          <a href="/">Voltar ao Google Login System</a>
        </footer>
      </div>
    </main>
  );
}