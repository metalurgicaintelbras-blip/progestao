function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }

  // Se for requisição AJAX/API, retorna JSON
  if (
    req.xhr ||
    (req.headers.accept && req.headers.accept.includes('json')) ||
    req.path.startsWith('/api/')
  ) {
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
