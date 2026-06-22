// ═══════════════════════════════════════════
// ProGestão — Módulo Treinamentos (Frontend)
// ═══════════════════════════════════════════

async function renderTreinamentos(el) {
  const [treinos, regs, colabs] = await Promise.all([
    API.get('/api/treinamentos'), API.get('/api/tr-registros'), API.get('/api/colaboradores')
  ]);
  CACHE.treinamentos = treinos || []; CACHE.trRegistros = regs || []; CACHE.colaboradores = colabs || [];

  el.innerHTML = `
    <div class="card">
      <div class="card-header"><div class="card-title"><span class="card-icon">📚</span>Treinamentos (${CACHE.treinamentos.length})</div>
        <button class="btn btn-purple btn-sm" onclick="document.getElementById('tr-form').style.display=document.getElementById('tr-form').style.display==='none'?'block':'none'">➕ Novo</button></div>
      <div id="tr-form" style="display:none;padding:20px;border-bottom:1px solid var(--border)"><div class="form-grid">
        <div class="form-group"><label class="form-label">Nome *</label><input type="text" class="form-control" id="tr-nome"></div>
        <div class="form-group"><label class="form-label">Categoria</label><select class="form-control" id="tr-cat"><option>NR</option><option>Integração</option><option>Interno</option><option>Externo</option><option>Reciclagem</option><option>Outro</option></select></div>
        <div class="form-group"><label class="form-label">Carga Horária (h)</label><input type="number" class="form-control" id="tr-ch" min="1"></div>
        <div class="form-group"><label class="form-label">Validade (meses)</label><input type="number" class="form-control" id="tr-val" min="0" placeholder="0 = sem"></div>
        <div class="form-group fg-full"><label class="form-label">Descrição</label><textarea class="form-control" id="tr-desc" style="min-height:60px"></textarea></div>
      </div><div class="form-actions"><button class="btn btn-ghost" onclick="document.getElementById('tr-form').style.display='none'">Cancelar</button><button class="btn btn-purple" onclick="salvarTreino()">💾 Salvar</button></div></div>
      <div class="tbl-wrap"><table><thead><tr><th>Nome</th><th>Categoria</th><th>CH</th><th>Validade</th><th>Registros</th><th>Ações</th></tr></thead><tbody id="tr-body"></tbody></table></div>
    </div>

    <!-- REGISTRO INDIVIDUAL -->
    <div class="card">
      <div class="card-header"><div class="card-title"><span class="card-icon">📝</span>Registrar Treinamento Individual</div></div>
      <div class="card-body"><div class="form-grid">
        <div class="form-group"><label class="form-label">Colaborador *</label>${colabSelect(colabs,'trr-colab')}</div>
        <div class="form-group"><label class="form-label">Treinamento *</label><select class="form-control" id="trr-treino"><option value="">Selecione...</option>${CACHE.treinamentos.map(t=>`<option value="${t.id}">${t.nome}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Data *</label><input type="date" class="form-control" id="trr-data" value="${hoje()}"></div>
        <div class="form-group"><label class="form-label">Validade</label><input type="date" class="form-control" id="trr-val"></div>
        <div class="form-group"><label class="form-label">Instrutor</label><input type="text" class="form-control" id="trr-inst"></div>
        <div class="form-group"><label class="form-label">Local</label><input type="text" class="form-control" id="trr-local"></div>
      </div><div class="form-actions"><button class="btn btn-purple" onclick="registrarTrReg()">💾 Registrar</button></div></div>
    </div>

    <!-- HISTORICO -->
    <div class="card"><div class="card-header"><div class="card-title"><span class="card-icon">📋</span>Registros (${CACHE.trRegistros.length})</div></div>
    <div class="tbl-wrap"><table><thead><tr><th>Data</th><th>Colaborador</th><th>Treinamento</th><th>Validade</th><th>Instrutor</th><th>Ações</th></tr></thead><tbody id="trr-body"></tbody></table></div></div>`;

  // Tabela treinamentos
  const catB = {'NR':'b-red','Integração':'b-blue','Interno':'b-purple','Externo':'b-yellow','Reciclagem':'b-green','Outro':'b-gray'};
  const tb = document.getElementById('tr-body');
  if (!CACHE.treinamentos.length) tb.innerHTML='<tr><td colspan="6" class="td-empty">Nenhum treinamento.</td></tr>';
  else tb.innerHTML = CACHE.treinamentos.map(t=>`<tr>
    <td class="td-hi">${t.nome}</td>
    <td><span class="badge ${catB[t.categoria]||'b-gray'}">${t.categoria||'—'}</span></td>
    <td>${t.carga_horaria||0}h</td>
    <td>${t.validade_meses ? t.validade_meses+' meses' : 'Sem'}</td>
    <td><span class="badge b-blue">${CACHE.trRegistros.filter(r=>r.treinamento_id===t.id).length}</span></td>
    <td><button class="btn btn-ghost btn-xs" onclick="delTreino(${t.id})">🗑️</button></td>
  </tr>`).join('');

  // Tabela registros
  const tbR = document.getElementById('trr-body');
  if (!CACHE.trRegistros.length) tbR.innerHTML='<tr><td colspan="6" class="td-empty">Nenhum registro.</td></tr>';
  else tbR.innerHTML = CACHE.trRegistros.map(r=>`<tr>
    <td style="font-size:12px">${fmtD(r.data)}</td>
    <td>${r.colab_nome}</td>
    <td>${r.treino_nome}</td>
    <td style="font-size:12px">${r.validade?fmtD(r.validade):'—'}</td>
    <td style="font-size:12px">${r.instrutor||'—'}</td>
    <td><button class="btn btn-ghost btn-xs" onclick="delTrReg(${r.id})">🗑️</button></td>
  </tr>`).join('');
}

async function salvarTreino() {
  const d = {
    nome: document.getElementById('tr-nome').value.trim(),
    categoria: document.getElementById('tr-cat').value,
    carga_horaria: parseInt(document.getElementById('tr-ch').value) || 0,
    validade_meses: parseInt(document.getElementById('tr-val').value) || 0,
    descricao: document.getElementById('tr-desc').value.trim()
  };
  if (!d.nome) { toast('Nome obrigatório','danger'); return; }
  await API.post('/api/treinamentos', d); toast('Cadastrado!');
  goModule('treinamentos');
}

async function delTreino(id) { if(!confirm('Excluir?'))return; await API.del('/api/treinamentos/'+id); toast('Excluído','info'); goModule('treinamentos'); }

async function registrarTrReg() {
  const d = {
    colaborador_id: document.getElementById('trr-colab').value,
    treinamento_id: document.getElementById('trr-treino').value,
    data: document.getElementById('trr-data').value,
    validade: document.getElementById('trr-val').value || null,
    instrutor: document.getElementById('trr-inst').value.trim(),
    local_treino: document.getElementById('trr-local').value.trim()
  };
  if (!d.colaborador_id || !d.treinamento_id || !d.data) { toast('Preencha os campos','danger'); return; }
  await API.post('/api/tr-registros', d); toast('Registro salvo!');
  goModule('treinamentos');
}

async function delTrReg(id) { if(!confirm('Excluir?'))return; await API.del('/api/tr-registros/'+id); toast('Excluído','info'); goModule('treinamentos'); }
