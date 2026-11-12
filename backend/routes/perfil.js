const express = require('express');
const pool = require('../db');
const { verificarToken, soloRol } = require('../middleware/auth');

const router = express.Router();
router.use('/perfil', verificarToken, soloRol('Cliente'));

router.get('/perfil', async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT u.correo, c.telefono FROM usuarios u JOIN clientes c ON c.id_usuario = u.id_usuario
       WHERE u.id_usuario = $1`,
      [req.usuario.id]
    );
    res.json(r.rows[0] || {});
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al consultar tus datos' });
  }
});

router.put('/perfil', async (req, res) => {
  const correo = req.body.correo?.trim();
  const telefono = (req.body.telefono || '').replace(/[\s-]/g, '');
  if (!correo || !/^\S+@\S+\.\S+$/.test(correo)) return res.status(400).json({ mensaje: 'El correo no es válido' });
  if (!/^\d{10}$/.test(telefono)) return res.status(400).json({ mensaje: 'El teléfono debe tener 10 dígitos' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE usuarios SET correo = $1 WHERE id_usuario = $2', [correo, req.usuario.id]);
    await client.query('UPDATE clientes SET telefono = $1 WHERE id_usuario = $2', [telefono, req.usuario.id]);
    await client.query('COMMIT');
    res.json({ correo, telefono });
  } catch (e) {
    await client.query('ROLLBACK');
    if (e.code === '23505') return res.status(409).json({ mensaje: 'Ya existe una cuenta con ese correo' });
    console.error(e);
    res.status(500).json({ mensaje: 'Error al guardar tus datos' });
  } finally {
    client.release();
  }
});

module.exports = router;
