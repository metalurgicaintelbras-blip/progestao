// ═══════════════════════════════════════════
// ProGestão — Módulo EPIs (Frontend)
// ═══════════════════════════════════════════

async function renderEPIs(el) {
  const [epis, entregas, colabs] = await Promise.all([
    API.get('/api/epis'), API.get('/api/epis/entregas/todos'), API.get('/api/colaboradores')
  ]);
  CACHE.epis = epis || []; CACHE.epiEntregas = entregas || []; CACHE.colaboradores = colabs || [];

  el.innerHTML = `
    <!-- CADASTRO EPI -->
    <div class="card">
      <div class="card-header"><div class="card-title"><span class="card-icon">🦺</span>EPIs (${CACHE.epis.length})</div>
        <button class="btn btn-purple btn-sm" onclick="document.getElementById('epi-form').style.display=document.getElementById('epi-form').style.display==='none'?'block':'none'">➕ Novo EPI</button></div>
      <div id="epi-form" style="display:none;padding:20px;border-bottom:1px solid var(--border)">
        <input type="hidden" id="epi-edit-id">
        <div class="form-grid">
          <div class="form-group"><label class="form-label">Nome *</label><input type="text" class="form-control" id="epi-nome"></div>
          <div class="form-group"><label class="form-label">Durabilidade</label>
            <div style="display:flex;gap:8px">
              <input type="number" class="form-control" id="epi-dur-qtd" placeholder="6" min="1" style="max-width:80px">
              <select class="form-control" id="epi-dur-tipo"><option value="">Sem prazo</option><option value="dias">Dias</option><option value="meses">Meses</option><option value="anos">Anos</option></select>
            </div></div>
          <div class="form-group fg-full"><label class="form-label">Descrição</label><textarea class="form-control" id="epi-desc" style="min-height:60px"></textarea></div>
        </div>
        <div class="form-actions"><button class="btn btn-ghost" onclick="document.getElementById('epi-form').style.display='none'">Cancelar</button>
          <button class="btn btn-purple" onclick="salvarEpi()">💾 Salvar</button></div>
      </div>
      <div class="tbl-wrap"><table><thead><tr><th>Nome</th><th>Durabilidade</th><th>Entregas</th><th>Ações</th></tr></thead><tbody id="epi-body"></tbody></table></div>
    </div>

    <!-- ENTREGA -->
    <div class="card">
      <div class="card-header"><div class="card-title"><span class="card-icon">📤</span>Registrar Entrega</div></div>
      <div class="card-body">
        <div class="form-grid">
          <div class="form-group"><label class="form-label">EPI *</label>
            <select class="form-control" id="ent-epi"><option value="">Selecione...</option>${CACHE.epis.map(e=>`<option value="${e.id}">${e.nome}</option>`).join('')}</select></div>
          <div class="form-group"><label class="form-label">Colaborador *</label>${colabSelect(colabs,'ent-colab')}</div>
          <div class="form-group"><label class="form-label">Quantidade</label><input type="number" class="form-control" id="ent-qtd" value="1" min="1"></div>
          <div class="form-group"><label class="form-label">Data Entrega *</label><input type="datetime-local" class="form-control" id="ent-dt"></div>
          <div class="form-group"><label class="form-label">Validade</label><input type="date" class="form-control" id="ent-val"></div>
          <div class="form-group"><label class="form-label">Motivo</label>
            <select class="form-control" id="ent-motivo"><option>Entrega Inicial</option><option>Substituição por Desgaste</option><option>Substituição por Perda</option><option>Vencimento</option><option>Novo Colaborador</option></select></div>
        </div>
        <div class="form-actions"><button class="btn btn-purple" onclick="registrarEntregaEpi()">📤 Registrar</button></div>
      </div>
    </div>

    <!-- HISTORICO -->
    <div class="card">
      <div class="card-header"><div class="card-title"><span class="card-icon">📋</span>Histórico de Entregas (${CACHE.epiEntregas.length})</div></div>
      <div class="tbl-wrap"><table><thead><tr><th>EPI</th><th>Colaborador</th><th>Qtd</th><th>Entrega</th><th>Validade</th><th>Motivo</th><th>Ações</th></tr></thead><tbody id="ent-body"></tbody></table></div>
    </div>`;

  const now = new Date();
  document.getElementById('ent-dt').value = new Date(now - now.getTimezoneOffset()*60000).toISOString().slice(0,16);
  renderEpiTable();
  renderEntTable();
}

function renderEpiTable() {
  const tb = document.getElementById('epi-body');
  if (!CACHE.epis.length) { tb.innerHTML='<tr><td colspan="4" class="td-empty">Nenhum EPI.</td></tr>'; return; }
  tb.innerHTML = CACHE.epis.map(e=>{
    const dur = e.dur_qtd && e.dur_tipo ? e.dur_qtd+' '+e.dur_tipo : '—';
    const nEnt = (CACHE.epiEntregas||[]).filter(x=>x.epi_id===e.id).length;
    return `<tr><td class="td-hi">${e.nome}</td><td>${dur}</td><td><span class="badge b-blue">${nEnt}</span></td>
    <td><button class="btn btn-ghost btn-xs" onclick="delEpi(${e.id})">🗑️</button></td></tr>`;
  }).join('');
}

function renderEntTable() {
  const tb = document.getElementById('ent-body');
  if (!CACHE.epiEntregas.length) { tb.innerHTML='<tr><td colspan="7" class="td-empty">Nenhuma entrega.</td></tr>'; return; }
  tb.innerHTML = CACHE.epiEntregas.map(e=>`<tr>
    <td class="td-hi">${e.epi_nome}</td>
    <td><div class="colab-cell"><div class="c-av">${inic(e.colab_nome)}</div><span class="c-name">${e.colab_nome}</span></div></td>
    <td style="text-align:center">${e.qtd}</td>
    <td style="font-size:12px">${fmtDT(e.dt)}</td>
    <td style="font-size:12px">${e.validade?fmtD(e.validade):'—'}</td>
    <td><span class="badge b-purple">${e.motivo||'—'}</span></td>
    <td><button class="btn btn-ghost btn-xs" onclick="delEntregaEpi(${e.id})">🗑️</button></td>
  </tr>`).join('');
}

async function salvarEpi() {
  const eid = document.getElementById('epi-edit-id').value;
  const d = {
    nome: document.getElementById('epi-nome').value.trim(),
    dur_qtd: parseInt(document.getElementById('epi-dur-qtd').value) || null,
    dur_tipo: document.getElementById('epi-dur-tipo').value || null,
    descricao: document.getElementById('epi-desc').value.trim()
  };
  if (!d.nome) { toast('Nome obrigatório','danger'); return; }
  if (eid) { await API.put('/api/epis/'+eid, d); toast('Atualizado!'); }
  else { await API.post('/api/epis', d); toast('Cadastrado!'); }
  document.getElementById('epi-form').style.display = 'none';
  CACHE.epis = await API.get('/api/epis');
  renderEpiTable();
}

async function delEpi(id) {
  if (!confirm('Excluir?')) return;
  await API.del('/api/epis/'+id); toast('Excluído','info');
  CACHE.epis = await API.get('/api/epis');
  CACHE.epiEntregas = await API.get('/api/epis/entregas/todos');
  renderEpiTable(); renderEntTable();
}

async function registrarEntregaEpi() {
  const d = {
    epi_id: document.getElementById('ent-epi').value,
    colaborador_id: document.getElementById('ent-colab').value,
    qtd: parseInt(document.getElementById('ent-qtd').value) || 1,
    dt: document.getElementById('ent-dt').value,
    validade: document.getElementById('ent-val').value || null,
    motivo: document.getElementById('ent-motivo').value
  };
  if (!d.epi_id || !d.colaborador_id || !d.dt) { toast('Preencha os campos','danger'); return; }
  await API.post('/api/epis/entregas', d); toast('Entrega registrada!');
  CACHE.epiEntregas = await API.get('/api/epis/entregas/todos');
  renderEntTable();
}

async function delEntregaEpi(id) {
  if (!confirm('Excluir?')) return;
  await API.del('/api/epis/entregas/'+id); toast('Excluída','info');
  CACHE.epiEntregas = await API.get('/api/epis/entregas/todos');
  renderEntTable();
}
