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

module.exports = { requireAuth, requireAdmin };
