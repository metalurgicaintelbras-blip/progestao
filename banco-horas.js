<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>ProGestão — Montagem</title>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg-base:#0e0b1e;--bg-surface:#16112e;--bg-card:#1e1840;--bg-card-2:#251f4a;--bg-hover:#2d2660;
  --border:#2e2750;--border-light:#3d3570;
  --purple:#7c3aed;--purple-mid:#8b5cf6;--purple-light:#a78bfa;--purple-glow:rgba(124,58,237,.25);--purple-bg:rgba(124,58,237,.12);
  --success:#10b981;--success-bg:rgba(16,185,129,.12);--success-bdr:rgba(16,185,129,.3);
  --warning:#f59e0b;--warning-bg:rgba(245,158,11,.12);--warning-bdr:rgba(245,158,11,.3);
  --danger:#ef4444;--danger-bg:rgba(239,68,68,.12);--danger-bdr:rgba(239,68,68,.3);
  --info:#38bdf8;--info-bg:rgba(56,189,248,.12);--info-bdr:rgba(56,189,248,.3);
  --pink:#f43f5e;--pink-bg:rgba(244,63,94,.12);--pink-bdr:rgba(244,63,94,.3);
  --text-1:#f0ecff;--text-2:#b8b0d8;--text-3:#7a708f;
  --radius:12px;--radius-sm:8px;--radius-xs:6px;
  --shadow:0 4px 24px rgba(0,0,0,.4);--shadow-lg:0 12px 48px rgba(0,0,0,.6);
  --trans:all .2s cubic-bezier(.4,0,.2,1);--font:'Inter','Segoe UI',system-ui,sans-serif;
}
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
html{scroll-behavior:smooth}
body{font-family:var(--font);background:var(--bg-base);color:var(--text-1);font-size:14px;line-height:1.5;min-height:100vh;display:flex;flex-direction:column}
::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:var(--bg-surface)}::-webkit-scrollbar-thumb{background:var(--border-light);border-radius:99px}::-webkit-scrollbar-thumb:hover{background:var(--purple-mid)}
.hero{position:relative;overflow:hidden;padding:60px 40px 50px;text-align:center;border-bottom:1px solid var(--border)}
.hero-bg{position:absolute;inset:0;background:linear-gradient(135deg,rgba(124,58,237,.15) 0%,rgba(14,11,30,.9) 60%,rgba(16,185,129,.08) 100%);z-index:0}
.hero-orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:.12;pointer-events:none;z-index:0}
.hero-orb-1{width:400px;height:400px;background:var(--purple);top:-100px;left:-100px}
.hero-orb-2{width:300px;height:300px;background:var(--success);bottom:-80px;right:-60px}
.hero-orb-3{width:200px;height:200px;background:var(--info);top:40%;left:60%}
.hero-content{position:relative;z-index:1;max-width:700px;margin:0 auto}
.hero-icon{width:80px;height:80px;background:linear-gradient(135deg,var(--purple),var(--purple-mid));border-radius:22px;display:inline-flex;align-items:center;justify-content:center;font-size:40px;margin-bottom:20px;box-shadow:0 0 40px var(--purple-glow),0 0 80px rgba(124,58,237,.15);animation:float 4s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.hero-title{font-size:36px;font-weight:800;letter-spacing:-1.2px;margin-bottom:8px;background:linear-gradient(135deg,var(--text-1) 0%,var(--purple-light) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-sub{font-size:15px;color:var(--text-2);max-width:500px;margin:0 auto 24px;line-height:1.7}
.hero-stats{display:flex;justify-content:center;gap:30px;flex-wrap:wrap}
.hero-stat{text-align:center}.hero-stat-val{font-size:26px;font-weight:800;color:var(--text-1);letter-spacing:-1px}.hero-stat-lab{font-size:10px;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:.8px;margin-top:2px}
.hs-purple .hero-stat-val{color:var(--purple-light)}.hs-green .hero-stat-val{color:#34d399}.hs-blue .hero-stat-val{color:var(--info)}.hs-yellow .hero-stat-val{color:var(--warning)}
.modules-section{flex:1;padding:40px;max-width:1200px;margin:0 auto;width:100%}
.section-header{text-align:center;margin-bottom:32px}
.section-title{font-size:22px;font-weight:800;color:var(--text-1);letter-spacing:-.6px;margin-bottom:6px}
.section-sub{font-size:13px;color:var(--text-3)}
.modules-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px}
.module-card{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:var(--trans);cursor:pointer;text-decoration:none;display:flex;flex-direction:column;position:relative}
.module-card:hover{transform:translateY(-6px);border-color:var(--border-light);box-shadow:var(--shadow-lg)}
.module-card:hover .mc-glow{opacity:.15}
.mc-glow{position:absolute;top:-40px;right:-40px;width:140px;height:140px;border-radius:50%;opacity:.06;pointer-events:none;transition:opacity .4s ease}
.mc-header{padding:28px 24px 20px;display:flex;align-items:flex-start;gap:16px}
.mc-icon{width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;box-shadow:0 0 20px rgba(0,0,0,.2)}
.mc-info{flex:1;min-width:0}
.mc-title{font-size:18px;font-weight:800;color:var(--text-1);letter-spacing:-.4px;margin-bottom:4px}
.mc-desc{font-size:12px;color:var(--text-3);line-height:1.6}
.mc-footer{padding:14px 24px;border-top:1px solid var(--border);background:var(--bg-card-2);display:flex;align-items:center;justify-content:space-between}
.mc-btn{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:var(--purple-light);transition:var(--trans)}
.module-card:hover .mc-btn{gap:10px;color:#fff}
.mc-badge{font-size:10px;padding:3px 8px;border-radius:12px;font-weight:700}
.mod-ferramentas .mc-icon{background:linear-gradient(135deg,#7c3aed,#8b5cf6)}.mod-ferramentas .mc-glow{background:#7c3aed}
.mod-epis .mc-icon{background:linear-gradient(135deg,#10b981,#34d399)}.mod-epis .mc-glow{background:#10b981}
.mod-banco .mc-icon{background:linear-gradient(135deg,#38bdf8,#0ea5e9)}.mod-banco .mc-glow{background:#38bdf8}
.mod-treino .mc-icon{background:linear-gradient(135deg,#f59e0b,#f97316)}.mod-treino .mc-glow{background:#f59e0b}
.mod-diario .mc-icon{background:linear-gradient(135deg,#8b5cf6,#a78bfa)}.mod-diario .mc-glow{background:#8b5cf6}
.mod-checklist .mc-icon{background:linear-gradient(135deg,#10b981,#6ee7b7)}.mod-checklist .mc-glow{background:#10b981}
.mod-producao .mc-icon{background:linear-gradient(135deg,#f43f5e,#fb7185)}.mod-producao .mc-glow{background:#f43f5e}
.colab-section{padding:0 40px 40px;max-width:1200px;margin:0 auto;width:100%}
.colab-card-wrap{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;overflow:hidden}
.colab-header{padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
.colab-header-title{font-size:18px;font-weight:800;display:flex;align-items:center;gap:10px}
.colab-header-right{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.colab-body{padding:20px 24px}
.colab-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
.colab-item{background:var(--bg-card-2);border:1px solid var(--border);border-radius:var(--radius);padding:16px;display:flex;align-items:center;gap:14px;transition:var(--trans)}
.colab-item:hover{border-color:var(--border-light);transform:translateY(-2px)}
.colab-av{width:46px;height:46px;border-radius:14px;background:linear-gradient(135deg,var(--purple),var(--purple-mid));display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#fff;flex-shrink:0}
.colab-nome{font-size:14px;font-weight:700;color:var(--text-1)}
.colab-mat{font-size:11px;color:var(--text-3)}
.colab-cargo{font-size:11px;color:var(--text-2);margin-top:2px}
.colab-st{margin-top:4px}
.colab-form{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-bottom:16px}
.form-group{display:flex;flex-direction:column;gap:5px}
.form-label{font-size:11px;font-weight:700;color:var(--text-2);text-transform:uppercase;letter-spacing:.6px}
.form-control{padding:10px 12px;border-radius:var(--radius-xs);border:1px solid var(--border);background:var(--bg-card-2);color:var(--text-1);font-size:13px;font-family:var(--font);transition:var(--trans)}
.form-control:focus{outline:none;border-color:var(--purple-mid);box-shadow:0 0 0 3px var(--purple-glow)}
select.form-control{cursor:pointer}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 18px;border-radius:var(--radius-sm);border:1px solid transparent;font-size:13px;font-weight:700;font-family:var(--font);cursor:pointer;transition:var(--trans);white-space:nowrap}
.btn-purple{background:linear-gradient(135deg,var(--purple),var(--purple-mid));color:#fff;border:none;box-shadow:0 0 16px var(--purple-glow)}
.btn-purple:hover{transform:translateY(-1px);box-shadow:0 0 24px var(--purple-glow)}
.btn-ghost{background:transparent;border:1px solid var(--border);color:var(--text-2)}
.btn-ghost:hover{background:var(--bg-hover);color:var(--text-1);border-color:var(--border-light)}
.btn-danger{background:var(--danger);color:#fff;border:none}
.btn-danger:hover{background:#dc2626}
.btn-sm{padding:7px 14px;font-size:12px}
.btn-xs{padding:5px 10px;font-size:11px;border-radius:var(--radius-xs)}
.btn-actions{display:flex;gap:8px;flex-wrap:wrap}
.badge{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid transparent}
.badge-success{background:var(--success-bg);color:var(--success);border-color:var(--success-bdr)}
.badge-danger{background:var(--danger-bg);color:var(--danger);border-color:var(--danger-bdr)}
.badge-warning{background:var(--warning-bg);color:var(--warning);border-color:var(--warning-bdr)}
.badge-info{background:var(--info-bg);color:var(--info);border-color:var(--info-bdr)}
.badge-ghost{background:var(--bg-card-2);color:var(--text-2);border-color:var(--border)}
.search-wrap{position:relative}.search-ico{position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--text-3);pointer-events:none}.search-wrap .form-control{padding-left:32px}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);z-index:500;display:none;align-items:center;justify-content:center;padding:20px}
.overlay.show{display:flex}
.modal{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:24px;width:100%;box-shadow:var(--shadow-lg)}
.modal-sm{max-width:440px}
.modal-title{font-size:16px;font-weight:800;margin-bottom:16px;display:flex;align-items:center;gap:8px}
#toast{position:fixed;bottom:24px;right:24px;z-index:900;display:flex;flex-direction:column;gap:8px}
.toast-item{padding:12px 20px;border-radius:var(--radius-sm);font-size:13px;font-weight:600;color:#fff;animation:slideIn .3s ease;box-shadow:var(--shadow)}
@keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
.toast-success{background:linear-gradient(135deg,#059669,var(--success))}
.toast-danger{background:linear-gradient(135deg,#dc2626,var(--danger))}
.toast-info{background:linear-gradient(135deg,#0284c7,var(--info))}
.main-footer{padding:20px 40px;border-top:1px solid var(--border);background:var(--bg-surface);text-align:center}
.footer-text{font-size:11px;color:var(--text-3)}.footer-text strong{color:var(--purple-light)}
.top-bar{display:flex;justify-content:space-between;align-items:center;padding:14px 40px;background:var(--bg-surface);border-bottom:1px solid var(--border)}
.clock-badge{font-size:12px;color:var(--text-3);background:var(--bg-card);border:1px solid var(--border);padding:6px 14px;border-radius:var(--radius-xs);display:inline-flex;align-items:center;gap:8px}
.user-info{display:flex;align-items:center;gap:10px}
.user-name{font-size:12px;color:var(--purple-light);font-weight:600}
.btn-logout{background:var(--danger-bg);color:var(--danger);border:1px solid var(--danger-bdr);padding:6px 14px;border-radius:var(--radius-xs);font-size:12px;font-weight:600;cursor:pointer;font-family:var(--font);transition:var(--trans)}
.btn-logout:hover{background:var(--danger);color:#fff}
.aniv-section{padding:0 40px 20px;max-width:1200px;margin:0 auto;width:100%}
.aniv-card{border-radius:16px;padding:20px 24px;margin-bottom:14px}
.aniv-card-empresa{background:linear-gradient(135deg,rgba(245,158,11,.08),rgba(124,58,237,.08));border:1px solid var(--warning-bdr)}
.aniv-card-pessoal{background:linear-gradient(135deg,rgba(244,63,94,.08),rgba(124,58,237,.08));border:1px solid var(--pink-bdr)}
.aniv-title{font-size:16px;font-weight:800;margin-bottom:12px;display:flex;align-items:center;gap:8px}
.aniv-title-empresa{color:var(--warning)}
.aniv-title-pessoal{color:var(--pink)}
.aniv-list{display:flex;flex-wrap:wrap;gap:10px}
.aniv-item{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:12px 16px;display:flex;align-items:center;gap:10px;min-width:260px}
.aniv-av{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.aniv-av-empresa{background:linear-gradient(135deg,var(--warning),#f97316)}
.aniv-av-pessoal{background:linear-gradient(135deg,var(--pink),#fb7185)}
.aniv-nome{font-size:13px;font-weight:700;color:var(--text-1)}
.aniv-info{font-size:11px;color:var(--text-2)}
.aniv-dias{font-size:11px;font-weight:700;padding:3px 8px;border-radius:10px}
.aniv-hoje{background:var(--success-bg);color:var(--success);border:1px solid var(--success-bdr)}
.aniv-breve{background:var(--warning-bg);color:var(--warning);border:1px solid var(--warning-bdr)}
.aniv-breve-pink{background:var(--pink-bg);color:var(--pink);border:1px solid var(--pink-bdr)}
@media(max-width:768px){.hero{padding:40px 20px 30px}.hero-title{font-size:26px}.modules-section{padding:24px 16px}.modules-grid{grid-template-columns:1fr}.top-bar{padding:10px 16px;flex-wrap:wrap;gap:8px}.main-footer{padding:16px}.colab-section{padding:0 16px 24px}.colab-form{grid-template-columns:1fr}.aniv-section{padding:0 16px 16px}}
</style>
</head>
<body>

<div class="top-bar">
  <div class="user-info">
    <span class="user-name" id="user-display">Carregando...</span>
    <button class="btn-logout" onclick="doLogout()">Sair</button>
  </div>
  <div class="clock-badge"><span id="clock">—</span></div>
</div>

<div class="hero">
  <div class="hero-bg"></div>
  <div class="hero-orb hero-orb-1"></div>
  <div class="hero-orb hero-orb-2"></div>
  <div class="hero-orb hero-orb-3"></div>
  <div class="hero-content">
    <div class="hero-icon">🏭</div>
    <h1 class="hero-title">ProGestão — Montagem</h1>
    <p class="hero-sub">Sistema centralizado de gestão do setor de montagem.</p>
    <div class="hero-stats">
      <div class="hero-stat hs-purple"><div class="hero-stat-val">7</div><div class="hero-stat-lab">Módulos Ativos</div></div>
      <div class="hero-stat hs-green"><div class="hero-stat-val" id="hs-colabs">0</div><div class="hero-stat-lab">Colaboradores</div></div>
      <div class="hero-stat hs-blue"><div class="hero-stat-val" id="hs-ferramentas">0</div><div class="hero-stat-lab">Ferramentas</div></div>
      <div class="hero-stat hs-yellow"><div class="hero-stat-val" id="hs-epis">0</div><div class="hero-stat-lab">EPIs</div></div>
    </div>
  </div>
</div>

<div class="modules-section">
  <div class="section-header">
    <h2 class="section-title">Módulos do Sistema</h2>
    <p class="section-sub">Selecione um módulo para acessar</p>
  </div>
  <div class="modules-grid">
    <a href="/ferramentas" class="module-card mod-ferramentas"><div class="mc-glow"></div><div class="mc-header"><div class="mc-icon">🔧</div><div class="mc-info"><div class="mc-title">Ferramentas</div><div class="mc-desc">Cadastro, empréstimos, manutenções, checklist e controle completo do ferramental.</div></div></div><div class="mc-footer"><span class="mc-btn">Acessar módulo →</span><span class="mc-badge" style="background:var(--purple-bg);color:var(--purple-light);border:1px solid var(--purple-glow)">Ativo</span></div></a>
    <a href="/epis" class="module-card mod-epis"><div class="mc-glow"></div><div class="mc-header"><div class="mc-icon">🦺</div><div class="mc-info"><div class="mc-title">EPIs</div><div class="mc-desc">Gestão de EPIs, entregas, checklist de uso e controle de vencimentos.</div></div></div><div class="mc-footer"><span class="mc-btn">Acessar módulo →</span><span class="mc-badge" style="background:var(--success-bg);color:#34d399;border:1px solid var(--success-bdr)">Ativo</span></div></a>
    <a href="/banco-horas" class="module-card mod-banco"><div class="mc-glow"></div><div class="mc-header"><div class="mc-icon">⏱️</div><div class="mc-info"><div class="mc-title">Banco de Horas</div><div class="mc-desc">Lançamentos, convites, atrasos na linha, calendário de eventos e extrato.</div></div></div><div class="mc-footer"><span class="mc-btn">Acessar módulo →</span><span class="mc-badge" style="background:var(--info-bg);color:var(--info);border:1px solid var(--info-bdr)">Ativo</span></div></a>
    <a href="/treinamentos" class="module-card mod-treino"><div class="mc-glow"></div><div class="mc-header"><div class="mc-icon">📚</div><div class="mc-info"><div class="mc-title">Treinamentos</div><div class="mc-desc">Treinamentos, registros, lista de presença, vencimentos e certificações.</div></div></div><div class="mc-footer"><span class="mc-btn">Acessar módulo →</span><span class="mc-badge" style="background:var(--warning-bg);color:var(--warning);border:1px solid var(--warning-bdr)">Ativo</span></div></a>
    <a href="/diario-bordo" class="module-card mod-diario"><div class="mc-glow"></div><div class="mc-header"><div class="mc-icon">📓</div><div class="mc-info"><div class="mc-title">Diário de Bordo</div><div class="mc-desc">Registro de acontecimentos diários, pendências e resumo de turno.</div></div></div><div class="mc-footer"><span class="mc-btn">Acessar módulo →</span><span class="mc-badge" style="background:var(--purple-bg);color:var(--purple-light);border:1px solid var(--purple-glow)">Ativo</span></div></a>
    <a href="/checklist" class="module-card mod-checklist"><div class="mc-glow"></div><div class="mc-header"><div class="mc-icon">☑️</div><div class="mc-info"><div class="mc-title">Checklist</div><div class="mc-desc">Controle de atividades periódicas com frequências configuráveis.</div></div></div><div class="mc-footer"><span class="mc-btn">Acessar módulo →</span><span class="mc-badge" style="background:var(--success-bg);color:var(--success);border:1px solid var(--success-bdr)">Ativo</span></div></a>
    <a href="/producao" class="module-card mod-producao"><div class="mc-glow"></div><div class="mc-header"><div class="mc-icon">📊</div><div class="mc-info"><div class="mc-title">Produção</div><div class="mc-desc">Plano mensal de produção, apontamento diário, metas e dashboard de acompanhamento.</div></div></div><div class="mc-footer"><span class="mc-btn">Acessar módulo →</span><span class="mc-badge" style="background:var(--danger-bg);color:var(--danger);border:1px solid var(--danger-bdr)">Ativo</span></div></a>
  </div>
</div>

<!-- Alertas de Aniversário -->
<div class="aniv-section" id="aniv-section" style="display:none">
  <div class="aniv-card aniv-card-empresa" id="aniv-empresa-card" style="display:none">
    <div class="aniv-title aniv-title-empresa">🏭 Aniversários de Empresa (próximos 7 dias)</div>
    <div class="aniv-list" id="aniv-empresa-list"></div>
  </div>
  <div class="aniv-card aniv-card-pessoal" id="aniv-pessoal-card" style="display:none">
    <div class="aniv-title aniv-title-pessoal">🎂 Aniversários (próximos 7 dias)</div>
    <div class="aniv-list" id="aniv-pessoal-list"></div>
  </div>
</div>

<div class="colab-section">
  <div class="colab-card-wrap">
    <div class="colab-header">
      <div class="colab-header-title"><span>👷</span> Colaboradores</div>
      <div class="colab-header-right">
        <div class="search-wrap" style="max-width:240px"><span class="search-ico">🔍</span><input class="form-control" id="colab-busca" placeholder="Buscar..." oninput="renderColabs()"></div>
        <button class="btn btn-purple btn-sm" onclick="toggleForm()">+ Novo Colaborador</button>
      </div>
    </div>
    <div id="colab-form-area" style="display:none;padding:20px 24px;border-bottom:1px solid var(--border);background:var(--bg-card-2)">
      <input type="hidden" id="colab-edit-id">
      <div class="colab-form">
        <div class="form-group"><label class="form-label">Nome Completo</label><input type="text" class="form-control" id="c-nome" placeholder="Nome completo"></div>
        <div class="form-group"><label class="form-label">Matrícula</label><input type="text" class="form-control" id="c-mat" placeholder="Matrícula"></div>
        <div class="form-group"><label class="form-label">Cargo</label><input type="text" class="form-control" id="c-cargo" placeholder="Cargo"></div>
        <div class="form-group"><label class="form-label">Setor</label><input type="text" class="form-control" id="c-setor" placeholder="Setor" value="Montagem"></div>
        <div class="form-group"><label class="form-label">Turno</label><select class="form-control" id="c-turno"><option value="1º Turno">1º Turno</option><option value="2º Turno">2º Turno</option></select></div>
        <div class="form-group"><label class="form-label">Status</label><select class="form-control" id="c-status"><option value="Ativo">Ativo</option><option value="Inativo">Inativo</option><option value="Férias">Férias</option><option value="Afastado">Afastado</option></select></div>
        <div class="form-group"><label class="form-label">Data Admissão</label><input type="date" class="form-control" id="c-admissao"></div>
        <div class="form-group"><label class="form-label">Data Nascimento</label><input type="date" class="form-control" id="c-nascimento"></div>
      </div>
      <div class="btn-actions"><button class="btn btn-purple" onclick="salvarColab()">Salvar</button><button class="btn btn-ghost" onclick="cancelarForm()">Cancelar</button></div>
    </div>
    <div class="colab-body"><div class="colab-grid" id="colab-grid"></div></div>
  </div>
</div>

<footer class="main-footer">
  <div class="footer-text">© 2026 <strong>ProGestão</strong> — Sistema de Gestão do Setor de Montagem</div>
</footer>

<div class="overlay" id="m-del-colab"><div class="modal modal-sm"><div class="modal-title">Excluir Colaborador</div><p style="color:var(--text-2);font-size:13px;margin-bottom:18px">Tem certeza que deseja excluir este colaborador?</p><input type="hidden" id="del-colab-id"><div class="btn-actions" style="justify-content:flex-end"><button class="btn btn-ghost" onclick="closeM('m-del-colab')">Cancelar</button><button class="btn btn-danger" onclick="confirmarDelColab()">Excluir</button></div></div></div>

<div id="toast"></div>

<script>
/* ══ API Helper ══ */
async function api(url, method, data) {
  method = method || 'GET';
  var opts = { method: method, headers: {'Content-Type':'application/json'} };
  if (data) opts.body = JSON.stringify(data);
  var r = await fetch(url, opts);
  if (r.status === 401) { window.location.href = '/login'; return null; }
  return r.json();
}

/* ══ Dados em cache ══ */
var colaboradores = [];

/* ══ Helpers ══ */
function inic(n){if(!n)return'?';var p=n.trim().split(/\s+/);return(p[0][0]+(p.length>1?p[p.length-1][0]:'')).toUpperCase();}
function stBadge(s){var m={'Ativo':['badge-success','🟢'],'Inativo':['badge-danger','🔴'],'Férias':['badge-warning','🌴'],'Afastado':['badge-info','🏥']};var d=m[s]||['badge-ghost','⚪'];return'<span class="badge '+d[0]+'">'+d[1]+' '+(s||'Ativo')+'</span>';}
function toast(msg,type){type=type||'success';var d=document.getElementById('toast');var t=document.createElement('div');t.className='toast-item toast-'+type;t.textContent=msg;d.appendChild(t);setTimeout(function(){t.remove();},3500);}
function openM(id){document.getElementById(id).classList.add('show');}
function closeM(id){document.getElementById(id).classList.remove('show');}

/* ══ CORREÇÃO DE FUSO — formata data SEM converter timezone ══ */
function fmtDate(d){
  if(!d) return '—';
  // Pega só a parte YYYY-MM-DD da string (ignora hora/timezone)
  var s = String(d).slice(0,10);
  var partes = s.split('-');
  if(partes.length !== 3) return '—';
  return partes[2] + '/' + partes[1] + '/' + partes[0];
}

/* ══ Logout ══ */
async function doLogout(){
  await fetch('/api/logout',{method:'POST'});
  window.location.href='/login';
}

/* ══ Clock ══ */
function updateClock(){
  document.getElementById('clock').textContent=new Date().toLocaleString('pt-BR',{weekday:'long',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'});
}
setInterval(updateClock,1000);

/* ══ Colaboradores CRUD ══ */
function toggleForm(){document.getElementById('colab-form-area').style.display='block';document.getElementById('c-nome').focus();}
function cancelarForm(){document.getElementById('colab-form-area').style.display='none';resetForm();}
function resetForm(){
  document.getElementById('colab-edit-id').value='';
  document.getElementById('c-nome').value='';
  document.getElementById('c-mat').value='';
  document.getElementById('c-cargo').value='';
  document.getElementById('c-setor').value='Montagem';
  document.getElementById('c-turno').value='1º Turno';
  document.getElementById('c-status').value='Ativo';
  document.getElementById('c-admissao').value='';
  document.getElementById('c-nascimento').value='';
}

async function salvarColab(){
  var editId=document.getElementById('colab-edit-id').value;
  var nome=document.getElementById('c-nome').value.trim();
  var mat=document.getElementById('c-mat').value.trim();
  var cargo=document.getElementById('c-cargo').value.trim();
  var setor=document.getElementById('c-setor').value.trim();
  var turno=document.getElementById('c-turno').value;
  var status=document.getElementById('c-status').value;
  var dt_admissao=document.getElementById('c-admissao').value||null;
  var dt_nascimento=document.getElementById('c-nascimento').value||null;
  if(!nome){toast('Informe o nome do colaborador.','danger');return;}
  var payload={nome:nome,mat:mat,cargo:cargo,setor:setor,turno:turno,status:status,dt_admissao:dt_admissao,dt_nascimento:dt_nascimento};
  if(editId){
    await api('/api/colaboradores/'+editId,'PUT',payload);
    toast('Colaborador atualizado!');
  }else{
    await api('/api/colaboradores','POST',payload);
    toast('Colaborador cadastrado!');
  }
  cancelarForm();
  await carregarColabs();
  await carregarAniversarios();
}

function editarColab(id){
  var c=colaboradores.find(function(x){return x.id==id;});if(!c)return;
  document.getElementById('colab-edit-id').value=c.id;
  document.getElementById('c-nome').value=c.nome;
  document.getElementById('c-mat').value=c.mat||'';
  document.getElementById('c-cargo').value=c.cargo||'';
  document.getElementById('c-setor').value=c.setor||'Montagem';
  document.getElementById('c-turno').value=c.turno||'1º Turno';
  document.getElementById('c-status').value=c.status||'Ativo';
  document.getElementById('c-admissao').value=c.dt_admissao?String(c.dt_admissao).slice(0,10):'';
  document.getElementById('c-nascimento').value=c.dt_nascimento?String(c.dt_nascimento).slice(0,10):'';
  toggleForm();
}

var delColabId='';
function pedirDelColab(id){delColabId=id;openM('m-del-colab');}
async function confirmarDelColab(){
  await api('/api/colaboradores/'+delColabId,'DELETE');
  closeM('m-del-colab');toast('Colaborador excluído.','info');
  await carregarColabs();
  await carregarAniversarios();
}

async function carregarColabs(){
  colaboradores=await api('/api/colaboradores')||[];
  document.getElementById('hs-colabs').textContent=colaboradores.length;
  renderColabs();
}

function renderColabs(){
  var busca=(document.getElementById('colab-busca').value||'').toLowerCase();
  var cs=colaboradores;
  if(busca)cs=cs.filter(function(c){return c.nome.toLowerCase().indexOf(busca)>=0||(c.mat||'').indexOf(busca)>=0||(c.cargo||'').toLowerCase().indexOf(busca)>=0;});
  var grid=document.getElementById('colab-grid');
  if(!cs.length){grid.innerHTML='<div style="color:var(--text-3);font-style:italic;grid-column:1/-1;text-align:center;padding:30px">Nenhum colaborador cadastrado.</div>';return;}
  grid.innerHTML=cs.map(function(c){
    var admTxt=c.dt_admissao?'Adm: '+fmtDate(c.dt_admissao):'';
    var nascTxt=c.dt_nascimento?'Nasc: '+fmtDate(c.dt_nascimento):'';
    var extras=[];if(admTxt)extras.push(admTxt);if(nascTxt)extras.push(nascTxt);
    var extraLine=extras.length?' | '+extras.join(' | '):'';
    return '<div class="colab-item"><div class="colab-av">'+inic(c.nome)+'</div><div style="flex:1;min-width:0"><div class="colab-nome">'+c.nome+'</div><div class="colab-mat">Mat: '+(c.mat||'—')+extraLine+'</div><div class="colab-cargo">'+(c.cargo||'Sem cargo')+(c.turno?' · '+c.turno:'')+(c.setor?' · '+c.setor:'')+'</div><div class="colab-st">'+stBadge(c.status)+'</div></div><div style="display:flex;flex-direction:column;gap:4px"><button class="btn btn-ghost btn-xs" onclick="editarColab('+c.id+')">✏️</button><button class="btn btn-ghost btn-xs" onclick="pedirDelColab('+c.id+')">🗑️</button></div></div>';
  }).join('');
}

/* ══ Aniversários ══ */
async function carregarAniversarios(){
  try{
    var anivEmpresa=await api('/api/colaboradores/aniversarios-empresa')||[];
    var anivPessoal=await api('/api/colaboradores/aniversarios-pessoal')||[];
    var sec=document.getElementById('aniv-section');
    var temAlgo=anivEmpresa.length>0||anivPessoal.length>0;
    sec.style.display=temAlgo?'block':'none';

    // Empresa
    var cardEmp=document.getElementById('aniv-empresa-card');
    var listEmp=document.getElementById('aniv-empresa-list');
    if(anivEmpresa.length){
      cardEmp.style.display='block';
      listEmp.innerHTML=anivEmpresa.map(function(a){
        var dias=parseInt(a.dias_faltam);
        var anos=parseInt(a.anos_empresa);
        var diasClass=dias===0?'aniv-hoje':'aniv-breve';
        var diasTxt=dias===0?'HOJE!':'em '+dias+' dia'+(dias>1?'s':'');
        return '<div class="aniv-item"><div class="aniv-av aniv-av-empresa">🏭</div><div style="flex:1"><div class="aniv-nome">'+a.nome+'</div><div class="aniv-info">'+anos+' ano'+(anos>1?'s':'')+' de empresa'+(a.cargo?' · '+a.cargo:'')+'</div></div><span class="aniv-dias '+diasClass+'">'+diasTxt+'</span></div>';
      }).join('');
    }else{cardEmp.style.display='none';}

    // Pessoal
    var cardPes=document.getElementById('aniv-pessoal-card');
    var listPes=document.getElementById('aniv-pessoal-list');
    if(anivPessoal.length){
      cardPes.style.display='block';
      listPes.innerHTML=anivPessoal.map(function(a){
        var dias=parseInt(a.dias_faltam);
        var idade=parseInt(a.idade);
        var diasClass=dias===0?'aniv-hoje':'aniv-breve-pink';
        var diasTxt=dias===0?'HOJE!':'em '+dias+' dia'+(dias>1?'s':'');
        return '<div class="aniv-item"><div class="aniv-av aniv-av-pessoal">🎂</div><div style="flex:1"><div class="aniv-nome">'+a.nome+'</div><div class="aniv-info">Faz '+idade+' anos'+(a.cargo?' · '+a.cargo:'')+'</div></div><span class="aniv-dias '+diasClass+'">'+diasTxt+'</span></div>';
      }).join('');
    }else{cardPes.style.display='none';}
  }catch(e){console.error('Erro aniversarios:',e);}
}

/* ══ Carregar Stats ══ */
async function loadStats(){
  try{
    var results=await Promise.all([api('/api/ferramentas'),api('/api/epis')]);
    document.getElementById('hs-ferramentas').textContent=(results[0]||[]).length;
    document.getElementById('hs-epis').textContent=(results[1]||[]).length;
  }catch(e){console.error(e);}
}

/* ══ User Info ══ */
async function loadUser(){
  try{var u=await api('/api/me');if(u&&u.nome)document.getElementById('user-display').textContent=u.nome;}catch(e){}
}

/* ══ Init ══ */
async function init(){
  updateClock();
  await loadUser();
  await carregarColabs();
  await loadStats();
  await carregarAniversarios();
}
window.onload=init;
</script>
</body>
</html>
