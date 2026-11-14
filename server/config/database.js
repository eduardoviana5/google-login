
import 'dotenv/config';
import pg from 'pg';
import fs from 'node:fs';

const { Pool } = pg;

// Carrega o certificado SSL oficial do Supabase.
const certificadoCA = fs.readFileSync(
  new URL('../../certificates/prod-ca-2021.crt', import.meta.url),
  'utf8'
);

// Verifica se a conexão foi configurada.
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não configurada no .env');
}

// Configuração da conexão com o PostgreSQL.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: {
    ca: certificadoCA,
    rejectUnauthorized: true,
    servername: 'aws-0-sa-east-1.pooler.supabase.com',
  },
});

// Trata erros de conexões ociosas.
pool.on('error', (erro) => {
  console.error(
    'Erro em conexão ociosa com o PostgreSQL:',
    erro.message
  );
});

export default pool;