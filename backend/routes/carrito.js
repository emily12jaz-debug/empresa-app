const express = require('express');
const pool = require('../db');
const { verificarToken, soloRol } = require('../middleware/auth');

const router = express.Router();
router.use('/carrito', verificarToken, soloRol('Cliente'));

router.get('/carrito', async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT c.id_producto, c.cantidad, p.titulo, p.modelo, p.precio, p.descripcion, p.imagen
       FROM carrito_items c JOIN productos p ON p.id_producto = c.id_producto
       WHERE c.id_usuario = $1 AND p.activo ORDER BY c.agregado`,
      [req.usuario.id]
    );
    res.json(r.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al consultar el carrito' });
  }
});

router.post('/carrito', async (req, res) => {
  const idProducto = Number(req.body.idProducto);
  const cantidad = Number(req.body.cantidad ?? 1);
  if (!Number.isInteger(idProducto) || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > 1000) {
    return res.status(400).json({ mensaje: 'La cantidad debe ser un número entero entre 1 y 1000' });
  }
  try {
    const existe = await pool.query('SELECT 1 FROM productos WHERE id_producto=$1 AND activo', [idProducto]);
    if (!existe.rows[0]) return res.status(404).json({ mensaje: 'Ese producto ya no está disponible' });
    await pool.query(
      `INSERT INTO carrito_items (id_usuario, id_producto, cantidad) VALUES ($1, $2, $3)
       ON CONFLICT (id_usuario, id_producto)
       DO UPDATE SET cantidad = LEAST(carrito_items.cantidad + EXCLUDED.cantidad, 1000)`,
      [req.usuario.id, idProducto, cantidad]
    );
    res.status(201).json({ mensaje: 'Producto agregado al carrito' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al agregar al carrito' });
  }
});

router.delete('/carrito/:idProducto', async (req, res) => {
  try {
    await pool.query('DELETE FROM carrito_items WHERE id_usuario=$1 AND id_producto=$2', [
      req.usuario.id,
      req.params.idProducto,
    ]);
    res.json({ mensaje: 'Producto quitado del carrito' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al quitar el producto' });
  }
});

module.exports = router;
