// ═══════════════════════════════════════════
// ProGestão — Núcleo do App
// ═══════════════════════════════════════════

const API = {
  async get(url) {
    const r = await fetch(url);
    if (r.status === 401) { window.location.href = '/login'; return []; }
    return r.json();
  },
  async post(url, data) {
    const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
    if (r.status === 401) { window.location.href = '/login'; return null; }
    return r.json();
  },
  async put(url, data) {
    const r = await fetch(url, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
    if (r.status === 401) { window.location.href = '/login'; return null; }
    return r.json();
  },
  async del(url) {
    const r = await fetch(url, { method:'DELETE' });
    if (r.status === 401) { window.location.href = '/login'; return null; }
    return r.json();
  }
};

// Cache global compartilhado entre módulos
let CACHE = {};

// ═══ HELPERS GLOBAIS ═══

const fmtD = d => {
  if (!d) return '—';
  const s = typeof d === 'string' ? d.slice(0,10) : d;
  const p = s.split('-');
  return p.length === 3 ? p[2]+'/'+p[1]+'/'+p[0] : s;
};
const fmtDT = d => d ? new Date(d).toLocaleString('pt-BR') : '—';
const inic = n => n ? n.split(' ').filter(Boolean).map(p=>p[0]).join('').toUpperCase().slice(0,2) : '?';
const minToHm = min => {
  const neg = min < 0; const a = Math.abs(min);
  return (neg?'-':'') + Math.floor(a/60) + 'h' + String(a%60).padStart(2,'0');
};
const hoje = () => new Date().toISOString().slice(0,10);
const agora = () => new Date().toTimeString().slice(0,5);
const stBadge = s => ({'Ativo':'b-green','Inativo':'b-gray','Férias':'b-yellow','Afastado':'b-blue'}[s]||'b-gray');

function toast(msg, type='success') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  const bg = type==='success' ? 'linear-gradient(135deg,#059669,#10b981)' :
             type==='danger' ? 'linear-gradient(135deg,#dc2626,#ef4444)' :
             'linear-gradient(135deg,#0284c7,#38bdf8)';
  t.style.cssText = `padding:12px 20px;border-radius:8px;font-size:13px;font-weight:600;color:#fff;animation:slideIn .3s ease;box-shadow:0 4px 24px rgba(0,0,0,.4);background:${bg}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

function colabSelect(colabs, id, selected) {
  return `<select class="form-control" id="${id}">
    <option value="">Selecione...</option>
    ${(colabs||[]).filter(c=>c.status==='Ativo'||!c.status).map(c=>
      `<option value="${c.id}" ${c.id==selected?'selected':''}>${c.nome}</option>`
    ).join('')}
  </select>`;
}

function updateClock() {
  const el = document.getElementById('clock');
  if (el) el.textContent = new Date().toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
}
setInterval(updateClock, 1000);

async function doLogout() {
  await fetch('/api/logout', { method:'POST' });
  window.location.href = '/login';
}

// ═══ NAVEGAÇÃO ═══

const TITLES = {
  home:'Painel', ferramentas:'Ferramentas', epis:'EPIs',
  'banco-horas':'Banco de Horas', treinamentos:'Treinamentos',
  diario:'Diário de Bordo', checklist:'Checklist',
  colaboradores:'Colaboradores', exportar:'Exportar Excel'
};

function goModule(mod, btnEl) {
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  else document.querySelector(`.nav-item[data-mod="${mod}"]`)?.classList.add('active');
  document.getElementById('page-title').textContent = TITLES[mod] || mod;
  document.getElementById('page-crumb').textContent = TITLES[mod] || mod;
  loadModule(mod);
}

async function loadModule(mod) {
  const el = document.getElementById('app-content');
  el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-3)"><div style="font-size:32px;margin-bottom:12px">⏳</div>Carregando...</div>';
  try {
    switch(mod) {
      case 'home':           await renderHome(el); break;
      case 'colaboradores':  await renderColaboradores(el); break;
      case 'ferramentas':    await renderFerramentas(el); break;
      case 'epis':           await renderEPIs(el); break;
      case 'banco-horas':    await renderBancoHoras(el); break;
      case 'treinamentos':   await renderTreinamentos(el); break;
      case 'diario':         await renderDiario(el); break;
      case 'checklist':      await renderChecklist(el); break;
      case 'exportar':       renderExportar(el); break;
      default: el.innerHTML = '<p style="color:var(--text-3);text-align:center;padding:40px">Módulo não encontrado</p>';
    }
  } catch(err) {
    el.innerHTML = `<div style="text-align:center;padding:40px;color:var(--danger)">Erro ao carregar: ${err.message}</div>`;
    console.error(err);
  }
}

// ═══ HOME ═══

async function renderHome(el) {
  const [colabs, ferrs, epis, lancs, treinos, dbRegs, clAtivs] = await Promise.all([
    API.get('/api/colaboradores'), API.get('/api/ferramentas'), API.get('/api/epis'),
    API.get('/api/bh-lancamentos'), API.get('/api/treinamentos'),
    API.get('/api/db-registros'), API.get('/api/cl-atividades')
  ]);
  CACHE.colaboradores = colabs || [];
  const dbPend = (dbRegs||[]).filter(r=>r.status==='Pendente').length;

  el.innerHTML = `
    <div class="kpi-row" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">
      <div class="kpi-card"><div class="kpi-icon">👷</div><div class="kpi-val">${(colabs||[]).length}</div><div class="kpi-label">Colaboradores</div></div>
      <div class="kpi-card kc-s"><div class="kpi-icon">🔧</div><div class="kpi-val">${(ferrs||[]).length}</div><div class="kpi-label">Ferramentas</div></div>
      <div class="kpi-card kc-i"><div class="kpi-icon">🦺</div><div class="kpi-val">${(epis||[]).length}</div><div class="kpi-label">EPIs</div></div>
      <div class="kpi-card kc-w"><div class="kpi-icon">⏱️</div><div class="kpi-val">${(lancs||[]).length}</div><div class="kpi-label">Lançam. BH</div></div>
      <div class="kpi-card"><div class="kpi-icon">📚</div><div class="kpi-val">${(treinos||[]).length}</div><div class="kpi-label">Treinamentos</div></div>
      <div class="kpi-card ${dbPend>0?'kc-d':''}"><div class="kpi-icon">📓</div><div class="kpi-val">${dbPend}</div><div class="kpi-label">Pend. Diário</div></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px">
      ${Object.entries({ferramentas:'🔧',epis:'🦺','banco-horas':'⏱️',treinamentos:'📚',diario:'📓',checklist:'☑️',colaboradores:'👷',exportar:'📊'}).map(([k,v])=>
        `<div class="card" style="cursor:pointer" onclick="goModule('${k}')">
          <div class="card-body" style="display:flex;align-items:center;gap:16px">
            <div style="font-size:32px">${v}</div>
            <div><div style="font-size:15px;font-weight:800">${TITLES[k]}</div><div style="font-size:12px;color:var(--text-3);margin-top:2px">Clique para acessar</div></div>
            <div style="margin-left:auto;font-size:18px;color:var(--purple-light)">→</div>
          </div>
        </div>`
      ).join('')}
    </div>`;
}

// ═══ COLABORADORES ═══

async function renderColaboradores(el) {
  CACHE.colaboradores = await API.get('/api/colaboradores') || [];

  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="card-icon">➕</span><span id="colab-form-title">Novo Colaborador</span></div>
        <button class="btn btn-ghost btn-sm" onclick="resetColabForm()">Limpar</button>
      </div>
      <div class="card-body">
        <input type="hidden" id="colab-edit-id">
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Nome *</label><input type="text" class="form-control" id="c-nome" placeholder="Nome completo"></div>
          <div class="form-group"><label class="form-label">Matrícula</label><input type="text" class="form-control" id="c-mat" placeholder="Matrícula"></div>
          <div class="form-group"><label class="form-label">Cargo</label><input type="text" class="form-control" id="c-cargo" placeholder="Cargo"></div>
          <div class="form-group"><label class="form-label">Setor</label><input type="text" class="form-control" id="c-setor" value="Montagem"></div>
          <div class="form-group"><label class="form-label">Turno</label><select class="form-control" id="c-turno"><option>1º Turno</option><option>2º Turno</option><option>Administrativo</option></select></div>
          <div class="form-group"><label class="form-label">Status</label><select class="form-control" id="c-status"><option>Ativo</option><option>Inativo</option><option>Férias</option><option>Afastado</option></select></div>
        </div>
        <div class="form-actions">
          <button class="btn btn-ghost" onclick="resetColabForm()">Cancelar</button>
          <button class="btn btn-purple" onclick="salvarColab()">💾 Salvar</button>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="card-icon">👥</span>Colaboradores (${CACHE.colaboradores.length})</div>
        <div class="search-wrap" style="max-width:260px"><span class="search-ico">🔍</span><input class="form-control" id="colab-busca" placeholder="Buscar..." oninput="filtrarColabs()"></div>
      </div>
      <div class="card-body"><div class="colab-grid" id="colab-grid"></div></div>
    </div>`;

  renderColabGrid();
}

function renderColabGrid() {
  const busca = (document.getElementById('colab-busca')?.value||'').toLowerCase();
  let cs = CACHE.colaboradores || [];
  if (busca) cs = cs.filter(c=>c.nome.toLowerCase().includes(busca)||(c.mat||'').includes(busca));
  const grid = document.getElementById('colab-grid');
  if (!cs.length) { grid.innerHTML='<div style="color:var(--text-3);font-style:italic;grid-column:1/-1">Nenhum colaborador.</div>'; return; }
  grid.innerHTML = cs.map(c=>`
    <div class="colab-card">
      <div class="colab-big-av">${inic(c.nome)}</div>
      <div class="colab-info" style="flex:1;min-width:0">
        <div class="cn">${c.nome}</div>
        <div class="cm">Mat: ${c.mat||'—'}</div>
        <div class="cc">${c.cargo||'Sem cargo'}${c.turno?' · '+c.turno:''}</div>
        <div style="margin-top:6px"><span class="badge ${stBadge(c.status)}">${c.status||'Ativo'}</span></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px">
        <button class="btn btn-ghost btn-xs" onclick="editColab(${c.id})">✏️</button>
        <button class="btn btn-ghost btn-xs" onclick="delColab(${c.id})">🗑️</button>
      </div>
    </div>`).join('');
}

function filtrarColabs() { renderColabGrid(); }

async function salvarColab() {
  const eid = document.getElementById('colab-edit-id').value;
  const d = {
    nome: document.getElementById('c-nome').value.trim(),
    mat: document.getElementById('c-mat').value.trim(),
    cargo: document.getElementById('c-cargo').value.trim(),
    setor: document.getElementById('c-setor').value.trim(),
    turno: document.getElementById('c-turno').value,
    status: document.getElementById('c-status').value
  };
  if (!d.nome) { toast('Informe o nome','danger'); return; }
  if (eid) { await API.put('/api/colaboradores/'+eid, d); toast('Atualizado!'); }
  else { await API.post('/api/colaboradores', d); toast('Cadastrado!'); }
  resetColabForm();
  CACHE.colaboradores = await API.get('/api/colaboradores');
  renderColabGrid();
}

function editColab(id) {
  const c = CACHE.colaboradores.find(x=>x.id===id); if (!c) return;
  document.getElementById('colab-edit-id').value = c.id;
  document.getElementById('c-nome').value = c.nome;
  document.getElementById('c-mat').value = c.mat || '';
  document.getElementById('c-cargo').value = c.cargo || '';
  document.getElementById('c-setor').value = c.setor || 'Montagem';
  document.getElementById('c-turno').value = c.turno || '1º Turno';
  document.getElementById('c-status').value = c.status || 'Ativo';
  document.getElementById('colab-form-title').textContent = 'Editar: ' + c.nome;
  window.scrollTo({top:0,behavior:'smooth'});
}

async function delColab(id) {
  if (!confirm('Excluir este colaborador?')) return;
  await API.del('/api/colaboradores/'+id);
  toast('Excluído','info');
  CACHE.colaboradores = await API.get('/api/colaboradores');
  renderColabGrid();
}

function resetColabForm() {
  document.getElementById('colab-edit-id').value = '';
  ['c-nome','c-mat','c-cargo'].forEach(i=>document.getElementById(i).value='');
  document.getElementById('c-setor').value = 'Montagem';
  document.getElementById('c-turno').value = '1º Turno';
  document.getElementById('c-status').value = 'Ativo';
  document.getElementById('colab-form-title').textContent = 'Novo Colaborador';
}

// ═══ EXPORTAR ═══

function renderExportar(el) {
  const mods = [
    {key:'colaboradores',icon:'👷',title:'Colaboradores',desc:'Lista completa'},
    {key:'ferramentas',icon:'🔧',title:'Ferramentas',desc:'Inventário'},
    {key:'emprestimos',icon:'🤝',title:'Empréstimos',desc:'Retiradas e devoluções'},
    {key:'manutencoes',icon:'🔩',title:'Manutenções',desc:'Corretivas e preventivas'},
    {key:'epis',icon:'🦺',title:'EPIs',desc:'EPIs cadastrados'},
    {key:'epi-entregas',icon:'📤',title:'Entregas EPIs',desc:'Com validade'},
    {key:'bh-lancamentos',icon:'⏱️',title:'Lançamentos BH',desc:'Banco de horas'},
    {key:'bh-convites',icon:'📩',title:'Convites BH',desc:'Convites para banco'},
    {key:'bh-atrasos',icon:'🐌',title:'Atrasos',desc:'Atrasos na linha'},
    {key:'treinamentos',icon:'📚',title:'Treinamentos',desc:'Treinamentos cadastrados'},
    {key:'tr-registros',icon:'📝',title:'Registros Trein.',desc:'Registros de capacitação'},
    {key:'diario',icon:'📓',title:'Diário de Bordo',desc:'Todos os registros'},
    {key:'db-resumos',icon:'📄',title:'Resumos Diário',desc:'Resumos diários'},
    {key:'cl-atividades',icon:'☑️',title:'Atividades Checklist',desc:'Atividades periódicas'},
    {key:'cl-execucoes',icon:'✅',title:'Execuções Checklist',desc:'Histórico de execuções'}
  ];
  el.innerHTML = `
    <div class="card"><div class="card-header"><div class="card-title"><span class="card-icon">📊</span>Exportar para Excel (.xlsx)</div></div>
    <div class="card-body"><p style="color:var(--text-3);margin-bottom:20px">Clique para baixar o arquivo Excel do módulo.</p>
    <div class="report-grid">${mods.map(m=>`
      <div class="report-card" onclick="window.location.href='/api/export/${m.key}'">
        <div class="rc-icon">${m.icon}</div><div class="rc-title">${m.title}</div><div class="rc-desc">${m.desc}</div>
        <button class="btn btn-purple btn-sm">⬇ Exportar</button>
      </div>`).join('')}</div></div></div>`;
}

// ═══ INIT ═══

async function init() {
  updateClock();
  try {
    const me = await API.get('/api/me');
    if (me && me.nome) document.getElementById('user-name').textContent = me.nome;
  } catch(e) { window.location.href = '/login'; return; }
  goModule('home');
}

window.onload = init;
