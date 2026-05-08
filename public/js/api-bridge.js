// ═══════════════════════════════════════════════════════
// API Bridge — Compatibilidade localStorage → PostgreSQL
// ═══════════════════════════════════════════════════════
// Este script sobrescreve o objeto DB usado pelas páginas
// para que os dados sejam salvos/lidos da API (PostgreSQL)
// em vez do localStorage do navegador.
// ═══════════════════════════════════════════════════════

// Cache local para evitar chamadas repetidas
const _cache = {};
let _cacheLoaded = false;

// Mapeamento de chaves localStorage → endpoints da API
const KEY_MAP = {
  // Colaboradores
  'pg_colaboradores': '/api/colaboradores',
  // Ferramentas
  'gp_ferramentas': '/api/ferramentas',
  'gp_emprestimos': '/api/ferramentas/emprestimos',
  'gp_manutencoes': '/api/ferramentas/manutencoes',
  'gp_checklist': null, // checklist fica local por enquanto
  'fr_ferramentas': '/api/ferramentas',
  'fr_emprestimos': '/api/ferramentas/emprestimos',
  // EPIs
  'ep_epis': '/api/epis',
  'ep_entregas': '/api/epis/entregas',
  'ep_checklists': '/api/epis/checklists',
  // Banco de Horas
  'bh_colaboradores': '/api/colaboradores',
  'bh_lancamentos': '/api/bh-lancamentos',
  'bh_convites': '/api/bh-convites',
  'bh_atrasos': '/api/bh-atrasos',
  'bh_eventos': '/api/bh-eventos',
  // Treinamentos
  'tr_treinamentos': '/api/treinamentos',
  'tr_registros': '/api/tr-registros',
  'tr_presencas': '/api/tr-presencas',
  'tr_agenda': '/api/tr-agenda',
  // Diário de Bordo
  'db_registros': '/api/db-registros',
  'db_resumos': '/api/db-resumos',
  // Checklist Atividades
  'cl_atividades': '/api/cl-atividades',
  'cl_execucoes': '/api/cl-execucoes'
};

// ══ Fetch helper com tratamento de 401 ══
async function _apiFetch(url, method, data) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (data) opts.body = JSON.stringify(data);
  try {
    const r = await fetch(url, opts);
    if (r.status === 401) { window.location.href = '/login'; return null; }
    if (!r.ok) { console.error('API error:', r.status, url); return null; }
    return r.json();
  } catch (e) {
    console.error('Fetch error:', e, url);
    return null;
  }
}

// ══ Pré-carregar todos os dados na inicialização ══
async function preloadAllData() {
  if (_cacheLoaded) return;
  const keys = Object.entries(KEY_MAP).filter(([k, v]) => v !== null);
  const promises = keys.map(async ([key, url]) => {
    try {
      const data = await _apiFetch(url, 'GET');
      _cache[key] = data || [];
    } catch (e) {
      _cache[key] = [];
    }
  });
  await Promise.all(promises);
  _cacheLoaded = true;
}

// ══ Objeto DB compatível — leitura síncrona do cache ══
// As páginas usam DB.g(key) e DB.s(key, value)
// g() lê do cache (síncrono), s() salva na API (assíncrono em background)

const DB_BRIDGE = {
  g: function(key) {
    if (_cache[key]) return JSON.parse(JSON.stringify(_cache[key]));
    // fallback localStorage para chaves não mapeadas
    return JSON.parse(localStorage.getItem(key) || '[]');
  },
  s: function(key, value) {
    // Atualizar cache local imediatamente
    _cache[key] = value;
    // Se não tem mapeamento API, usar localStorage
    const url = KEY_MAP[key];
    if (!url) {
      localStorage.setItem(key, JSON.stringify(value));
      return;
    }
    // Sync com API em background — envia o array completo
    _apiFetch(url + '/sync', 'POST', { data: value }).catch(e => {
      console.warn('Sync falhou para', key, '- dados mantidos no cache local');
    });
  },
  // Para objeto (usado no checklist de ferramentas)
  go: function(key) {
    if (_cache[key] && typeof _cache[key] === 'object' && !Array.isArray(_cache[key])) {
      return JSON.parse(JSON.stringify(_cache[key]));
    }
    return JSON.parse(localStorage.getItem(key) || '{}');
  },
  so: function(key, value) {
    _cache[key] = value;
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// ══ Verificar usuário logado ══
async function checkAuth() {
  const r = await _apiFetch('/api/me', 'GET');
  if (!r) { window.location.href = '/login'; return null; }
  return r;
}

// ══ Logout ══
async function doLogout() {
  await fetch('/api/logout', { method: 'POST' });
  window.location.href = '/login';
}

// ══ Inicialização — chamar antes do window.onload da página ══
async function bridgeInit() {
  const user = await checkAuth();
  if (!user) return false;
  await preloadAllData();
  return user;
}
