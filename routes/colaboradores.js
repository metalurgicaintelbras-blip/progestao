const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET /api/colaboradores
router.get('/', requireAuth, async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM colaboradores ORDER BY nome');
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/colaboradores/aniversarios-empresa — próximos 7 dias
router.get('/aniversarios-empresa', requireAuth, async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT id, nome, mat, cargo, setor, turno, status, dt_admissao,
        EXTRACT(YEAR FROM AGE(
          (CURRENT_DATE + (
            CASE
              WHEN (DATE(TO_CHAR(CURRENT_DATE,'YYYY') || '-' || TO_CHAR(dt_admissao,'MM-DD'))) >= CURRENT_DATE
              THEN (DATE(TO_CHAR(CURRENT_DATE,'YYYY') || '-' || TO_CHAR(dt_admissao,'MM-DD'))) - CURRENT_DATE
              ELSE (DATE(TO_CHAR(CURRENT_DATE,'YYYY') || '-' || TO_CHAR(dt_admissao,'MM-DD')) + INTERVAL '1 year')::DATE - CURRENT_DATE
            END
          )::INTEGER),
          dt_admissao
        ))::INTEGER AS anos_empresa,
        CASE
          WHEN (DATE(TO_CHAR(CURRENT_DATE,'YYYY') || '-' || TO_CHAR(dt_admissao,'MM-DD'))) >= CURRENT_DATE
          THEN (DATE(TO_CHAR(CURRENT_DATE,'YYYY') || '-' || TO_CHAR(dt_admissao,'MM-DD'))) - CURRENT_DATE
          ELSE (DATE(TO_CHAR(CURRENT_DATE,'YYYY') || '-' || TO_CHAR(dt_admissao,'MM-DD')) + INTERVAL '1 year')::DATE - CURRENT_DATE
        END AS dias_faltam
      FROM colaboradores
      WHERE dt_admissao IS NOT NULL
        AND status = 'Ativo'
      HAVING
        CASE
          WHEN (DATE(TO_CHAR(CURRENT_DATE,'YYYY') || '-' || TO_CHAR(dt_admissao,'MM-DD'))) >= CURRENT_DATE
          THEN (DATE(TO_CHAR(CURRENT_DATE,'YYYY') || '-' || TO_CHAR(dt_admissao,'MM-DD'))) - CURRENT_DATE
          ELSE (DATE(TO_CHAR(CURRENT_DATE,'YYYY') || '-' || TO_CHAR(dt_admissao,'MM-DD')) + INTERVAL '1 year')::DATE - CURRENT_DATE
        END <= 7
      ORDER BY dias_faltam ASC
    `);
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/colaboradores/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM colaboradores WHERE id=$1', [req.params.id]);
    if (r.rows.length === 0) return res.status(404).json({ error: 'Nao encontrado' });
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/colaboradores
router.post('/', requireAuth, async (req, res) => {
  try {
    const { nome, mat, cargo, setor, turno, status, dt_admissao } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome obrigatorio' });
    const r = await pool.query(
      'INSERT INTO colaboradores (nome,mat,cargo,setor,turno,status,dt_admissao) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [nome, mat||null, cargo||null, setor||'Montagem', turno||null, status||'Ativo', dt_admissao||null]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/colaboradores/:id
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { nome, mat, cargo, setor, turno, status, dt_admissao } = req.body;
    const r = await pool.query(
      'UPDATE colaboradores SET nome=$1,mat=$2,cargo=$3,setor=$4,turno=$5,status=$6,dt_admissao=$7,updated_at=NOW() WHERE id=$8 RETURNING *',
      [nome, mat, cargo, setor, turno, status, dt_admissao||null, req.params.id]
    );
    if (r.rows.length === 0) return res.status(404).json({ error: 'Nao encontrado' });
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/colaboradores/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM colaboradores WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
