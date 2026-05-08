const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

// ======================== REGISTROS ========================

router.get('/db-registros', requireAuth, async (req, res) => {
  try { res.json((await pool.query('SELECT * FROM db_registros ORDER BY data DESC, hora DESC NULLS LAST')).rows); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/db-registros', requireAuth, async (req, res) => {
  try {
    const { data, hora, turno, categoria, prioridade, status, descricao, acao, envolvidos } = req.body;
    if (!data || !descricao) return res.status(400).json({ error: 'Data e descricao obrigatorios' });
    const r = await pool.query(
      'INSERT INTO db_registros (data,hora,turno,categoria,prioridade,status,descricao,acao,envolvidos) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [data, hora||null, turno||null, categoria||null, prioridade||'Baixa', status||'Resolvido', descricao, acao||null, JSON.stringify(envolvidos||[])]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/db-registros/:id', requireAuth, async (req, res) => {
  try {
    const { data, hora, turno, categoria, prioridade, status, descricao, acao, envolvidos } = req.body;
    const r = await pool.query(
      'UPDATE db_registros SET data=$1,hora=$2,turno=$3,categoria=$4,prioridade=$5,status=$6,descricao=$7,acao=$8,envolvidos=$9,updated_at=NOW() WHERE id=$10 RETURNING *',
      [data, hora, turno, categoria, prioridade, status, descricao, acao, JSON.stringify(envolvidos||[]), req.params.id]
    );
    if (r.rows.length === 0) return res.status(404).json({ error: 'Nao encontrado' });
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/db-registros/:id', requireAuth, async (req, res) => {
  try { await pool.query('DELETE FROM db_registros WHERE id=$1', [req.params.id]); res.json({ success: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// ======================== RESUMOS ========================

router.get('/db-resumos', requireAuth, async (req, res) => {
  try { res.json((await pool.query('SELECT * FROM db_resumos ORDER BY data DESC')).rows); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/db-resumos', requireAuth, async (req, res) => {
  try {
    const { data, turno, texto, obs } = req.body;
    if (!data || !texto) return res.status(400).json({ error: 'Data e texto obrigatorios' });
    const r = await pool.query(
      'INSERT INTO db_resumos (data,turno,texto,obs) VALUES ($1,$2,$3,$4) RETURNING *',
      [data, turno||null, texto, obs||null]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/db-resumos/:id', requireAuth, async (req, res) => {
  try { await pool.query('DELETE FROM db_resumos WHERE id=$1', [req.params.id]); res.json({ success: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
