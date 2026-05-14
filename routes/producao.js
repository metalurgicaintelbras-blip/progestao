const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

// ======================== PLANOS DE PRODUÇÃO ========================

// GET /api/prod-planos?mes=2026-05
router.get('/prod-planos', requireAuth, async (req, res) => {
  try {
    const { mes } = req.query;
    let q = 'SELECT * FROM prod_planos';
    const params = [];
    if (mes) { q += ' WHERE mes=$1'; params.push(mes); }
    q += ' ORDER BY codigo';
    res.json((await pool.query(q, params)).rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/prod-planos/:id
router.get('/prod-planos/:id', requireAuth, async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM prod_planos WHERE id=$1', [req.params.id]);
    if (r.rows.length === 0) return res.status(404).json({ error: 'Nao encontrado' });
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/prod-planos
router.post('/prod-planos', requireAuth, async (req, res) => {
  try {
    const { mes, codigo, descricao, meta_mensal, obs, cod_decio, cod_intelbras, status } = req.body;
    if (!mes || !codigo || !descricao || !meta_mensal) {
      return res.status(400).json({ error: 'Campos obrigatorios: mes, codigo, descricao, meta_mensal' });
    }
    const r = await pool.query(
      `INSERT INTO prod_planos (mes,codigo,descricao,meta_mensal,obs,cod_decio,cod_intelbras,status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [mes, codigo, descricao, parseInt(meta_mensal), obs || null,
       cod_decio || null, cod_intelbras || null, status || 'Ativo']
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/prod-planos/:id
router.put('/prod-planos/:id', requireAuth, async (req, res) => {
  try {
    const { mes, codigo, descricao, meta_mensal, obs, cod_decio, cod_intelbras, status } = req.body;
    const r = await pool.query(
      `UPDATE prod_planos SET mes=$1,codigo=$2,descricao=$3,meta_mensal=$4,obs=$5,
       cod_decio=$6,cod_intelbras=$7,status=$8,updated_at=NOW() WHERE id=$9 RETURNING *`,
      [mes, codigo, descricao, parseInt(meta_mensal), obs || null,
       cod_decio || null, cod_intelbras || null, status || 'Ativo', req.params.id]
    );
    if (r.rows.length === 0) return res.status(404).json({ error: 'Nao encontrado' });
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/prod-planos/:id
router.delete('/prod-planos/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM prod_planos WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ======================== APONTAMENTOS DE PRODUÇÃO ========================

// GET /api/prod-apontamentos?plano_id=1&mes=2026-05
router.get('/prod-apontamentos', requireAuth, async (req, res) => {
  try {
    const { plano_id, mes } = req.query;
    let q = `SELECT a.*, p.codigo, p.descricao as prod_descricao, p.meta_mensal
             FROM prod_apontamentos a
             JOIN prod_planos p ON a.plano_id = p.id`;
    const params = [];
    const conds = [];
    if (plano_id) { conds.push('a.plano_id=$' + (params.length + 1)); params.push(plano_id); }
    if (mes) { conds.push('p.mes=$' + (params.length + 1)); params.push(mes); }
    if (conds.length) q += ' WHERE ' + conds.join(' AND ');
    q += ' ORDER BY a.data DESC, p.codigo';
    res.json((await pool.query(q, params)).rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/prod-apontamentos
router.post('/prod-apontamentos', requireAuth, async (req, res) => {
  try {
    const { plano_id, data, qtd_realizada, atingiu_meta, justificativa } = req.body;
    if (!plano_id || !data || qtd_realizada === undefined) {
      return res.status(400).json({ error: 'Campos obrigatorios: plano_id, data, qtd_realizada' });
    }
    const r = await pool.query(
      `INSERT INTO prod_apontamentos (plano_id,data,qtd_realizada,atingiu_meta,justificativa)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (plano_id,data) DO UPDATE SET qtd_realizada=$3, atingiu_meta=$4, justificativa=$5, created_at=NOW()
       RETURNING *`,
      [plano_id, data, parseInt(qtd_realizada), atingiu_meta !== false, justificativa||null]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/prod-apontamentos/:id
router.delete('/prod-apontamentos/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM prod_apontamentos WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
