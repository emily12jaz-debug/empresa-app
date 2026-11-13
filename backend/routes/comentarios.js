const express = require('express');
const pool = require('../db');
const { verificarToken, soloRol } = require('../middleware/auth');

const router = express.Router();

// Público: comentarios de un producto, los más recientes primero
router.get('/productos/:id/comentarios', async (req, res) => {
  const idProducto = Number(req.params.id);
  if (!Number.isInteger(idProducto) || idProducto < 1) {
    return res.status(400).json({ mensaje: 'Producto no válido' });
  }
  try {
    const r = await pool.query(
      `SELECT id_comentario, nombre, calificacion, comentario, fecha
       FROM comentarios WHERE id_producto = $1
       ORDER BY fecha DESC, id_comentario DESC`,
      [idProducto]
    );
    res.json(r.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al consultar los comentarios' });
  }
});

// Solo clientes: publicar un comentario en un producto
router.post('/productos/:id/comentarios', verificarToken, soloRol('Cliente'), async (req, res) => {
  const idProducto = Number(req.params.id);
  if (!Number.isInteger(idProducto) || idProducto < 1) {
    return res.status(400).json({ mensaje: 'Producto no válido' });
  }

  const nombre = String(req.body.nombre ?? '').trim() || 'Usuario anónimo';
  const comentario = String(req.body.comentario ?? '').trim();
  const calificacion = Number(req.body.calificacion);

  if (nombre.length > 100) return res.status(400).json({ mensaje: 'El nombre no puede pasar de 100 caracteres' });
  if (!comentario) return res.status(400).json({ mensaje: 'Escribe un comentario antes de publicar' });
  if (comentario.length > 1000) return res.status(400).json({ mensaje: 'El comentario no puede pasar de 1000 caracteres' });
  if (!Number.isInteger(calificacion) || calificacion < 1 || calificacion > 5) {
    return res.status(400).json({ mensaje: 'La calificación debe ser de 1 a 5 estrellas' });
  }

  try {
    const producto = await pool.query('SELECT 1 FROM productos WHERE id_producto = $1 AND activo', [idProducto]);
    if (!producto.rows[0]) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    const r = await pool.query(
      `INSERT INTO comentarios (id_producto, nombre, calificacion, comentario)
       VALUES ($1, $2, $3, $4)
       RETURNING id_comentario, nombre, calificacion, comentario, fecha`,
      [idProducto, nombre, calificacion, comentario]
    );
    res.status(201).json(r.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al publicar el comentario' });
  }
});

module.exports = router;
