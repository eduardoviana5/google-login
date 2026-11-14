
import 'dotenv/config';

import pool from '../server/config/database.js';

async function testarConexao() {
  try {
    console.log('Testando conexão com o Supabase...');

    // Verifica a conexão com o PostgreSQL.
    const resultado = await pool.query(`
      SELECT
        current_database() AS banco,
        current_user AS usuario,
        NOW() AS horario
    `);

    console.log('\nConexão estabelecida com sucesso!');
    console.table(resultado.rows);

    // Verifica as tabelas do projeto.
    const tabelas = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'private'
      ORDER BY table_name
    `);

    console.log('\nTabelas encontradas no schema private:');
    console.table(tabelas.rows);
  } catch (erro) {
    console.error('\nErro ao conectar com o Supabase:');
    console.error(erro.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

testarConexao();