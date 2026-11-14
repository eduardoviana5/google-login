
import pool from '../config/database.js';
import { verificarIdToken } from '../services/googleAuthService.js';

import {
  DURACAO_SESSAO,
  cookieOptions,
  gerarSessionId,
  gerarHashSessao,
  formatarUsuario,
  formatarSessao,
} from '../utils/sessionUtils.js';

// LOGIN COM GOOGLE
export async function loginGoogle(req, res) {
  const idToken = req.body?.id_token;

  if (typeof idToken !== 'string' || !idToken.trim()) {
    return res.status(400).json({
      erro: 'id_token não fornecido ou inválido.',
    });
  }

  let usuarioGoogle;

  try {
    usuarioGoogle = await verificarIdToken(idToken);
  } catch (erro) {
    console.error('Falha na autenticação Google:', erro.message);

    return res.status(401).json({
      erro: 'Token inválido ou não verificado.',
    });
  }

  const sessionId = gerarSessionId();
  const sessionHash = gerarHashSessao(sessionId);

  const agora = new Date();
  const expiraEm = new Date(agora.getTime() + DURACAO_SESSAO);

  let client;

  try {
    client = await pool.connect();

    await client.query('BEGIN');

    // Cadastra o usuário ou atualiza seus dados.
    const usuarioResultado = await client.query(
      `
      INSERT INTO private.app_users (
        google_user_id,
        name,
        email,
        photo_url,
        email_verified,
        last_login_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (google_user_id)
      DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        photo_url = EXCLUDED.photo_url,
        email_verified = EXCLUDED.email_verified,
        updated_at = NOW(),
        last_login_at = EXCLUDED.last_login_at
      RETURNING *
      `,
      [
        usuarioGoogle.googleUserId,
        usuarioGoogle.nome || usuarioGoogle.email,
        usuarioGoogle.email,
        usuarioGoogle.foto || null,
        usuarioGoogle.emailVerificado,
        agora,
      ]
    );

    // Armazena somente o hash da sessão.
    await client.query(
      `
      INSERT INTO private.app_sessions (
        session_id_hash,
        google_user_id,
        created_at,
        expires_at,
        last_accessed_at
      )
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        sessionHash,
        usuarioGoogle.googleUserId,
        agora,
        expiraEm,
        agora,
      ]
    );

    await client.query('COMMIT');

    const usuario = formatarUsuario(usuarioResultado.rows[0]);

    res.cookie('session_id', sessionId, {
      ...cookieOptions,
      maxAge: DURACAO_SESSAO,
    });

    return res.status(200).json({
      mensagem: 'Sessão criada com sucesso.',
      usuario,
      sessao: {
        criadaEm: agora.toISOString(),
        expiraEm: expiraEm.toISOString(),
      },
    });
  } catch (erro) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackErro) {
        console.error(
          'Falha ao reverter transação:',
          rollbackErro.message
        );
      }
    }

    console.error('Erro ao salvar autenticação:', erro.message);

    return res.status(500).json({
      erro: 'Não foi possível criar a sessão.',
    });
  } finally {
    if (client) client.release();
  }
}

// CONSULTAR USUÁRIO E SESSÃO
export async function consultarSessao(req, res) {
  const sessionId = req.cookies?.session_id;

  if (typeof sessionId !== 'string' || !sessionId) {
    return res.status(401).json({
      erro: 'Sessão inexistente ou expirada.',
    });
  }

  const sessionHash = gerarHashSessao(sessionId);

  try {
    const resultado = await pool.query(
      `
      UPDATE private.app_sessions AS s
      SET last_accessed_at = NOW()
      FROM private.app_users AS u
      WHERE s.session_id_hash = $1
        AND s.google_user_id = u.google_user_id
        AND s.expires_at > NOW()
      RETURNING
        s.created_at,
        s.expires_at,
        s.last_accessed_at,
        u.google_user_id,
        u.name,
        u.email,
        u.photo_url,
        u.email_verified
      `,
      [sessionHash]
    );

    if (resultado.rows.length === 0) {
      res.clearCookie('session_id', cookieOptions);

      return res.status(401).json({
        erro: 'Sessão inexistente ou expirada.',
      });
    }

    const registro = resultado.rows[0];

    return res.status(200).json({
      usuario: formatarUsuario(registro),
      sessao: {
        ...formatarSessao(registro),
        ultimoAcesso: registro.last_accessed_at.toISOString(),
        status: 'ativa',
      },
    });
  } catch (erro) {
    console.error('Erro ao consultar sessão:', erro.message);

    return res.status(500).json({
      erro: 'Não foi possível consultar a sessão.',
    });
  }
}

// LOGOUT
export async function logout(req, res) {
  const sessionId = req.cookies?.session_id;

  try {
    if (typeof sessionId === 'string' && sessionId) {
      const sessionHash = gerarHashSessao(sessionId);

      await pool.query(
        `
        DELETE FROM private.app_sessions
        WHERE session_id_hash = $1
        `,
        [sessionHash]
      );
    }

    res.clearCookie('session_id', cookieOptions);

    return res.status(200).json({
      mensagem: 'Sessão encerrada com sucesso.',
    });
  } catch (erro) {
    console.error('Erro ao encerrar sessão:', erro.message);

    return res.status(500).json({
      erro: 'Não foi possível encerrar a sessão.',
    });
  }
}