const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Listar consumíveis em uso (os 4 da máquina)
router.get('/em-uso', async (req, res) => {
    const r = await pool.query('SELECT * FROM consumiveis_em_uso WHERE status = $1', ['Em Uso']);
    res.json(r.rows);
});

// Retirar do estoque e colocar na máquina
router.post('/solicitar', async (req, res) => {
    const { estoque_id, identificador_id } = req.body;
    await pool.query('UPDATE consumiveis_estoque SET quantidade_atual = quantidade_atual - 1 WHERE id = $1', [estoque_id]);
    const r = await pool.query(
        'INSERT INTO consumiveis_em_uso (estoque_id, identificador_id) VALUES ($1, $2) RETURNING *',
        [estoque_id, identificador_id]
    );
    res.json(r.rows[0]);
});

// Descartar consumível
router.put('/descartar/:id', async (req, res) => {
    const { ciclos, motivo } = req.body;
    const r = await pool.query(
        'UPDATE consumiveis_em_uso SET status=$1, ciclos_realizados=$2, motivo_descarte=$3, data_descarte=NOW() WHERE id=$4 RETURNING *',
        ['Descartado', ciclos, motivo, req.params.id]
    );
    res.json(r.rows[0]);
});

module.exports = router;
