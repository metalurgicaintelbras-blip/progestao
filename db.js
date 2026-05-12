const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nome VARCHAR(200),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS colaboradores (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(200) NOT NULL,
        mat VARCHAR(50),
        cargo VARCHAR(100),
        setor VARCHAR(100) DEFAULT 'Montagem',
        turno VARCHAR(50),
        status VARCHAR(30) DEFAULT 'Ativo',
        dt_admissao DATE,
        dt_nascimento DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      ALTER TABLE colaboradores ADD COLUMN IF NOT EXISTS dt_admissao DATE;
      ALTER TABLE colaboradores ADD COLUMN IF NOT EXISTS dt_nascimento DATE;

      CREATE TABLE IF NOT EXISTS ferramentas (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(200) NOT NULL,
        cod VARCHAR(100) NOT NULL,
        cat VARCHAR(100),
        loc VARCHAR(200),
        status VARCHAR(30) DEFAULT 'Disponível',
        cal DATE,
        prev DATE,
        obs TEXT,
        foto TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS emprestimos (
        id SERIAL PRIMARY KEY,
        ferramenta_id INTEGER REFERENCES ferramentas(id) ON DELETE CASCADE,
        colaborador_id INTEGER REFERENCES colaboradores(id) ON DELETE CASCADE,
        dt TIMESTAMP NOT NULL,
        dev_dt TIMESTAMP,
        devolvido BOOLEAN DEFAULT FALSE,
        obs TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS manutencoes (
        id SERIAL PRIMARY KEY,
        ferramenta_id INTEGER REFERENCES ferramentas(id) ON DELETE CASCADE,
        tipo VARCHAR(50) NOT NULL,
        responsavel_id INTEGER REFERENCES colaboradores(id) ON DELETE SET NULL,
        env DATE NOT NULL,
        ret DATE,
        descricao TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS checklist_ferramentas (
        id SERIAL PRIMARY KEY,
        ferramenta_id INTEGER REFERENCES ferramentas(id) ON DELETE CASCADE,
        checked BOOLEAN DEFAULT FALSE,
        obs TEXT,
        data DATE DEFAULT CURRENT_DATE,
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(ferramenta_id, data)
      );

      CREATE TABLE IF NOT EXISTS epis (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(200) NOT NULL,
        dur_qtd INTEGER,
        dur_tipo VARCHAR(20),
        descricao TEXT,
        foto TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS epi_entregas (
        id SERIAL PRIMARY KEY,
        epi_id INTEGER REFERENCES epis(id) ON DELETE CASCADE,
        colaborador_id INTEGER REFERENCES colaboradores(id) ON DELETE CASCADE,
        qtd INTEGER DEFAULT 1,
        dt TIMESTAMP NOT NULL,
        validade DATE,
        motivo VARCHAR(100),
        obs TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS epi_checklists (
        id SERIAL PRIMARY KEY,
        data DATE NOT NULL,
        turno VARCHAR(50),
        total INTEGER DEFAULT 0,
        conformes INTEGER DEFAULT 0,
        irregulares INTEGER DEFAULT 0,
        pct INTEGER DEFAULT 0,
        registros JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS bh_lancamentos (
        id SERIAL PRIMARY KEY,
        colaborador_id INTEGER REFERENCES colaboradores(id) ON DELETE CASCADE,
        tipo VARCHAR(20) NOT NULL,
        minutos INTEGER NOT NULL,
        data DATE NOT NULL,
        motivo VARCHAR(100),
        justificativa TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS bh_convites (
        id SERIAL PRIMARY KEY,
        colaborador_id INTEGER REFERENCES colaboradores(id) ON DELETE CASCADE,
        data DATE NOT NULL,
        data<span class="cursor">█</span>
