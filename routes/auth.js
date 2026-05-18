function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }

  // Se for requisição AJAX/API, retorna JSON
  if (
    req.xhr ||
    (req.headers.accept && req.headers.accept.includes('json')) ||
    req.path.startsWith('/api/')
  ) {const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario e senha obrigatorios' });
    }

    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario ou senha invalidos' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: 'Usuario ou senha invalidos' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;
    req.session.nome = user.nome;

    res.json({
      success: true,
      nome: user.nome,
      role: user.role
    });
  } catch (err) {
    console.error('Erro login:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// POST /api/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao encerrar sessao' });
    }
    res.json({ success: true });
  });
});

// GET /api/me — dados do usuario logado
router.get('/me', requireAuth, (req, res) => {
  res.json({
    userId: req.session.userId,
    username: req.session.username,
    nome: req.session.nome,
    role: req.session.role
  });
});

// POST /api/users — criar novo usuario (somente admin)
router.post('/users', requireAuth, async (req, res) => {
  try {
    if (req.session.role !== 'admin') {
      return res.status(403).json({ error: 'Apenas administradores podem criar usuarios' });
    }

    const { username, password, nome, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username e password obrigatorios' });
    }

    // Verificar se ja existe
    const existing = await pool.query('SELECT id FROM users WHERE username=$1', [username]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Username ja existe' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, nome, role) VALUES ($1,$2,$3,$4) RETURNING id, username, nome, role, created_at',
      [username, hash, nome || username, role || 'user']
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro criar usuario:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users — listar usuarios (somente admin)
router.get('/users', requireAuth, async (req, res) => {
  try {
    if (req.session.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const result = await pool.query(
      'SELECT id, username, nome, role, created_at FROM users ORDER BY nome'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/:id/password — alterar senha
router.put('/users/:id/password', requireAuth, async (req, res) => {
  try {
    const targetId = parseInt(req.params.id);

    // So pode alterar a propria senha ou se for admin
    if (req.session.userId !== targetId && req.session.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no minimo 6 caracteres' });
    }

    const hash = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password=$1 WHERE id=$2', [hash, targetId]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:id — excluir usuario (somente admin)
router.delete('/users/:id', requireAuth, async (req, res) => {
  try {
    if (req.session.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Nao pode excluir a si mesmo
    if (req.session.userId === parseInt(req.params.id)) {
      return res.status(400).json({ error: 'Nao pode excluir o proprio usuario' });
    }

    await pool.query('DELETE FROM users WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

    return res.status(401).json({ error: 'Nao autenticado' });
  }

  // Se for navegação normal, redireciona pro login
  res.redirect('/login');
}

function requireAdmin(req, res, next) {
  if (req.session && req.session.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
}

// 🆕 Bloqueia escrita para usuários "viewer" (somente leitura)
function blockViewerWrites(req, res, next) {
  // Libera métodos de leitura
  if (['GET', 'OPTIONS', 'HEAD'].includes(req.method)) {
    return next();
  }
  // Libera login/logout mesmo para viewer
  if (req.path === '/login' || req.path === '/logout') {
    return next();
  }
  // Bloqueia POST/PUT/DELETE/PATCH se o role for viewer
  if (req.session && req.session.role === 'viewer') {
    return res.status(403).json({ error: 'Usuário somente leitura. Operação não permitida.' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin, blockViewerWrites };
