const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initDB() {
  const client = await pool.connect();
  try {
    // ============ TABELAS BASE ============
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
        matricula VARCHAR(50),
        setor VARCHAR(100),
        cargo VARCHAR(100),
        ativo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS ferramentas (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(200) NOT NULL,
        codigo VARCHAR(100),
        categoria VARCHAR(100),
        status VARCHAR(50) DEFAULT 'disponivel',
        localizacao VARCHAR(200),
        observacoes TEXT,
        foto TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS emprestimos (
        id SERIAL PRIMARY KEY,
        ferramenta_id INTEGER REFERENCES ferramentas(id) ON DELETE CASCADE,
        colaborador_id INTEGER REFERENCES colaboradores(id),
        data_emprestimo TIMESTAMP DEFAULT NOW(),
        data_devolucao TIMESTAMP,
        observacoes TEXT,
        status VARCHAR(50) DEFAULT 'ativo'
      );

      CREATE TABLE IF NOT EXISTS manutencoes (
        id SERIAL PRIMARY KEY,
        ferramenta_id INTEGER REFERENCES ferramentas(id) ON DELETE CASCADE,
        tipo VARCHAR(50),
        descricao TEXT,
        data TIMESTAMP DEFAULT NOW(),
        custo NUMERIC(10,2)
      );

      CREATE TABLE IF NOT EXISTS checklist_ferramentas (
        id SERIAL PRIMARY KEY,
        ferramenta_id INTEGER REFERENCES ferramentas(id) ON DELETE CASCADE,
        data TIMESTAMP DEFAULT NOW(),
        status VARCHAR(50),
        observacoes TEXT,
        responsavel VARCHAR(200)
      );

      CREATE TABLE IF NOT EXISTS epis (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(200) NOT NULL,
        ca VARCHAR(50),
        validade DATE,
        categoria VARCHAR(100),
        foto TEXT,
        observacoes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS epi_entregas (
        id SERIAL PRIMARY KEY,
        epi_id INTEGER REFERENCES epis(id) ON DELETE CASCADE,
        colaborador_id INTEGER REFERENCES colaboradores(id),
        data TIMESTAMP DEFAULT NOW(),
        quantidade INTEGER DEFAULT 1,
        motivo VARCHAR(100),
        observacoes TEXT
      );

      CREATE TABLE IF NOT EXISTS epi_checklists (
        id SERIAL PRIMARY KEY,
        colaborador_id INTEGER REFERENCES colaboradores(id),
        data DATE,
        hora TIME,
        turno VARCHAR(50),
        status VARCHAR(50),
        epis_irregulares TEXT,
        obs TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS bh_lancamentos (
        id SERIAL PRIMARY KEY,
        colaborador_id INTEGER REFERENCES colaboradores(id),
        data DATE,
        horas NUMERIC(5,2),
        tipo VARCHAR(50),
        descricao TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS bh_convites (
        id SERIAL PRIMARY KEY,
        colaborador_id INTEGER REFERENCES colaboradores(id),
        data DATE,
        status VARCHAR(50),
        observacoes TEXT
      );

      CREATE TABLE IF NOT EXISTS bh_atrasos (
        id SERIAL PRIMARY KEY,
        colaborador_id INTEGER REFERENCES colaboradores(id),
        data DATE,
        minutos INTEGER,
        motivo TEXT
      );

      CREATE TABLE IF NOT EXISTS bh_eventos (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(200),
        data DATE,
        descricao TEXT
      );

      CREATE TABLE IF NOT EXISTS treinamentos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(200) NOT NULL,
        descricao TEXT,
        carga_horaria INTEGER,
        validade_meses INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS tr_registros (
        id SERIAL PRIMARY KEY,
        treinamento_id INTEGER REFERENCES treinamentos(id) ON DELETE CASCADE,
        data DATE,
        instrutor VARCHAR(200),
        local VARCHAR(200),
        observacoes TEXT
      );

      CREATE TABLE IF NOT EXISTS tr_presencas (
        id SERIAL PRIMARY KEY,
        registro_id INTEGER REFERENCES tr_registros(id) ON DELETE CASCADE,
        colaborador_id INTEGER REFERENCES colaboradores(id),
        presente BOOLEAN DEFAULT true
      );

      CREATE TABLE IF NOT EXISTS tr_agenda (
        id SERIAL PRIMARY KEY,
        treinamento_id INTEGER REFERENCES treinamentos(id),
        data DATE,
        observacoes TEXT
      );

      CREATE TABLE IF NOT EXISTS db_setores (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(200) NOT NULL,
        descricao TEXT
      );

      CREATE TABLE IF NOT EXISTS db_registros (
        id SERIAL PRIMARY KEY,
        setor_id INTEGER REFERENCES db_setores(id),
        data DATE,
        turno VARCHAR(50),
        responsavel VARCHAR(200),
        ocorrencias TEXT,
        fotos TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS db_resumos (
        id SERIAL PRIMARY KEY,
        mes VARCHAR(7),
        conteudo TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS cl_atividades (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(200) NOT NULL,
        descricao TEXT,
        frequencia VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS cl_execucoes (
        id SERIAL PRIMARY KEY,
        atividade_id INTEGER REFERENCES cl_atividades(id) ON DELETE CASCADE,
        data DATE,
        status VARCHAR(50),
        responsavel VARCHAR(200),
        observacoes TEXT
      );

      CREATE TABLE IF NOT EXISTS prod_planos (
        id SERIAL PRIMARY KEY,
        mes VARCHAR(7),
        produto VARCHAR(200),
        meta NUMERIC(12,2) DEFAULT 0,
        observacoes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS prod_apontamentos (
        id SERIAL PRIMARY KEY,
        plano_id INTEGER REFERENCES prod_planos(id) ON DELETE CASCADE,
        data DATE,
        quantidade NUMERIC(12,2),
        observacoes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS prod_produtos (
        id SERIAL PRIMARY KEY,
        cod_decio VARCHAR(50) UNIQUE NOT NULL,
        cod_intelbras VARCHAR(50),
        descricao VARCHAR(300),
        categoria VARCHAR(100),
        valor NUMERIC(12,2) DEFAULT 0,
        minutos_reportados NUMERIC(10,2) DEFAULT 0,
        hora_reportado NUMERIC(10,4) DEFAULT 0,
        ativo BOOLEAN DEFAULT true,
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

    // ============ AJUSTES EM TABELAS EXISTENTES ============
    await client.query(`
      ALTER TABLE prod_planos ADD COLUMN IF NOT EXISTS mes VARCHAR(7);
      ALTER TABLE prod_planos ADD COLUMN IF NOT EXISTS produto VARCHAR(300);
      ALTER TABLE prod_planos ADD COLUMN IF NOT EXISTS meta NUMERIC(12,2) DEFAULT 0;
      ALTER TABLE prod_planos ADD COLUMN IF NOT EXISTS observacoes TEXT;
      ALTER TABLE prod_planos ADD COLUMN IF NOT EXISTS cod_decio VARCHAR(50);
      ALTER TABLE prod_planos ADD COLUMN IF NOT EXISTS cod_intelbras VARCHAR(50);
      ALTER TABLE prod_planos ADD COLUMN IF NOT EXISTS descricao VARCHAR(300);
      ALTER TABLE prod_planos ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'em_andamento';
      ALTER TABLE prod_planos ADD COLUMN IF NOT EXISTS data_limite DATE;
      ALTER TABLE prod_planos ADD COLUMN IF NOT EXISTS realizado NUMERIC(12,2) DEFAULT 0;
      ALTER TABLE prod_planos ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
      ALTER TABLE prod_planos ADD COLUMN IF NOT EXISTS num_op VARCHAR(8);
    `);

    // Índice para acelerar busca por OP
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_prod_planos_num_op ON prod_planos(num_op);
    `);

    await client.query(`
      ALTER TABLE prod_produtos ADD COLUMN IF NOT EXISTS cod_intelbras VARCHAR(50);
      ALTER TABLE prod_produtos ADD COLUMN IF NOT EXISTS descricao VARCHAR(300);
      ALTER TABLE prod_produtos ADD COLUMN IF NOT EXISTS categoria VARCHAR(100);
      ALTER TABLE prod_produtos ADD COLUMN IF NOT EXISTS valor NUMERIC(12,2) DEFAULT 0;
      ALTER TABLE prod_produtos ADD COLUMN IF NOT EXISTS minutos_reportados NUMERIC(10,2) DEFAULT 0;
      ALTER TABLE prod_produtos ADD COLUMN IF NOT EXISTS hora_reportado NUMERIC(10,4) DEFAULT 0;
      ALTER TABLE prod_produtos ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;
    `);

    await client.query(`
      UPDATE prod_planos
      SET data_limite = (date_trunc('month', to_date(mes || '-01', 'YYYY-MM-DD')) + interval '1 month - 1 day')::date
      WHERE data_limite IS NULL AND mes IS NOT NULL;
    `);

    // ============ NOVA TABELA: APONTAMENTOS DETALHADOS ============
    await client.query(`
      CREATE TABLE IF NOT EXISTS prod_apontamentos_detalhados (
        id SERIAL PRIMARY KEY,
        data_execucao DATE NOT NULL,
        turno VARCHAR(10) NOT NULL,
        celula VARCHAR(50) NOT NULL,
        num_op VARCHAR(8) NOT NULL,
        serie_inicial VARCHAR(13) NOT NULL,
        serie_final VARCHAR(13) NOT NULL,
        cod_decio VARCHAR(50) NOT NULL,
        cod_intelbras VARCHAR(50),
        descricao VARCHAR(300),
        categoria VARCHAR(100),
        meta NUMERIC(12,2) DEFAULT 0,
        realizado NUMERIC(12,2) DEFAULT 0,
        hora_reportada_total NUMERIC(12,4) DEFAULT 0,
        observacoes TEXT,
        plano_id INTEGER REFERENCES prod_planos(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_apont_det_data ON prod_apontamentos_detalhados(data_execucao);
      CREATE INDEX IF NOT EXISTS idx_apont_det_decio ON prod_apontamentos_detalhados(cod_decio);
      CREATE INDEX IF NOT EXISTS idx_apont_det_op ON prod_apontamentos_detalhados(num_op);
      CREATE INDEX IF NOT EXISTS idx_apont_det_plano ON prod_apontamentos_detalhados(plano_id);
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
