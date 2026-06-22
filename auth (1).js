// ═══════════════════════════════════════════
// ProGestão — Módulo Ferramentas (Frontend)
// ═══════════════════════════════════════════

async function renderFerramentas(el) {
  const [ferrs, colabs, emps, mans] = await Promise.all([
    API.get('/api/ferramentas'),
    API.get('/api/colaboradores'),
    API.get('/api/ferramentas/emprestimos/todos'),
    API.get('/api/ferramentas/manutencoes/todos')
  ]);
  CACHE.ferramentas = ferrs || [];
  CACHE.colaboradores = colabs || [];
  CACHE.emprestimos = emps || [];
  CACHE.manutencoes = mans || [];

  const disp = (ferrs||[]).filter(f=>f.status==='Disponível').length;
  const uso = (ferrs||[]).filter(f=>f.status==='Em Uso').length;
  const manut = (ferrs||[]).filter(f=>f.status==='Manutenção').length;

  el.innerHTML = `
    <div class="kpi-row" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr));margin-bottom:20px">
      <div class="kpi-card"><div class="kpi-icon">🔧</div><div class="kpi-val">${(ferrs||[]).length}</div><div class="kpi-label">Total</div></div>
      <div class="kpi-card kc-s"><div class="kpi-icon">✅</div><div class="kpi-val">${disp}</div><div class="kpi-label">Disponíveis</div></div>
      <div class="kpi-card kc-i"><div class="kpi-icon">📤</div><div class="kpi-val">${uso}</div><div class="kpi-label">Em Uso</div></div>
      <div class="kpi-card kc-w"><div class="kpi-icon">🔩</div><div class="kpi-val">${manut}</div><div class="kpi-label">Manutenção</div></div>
    </div>

    <!-- CADASTRO -->
    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="card-icon">🔧</span><span id="ferr-form-title">Nova Ferramenta</span></div>
        <button class="btn btn-purple btn-sm" onclick="toggleFerrForm()">➕ Nova Ferramenta</button>
      </div>
      <div id="ferr-form" style="display:none;padding:20px;border-bottom:1px solid var(--border)">
        <input type="hidden" id="ferr-edit-id">
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Nome *</label><input type="text" class="form-control" id="f-nome"></div>
          <div class="form-group"><label class="form-label">Código *</label><input type="text" class="form-control" id="f-cod"></div>
          <div class="form-group"><label class="form-label">Categoria</label><select class="form-control" id="f-cat"><option>Elétrica</option><option>Manual</option><option>Medição e Precisão</option><option>Corte</option><option>Fixação</option><option>Pneumática</option><option>Outro</option></select></div>
          <div class="form-group"><label class="form-label">Localização</label><input type="text" class="form-control" id="f-loc"></div>
          <div class="form-group"><label class="form-label">Status</label><select class="form-control" id="f-sta"><option>Disponível</option><option>Em Uso</option><option>Manutenção</option><option>Inativo</option></select></div>
          <div class="form-group"><label class="form-label">Calibração</label><input type="date" class="form-control" id="f-cal"></div>
          <div class="form-group"><label class="form-label">Preventiva</label><input type="date" class="form-control" id="f-prev"></div>
          <div class="form-group fg-full"><label class="form-label">Observação</label><textarea class="form-control" id="f-obs" style="min-height:60px"></textarea></div>
        </div>
        <div class="form-actions">
          <button class="btn btn-ghost" onclick="toggleFerrForm()">Cancelar</button>
          <button class="btn btn-purple" onclick="salvarFerr()">💾 Salvar</button>
        </div>
      </div>
      <div class="tbl-wrap"><table><thead><tr>
        <th>Código</th><th>Nome</th><th>Categoria</th><th>Local</th><th>Status</th><th>Calibração</th><th>Preventiva</th><th>Ações</th>
      </tr></thead><tbody id="ferr-body"></tbody></table></div>
    </div>

    <!-- EMPRESTIMOS -->
    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="card-icon">📤</span>Registrar Retirada</div>
        <button class="btn btn-purple btn-sm" onclick="toggleEmpForm()">📤 Nova Retirada</button>
      </div>
      <div id="emp-form" style="display:none;padding:20px;border-bottom:1px solid var(--border)">
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Ferramenta *</label>
            <select class="form-control" id="emp-ferr"><option value="">Selecione...</option>${
              (ferrs||[]).filter(f=>f.status==='Disponível').map(f=>`<option value="${f.id}">${f.nome} (${f.cod})</option>`).join('')
            }</select></div>
          <div class="form-group"><label class="form-label">Colaborador *</label>${colabSelect(colabs,'emp-colab')}</div>
          <div class="form-group"><label class="form-label">Data/Hora *</label><input type="datetime-local" class="form-control" id="emp-dt"></div>
          <div class="form-group"><label class="form-label">Observação</label><input type="text" class="form-control" id="emp-obs" placeholder="Ex: Uso na linha 3"></div>
        </div>
        <div class="form-actions"><button class="btn btn-ghost" onclick="toggleEmpForm()">Cancelar</button><button class="btn btn-purple" onclick="registrarEmp()">📤 Registrar</button></div>
      </div>
      <div class="tbl-wrap"><table><thead><tr>
        <th>Ferramenta</th><th>Colaborador</th><th>Retirada</th><th>Devolução</th><th>Status</th><th>Ações</th>
      </tr></thead><tbody id="emp-body"></tbody></table></div>
    </div>

    <!-- MANUTENCOES -->
    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="card-icon">🔩</span>Manutenções</div>
        <button class="btn btn-purple btn-sm" onclick="toggleManForm()">🔩 Nova Manutenção</button>
      </div>
      <div id="man-form" style="display:none;padding:20px;border-bottom:1px solid var(--border)">
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Ferramenta *</label>
            <select class="form-control" id="man-ferr"><option value="">Selecione...</option>${
              (ferrs||[]).map(f=>`<option value="${f.id}">${f.nome} (${f.cod})</option>`).join('')
            }</select></div>
          <div class="form-group"><label class="form-label">Tipo *</label><select class="form-control" id="man-tipo"><option>Corretiva</option><option>Preventiva</option><option>Calibração</option></select></div>
          <div class="form-group"><label class="form-label">Responsável</label>${colabSelect(colabs,'man-resp')}</div>
          <div class="form-group"><label class="form-label">Data Envio *</label><input type="date" class="form-control" id="man-env" value="${hoje()}"></div>
          <div class="form-group"><label class="form-label">Data Retorno</label><input type="date" class="form-control" id="man-ret"></div>
          <div class="form-group fg-full"><label class="form-label">Descrição *</label><textarea class="form-control" id="man-desc"></textarea></div>
        </div>
        <div class="form-actions"><button class="btn btn-ghost" onclick="toggleManForm()">Cancelar</button><button class="btn btn-purple" onclick="registrarMan()">🔩 Registrar</button></div>
      </div>
      <div class="tbl-wrap"><table><thead><tr>
        <th>Ferramenta</th><th>Tipo</th><th>Responsável</th><th>Envio</th><th>Retorno</th><th>Descrição</th><th>Ações</th>
      </tr></thead><tbody id="man-body"></tbody></table></div>
    </div>`;

  // Setar data atual no empréstimo
  const now = new Date();
  document.getElementById('emp-dt').value = new Date(now - now.getTimezoneOffset()*60000).toISOString().slice(0,16);

  renderFerrTable();
  renderEmpTable();
  renderManTable();
}

function toggleFerrForm() {
  const f = document.getElementById('ferr-form');
  f.style.display = f.style.display === 'none' ? 'block' : 'none';
}
function toggleEmpForm() {
  const f = document.getElementById('emp-form');
  f.style.display = f.style.display === 'none' ? 'block' : 'none';
}
function toggleManForm() {
  const f = document.getElementById('man-form');
  f.style.display = f.style.display === 'none' ? 'block' : 'none';
}

// ── Tabela Ferramentas ──
function renderFerrTable() {
  const stMap = {'Disponível':'b-green','Em Uso':'b-blue','Manutenção':'b-yellow','Inativo':'b-gray'};
  const tb = document.getElementById('ferr-body');
  const fs = CACHE.ferramentas || [];
  if (!fs.length) { tb.innerHTML='<tr><td colspan="8" class="td-empty">Nenhuma ferramenta.</td></tr>'; return; }
  tb.innerHTML = fs.map(f=>`<tr>
    <td><span class="td-code">${f.cod}</span></td>
    <td class="td-hi">${f.nome}</td>
    <td style="font-size:12px">${f.cat||'—'}</td>
    <td style="font-size:12px">${f.loc||'—'}</td>
    <td><span class="badge ${stMap[f.status]||'b-gray'}">${f.status}</span></td>
    <td style="font-size:12px">${f.cal?fmtD(f.cal):'—'}</td>
    <td style="font-size:12px">${f.prev?fmtD(f.prev):'—'}</td>
    <td>
      <button class="btn btn-ghost btn-xs" onclick="editFerr(${f.id})">✏️</button>
      <button class="btn btn-ghost btn-xs" onclick="delFerr(${f.id})">🗑️</button>
    </td>
  </tr>`).join('');
}

async function salvarFerr() {
  const eid = document.getElementById('ferr-edit-id').value;
  const d = {
    nome: document.getElementById('f-nome').value.trim(),
    cod: document.getElementById('f-cod').value.trim(),
    cat: document.getElementById('f-cat').value,
    loc: document.getElementById('f-loc').value.trim(),
    status: document.getElementById('f-sta').value,
    cal: document.getElementById('f-cal').value || null,
    prev: document.getElementById('f-prev').value || null,
    obs: document.getElementById('f-obs').value.trim()
  };
  if (!d.nome || !d.cod) { toast('Nome e código obrigatórios','danger'); return; }
  if (eid) { await API.put('/api/ferramentas/'+eid, d); toast('Atualizada!'); }
  else { await API.post('/api/ferramentas', d); toast('Cadastrada!'); }
  document.getElementById('ferr-form').style.display = 'none';
  document.getElementById('ferr-edit-id').value = '';
  CACHE.ferramentas = await API.get('/api/ferramentas');
  renderFerrTable();
}

function editFerr(id) {
  const f = CACHE.ferramentas.find(x=>x.id===id); if (!f) return;
  document.getElementById('ferr-edit-id').value = f.id;
  document.getElementById('f-nome').value = f.nome;
  document.getElementById('f-cod').value = f.cod;
  document.getElementById('f-cat').value = f.cat || 'Manual';
  document.getElementById('f-loc').value = f.loc || '';
  document.getElementById('f-sta').value = f.status || 'Disponível';
  document.getElementById('f-cal').value = f.cal ? f.cal.slice(0,10) : '';
  document.getElementById('f-prev').value = f.prev ? f.prev.slice(0,10) : '';
  document.getElementById('f-obs').value = f.obs || '';
  document.getElementById('ferr-form-title').textContent = 'Editar: ' + f.nome;
  document.getElementById('ferr-form').style.display = 'block';
  window.scrollTo({top:0,behavior:'smooth'});
}

async function delFerr(id) {
  if (!confirm('Excluir esta ferramenta?')) return;
  await API.del('/api/ferramentas/'+id);
  toast('Excluída','info');
  CACHE.ferramentas = await API.get('/api/ferramentas');
  renderFerrTable();
}

// ── Tabela Empréstimos ──
function renderEmpTable() {
  const tb = document.getElementById('emp-body');
  const es = CACHE.emprestimos || [];
  if (!es.length) { tb.innerHTML='<tr><td colspan="6" class="td-empty">Nenhum empréstimo.</td></tr>'; return; }
  tb.innerHTML = es.map(e=>`<tr>
    <td class="td-hi">${e.ferr_nome} <span class="td-code" style="font-size:10px">${e.ferr_cod}</span></td>
    <td><div class="colab-cell"><div class="c-av">${inic(e.colab_nome)}</div><span class="c-name">${e.colab_nome}</span></div></td>
    <td style="font-size:12px">${fmtDT(e.dt)}</td>
    <td style="font-size:12px">${e.devolvido ? fmtDT(e.dev_dt) : '<span class="badge b-yellow">Pendente</span>'}</td>
    <td><span class="badge ${e.devolvido?'b-green':'b-yellow'}">${e.devolvido?'Devolvido':'Em uso'}</span></td>
    <td>${!e.devolvido ? `<button class="btn btn-success btn-xs" onclick="devolverEmp(${e.id})">↩ Devolver</button>` : ''}
      <button class="btn btn-ghost btn-xs" onclick="delEmp(${e.id})">🗑️</button>
    </td>
  </tr>`).join('');
}

async function registrarEmp() {
  const d = {
    ferramenta_id: document.getElementById('emp-ferr').value,
    colaborador_id: document.getElementById('emp-colab').value,
    dt: document.getElementById('emp-dt').value,
    obs: document.getElementById('emp-obs').value.trim()
  };
  if (!d.ferramenta_id || !d.colaborador_id || !d.dt) { toast('Preencha os campos','danger'); return; }
  await API.post('/api/ferramentas/emprestimos', d);
  toast('Retirada registrada!');
  document.getElementById('emp-form').style.display = 'none';
  goModule('ferramentas');
}

async function devolverEmp(id) {
  if (!confirm('Confirmar devolução?')) return;
  const now = new Date();
  const dt = new Date(now - now.getTimezoneOffset()*60000).toISOString().slice(0,19);
  await API.put('/api/ferramentas/emprestimos/'+id+'/devolver', { dev_dt: dt });
  toast('Devolvido!');
  goModule('ferramentas');
}

async function delEmp(id) {
  if (!confirm('Excluir?')) return;
  await API.del('/api/ferramentas/emprestimos/'+id);
  toast('Excluído','info');
  CACHE.emprestimos = await API.get('/api/ferramentas/emprestimos/todos');
  renderEmpTable();
}

// ── Tabela Manutenções ──
function renderManTable() {
  const tb = document.getElementById('man-body');
  const ms = CACHE.manutencoes || [];
  if (!ms.length) { tb.innerHTML='<tr><td colspan="7" class="td-empty">Nenhuma manutenção.</td></tr>'; return; }
  tb.innerHTML = ms.map(m=>`<tr>
    <td class="td-hi">${m.ferr_nome} <span class="td-code" style="font-size:10px">${m.ferr_cod}</span></td>
    <td><span class="badge b-purple">${m.tipo}</span></td>
    <td>${m.resp_nome || '—'}</td>
    <td style="font-size:12px">${fmtD(m.env)}</td>
    <td style="font-size:12px">${m.ret ? fmtD(m.ret) : '<span class="badge b-yellow">Em andamento</span>'}</td>
    <td style="font-size:12px;max-width:200px">${(m.descricao||'').slice(0,80)}</td>
    <td><button class="btn btn-ghost btn-xs" onclick="delMan(${m.id})">🗑️</button></td>
  </tr>`).join('');
}

async function registrarMan() {
  const d = {
    ferramenta_id: document.getElementById('man-ferr').value,
    tipo: document.getElementById('man-tipo').value,
    responsavel_id: document.getElementById('man-resp').value || null,
    env: document.getElementById('man-env').value,
    ret: document.getElementById('man-ret').value || null,
    descricao: document.getElementById('man-desc').value.trim()
  };
  if (!d.ferramenta_id || !d.env || !d.descricao) { toast('Preencha os campos obrigatórios','danger'); return; }
  await API.post('/api/ferramentas/manutencoes', d);
  toast('Manutenção registrada!');
  document.getElementById('man-form').style.display = 'none';
  goModule('ferramentas');
}

async function delMan(id) {
  if (!confirm('Excluir?')) return;
  await API.del('/api/ferramentas/manutencoes/'+id);
  toast('Excluída','info');
  CACHE.manutencoes = await API.get('/api/ferramentas/manutencoes/todos');
  renderManTable();
}
