const express = require('express');
const pool = require('../db');
const { verificarToken, soloRol } = require('../middleware/auth');

const router = express.Router();
const IMAGENES = ['silla1', 'silla2', 'silla3'];

function validar(body) {
  const titulo = body.titulo?.trim();
  const modelo = body.modelo?.trim();
  const precio = Number(body.precio);
  const descripcion = body.descripcion?.trim() || '';
  const imagen = IMAGENES.includes(body.imagen) ? body.imagen : 'silla1';
  if (!titulo || !modelo) return { error: 'El nombre y el modelo son obligatorios' };
  if (!Number.isFinite(precio) || precio <= 0 || precio > 9999999) return { error: 'El precio debe ser un número mayor a 0' };
  return { datos: [titulo, modelo, precio, descripcion, imagen] };
}

// Público: catálogo para la página principal
router.get('/productos', async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT id_producto, titulo, modelo, precio, descripcion, imagen
       FROM productos WHERE activo ORDER BY actualizado DESC, id_producto ASC`
    );
    res.json(r.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al consultar los productos' });
  }
});

router.post('/productos', verificarToken, soloRol('Administrador'), async (req, res) => {
  const { error, datos } = validar(req.body);
  if (error) return res.status(400).json({ mensaje: error });
  try {
    const r = await pool.query(
      `INSERT INTO productos (titulo, modelo, precio, descripcion, imagen)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      datos
    );
    res.status(201).json(r.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al crear el producto' });
  }
});

router.put('/productos/:id', verificarToken, soloRol('Administrador'), async (req, res) => {
  const { error, datos } = validar(req.body);
  if (error) return res.status(400).json({ mensaje: error });
  try {
    const r = await pool.query(
      `UPDATE productos SET titulo=$1, modelo=$2, precio=$3, descripcion=$4, imagen=$5,
              actualizado=CURRENT_TIMESTAMP
       WHERE id_producto=$6 AND activo RETURNING *`,
      [...datos, req.params.id]
    );
    if (!r.rows[0]) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(r.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al modificar el producto' });
  }
});

// "Eliminar" = ocultar de la venta (los pedidos anteriores conservan su información)
router.delete('/productos/:id', verificarToken, soloRol('Administrador'), async (req, res) => {
  try {
    const r = await pool.query(
      'UPDATE productos SET activo=FALSE, actualizado=CURRENT_TIMESTAMP WHERE id_producto=$1 AND activo RETURNING id_producto',
      [req.params.id]
    );
    if (!r.rows[0]) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado de la venta' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al eliminar el producto' });
  }
});

module.exports = router;
