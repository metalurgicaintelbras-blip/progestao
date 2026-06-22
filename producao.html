// ═══════════════════════════════════════════
// ProGestão — Módulo Diário de Bordo (Frontend)
// ═══════════════════════════════════════════

async function renderDiario(el) {
  const [regs, resumos, colabs] = await Promise.all([
    API.get('/api/db-registros'), API.get('/api/db-resumos'), API.get('/api/colaboradores')
  ]);
  CACHE.colaboradores = colabs || [];
  const pend = (regs||[]).filter(r=>r.status==='Pendente').length;

  el.innerHTML = `
    <div class="kpi-row" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr));margin-bottom:20px">
      <div class="kpi-card"><div class="kpi-icon">📓</div><div class="kpi-val">${(regs||[]).length}</div><div class="kpi-label">Total</div></div>
      <div class="kpi-card ${pend>0?'kc-d':'kc-s'}"><div class="kpi-icon">${pend>0?'⏳':'✅'}</div><div class="kpi-val">${pend}</div><div class="kpi-label">Pendências</div></div>
      <div class="kpi-card kc-i"><div class="kpi-icon">📄</div><div class="kpi-val">${(resumos||[]).length}</div><div class="kpi-label">Resumos</div></div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title"><span class="card-icon">✏️</span>Novo Registro</div></div>
      <div class="card-body"><div class="form-grid">
        <div class="form-group"><label class="form-label">Data *</label><input type="date" class="form-control" id="db-data" value="${hoje()}"></div>
        <div class="form-group"><label class="form-label">Hora</label><input type="time" class="form-control" id="db-hora" value="${agora()}"></div>
        <div class="form-group"><label class="form-label">Turno</label><select class="form-control" id="db-turno"><option>1º Turno</option><option>2º Turno</option></select></div>
        <div class="form-group"><label class="form-label">Categoria</label><select class="form-control" id="db-cat"><option>Ocorrência na Linha</option><option>Parada de Máquina</option><option>Problema de Qualidade</option><option>Acidente/Incidente</option><option>Decisão Tomada</option><option>Comunicado Recebido</option><option>Reclamação</option><option>Ação Corretiva</option><option>Observação Geral</option></select></div>
        <div class="form-group"><label class="form-label">Prioridade</label><select class="form-control" id="db-prior"><option>Baixa</option><option>Média</option><option>Alta</option><option>Crítica</option></select></div>
        <div class="form-group"><label class="form-label">Status</label><select class="form-control" id="db-status"><option>Resolvido</option><option>Pendente</option></select></div>
        <div class="form-group fg-full"><label class="form-label">Descrição *</label><textarea class="form-control" id="db-desc"></textarea></div>
        <div class="form-group fg-full"><label class="form-label">Ação Tomada</label><textarea class="form-control" id="db-acao" style="min-height:60px"></textarea></div>
      </div><div class="form-actions"><button class="btn btn-purple" onclick="salvarDbReg()">💾 Salvar</button></div></div>
    </div>

    <div class="card"><div class="card-header"><div class="card-title"><span class="card-icon">📋</span>Registros</div></div>
    <div class="tbl-wrap"><table><thead><tr><th>Data</th><th>Turno</th><th>Categoria</th><th>Prioridade</th><th>Status</th><th>Descrição</th><th>Ações</th></tr></thead><tbody id="db-body"></tbody></table></div></div>

    <div class="card"><div class="card-header"><div class="card-title"><span class="card-icon">📄</span>Resumos (${(resumos||[]).length})</div></div>
    <div class="tbl-wrap"><table><thead><tr><th>Data</th><th>Turno</th><th>Resumo</th><th>Ações</th></tr></thead><tbody id="db-res-body"></tbody></table></div></div>`;

  // Tabela registros
  const tb = document.getElementById('db-body');
  if (!(regs||[]).length) tb.innerHTML='<tr><td colspan="7" class="td-empty">Nenhum registro.</td></tr>';
  else tb.innerHTML = (regs||[]).slice(0,50).map(r=>`<tr>
    <td style="white-space:nowrap;font-size:12px">${fmtD(r.data)} ${r.hora||''}</td>
    <td>${r.turno||'—'}</td>
    <td><span class="badge b-purple">${r.categoria||'—'}</span></td>
    <td>${r.prioridade||'—'}</td>
    <td><span class="badge ${r.status==='Pendente'?'b-yellow':'b-green'}">${r.status}</span></td>
    <td style="max-width:250px;font-size:12px">${(r.descricao||'').slice(0,80)}${(r.descricao||'').length>80?'...':''}</td>
    <td>
      ${r.status==='Pendente'?`<button class="btn btn-success btn-xs" onclick="resolverDbReg(${r.id})">✅</button>`:''} 
      <button class="btn btn-ghost btn-xs" onclick="delDbReg(${r.id})">🗑️</button>
    </td>
  </tr>`).join('');

  // Tabela resumos
  const tbR = document.getElementById('db-res-body');
  if (!(resumos||[]).length) tbR.innerHTML='<tr><td colspan="4" class="td-empty">Nenhum resumo.</td></tr>';
  else tbR.innerHTML = (resumos||[]).map(r=>`<tr>
    <td style="font-size:12px;font-weight:600">${fmtD(r.data)}</td>
    <td><span class="badge b-purple">${r.turno||'—'}</span></td>
    <td style="font-size:12px;max-width:400px">${(r.texto||'').slice(0,120)}${(r.texto||'').length>120?'...':''}</td>
    <td><button class="btn btn-ghost btn-xs" onclick="delDbRes(${r.id})">🗑️</button></td>
  </tr>`).join('');
}

async function salvarDbReg() {
  const d = {
    data: document.getElementById('db-data').value,
    hora: document.getElementById('db-hora').value,
    turno: document.getElementById('db-turno').value,
    categoria: document.getElementById('db-cat').value,
    prioridade: document.getElementById('db-prior').value,
    status: document.getElementById('db-status').value,
    descricao: document.getElementById('db-desc').value.trim(),
    acao: document.getElementById('db-acao').value.trim()
  };
  if (!d.data || !d.descricao) { toast('Data e descrição obrigatórios','danger'); return; }
  await API.post('/api/db-registros', d); toast('Registro salvo!');
  goModule('diario');
}

async function resolverDbReg(id) {
  await API.put('/api/db-registros/'+id, { status:'Resolvido', data:hoje() });
  toast('Resolvido!');
  goModule('diario');
}

async function delDbReg(id) { if(!confirm('Excluir?'))return; await API.del('/api/db-registros/'+id); toast('Excluído','info'); goModule('diario'); }
async function delDbRes(id) { if(!confirm('Excluir?'))return; await API.del('/api/db-resumos/'+id); toast('Excluído','info'); goModule('diario'); }
