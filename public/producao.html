<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ProGestão – Produção</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<style>
:root{--bg:#0f172a;--card:#1e293b;--card2:#334155;--accent:#3b82f6;--accent2:#8b5cf6;--green:#22c55e;--yellow:#eab308;--red:#ef4444;--orange:#f97316;--pink:#f43f5e;--text:#f1f5f9;--text2:#94a3b8;--border:#475569;--radius:12px}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
.topbar{display:flex;justify-content:space-between;align-items:center;padding:12px 24px;background:#0b1120;border-bottom:1px solid var(--border)}
.topbar .logo{font-size:15px;font-weight:700;color:var(--text)}.topbar .logo a{color:var(--accent);text-decoration:none}
.topbar .right{display:flex;align-items:center;gap:14px;font-size:12px;color:var(--text2)}
.btn-sm{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;border:none;font-family:inherit;transition:.2s}
.btn-danger{background:var(--red);color:#fff}.btn-danger:hover{background:#dc2626}
.btn-accent{background:var(--accent);color:#fff}.btn-accent:hover{background:#2563eb}
.btn-ghost{background:transparent;border:1px solid var(--border);color:var(--text2)}.btn-ghost:hover{background:var(--card2);color:var(--text)}
.btn-green{background:var(--green);color:#fff}.btn-green:hover{background:#16a34a}
.layout{display:flex;min-height:calc(100vh - 49px)}
.sidebar{width:220px;background:#0b1120;border-right:1px solid var(--border);padding:16px 0;flex-shrink:0}
.sidebar a{display:flex;align-items:center;gap:10px;padding:10px 20px;color:var(--text2);text-decoration:none;font-size:13px;font-weight:600;transition:.2s;border-left:3px solid transparent}
.sidebar a:hover,.sidebar a.active{background:rgba(59,130,246,.08);color:var(--accent);border-left-color:var(--accent)}
.main{flex:1;padding:24px;overflow-y:auto}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:24px}
.kpi{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:18px;text-align:center}
.kpi-val{font-size:28px;font-weight:800;letter-spacing:-1px}.kpi-lab{font-size:11px;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;margin-top:4px}
.tabs{display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap}
.tab{padding:8px 18px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;border:1px solid var(--border);background:transparent;color:var(--text2);transition:.2s;font-family:inherit}
.tab:hover{background:var(--card2);color:var(--text)}
.tab.active{background:var(--accent);color:#fff;border-color:var(--accent)}
.section{display:none}.section.show{display:block}
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:16px}
.card-title{font-size:16px;font-weight:800;margin-bottom:14px;display:flex;align-items:center;gap:8px}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;padding:10px 12px;border-bottom:2px solid var(--border);color:var(--text2);font-size:11px;text-transform:uppercase;letter-spacing:.5px}
td{padding:10px 12px;border-bottom:1px solid rgba(71,85,105,.3)}
tr:hover td{background:rgba(59,130,246,.04)}
.form-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-bottom:14px}
.fg{display:flex;flex-direction:column;gap:4px}
.fg label{font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.5px}
.fg input,.fg select,.fg textarea{padding:9px 12px;border-radius:8px;border:1px solid var(--border);background:var(--card2);color:var(--text);font-size:13px;font-family:inherit}
.fg input:focus,.fg select:focus,.fg textarea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 2px rgba(59,130,246,.2)}
.fg textarea{min-height:60px;resize:vertical}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700}
.badge-green{background:rgba(34,197,94,.12);color:var(--green);border:1px solid rgba(34,197,94,.3)}
.badge-red{background:rgba(239,68,68,.12);color:var(--red);border:1px solid rgba(239,68,68,.3)}
.badge-yellow{background:rgba(234,179,8,.12);color:var(--yellow);border:1px solid rgba(234,179,8,.3)}
.badge-blue{background:rgba(59,130,246,.12);color:var(--accent);border:1px solid rgba(59,130,246,.3)}
.chart-wrap{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:16px}
.chart-wrap canvas{max-height:320px}
.charts-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:16px;margin-bottom:16px}
#toast{position:fixed;bottom:20px;right:20px;z-index:900;display:flex;flex-direction:column;gap:8px}
.toast-item{padding:10px 18px;border-radius:8px;font-size:13px;font-weight:600;color:#fff;animation:slideIn .3s}
@keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
.toast-success{background:var(--green)}.toast-danger{background:var(--red)}.toast-info{background:var(--accent)}
.apontar-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:10px;display:flex;align-items:center;gap:16px;flex-wrap:wrap}
.apontar-info{flex:1;min-width:200px}
.apontar-prod{font-weight:700;font-size:14px}.apontar-meta{font-size:12px;color:var(--text2)}
.apontar-inputs{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.apontar-inputs input,.apontar-inputs textarea{padding:8px 10px;border-radius:8px;border:1px solid var(--border);background:var(--card2);color:var(--text);font-size:13px;font-family:inherit}
.apontar-inputs input:focus,.apontar-inputs textarea:focus{outline:none;border-color:var(--accent)}
.apontar-inputs input[type=number]{width:90px}
.apontar-inputs textarea{width:200px;min-height:36px}
.empty{text-align:center;color:var(--text2);font-style:italic;padding:30px}
@media(max-width:768px){.sidebar{display:none}.main{padding:16px}.charts-grid{grid-template-columns:1fr}.form-row{grid-template-columns:1fr}.topbar{padding:10px 12px}}
</style>
</head>
<body>
<div class="topbar">
  <div class="logo"><a href="/">⚙ ProGestão</a> / Produção</div>
  <div class="right"><span class="clock" id="clock"></span><span class="user" id="user-display"></span><button class="btn-sm btn-danger" onclick="doLogout()">Sair</button></div>
</div>
<div class="layout">
<nav class="sidebar">
  <a href="/">🏠 Início</a>
  <a href="/ferramentas">🔧 Ferramentas</a>
  <a href="/epis">🦺 EPIs</a>
  <a href="/banco-horas">⏰ Banco Horas</a>
  <a href="/treinamentos">📚 Treinamentos</a>
  <a href="/diario-bordo">📋 Diário Bordo</a>
  <a href="/checklist">✅ Checklist</a>
  <a href="/producao" class="active">📊 Produção</a>
</nav>
<div class="main">

<!-- KPIs -->
<div class="kpis">
  <div class="kpi"><div class="kpi-val" id="kpi-produtos" style="color:var(--accent)">0</div><div class="kpi-lab">Produtos no Plano</div></div>
  <div class="kpi"><div class="kpi-val" id="kpi-meta" style="color:var(--yellow)">0</div><div class="kpi-lab">Meta Total (un.)</div></div>
  <div class="kpi"><div class="kpi-val" id="kpi-realizado" style="color:var(--green)">0</div><div class="kpi-lab">Realizado Total</div></div>
  <div class="kpi"><div class="kpi-val" id="kpi-pct" style="color:var(--pink)">0%</div><div class="kpi-lab">% Atendimento</div></div>
</div>

<!-- Filtro de mês -->
<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap">
  <label style="font-size:13px;font-weight:700;color:var(--text2)">Mês:</label>
  <input type="month" id="filtro-mes" class="btn-sm" style="background:var(--card);border:1px solid var(--border);color:var(--text);padding:6px 12px;border-radius:8px;font-family:inherit">
</div>

<!-- Tabs -->
<div class="tabs">
  <button class="tab active" onclick="showTab('dashboard')">📊 Dashboard</button>
  <button class="tab" onclick="showTab('planos')">📋 Plano Mensal</button>
  <button class="tab" onclick="showTab('apontar')">✏️ Apontamento Diário</button>
  <button class="tab" onclick="showTab('historico')">📜 Histórico</button>
</div>

<!-- Tab: Dashboard -->
<div class="section show" id="sec-dashboard">
  <div class="charts-grid">
    <div class="chart-wrap"><canvas id="chart-meta-real"></canvas></div>
    <div class="chart-wrap"><canvas id="chart-pct"></canvas></div>
  </div>
  <div class="chart-wrap"><canvas id="chart-acumulado"></canvas></div>
</div>

<!-- Tab: Plano Mensal -->
<div class="section" id="sec-planos">
  <div class="card">
    <div class="card-title">Cadastrar Produto no Plano</div>
    <input type="hidden" id="plano-edit-id">
    <div class="form-row">
      <div class="fg"><label>Código Produto</label><input type="text" id="p-codigo" placeholder="Ex: PRD-001"></div>
      <div class="fg"><label>Descrição</label><input type="text" id="p-descricao" placeholder="Nome do produto"></div>
      <div class="fg"><label>Meta Mensal (un.)</label><input type="number" id="p-meta" min="1" placeholder="Quantidade"></div>
      <div class="fg"><label>Observação</label><input type="text" id="p-obs" placeholder="Opcional"></div>
    </div>
    <div style="display:flex;gap:8px"><button class="btn-sm btn-accent" onclick="salvarPlano()">Salvar</button><button class="btn-sm btn-ghost" onclick="cancelarPlano()">Cancelar</button></div>
  </div>
  <div class="card">
    <div class="card-title">Produtos do Mês</div>
    <table>
      <thead><tr><th>Código</th><th>Descrição</th><th>Meta Mensal</th><th>Realizado</th><th>%</th><th>Obs</th><th>Ações</th></tr></thead>
      <tbody id="tb-planos"></tbody>
    </table>
  </div>
</div>

<!-- Tab: Apontamento Diário -->
<div class="section" id="sec-apontar">
  <div class="card">
    <div class="card-title">Apontamento do Dia</div>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <label style="font-size:13px;font-weight:700;color:var(--text2)">Data:</label>
      <input type="date" id="apontar-data" style="padding:7px 12px;border-radius:8px;border:1px solid var(--border);background:var(--card2);color:var(--text);font-family:inherit">
      <button class="btn-sm btn-green" onclick="salvarTodosApontamentos()">Salvar Todos</button>
    </div>
    <div id="apontar-list"></div>
  </div>
</div>

<!-- Tab: Histórico -->
<div class="section" id="sec-historico">
  <div class="card">
    <div class="card-title">Histórico de Apontamentos</div>
    <table>
      <thead><tr><th>Data</th><th>Código</th><th>Descrição</th><th>Meta Diária</th><th>Realizado</th><th>Status</th><th>Justificativa</th><th>Ações</th></tr></thead>
      <tbody id="tb-historico"></tbody>
    </table>
  </div>
</div>

</div>
</div>

<div id="toast"></div>

<script>
/* ══ Globais ══ */
let planos=[], apontamentos=[], chartMetaReal=null, chartPct=null, chartAcum=null;

/* ══ API ══ */
async function api(url,method,data){
  method=method||'GET';
  const opts={method:method,headers:{'Content-Type':'application/json'}};
  if(data)opts.body=JSON.stringify(data);
  const r=await fetch(url,opts);
  if(r.status===401){window.location.href='/login';return null;}
  return r.json();
}

/* ══ Helpers ══ */
function toast(m,t){t=t||'success';var d=document.getElementById('toast');var el=document.createElement('div');el.className='toast-item toast-'+t;el.textContent=m;d.appendChild(el);setTimeout(function(){el.remove()},3500);}
function fmtDate(d){if(!d)return'—';return new Date(d+'T12:00:00').toLocaleDateString('pt-BR');}
function getMes(){return document.getElementById('filtro-mes').value;}
function getHoje(){return new Date().toISOString().slice(0,10);}
function diasNoMes(mes){var p=mes.split('-');return new Date(parseInt(p[0]),parseInt(p[1]),0).getDate();}
function diasUteisNoMes(mes){var p=mes.split('-');var y=parseInt(p[0]),m=parseInt(p[1]);var total=new Date(y,m,0).getDate();var uteis=0;for(var d=1;d<=total;d++){var dow=new Date(y,m-1,d).getDay();if(dow!==0&&dow!==6)uteis++;}return uteis;}

/* ══ Clock ══ */
function updateClock(){document.getElementById('clock').textContent=new Date().toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});}
setInterval(updateClock,1000);

/* ══ Logout ══ */
async function doLogout(){await fetch('/api/logout',{method:'POST'});window.location.href='/login';}

/* ══ User ══ */
async function loadUser(){try{var u=await api('/api/me');if(u&&u.nome)document.getElementById('user-display').textContent=u.nome;}catch(e){}}

/* ══ Tabs ══ */
function showTab(t){
  document.querySelectorAll('.section').forEach(function(s){s.classList.remove('show');});
  document.querySelectorAll('.tab').forEach(function(b){b.classList.remove('active');});
  document.getElementById('sec-'+t).classList.add('show');
  event.target.classList.add('active');
  if(t==='apontar')renderApontar();
  if(t==='dashboard')renderDashboard();
}

/* ══ Carregar dados ══ */
async function loadAll(){
  var mes=getMes();
  planos=await api('/api/prod-planos?mes='+mes)||[];
  apontamentos=await api('/api/prod-apontamentos?mes='+mes)||[];
  calcKPIs();
  renderPlanos();
  renderApontar();
  renderHistorico();
  renderDashboard();
}

/* ══ KPIs ══ */
function calcKPIs(){
  var metaTotal=0, realTotal=0;
  planos.forEach(function(p){
    metaTotal+=p.meta_mensal;
    var apts=apontamentos.filter(function(a){return a.plano_id===p.id;});
    var soma=0;apts.forEach(function(a){soma+=a.qtd_realizada;});
    realTotal+=soma;
  });
  var pct=metaTotal>0?Math.round(realTotal/metaTotal*100):0;
  document.getElementById('kpi-produtos').textContent=planos.length;
  document.getElementById('kpi-meta').textContent=metaTotal.toLocaleString('pt-BR');
  document.getElementById('kpi-realizado').textContent=realTotal.toLocaleString('pt-BR');
  document.getElementById('kpi-pct').textContent=pct+'%';
}

/* ══ Planos CRUD ══ */
function renderPlanos(){
  var tb=document.getElementById('tb-planos');
  if(!planos.length){tb.innerHTML='<tr><td colspan="7" class="empty">Nenhum produto cadastrado neste mês.</td></tr>';return;}
  tb.innerHTML=planos.map(function(p){
    var apts=apontamentos.filter(function(a){return a.plano_id===p.id;});
    var soma=0;apts.forEach(function(a){soma+=a.qtd_realizada;});
    var pct=p.meta_mensal>0?Math.round(soma/p.meta_mensal*100):0;
    var cls=pct>=100?'badge-green':pct>=70?'badge-yellow':'badge-red';
    return '<tr><td><strong>'+p.codigo+'</strong></td><td>'+p.descricao+'</td><td>'+p.meta_mensal.toLocaleString('pt-BR')+'</td><td>'+soma.toLocaleString('pt-BR')+'</td><td><span class="badge '+cls+'">'+pct+'%</span></td><td>'+(p.obs||'—')+'</td><td><button class="btn-sm btn-ghost" onclick="editarPlano('+p.id+')">✏️</button> <button class="btn-sm btn-ghost" onclick="deletarPlano('+p.id+')">🗑️</button></td></tr>';
  }).join('');
}

async function salvarPlano(){
  var editId=document.getElementById('plano-edit-id').value;
  var mes=getMes();
  var codigo=document.getElementById('p-codigo').value.trim();
  var descricao=document.getElementById('p-descricao').value.trim();
  var meta_mensal=parseInt(document.getElementById('p-meta').value)||0;
  var obs=document.getElementById('p-obs').value.trim();
  if(!codigo||!descricao||!meta_mensal){toast('Preencha código, descrição e meta.','danger');return;}
  if(editId){
    await api('/api/prod-planos/'+editId,'PUT',{mes:mes,codigo:codigo,descricao:descricao,meta_mensal:meta_mensal,obs:obs});
    toast('Produto atualizado!');
  }else{
    await api('/api/prod-planos','POST',{mes:mes,codigo:codigo,descricao:descricao,meta_mensal:meta_mensal,obs:obs});
    toast('Produto cadastrado!');
  }
  cancelarPlano();
  await loadAll();
}

function editarPlano(id){
  var p=planos.find(function(x){return x.id===id;});if(!p)return;
  document.getElementById('plano-edit-id').value=p.id;
  document.getElementById('p-codigo').value=p.codigo;
  document.getElementById('p-descricao').value=p.descricao;
  document.getElementById('p-meta').value=p.meta_mensal;
  document.getElementById('p-obs').value=p.obs||'';
  showTab('planos');
}

function cancelarPlano(){
  document.getElementById('plano-edit-id').value='';
  document.getElementById('p-codigo').value='';
  document.getElementById('p-descricao').value='';
  document.getElementById('p-meta').value='';
  document.getElementById('p-obs').value='';
}

async function deletarPlano(id){
  if(!confirm('Excluir este produto do plano?'))return;
  await api('/api/prod-planos/'+id,'DELETE');
  toast('Produto excluído.','info');
  await loadAll();
}

/* ══ Apontamento Diário ══ */
function renderApontar(){
  var data=document.getElementById('apontar-data').value;
  var div=document.getElementById('apontar-list');
  if(!planos.length){div.innerHTML='<div class="empty">Cadastre produtos no Plano Mensal primeiro.</div>';return;}
  var uteis=diasUteisNoMes(getMes());
  div.innerHTML=planos.map(function(p){
    var metaDia=Math.ceil(p.meta_mensal/uteis);
    // Verificar se já tem apontamento nesta data
    var apt=apontamentos.find(function(a){return a.plano_id===p.id&&a.data&&a.data.slice(0,10)===data;});
    var qtd=apt?apt.qtd_realizada:'';
    var just=apt?apt.justificativa||'':'';
    return '<div class="apontar-card"><div class="apontar-info"><div class="apontar-prod">'+p.codigo+' — '+p.descricao+'</div><div class="apontar-meta">Meta mensal: '+p.meta_mensal+' | Meta diária: ~'+metaDia+' un.</div></div><div class="apontar-inputs"><input type="number" id="apt-qtd-'+p.id+'" placeholder="Qtd" min="0" value="'+qtd+'"><textarea id="apt-just-'+p.id+'" placeholder="Justificativa (se não bateu meta)">'+just+'</textarea></div></div>';
  }).join('');
}

async function salvarTodosApontamentos(){
  var data=document.getElementById('apontar-data').value;
  if(!data){toast('Selecione uma data.','danger');return;}
  var uteis=diasUteisNoMes(getMes());
  var salvos=0;
  for(var i=0;i<planos.length;i++){
    var p=planos[i];
    var qtdEl=document.getElementById('apt-qtd-'+p.id);
    var justEl=document.getElementById('apt-just-'+p.id);
    var qtd=parseInt(qtdEl.value);
    if(isNaN(qtd))continue;
    var metaDia=Math.ceil(p.meta_mensal/uteis);
    var atingiu=qtd>=metaDia;
    var just=justEl.value.trim();
    await api('/api/prod-apontamentos','POST',{plano_id:p.id,data:data,qtd_realizada:qtd,atingiu_meta:atingiu,justificativa:just||null});
    salvos++;
  }
  if(salvos)toast(salvos+' apontamento(s) salvo(s)!');
  else toast('Preencha ao menos uma quantidade.','danger');
  await loadAll();
}

/* ══ Histórico ══ */
function renderHistorico(){
  var tb=document.getElementById('tb-historico');
  if(!apontamentos.length){tb.innerHTML='<tr><td colspan="8" class="empty">Nenhum apontamento registrado.</td></tr>';return;}
  var uteis=diasUteisNoMes(getMes());
  tb.innerHTML=apontamentos.map(function(a){
    var p=planos.find(function(x){return x.id===a.plano_id;});
    var metaDia=p?Math.ceil(p.meta_mensal/uteis):0;
    var stCls=a.atingiu_meta?'badge-green':'badge-red';
    var stTxt=a.atingiu_meta?'Atingiu':'Não atingiu';
    return '<tr><td>'+fmtDate(a.data)+'</td><td><strong>'+(a.codigo||'—')+'</strong></td><td>'+(a.prod_descricao||'—')+'</td><td>'+metaDia+'</td><td>'+a.qtd_realizada+'</td><td><span class="badge '+stCls+'">'+stTxt+'</span></td><td style="max-width:200px">'+(a.justificativa||'—')+'</td><td><button class="btn-sm btn-ghost" onclick="deletarApt('+a.id+')">🗑️</button></td></tr>';
  }).join('');
}

async function deletarApt(id){
  if(!confirm('Excluir apontamento?'))return;
  await api('/api/prod-apontamentos/'+id,'DELETE');
  toast('Apontamento excluído.','info');
  await loadAll();
}

/* ══ Dashboard / Gráficos ══ */
function renderDashboard(){
  if(!planos.length)return;
  // Dados por produto
  var labels=[],metas=[],realizados=[],pcts=[];
  planos.forEach(function(p){
    labels.push(p.codigo);
    metas.push(p.meta_mensal);
    var apts=apontamentos.filter(function(a){return a.plano_id===p.id;});
    var soma=0;apts.forEach(function(a){soma+=a.qtd_realizada;});
    realizados.push(soma);
    pcts.push(p.meta_mensal>0?Math.round(soma/p.meta_mensal*100):0);
  });

  // Gráfico 1: Meta vs Realizado (barras)
  var ctx1=document.getElementById('chart-meta-real').getContext('2d');
  if(chartMetaReal)chartMetaReal.destroy();
  chartMetaReal=new Chart(ctx1,{
    type:'bar',
    data:{labels:labels,datasets:[
      {label:'Meta',data:metas,backgroundColor:'rgba(234,179,8,.5)',borderColor:'#eab308',borderWidth:2},
      {label:'Realizado',data:realizados,backgroundColor:'rgba(34,197,94,.5)',borderColor:'#22c55e',borderWidth:2}
    ]},
    options:{responsive:true,plugins:{title:{display:true,text:'Meta vs Realizado por Produto',color:'#f1f5f9',font:{size:14,weight:'bold'}},legend:{labels:{color:'#94a3b8'}}},scales:{x:{ticks:{color:'#94a3b8'},grid:{color:'rgba(71,85,105,.3)'}},y:{ticks:{color:'#94a3b8'},grid:{color:'rgba(71,85,105,.3)'}}}}
  });

  // Gráfico 2: % Atendimento (donut)
  var ctx2=document.getElementById('chart-pct').getContext('2d');
  if(chartPct)chartPct.destroy();
  var cores=['#3b82f6','#8b5cf6','#f43f5e','#22c55e','#eab308','#f97316','#06b6d4','#ec4899'];
  chartPct=new Chart(ctx2,{
    type:'doughnut',
    data:{labels:labels.map(function(l,i){return l+' ('+pcts[i]+'%)';}),datasets:[{data:pcts,backgroundColor:cores.slice(0,labels.length),borderWidth:0}]},
    options:{responsive:true,plugins:{title:{display:true,text:'% Atendimento por Produto',color:'#f1f5f9',font:{size:14,weight:'bold'}},legend:{position:'bottom',labels:{color:'#94a3b8',font:{size:11}}}}}
  });

  // Gráfico 3: Produção diária acumulada
  renderChartAcumulado();
}

function renderChartAcumulado(){
  var mes=getMes();
  if(!mes||!planos.length)return;
  // Coletar todas as datas de apontamento no mês e ordenar
  var datasSet={};
  apontamentos.forEach(function(a){if(a.data)datasSet[a.data.slice(0,10)]=true;});
  var datas=Object.keys(datasSet).sort();
  if(!datas.length)return;

  // Acumulado total por dia
  var acum=[], metaAcum=[];
  var totalMeta=0;planos.forEach(function(p){totalMeta+=p.meta_mensal;});
  var uteis=diasUteisNoMes(mes);
  var metaDiaria=Math.ceil(totalMeta/uteis);

  var somaAcum=0;
  datas.forEach(function(d,i){
    var somaHoje=0;
    apontamentos.forEach(function(a){if(a.data&&a.data.slice(0,10)===d)somaHoje+=a.qtd_realizada;});
    somaAcum+=somaHoje;
    acum.push(somaAcum);
    metaAcum.push(metaDiaria*(i+1));
  });

  var ctx3=document.getElementById('chart-acumulado').getContext('2d');
  if(chartAcum)chartAcum.destroy();
  chartAcum=new Chart(ctx3,{
    type:'line',
    data:{labels:datas.map(function(d){return fmtDate(d);}),datasets:[
      {label:'Meta Acumulada',data:metaAcum,borderColor:'#eab308',borderDash:[6,4],tension:.3,fill:false,pointRadius:3},
      {label:'Realizado Acumulado',data:acum,borderColor:'#22c55e',backgroundColor:'rgba(34,197,94,.1)',tension:.3,fill:true,pointRadius:4}
    ]},
    options:{responsive:true,plugins:{title:{display:true,text:'Produção Diária Acumulada',color:'#f1f5f9',font:{size:14,weight:'bold'}},legend:{labels:{color:'#94a3b8'}}},scales:{x:{ticks:{color:'#94a3b8'},grid:{color:'rgba(71,85,105,.3)'}},y:{ticks:{color:'#94a3b8'},grid:{color:'rgba(71,85,105,.3)'}}}}
  });
}

/* ══ Init ══ */
async function init(){
  updateClock();
  await loadUser();
  // Definir mês atual
  var hoje=new Date();
  var mesAtual=hoje.getFullYear()+'-'+String(hoje.getMonth()+1).padStart(2,'0');
  document.getElementById('filtro-mes').value=mesAtual;
  document.getElementById('apontar-data').value=getHoje();
  // Listener mudança de mês
  document.getElementById('filtro-mes').addEventListener('change',loadAll);
  document.getElementById('apontar-data').addEventListener('change',renderApontar);
  await loadAll();
}
window.onload=init;
</script>
</body>
</html>
