const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

function styleHeader(sheet) {
  if (!sheet) return;
  const row = sheet.getRow(1);
  row.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
  row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7C3AED' } };
  row.alignment = { vertical: 'middle', horizontal: 'center' };
  row.height = 25;
}

// GET /api/export/:modulo
router.get('/:modulo', requireAuth, async (req, res) => {
  const modulo = req.params.modulo;

  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ProGestao';
    workbook.created = new Date();
    let sheet;

    // ── COLABORADORES ──
    if (modulo === 'colaboradores') {
      sheet = workbook.addWorksheet('Colaboradores');
      sheet.columns = [
        { header:'ID', key:'id', width:8 },
        { header:'Nome', key:'nome', width:30 },
        { header:'Matricula', key:'mat', width:15 },
        { header:'Cargo', key:'cargo', width:20 },
        { header:'Setor', key:'setor', width:20 },
        { header:'Turno', key:'turno', width:15 },
        { header:'Status', key:'status', width:12 }
      ];
      (await pool.query('SELECT * FROM colaboradores ORDER BY nome')).rows.forEach(r => sheet.addRow(r));
    }

    // ── FERRAMENTAS ──
    else if (modulo === 'ferramentas') {
      sheet = workbook.addWorksheet('Ferramentas');
      sheet.columns = [
        { header:'Codigo', key:'cod', width:12 },
        { header:'Nome', key:'nome', width:30 },
        { header:'Categoria', key:'cat', width:18 },
        { header:'Localizacao', key:'loc', width:25 },
        { header:'Status', key:'status', width:15 },
        { header:'Calibracao', key:'cal', width:14 },
        { header:'Preventiva', key:'prev', width:14 },
        { header:'Obs', key:'obs', width:30 }
      ];
      (await pool.query('SELECT * FROM ferramentas ORDER BY nome')).rows.forEach(r => sheet.addRow(r));
    }

    // ── EMPRESTIMOS ──
    else if (modulo === 'emprestimos') {
      sheet = workbook.addWorksheet('Emprestimos');
      sheet.columns = [
        { header:'Ferramenta', key:'ferr_nome', width:25 },
        { header:'Codigo', key:'ferr_cod', width:12 },
        { header:'Colaborador', key:'colab_nome', width:25 },
        { header:'Retirada', key:'dt', width:20 },
        { header:'Devolucao', key:'dev_dt', width:20 },
        { header:'Status', key:'status_text', width:12 },
        { header:'Obs', key:'obs', width:25 }
      ];
      const rows = (await pool.query(`
        SELECT e.*, f.nome as ferr_nome, f.cod as ferr_cod, c.nome as colab_nome
        FROM emprestimos e JOIN ferramentas f ON e.ferramenta_id=f.id
        JOIN colaboradores c ON e.colaborador_id=c.id ORDER BY e.dt DESC
      `)).rows;
      rows.forEach(r => { r.status_text = r.devolvido ? 'Devolvido' : 'Pendente'; sheet.addRow(r); });
    }

    // ── MANUTENCOES ──
    else if (modulo === 'manutencoes') {
      sheet = workbook.addWorksheet('Manutencoes');
      sheet.columns = [
        { header:'Ferramenta', key:'ferr_nome', width:25 },
        { header:'Codigo', key:'ferr_cod', width:12 },
        { header:'Tipo', key:'tipo', width:15 },
        { header:'Responsavel', key:'resp_nome', width:25 },
        { header:'Envio', key:'env', width:14 },
        { header:'Retorno', key:'ret', width:14 },
        { header:'Descricao', key:'descricao', width:40 }
      ];
      const rows = (await pool.query(`
        SELECT m.*, f.nome as ferr_nome, f.cod as ferr_cod, c.nome as resp_nome
        FROM manutencoes m JOIN ferramentas f ON m.ferramenta_id=f.id
        LEFT JOIN colaboradores c ON m.responsavel_id=c.id ORDER BY m.created_at DESC
      `)).rows;
      rows.forEach(r => sheet.addRow(r));
    }

    // ── EPIs ──
    else if (modulo === 'epis') {
      sheet = workbook.addWorksheet('EPIs');
      sheet.columns = [
        { header:'Nome', key:'nome', width:30 },
        { header:'Durabilidade Qtd', key:'dur_qtd', width:15 },
        { header:'Durabilidade Tipo', key:'dur_tipo', width:15 },
        { header:'Descricao', key:'descricao', width:40 }
      ];
      (await pool.query('SELECT * FROM epis ORDER BY nome')).rows.forEach(r => sheet.addRow(r));
    }

    // ── EPI ENTREGAS ──
    else if (modulo === 'epi-entregas') {
      sheet = workbook.addWorksheet('Entregas EPIs');
      sheet.columns = [
        { header:'EPI', key:'epi_nome', width:25 },
        { header:'Colaborador', key:'colab_nome', width:25 },
        { header:'Qtd', key:'qtd', width:8 },
        { header:'Entrega', key:'dt', width:20 },
        { header:'Validade', key:'validade', width:14 },
        { header:'Motivo', key:'motivo', width:25 },
        { header:'Obs', key:'obs', width:25 }
      ];
      const rows = (await pool.query(`
        SELECT ee.*, ep.nome as epi_nome, c.nome as colab_nome
        FROM epi_entregas ee JOIN epis ep ON ee.epi_id=ep.id
        JOIN colaboradores c ON ee.colaborador_id=c.id ORDER BY ee.dt DESC
      `)).rows;
      rows.forEach(r => sheet.addRow(r));
    }

    // ── BH LANCAMENTOS ──
    else if (modulo === 'bh-lancamentos') {
      sheet = workbook.addWorksheet('Lancamentos BH');
      sheet.columns = [
        { header:'Colaborador', key:'colab_nome', width:25 },
        { header:'Tipo', key:'tipo', width:12 },
        { header:'Minutos', key:'minutos', width:10 },
        { header:'Data', key:'data', width:14 },
        { header:'Motivo', key:'motivo', width:20 },
        { header:'Justificativa', key:'justificativa', width:35 }
      ];
      const rows = (await pool.query(`
        SELECT l.*, c.nome as colab_nome FROM bh_lancamentos l
        JOIN colaboradores c ON l.colaborador_id=c.id ORDER BY l.data DESC
      `)).rows;
      rows.forEach(r => sheet.addRow(r));
    }

    // ── BH CONVITES ──
    else if (modulo === 'bh-convites') {
      sheet = workbook.addWorksheet('Convites BH');
      sheet.columns = [
        { header:'Colaborador', key:'colab_nome', width:25 },
        { header:'Data Convite', key:'data', width:14 },
        { header:'Data Proposta', key:'data_banco', width:14 },
        { header:'Resposta', key:'resposta', width:15 },
        { header:'Obs', key:'obs', width:30 }
      ];
      const rows = (await pool.query(`
        SELECT cv.*, c.nome as colab_nome FROM bh_convites cv
        JOIN colaboradores c ON cv.colaborador_id=c.id ORDER BY cv.data DESC
      `)).rows;
      rows.forEach(r => sheet.addRow(r));
    }

    // ── BH ATRASOS ──
    else if (modulo === 'bh-atrasos') {
      sheet = workbook.addWorksheet('Atrasos');
      sheet.columns = [
        { header:'Colaborador', key:'colab_nome', width:25 },
        { header:'Data', key:'data', width:14 },
        { header:'Ponto', key:'ponto', width:10 },
        { header:'Linha', key:'linha', width:10 },
        { header:'Diff (min)', key:'diff', width:10 },
        { header:'Motivo', key:'motivo', width:20 },
        { header:'Obs', key:'obs', width:25 }
      ];
      const rows = (await pool.query(`
        SELECT a.*, c.nome as colab_nome FROM bh_atrasos a
        JOIN colaboradores c ON a.colaborador_id=c.id ORDER BY a.data DESC
      `)).rows;
      rows.forEach(r => sheet.addRow(r));
    }

    // ── TREINAMENTOS ──
    else if (modulo === 'treinamentos') {
      sheet = workbook.addWorksheet('Treinamentos');
      sheet.columns = [
        { header:'Nome', key:'nome', width:30 },
        { header:'Categoria', key:'categoria', width:15 },
        { header:'Carga Horaria', key:'carga_horaria', width:14 },
        { header:'Validade (meses)', key:'validade_meses', width:15 },
        { header:'Descricao', key:'descricao', width:40 }
      ];
      (await pool.query('SELECT * FROM treinamentos ORDER BY nome')).rows.forEach(r => sheet.addRow(r));
    }

    // ── TR REGISTROS ──
    else if (modulo === 'tr-registros') {
      sheet = workbook.addWorksheet('Registros Treinamentos');
      sheet.columns = [
        { header:'Data', key:'data', width:14 },
        { header:'Colaborador', key:'colab_nome', width:25 },
        { header:'Treinamento', key:'treino_nome', width:30 },
        { header:'Validade', key:'validade', width:14 },
        { header:'Instrutor', key:'instrutor', width:20 },
        { header:'Local', key:'local_treino', width:20 },
        { header:'Obs', key:'obs', width:30 }
      ];
      const rows = (await pool.query(`
        SELECT r.*, c.nome as colab_nome, t.nome as treino_nome
        FROM tr_registros r JOIN colaboradores c ON r.colaborador_id=c.id
        JOIN treinamentos t ON r.treinamento_id=t.id ORDER BY r.data DESC
      `)).rows;
      rows.forEach(r => sheet.addRow(r));
    }

    // ── DIARIO ──
    else if (modulo === 'diario') {
      sheet = workbook.addWorksheet('Diario de Bordo');
      sheet.columns = [
        { header:'Data', key:'data', width:14 },
        { header:'Hora', key:'hora', width:10 },
        { header:'Turno', key:'turno', width:12 },
        { header:'Categoria', key:'categoria', width:22 },
        { header:'Prioridade', key:'prioridade', width:12 },
        { header:'Status', key:'status', width:12 },
        { header:'Descricao', key:'descricao', width:45 },
        { header:'Acao Tomada', key:'acao', width:35 }
      ];
      (await pool.query('SELECT * FROM db_registros ORDER BY data DESC, hora DESC NULLS LAST')).rows.forEach(r => sheet.addRow(r));
    }

    // ── DB RESUMOS ──
    else if (modulo === 'db-resumos') {
      sheet = workbook.addWorksheet('Resumos');
      sheet.columns = [
        { header:'Data', key:'data', width:14 },
        { header:'Turno', key:'turno', width:12 },
        { header:'Texto', key:'texto', width:60 },
        { header:'Obs', key:'obs', width:40 }
      ];
      (await pool.query('SELECT * FROM db_resumos ORDER BY data DESC')).rows.forEach(r => sheet.addRow(r));
    }

    // ── CL ATIVIDADES ──
    else if (modulo === 'cl-atividades') {
      sheet = workbook.addWorksheet('Atividades Checklist');
      sheet.columns = [
        { header:'Nome', key:'nome', width:30 },
        { header:'Frequencia', key:'freq', width:15 },
        { header:'Inicio', key:'inicio', width:14 },
        { header:'Status', key:'status', width:12 },
        { header:'Descricao', key:'descricao', width:40 }
      ];
      (await pool.query('SELECT * FROM cl_atividades ORDER BY nome')).rows.forEach(r => sheet.addRow(r));
    }

    // ── CL EXECUCOES ──
    else if (modulo === 'cl-execucoes') {
      sheet = workbook.addWorksheet('Execucoes Checklist');
      sheet.columns = [
        { header:'Data', key:'data', width:14 },
        { header:'Atividade', key:'ativ_nome', width:30 },
        { header:'Frequencia', key:'ativ_freq', width:15 },
        { header:'Hora', key:'hora', width:10 }
      ];
      const rows = (await pool.query(`
        SELECT e.*, a.nome as ativ_nome, a.freq as ativ_freq
        FROM cl_execucoes e JOIN cl_atividades a ON e.atividade_id=a.id
        ORDER BY e.data DESC, e.hora DESC NULLS LAST
      `)).rows;
      rows.forEach(r => sheet.addRow(r));
    }

    else {
      return res.status(400).json({ error: 'Modulo invalido: ' + modulo });
    }

    styleHeader(sheet);

    const filename = `progestao_${modulo}_${new Date().toISOString().slice(0,10)}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
