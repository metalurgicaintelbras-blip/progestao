const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

// =====================================================
// HELPERS
// =====================================================

// Retorna o mês (YYYY-MM) de uma data
function mesDaData(dataISO) {
  if (!dataISO) return null;
  return String(dataISO).substring(0, 7); // "YYYY-MM-DD" -> "YYYY-MM"
}

// Valida string de exatos N dígitos numéricos
function validarDigitos(valor, qtd) {
  if (!valor) return false;
  const s = String(valor).trim();
  const re = new RegExp(`^\\d{${qtd}}$`);
  return re.test(s);
}

// Recalcula e atualiza o status do plano (chamado após mudanças no realizado)
async function atualizarStatusPlano(planoId, client) {
  const db = client || pool;
  const r = await db.query('SELECT meta, realizado, data_limite FROM prod_planos WHERE id=$1', [planoId]);
  if (!r.rows.length) return;
  const p = r.rows[0];
  const meta = parseFloat(p.meta) || 0;
  const realizado = parseFloat(p.realizado) || 0;
  const pct = meta > 0 ? (realizado / meta) * 100 : 0;
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  const dl = p.data_limite ? new Date(p.data_limite) : null;
  let status = 'em_andamento';
  if (pct >= 100) status = 'concluido';
  else if (dl && dl < hoje) status = 'atrasado';
  await db.query('UPDATE prod_planos SET status=$1 WHERE id=$2', [status, planoId]);
}

// =====================================================
// PROD-PLANOS  (planos mensais)
// =====================================================

router.get('/prod-planos', requireAuth, async (req, res) => {
  try {
    const { mes } = req.query;
    let q = 'SELECT * FROM prod_planos';
    const params = [];
    if (mes) { params.push(mes); q += ' WHERE mes=$1'; }
    q += ' ORDER BY data_limite ASC NULLS LAST, id DESC';
    const r = await pool.query(q, params);
    res.json(r.rows);
  } catch (err) {
    console.error('GET /prod-planos', err);
    res.status(500).json({ error: 'Erro ao listar planos' });
  }
});

router.get('/prod-planos/:id', requireAuth, async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM prod_planos WHERE id=$1', [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Plano não encontrado' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error('GET /prod-planos/:id', err);
    res.status(500).json({ error: 'Erro ao buscar plano' });
  }
});

router.post('/prod-planos', requireAuth, async (req, res) => {
  try {
    const { data_limite, cod_decio, cod_intelbras, descricao, produto, meta, observacoes } = req.body;
    if (!data_limite) return res.status(400).json({ error: 'Data limite obrigatória' });
    if (!cod_decio) return res.status(400).json({ error: 'Código Décio obrigatório' });
    const mes = mesDaData(data_limite);
    const prod = produto || descricao || cod_decio;
    const r = await pool.query(
      `INSERT INTO prod_planos (mes, data_limite, cod_decio, cod_intelbras, descricao, produto, meta, observacoes, realizado, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,0,'em_andamento') RETURNING *`,
      [mes, data_limite, cod_decio, cod_intelbras || null, descricao || null, prod, meta || 0, observacoes || null]
    );
    await atualizarStatusPlano(r.rows[0].id);
    const final = await pool.query('SELECT * FROM prod_planos WHERE id=$1', [r.rows[0].id]);
    res.json(final.rows[0]);
  } catch (err) {
    console.error('POST /prod-planos', err);
    res.status(500).json({ error: 'Erro ao criar plano' });
  }
});

router.put('/prod-planos/:id', requireAuth, async (req, res) => {
  try {
    const { data_limite, cod_decio, cod_intelbras, descricao, produto, meta, observacoes } = req.body;
    const mes = data_limite ? mesDaData(data_limite) : null;
    const prod = produto || descricao || cod_decio;
    await pool.query(
      `UPDATE prod_planos
       SET data_limite=COALESCE($1,data_limite),
           mes=COALESCE($2,mes),
           cod_decio=COALESCE($3,cod_decio),
           cod_intelbras=COALESCE($4,cod_intelbras),
           descricao=COALESCE($5,descricao),
           produto=COALESCE($6,produto),
           meta=COALESCE($7,meta),
           observacoes=COALESCE($8,observacoes)
       WHERE id=$9`,
      [data_limite || null, mes, cod_decio || null, cod_intelbras || null, descricao || null, prod || null, meta ?? null, observacoes || null, req.params.id]
    );
    await atualizarStatusPlano(req.params.id);
    const r = await pool.query('SELECT * FROM prod_planos WHERE id=$1', [req.params.id]);
    res.json(r.rows[0]);
  } catch (err) {
    console.error('PUT /prod-planos/:id', err);
    res.status(500).json({ error: 'Erro ao atualizar plano' });
  }
});

router.delete('/prod-planos/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM prod_planos WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /prod-planos/:id', err);
    res.status(500).json({ error: 'Erro ao excluir plano' });
  }
});

// =====================================================
// PROD-APONTAMENTOS  (apontamentos simples - mantidos por compatibilidade)
// =====================================================

router.get('/prod-apontamentos', requireAuth, async (req, res) => {
  try {
    const { plano_id, mes } = req.query;
    let q = `SELECT a.*, p.mes, p.produto, p.cod_decio, p.cod_intelbras
             FROM prod_apontamentos a LEFT JOIN prod_planos p ON p.id = a.plano_id`;
    const params = [];
    const where = [];
    if (plano_id) { params.push(plano_id); where.push(`a.plano_id=$${params.length}`); }
    if (mes) { params.push(mes); where.push(`p.mes=$${params.length}`); }
    if (where.length) q += ' WHERE ' + where.join(' AND ');
    q += ' ORDER BY a.data DESC, a.id DESC';
    const r = await pool.query(q, params);
    res.json(r.rows);
  } catch (err) {
    console.error('GET /prod-apontamentos', err);
    res.status(500).json({ error: 'Erro ao listar apontamentos' });
  }
});

router.post('/prod-apontamentos', requireAuth, async (req, res) => {
  try {
    const { plano_id, data, quantidade, observacoes } = req.body;
    if (!plano_id) return res.status(400).json({ error: 'Plano obrigatório' });
    const r = await pool.query(
      `INSERT INTO prod_apontamentos (plano_id, data, quantidade, observacoes)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [plano_id, data || new Date(), quantidade || 0, observacoes || null]
    );
    res.json(r.rows[0]);
  } catch (err) {
    console.error('POST /prod-apontamentos', err);
    res.status(500).json({ error: 'Erro ao criar apontamento' });
  }
});

router.delete('/prod-apontamentos/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM prod_apontamentos WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /prod-apontamentos/:id', err);
    res.status(500).json({ error: 'Erro ao excluir apontamento' });
  }
});

// =====================================================
// PROD-APONTAMENTOS-DETALHADOS  (novo: detalhado com OP, séries, etc)
// =====================================================

router.get('/prod-apontamentos-detalhados', requireAuth, async (req, res) => {
  try {
    const { data_ini, data_fim, turno, celula, num_op, cod_decio, mes } = req.query;
    const params = [];
    const where = [];
    if (data_ini) { params.push(data_ini); where.push(`data_execucao >= $${params.length}`); }
    if (data_fim) { params.push(data_fim); where.push(`data_execucao <= $${params.length}`); }
    if (turno) { params.push(turno); where.push(`turno = $${params.length}`); }
    if (celula) { params.push(celula); where.push(`celula = $${params.length}`); }
    if (num_op) { params.push(num_op); where.push(`num_op = $${params.length}`); }
    if (cod_decio) { params.push(cod_decio); where.push(`cod_decio = $${params.length}`); }
    if (mes) { params.push(mes); where.push(`to_char(data_execucao,'YYYY-MM') = $${params.length}`); }
    let q = 'SELECT * FROM prod_apontamentos_detalhados';
    if (where.length) q += ' WHERE ' + where.join(' AND ');
    q += ' ORDER BY data_execucao DESC, id DESC';
    const r = await pool.query(q, params);
    res.json(r.rows);
  } catch (err) {
    console.error('GET /prod-apontamentos-detalhados', err);
    res.status(500).json({ error: 'Erro ao listar apontamentos detalhados' });
  }
});

router.get('/prod-apontamentos-detalhados/:id', requireAuth, async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM prod_apontamentos_detalhados WHERE id=$1', [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Apontamento não encontrado' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error('GET /prod-apontamentos-detalhados/:id', err);
    res.status(500).json({ error: 'Erro ao buscar apontamento' });
  }
});

router.post('/prod-apontamentos-detalhados', requireAuth, async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      data_execucao, turno, celula, num_op, serie_inicial, serie_final,
      cod_decio, cod_intelbras, descricao, categoria,
      meta, realizado, hora_reportada_total, observacoes
    } = req.body;

    // Validações
    if (!data_execucao) return res.status(400).json({ error: 'Data de execução obrigatória' });
    if (!turno) return res.status(400).json({ error: 'Turno obrigatório' });
    if (!celula) return res.status(400).json({ error: 'Célula obrigatória' });
    if (!validarDigitos(num_op, 8)) return res.status(400).json({ error: 'N° OP deve ter exatos 8 dígitos numéricos' });
    if (!validarDigitos(serie_inicial, 13)) return res.status(400).json({ error: 'N° Série Inicial deve ter exatos 13 dígitos numéricos' });
    if (!validarDigitos(serie_final, 13)) return res.status(400).json({ error: 'N° Série Final deve ter exatos 13 dígitos numéricos' });
    if (!cod_decio) return res.status(400).json({ error: 'Código Décio obrigatório' });

    await client.query('BEGIN');

    // Tenta localizar o plano correspondente (mesmo cod_decio e mesmo mês da data)
    const mes = mesDaData(data_execucao);
    const planoRes = await client.query(
      'SELECT id FROM prod_planos WHERE cod_decio=$1 AND mes=$2 LIMIT 1',
      [cod_decio, mes]
    );
    const planoId = planoRes.rows.length ? planoRes.rows[0].id : null;

    // Insere o apontamento detalhado
    const r = await client.query(
      `INSERT INTO prod_apontamentos_detalhados
       (data_execucao, turno, celula, num_op, serie_inicial, serie_final,
        cod_decio, cod_intelbras, descricao, categoria,
        meta, realizado, hora_reportada_total, observacoes, plano_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING *`,
      [
        data_execucao, turno, celula, num_op, serie_inicial, serie_final,
        cod_decio, cod_intelbras || null, descricao || null, categoria || null,
        meta || 0, realizado || 0, hora_reportada_total || 0,
        observacoes || null, planoId
      ]
    );

    // Se encontrou plano, soma o realizado e atualiza status
    if (planoId) {
      await client.query(
        'UPDATE prod_planos SET realizado = COALESCE(realizado,0) + $1 WHERE id=$2',
        [parseFloat(realizado) || 0, planoId]
      );
      await atualizarStatusPlano(planoId, client);
    }

    await client.query('COMMIT');
    res.json({ ...r.rows[0], plano_encontrado: !!planoId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('POST /prod-apontamentos-detalhados', err);
    res.status(500).json({ error: 'Erro ao criar apontamento detalhado' });
  } finally {
    client.release();
  }
});

router.delete('/prod-apontamentos-detalhados/:id', requireAuth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Busca o apontamento para saber se está vinculado a um plano e quanto subtrair
    const ap = await client.query('SELECT * FROM prod_apontamentos_detalhados WHERE id=$1', [req.params.id]);
    if (!ap.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Apontamento não encontrado' });
    }
    const a = ap.rows[0];
    if (a.plano_id) {
      await client.query(
        'UPDATE prod_planos SET realizado = GREATEST(COALESCE(realizado,0) - $1, 0) WHERE id=$2',
        [parseFloat(a.realizado) || 0, a.plano_id]
      );
      await atualizarStatusPlano(a.plano_id, client);
    }
    await client.query('DELETE FROM prod_apontamentos_detalhados WHERE id=$1', [req.params.id]);
    await client.query('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('DELETE /prod-apontamentos-detalhados/:id', err);
    res.status(500).json({ error: 'Erro ao excluir apontamento' });
  } finally {
    client.release();
  }
});

module.exports = router;
