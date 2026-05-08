// ═══════════════════════════════════════════
// ProGestão — Módulo Checklist (Frontend)
// ═══════════════════════════════════════════

async function renderChecklist(el) {
  const [ativs, execs] = await Promise.all([
    API.get('/api/cl-atividades'), API.get('/api/cl-execucoes')
  ]);
  CACHE.clAtividades = ativs || [];
  CACHE.clExecucoes = execs || [];

  const FREQ = {'diaria':'Diária','2dias':'A cada 2 dias','3dias':'A cada 3 dias','semanal':'Semanal','quinzenal':'Quinzenal','mensal':'Mensal'};

  // Calcular previstas hoje
  const hj = hoje();
  let prevHoje = 0, feitasHoje = 0;
  (ativs||[]).filter(a=>a.status==='Ativa').forEach(a => {
    if (ativPrevistaPara(a, hj)) {
      prevHoje++;
      if ((execs||[]).some(e => e.atividade_id === a.id && e.data && e.data.slice(0,10) === hj)) feitasHoje++;
    }
  });
  const pendHoje = prevHoje - feitasHoje;
  const pctHoje = prevHoje ? Math.round(feitasHoje/prevHoje*100) : 0;

  el.innerHTML = `
    <div class="kpi-row" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr));margin-bottom:20px">
      <div class="kpi-card"><div class="kpi-icon">📋</div><div class="kpi-val">${(ativs||[]).filter(a=>a.status==='Ativa').length}</div><div class="kpi-label">Atividades Ativas</div></div>
      <div class="kpi-card kc-i"><div class="kpi-icon">📅</div><div class="kpi-val">${prevHoje}</div><div class="kpi-label">Previstas Hoje</div></div>
      <div class="kpi-card kc-s"><div class="kpi-icon">✅</div><div class="kpi-val">${feitasHoje}</div><div class="kpi-label">Feitas Hoje</div></div>
      <div class="kpi-card ${pendHoje>0?'kc-w':'kc-s'}"><div class="kpi-icon">${pendHoje>0?'⏳':'🎉'}</div><div class="kpi-val">${pendHoje}</div><div class="kpi-label">Pendentes Hoje</div></div>
    </div>

    <!-- CADASTRO -->
    <div class="card">
      <div class="card-header"><div class="card-title"><span class="card-icon">☑️</span>Atividades</div>
        <button class="btn btn-purple btn-sm" onclick="document.getElementById('cl-form').style.display=document.getElementById('cl-form').style.display==='none'?'block':'none'">➕ Nova</button></div>
      <div id="cl-form" style="display:none;padding:20px;border-bottom:1px solid var(--border)"><div class="form-grid">
        <div class="form-group"><label class="form-label">Nome *</label><input type="text" class="form-control" id="cl-nome"></div>
        <div class="form-group"><label class="form-label">Frequência</label><select class="form-control" id="cl-freq"><option value="diaria">Diária</option><option value="2dias">A cada 2 dias</option><option value="3dias">A cada 3 dias</option><option value="semanal">Semanal</option><option value="quinzenal">Quinzenal</option><option value="mensal">Mensal</option></select></div>
        <div class="form-group"><label class="form-label">Início *</label><input type="date" class="form-control" id="cl-inicio" value="${hj}"></div>
        <div class="form-group fg-full"><label class="form-label">Descrição</label><textarea class="form-control" id="cl-desc" style="min-height:60px"></textarea></div>
      </div><div class="form-actions"><button class="btn btn-ghost" onclick="document.getElementById('cl-form').style.display='none'">Cancelar</button><button class="btn btn-purple" onclick="salvarAtiv()">💾 Salvar</button></div></div>
      <div class="tbl-wrap"><table><thead><tr><th>Atividade</th><th>Frequência</th><th>Início</th><th>Status</th><th>Execuções</th><th>Ações</th></tr></thead><tbody id="cl-body"></tbody></table></div>
    </div>

    <!-- CHECKLIST DO DIA -->
    <div class="card">
      <div class="card-header"><div class="card-title"><span class="card-icon">📅</span>Checklist de Hoje (${pctHoje}%)</div></div>
      <div class="card-body"><div id="cl-hoje"></div></div>
    </div>`;

  // Tabela atividades
  const tb = document.getElementById('cl-body');
  if (!CACHE.clAtividades.length) tb.innerHTML='<tr><td colspan="6" class="td-empty">Nenhuma atividade.</td></tr>';
  else tb.innerHTML = CACHE.clAtividades.map(a=>`<tr>
    <td class="td-hi">${a.nome}${a.descricao?`<div style="font-size:11px;color:var(--text-3);font-weight:400;margin-top:2px">${a.descricao.slice(0,60)}</div>`:''}</td>
    <td><span class="badge b-blue">${FREQ[a.freq]||a.freq}</span></td>
    <td style="font-size:12px">${fmtD(a.inicio)}</td>
    <td><span class="badge ${a.status==='Ativa'?'b-green':'b-gray'}">${a.status}</span></td>
    <td><span class="badge b-purple">${CACHE.clExecucoes.filter(e=>e.atividade_id===a.id).length}</span></td>
    <td><button class="btn btn-ghost btn-xs" onclick="delAtiv(${a.id})">🗑️</button></td>
  </tr>`).join('');

  // Checklist do dia
  const clHoje = document.getElementById('cl-hoje');
  const previstas = (ativs||[]).filter(a => a.status==='Ativa' && ativPrevistaPara(a, hj));
  if (!previstas.length) {
    clHoje.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-3)">Nenhuma atividade prevista para hoje.</div>';
  } else {
    clHoje.innerHTML = previstas.map(a => {
      const feita = (execs||[]).some(e => e.atividade_id === a.id && e.data && e.data.slice(0,10) === hj);
      const exec = feita ? (execs||[]).find(e => e.atividade_id === a.id && e.data && e.data.slice(0,10) === hj) : null;
      return `<div style="display:flex;align-items:center;gap:14px;padding:12px 16px;background:var(--bg-card-2);border:1px solid var(--border);border-radius:8px;margin-bottom:8px;${feita?'opacity:.5':''}">
        <div style="font-size:20px;cursor:pointer" onclick="${feita ? `desfazerExec(${a.id},'${hj}')` : `executarAtiv(${a.id},'${hj}')`}">${feita?'✅':'⬜'}</div>
        <div style="flex:1"><div style="font-size:14px;font-weight:700;${feita?'text-decoration:line-through;color:var(--text-3)':'color:var(--text-1)'}">${a.nome}</div>
          <div style="font-size:11px;color:var(--text-3)"><span class="badge b-blue" style="font-size:9px">${FREQ[a.freq]||a.freq}</span>${feita && exec ? ` · Feito às ${exec.hora||''}` : ''}</div>
        </div>
        ${feita ? `<button class="btn btn-ghost btn-xs" onclick="desfazerExec(${a.id},'${hj}')">↩ Desfazer</button>` : ''}
      </div>`;
    }).join('');
  }
}

// Verifica se atividade é prevista para uma data
function ativPrevistaPara(ativ, dataStr) {
  if (ativ.status === 'Inativa') return false;
  const inicio = new Date((ativ.inicio ? ativ.inicio.slice(0,10) : ativ.inicio) + 'T00:00:00');
  const alvo = new Date(dataStr + 'T00:00:00');
  if (alvo < inicio) return false;
  const diffDias = Math.round((alvo - inicio) / 86400000);
  const freq = ativ.freq;
  if (freq === 'diaria') return true;
  if (freq === '2dias') return diffDias % 2 === 0;
  if (freq === '3dias') return diffDias % 3 === 0;
  if (freq === 'semanal') return diffDias % 7 === 0;
  if (freq === 'quinzenal') return diffDias % 15 === 0;
  if (freq === 'mensal') return inicio.getDate() === alvo.getDate() && alvo >= inicio;
  return false;
}

async function salvarAtiv() {
  const d = {
    nome: document.getElementById('cl-nome').value.trim(),
    freq: document.getElementById('cl-freq').value,
    inicio: document.getElementById('cl-inicio').value,
    descricao: document.getElementById('cl-desc').value.trim()
  };
  if (!d.nome || !d.inicio) { toast('Nome e início obrigatórios','danger'); return; }
  await API.post('/api/cl-atividades', d); toast('Cadastrada!');
  goModule('checklist');
}

async function delAtiv(id) {
  if (!confirm('Excluir atividade e todas as execuções?')) return;
  await API.del('/api/cl-atividades/'+id); toast('Excluída','info');
  goModule('checklist');
}

async function executarAtiv(ativId, dataStr) {
  await API.post('/api/cl-execucoes', { atividade_id: ativId, data: dataStr, hora: agora() });
  toast('Atividade concluída!');
  goModule('checklist');
}

async function desfazerExec(ativId, dataStr) {
  await API.del(`/api/cl-execucoes/desfazer/${ativId}/${dataStr}`);
  toast('Execução desfeita','info');
  goModule('checklist');
}
