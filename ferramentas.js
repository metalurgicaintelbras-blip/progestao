// ═══════════════════════════════════════════
// ProGestão — Módulo Banco de Horas (Frontend)
// ═══════════════════════════════════════════

async function renderBancoHoras(el) {
  const [lancs, convites, atrasos, colabs] = await Promise.all([
    API.get('/api/bh-lancamentos'), API.get('/api/bh-convites'),
    API.get('/api/bh-atrasos'), API.get('/api/colaboradores')
  ]);
  CACHE.colaboradores = colabs || [];

  el.innerHTML = `
    <!-- LANCAMENTO -->
    <div class="card">
      <div class="card-header"><div class="card-title"><span class="card-icon">⏱️</span>Novo Lançamento</div></div>
      <div class="card-body"><div class="form-grid">
        <div class="form-group"><label class="form-label">Colaborador *</label>${colabSelect(colabs,'bh-colab')}</div>
        <div class="form-group"><label class="form-label">Tipo *</label><select class="form-control" id="bh-tipo"><option value="positivo">Positivo (Extra)</option><option value="negativo">Negativo (Débito)</option></select></div>
        <div class="form-group"><label class="form-label">Horas *</label><div style="display:flex;gap:8px"><input type="number" class="form-control" id="bh-hh" min="0" max="23" placeholder="H" style="max-width:70px"><span style="align-self:center;color:var(--text-3)">:</span><input type="number" class="form-control" id="bh-mm" min="0" max="59" placeholder="M" style="max-width:70px"></div></div>
        <div class="form-group"><label class="form-label">Data *</label><input type="date" class="form-control" id="bh-data" value="${hoje()}"></div>
        <div class="form-group"><label class="form-label">Motivo</label><select class="form-control" id="bh-motivo"><option>Hora Extra</option><option>Compensação</option><option>Falta</option><option>Atraso</option><option>Folga</option><option>Outro</option></select></div>
        <div class="form-group fg-full"><label class="form-label">Justificativa</label><textarea class="form-control" id="bh-just" style="min-height:60px"></textarea></div>
      </div><div class="form-actions"><button class="btn btn-purple" onclick="salvarLanc()">💾 Registrar</button></div></div>
    </div>

    <!-- TABELA LANCAMENTOS -->
    <div class="card"><div class="card-header"><div class="card-title"><span class="card-icon">📋</span>Lançamentos (${(lancs||[]).length})</div></div>
    <div class="tbl-wrap"><table><thead><tr><th>Colaborador</th><th>Tipo</th><th>Tempo</th><th>Data</th><th>Motivo</th><th>Justificativa</th><th>Ações</th></tr></thead><tbody id="bh-body"></tbody></table></div></div>

    <!-- CONVITES -->
    <div class="card"><div class="card-header"><div class="card-title"><span class="card-icon">📩</span>Convites (${(convites||[]).length})</div></div>
    <div class="tbl-wrap"><table><thead><tr><th>Colaborador</th><th>Data Convite</th><th>Data Proposta</th><th>Resposta</th><th>Obs</th><th>Ações</th></tr></thead><tbody id="bh-conv-body"></tbody></table></div></div>

    <!-- ATRASOS -->
    <div class="card"><div class="card-header"><div class="card-title"><span class="card-icon">🐌</span>Atrasos (${(atrasos||[]).length})</div></div>
    <div class="tbl-wrap"><table><thead><tr><th>Colaborador</th><th>Data</th><th>Ponto</th><th>Linha</th><th>Tempo</th><th>Motivo</th><th>Ações</th></tr></thead><tbody id="bh-atr-body"></tbody></table></div></div>`;

  // Renderizar tabelas
  const tbL = document.getElementById('bh-body');
  if (!(lancs||[]).length) tbL.innerHTML='<tr><td colspan="7" class="td-empty">Nenhum lançamento.</td></tr>';
  else tbL.innerHTML = (lancs||[]).map(l=>`<tr>
    <td><div class="colab-cell"><div class="c-av">${inic(l.colab_nome)}</div><span class="c-name">${l.colab_nome}</span></div></td>
    <td><span class="badge ${l.tipo==='positivo'?'b-green':'b-red'}">${l.tipo}</span></td>
    <td style="font-weight:800">${minToHm(l.minutos)}</td>
    <td style="font-size:12px">${fmtD(l.data)}</td>
    <td><span class="badge b-purple">${l.motivo||'—'}</span></td>
    <td style="font-size:12px;color:var(--text-3);max-width:200px">${l.justificativa||'—'}</td>
    <td><button class="btn btn-ghost btn-xs" onclick="delBhLanc(${l.id})">🗑️</button></td>
  </tr>`).join('');

  const tbC = document.getElementById('bh-conv-body');
  if (!(convites||[]).length) tbC.innerHTML='<tr><td colspan="6" class="td-empty">Nenhum convite.</td></tr>';
  else tbC.innerHTML = (convites||[]).map(c=>{
    const rBadge = {'Pendente':'b-yellow','Aceitou':'b-green','Recusou':'b-red','Não Respondeu':'b-orange'};
    return `<tr>
      <td><div class="colab-cell"><div class="c-av">${inic(c.colab_nome)}</div><span class="c-name">${c.colab_nome}</span></div></td>
      <td style="font-size:12px">${fmtD(c.data)}</td>
      <td style="font-size:12px">${fmtD(c.data_banco)}</td>
      <td><span class="badge ${rBadge[c.resposta]||'b-gray'}">${c.resposta}</span></td>
      <td style="font-size:12px;color:var(--text-3)">${c.obs||'—'}</td>
      <td><button class="btn btn-ghost btn-xs" onclick="delBhConv(${c.id})">🗑️</button></td>
    </tr>`;
  }).join('');

  const tbA = document.getElementById('bh-atr-body');
  if (!(atrasos||[]).length) tbA.innerHTML='<tr><td colspan="7" class="td-empty">Nenhum atraso.</td></tr>';
  else tbA.innerHTML = (atrasos||[]).map(a=>`<tr>
    <td><div class="colab-cell"><div class="c-av">${inic(a.colab_nome)}</div><span class="c-name">${a.colab_nome}</span></div></td>
    <td style="font-size:12px">${fmtD(a.data)}</td>
    <td style="text-align:center">${a.ponto}</td>
    <td style="text-align:center;color:#f87171">${a.linha}</td>
    <td style="text-align:center"><span class="badge b-red">${minToHm(a.diff||0)}</span></td>
    <td><span class="badge b-orange">${a.motivo||'—'}</span></td>
    <td><button class="btn btn-ghost btn-xs" onclick="delBhAtr(${a.id})">🗑️</button></td>
  </tr>`).join('');
}

async function salvarLanc() {
  const min = (parseInt(document.getElementById('bh-hh').value)||0)*60 + (parseInt(document.getElementById('bh-mm').value)||0);
  const d = {
    colaborador_id: document.getElementById('bh-colab').value,
    tipo: document.getElementById('bh-tipo').value,
    minutos: min,
    data: document.getElementById('bh-data').value,
    motivo: document.getElementById('bh-motivo').value,
    justificativa: document.getElementById('bh-just').value.trim()
  };
  if (!d.colaborador_id || !d.data || min <= 0) { toast('Preencha corretamente','danger'); return; }
  await API.post('/api/bh-lancamentos', d);
  toast('Lançamento registrado!');
  goModule('banco-horas');
}

async function delBhLanc(id) { if(!confirm('Excluir?'))return; await API.del('/api/bh-lancamentos/'+id); toast('Excluído','info'); goModule('banco-horas'); }
async function delBhConv(id) { if(!confirm('Excluir?'))return; await API.del('/api/bh-convites/'+id); toast('Excluído','info'); goModule('banco-horas'); }
async function delBhAtr(id) { if(!confirm('Excluir?'))return; await API.del('/api/bh-atrasos/'+id); toast('Excluído','info'); goModule('banco-horas'); }
