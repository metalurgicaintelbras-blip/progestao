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
        data DATE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS bh_atrasos (
        id SERIAL PRIMARY KEY,
        colaborador_id INTEGER REFERENCES colaboradores(id) ON DELETE CASCADE,
        data DATE NOT NULL,
        minutos INTEGER DEFAULT 0,
        justificativa TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS bh_eventos (
        id SERIAL PRIMARY KEY,
        colaborador_id INTEGER REFERENCES colaboradores(id) ON DELETE CASCADE,
        tipo VARCHAR(50) NOT NULL,
        data DATE NOT NULL,
        descricao TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS treinamentos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(200) NOT NULL,
        descricao TEXT,
        carga_horaria INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS tr_registros (
        id SERIAL PRIMARY KEY,
        treinamento_id INTEGER REFERENCES treinamentos(id) ON DELETE CASCADE,
        data DATE NOT NULL,
        instrutor VARCHAR(200),
        obs TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS tr_presencas (
        id SERIAL PRIMARY KEY,
        registro_id INTEGER REFERENCES tr_registros(id) ON DELETE CASCADE,
        colaborador_id INTEGER REFERENCES colaboradores(id) ON DELETE CASCADE,
        presente BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS tr_agenda (
        id SERIAL PRIMARY KEY,
        treinamento_id INTEGER REFERENCES treinamentos(id) ON DELETE CASCADE,
        data DATE NOT NULL,
        hora TIME,
        local VARCHAR(200),
        obs TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS db_setores (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(200) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS db_registros (
        id SERIAL PRIMARY KEY,
        data DATE NOT NULL,
        hora TIME,
        turno VARCHAR(30),
        categoria VARCHAR(100),
        prioridade VARCHAR(30),
        status VARCHAR(30) DEFAULT 'Resolvido',
        descricao TEXT NOT NULL,
        acao TEXT,
        envolvidos JSONB DEFAULT '[]',
        foto TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      ALTER TABLE db_registros ADD COLUMN IF NOT EXISTS foto TEXT;

      CREATE TABLE IF NOT EXISTS db_resumos (
        id SERIAL PRIMARY KEY,
        data DATE NOT NULL,
        turno VARCHAR(30),
        texto TEXT NOT NULL,
        obs TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS cl_atividades (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(200) NOT NULL,
        freq VARCHAR(30) NOT NULL,
        inicio DATE NOT NULL,
        status VARCHAR(30) DEFAULT 'Ativa',
        descricao TEXT,
        horario TIME,
        horario2 TIME,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      ALTER TABLE cl_atividades ADD COLUMN IF NOT EXISTS horario TIME;
      ALTER TABLE cl_atividades ADD COLUMN IF NOT EXISTS horario2 TIME;

      CREATE TABLE IF NOT EXISTS cl_execucoes (
        id SERIAL PRIMARY KEY,
        atividade_id INTEGER REFERENCES cl_atividades(id) ON DELETE CASCADE,
        data DATE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS prod_planos (
        id SERIAL PRIMARY KEY,
        data DATE NOT NULL,
        turno VARCHAR(30),
        produto VARCHAR(200),
        meta INTEGER DEFAULT 0,
        obs TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS prod_apontamentos (
        id SERIAL PRIMARY KEY,
        plano_id INTEGER REFERENCES prod_planos(id) ON DELETE CASCADE,
        hora TIME,
        qtd INTEGER DEFAULT 0,
        defeitos INTEGER DEFAULT 0,
        obs TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "session" (
        "sid" VARCHAR NOT NULL COLLATE "default",
        "sess" JSON NOT NULL,
        "expire" TIMESTAMP(6) NOT NULL,
        PRIMARY KEY ("sid")
      );

      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

    `);
    console.log('Database tables initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, initDB };
