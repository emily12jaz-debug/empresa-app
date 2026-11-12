const express = require('express');
const pool = require('../db');
const { verificarToken, soloRol } = require('../middleware/auth');
const { enviarCorreo } = require('../utils/correo');
const { correoConfirmacion } = require('../utils/plantillaCorreo');

const router = express.Router();
const ESTADOS = ['Pedido', 'Pendiente', 'Enviado', 'Finalizado', 'Cancelado'];

// Enlace del botón "Ver mi pedido" del correo
const urlCuenta = `${(process.env.FRONTEND_URL || 'http://localhost:3000').split(',')[0].trim()}/cuenta-cliente`;

const CONSULTA_PEDIDOS = `
  SELECT p.id_pedido, p.estado, p.total, p.fecha, u.correo,
         json_agg(json_build_object('titulo', d.titulo, 'modelo', d.modelo,
                                    'cantidad', d.cantidad, 'precio', d.precio_unitario)
                  ORDER BY d.id_detalle) AS items
  FROM pedidos p
  JOIN usuarios u ON u.id_usuario = p.id_usuario
  JOIN pedido_detalle d ON d.id_pedido = p.id_pedido`;

// CLIENTE: convertir el carrito en pedido y mandar el correo de confirmación
router.post('/pedidos/checkout', verificarToken, soloRol('Cliente'), async (req, res) => {
  const client = await pool.connect();
  let pedido, items, usuario;
  try {
    await client.query('BEGIN');

    const carrito = await client.query(
      `SELECT c.id_producto, c.cantidad, p.titulo, p.modelo, p.precio
       FROM carrito_items c JOIN productos p ON p.id_producto = c.id_producto
       WHERE c.id_usuario = $1 AND p.activo ORDER BY c.agregado`,
      [req.usuario.id]
    );
    items = carrito.rows;
    if (items.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ mensaje: 'Tu carrito está vacío' });
    }

    const total = items.reduce((suma, i) => suma + Number(i.precio) * i.cantidad, 0);
    const nuevo = await client.query(
      'INSERT INTO pedidos (id_usuario, total) VALUES ($1, $2) RETURNING id_pedido, fecha',
      [req.usuario.id, total]
    );
    pedido = { ...nuevo.rows[0], total };

    for (const i of items) {
      await client.query(
        `INSERT INTO pedido_detalle (id_pedido, id_producto, titulo, modelo, precio_unitario, cantidad)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [pedido.id_pedido, i.id_producto, i.titulo, i.modelo, i.precio, i.cantidad]
      );
    }
    await client.query('DELETE FROM carrito_items WHERE id_usuario = $1', [req.usuario.id]);

    const u = await client.query(
      `SELECT u.correo, c.nombres FROM usuarios u JOIN clientes c ON c.id_usuario = u.id_usuario
       WHERE u.id_usuario = $1`,
      [req.usuario.id]
    );
    usuario = u.rows[0];
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    return res.status(500).json({ mensaje: 'No se pudo registrar la compra' });
  } finally {
    client.release();
  }

  // El pedido ya está guardado: si el correo falla, la compra NO se pierde
  let correoEnviado = false;
  try {
    correoEnviado = await enviarCorreo({
      to: usuario.correo,
      subject: `Confirmación de tu pedido #${pedido.id_pedido} - ERGOSEATING`,
      html: correoConfirmacion({
        idPedido: pedido.id_pedido,
        nombre: usuario.nombres,
        items,
        total: pedido.total,
        fecha: pedido.fecha,
        urlCuenta,
      }),
    });
  } catch (e) {
    console.error('No se pudo enviar el correo de confirmación:', e.message);
  }

  res.status(201).json({
    mensaje: 'Compra realizada correctamente',
    idPedido: pedido.id_pedido,
    correo: usuario.correo,
    correoEnviado,
  });
});

// CLIENTE: mis pedidos
router.get('/pedidos/mios', verificarToken, soloRol('Cliente'), async (req, res) => {
  try {
    const r = await pool.query(
      `${CONSULTA_PEDIDOS} WHERE p.id_usuario = $1 GROUP BY p.id_pedido, u.correo ORDER BY p.fecha DESC`,
      [req.usuario.id]
    );
    res.json(r.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al consultar tus pedidos' });
  }
});

// ADMIN: todos los pedidos
router.get('/pedidos', verificarToken, soloRol('Administrador'), async (req, res) => {
  try {
    const r = await pool.query(`${CONSULTA_PEDIDOS} GROUP BY p.id_pedido, u.correo ORDER BY p.fecha DESC`);
    res.json(r.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al consultar los pedidos' });
  }
});

// ADMIN: cambiar estado
router.put('/pedidos/:id/estado', verificarToken, soloRol('Administrador'), async (req, res) => {
  if (!ESTADOS.includes(req.body.estado)) return res.status(400).json({ mensaje: 'Estado no válido' });
  try {
    const r = await pool.query('UPDATE pedidos SET estado = $1 WHERE id_pedido = $2 RETURNING id_pedido', [
      req.body.estado,
      req.params.id,
    ]);
    if (!r.rows[0]) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    res.json({ mensaje: 'Estado actualizado' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al actualizar el estado' });
  }
});

module.exports = router;
