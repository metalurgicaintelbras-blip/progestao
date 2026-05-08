require('dotenv').config();
const express = require('express');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const path = require('path');
const bcrypt = require('bcryptjs');
const { pool, initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ======================== MIDDLEWARES GLOBAIS ========================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(session({
  store: new PgSession({ pool, tableName: 'session' }),
  secret: process.env.SESSION_SECRET || 'progestao-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000, secure: false }
}));

// Servir arquivos estáticos SEM prefixo /public
app.use(express.static(path.join(__dirname, 'public')));

// ======================== MIDDLEWARE AUTH ========================

const { requireAuth } = require('./middleware/auth');

// ======================== IMPORTAR ROTAS API ========================

const authRoutes = require('./routes/auth');
const colaboradoresRoutes = require('./routes/colaboradores');
const ferramentasRoutes = require('./routes/ferramentas');
const episRoutes = require('./routes/epis');
const bancoHorasRoutes = require('./routes/banco-horas');
const treinamentosRoutes = require('./routes/treinamentos');
const diarioRoutes = require('./routes/diario');
const checklistRoutes = require('./routes/checklist');
const exportRoutes = require('./routes/export');

// ======================== REGISTRAR ROTAS API ========================

app.use('/api', authRoutes);
app.use('/api/colaboradores', colaboradoresRoutes);
app.use('/api/ferramentas', ferramentasRoutes);
app.use('/api/epis', episRoutes);
app.use('/api', bancoHorasRoutes);
app.use('/api', treinamentosRoutes);
app.use('/api', diarioRoutes);
app.use('/api', checklistRoutes);
app.use('/api/export', exportRoutes);

// ======================== PAGINA DE LOGIN ========================

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// ======================== ROTAS DAS PAGINAS ========================

const paginas = [
  'ferramentas', 'epis', 'banco-horas',
  'treinamentos', 'diario-bordo', 'checklist'
];

// Página principal
app.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Cada módulo serve sua própria página HTML
paginas.forEach(p => {
  app.get('/' + p, requireAuth, (req, res) => {
    const arquivo = path.join(__dirname, 'public', p + '.html');
    res.sendFile(arquivo);
  });
});

// ======================== FALLBACK ========================

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Rota nao encontrada' });
  }
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ======================== INICIALIZACAO ========================

async function start() {
  try {
    await initDB();

    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'ProGestao2026!';
    const existing = await pool.query('SELECT id FROM users WHERE username=$1', [adminUser]);

    if (existing.rows.length === 0) {
      const hash = await bcrypt.hash(adminPass, 10);
      await pool.query(
        'INSERT INTO users (username, password, nome, role) VALUES ($1,$2,$3,$4)',
        [adminUser, hash, 'Administrador', 'admin']
      );
      console.log('Usuario admin criado: ' + adminUser);
    }

    app.listen(PORT, () => {
      console.log('========================================');
      console.log('  ProGestao rodando na porta ' + PORT);
      console.log('========================================');
    });
  } catch (err) {
    console.error('Falha ao iniciar:', err);
    process.exit(1);
  }
}

start();
