const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Convierte "dd-mm-aaaa" a "aaaa-mm-dd". Devuelve null si la fecha no es válida.
function convertirFecha(texto) {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(texto || '');
  if (!m) return null;
  const [, dd, mm, aaaa] = m;
  const fecha = new Date(`${aaaa}-${mm}-${dd}T00:00:00`);
  const esReal =
    fecha.getFullYear() === Number(aaaa) &&
    fecha.getMonth() + 1 === Number(mm) &&
    fecha.getDate() === Number(dd);
  if (!esReal || fecha > new Date() || Number(aaaa) < 1900) return null;
  return `${aaaa}-${mm}-${dd}`;
}

// POST /api/registro  (crea una cuenta de CLIENTE)
router.post('/registro', async (req, res) => {
  const {
    nombres, apellidoPaterno, apellidoMaterno,
    correo, fechaNacimiento, telefono, password,
  } = req.body;

  // --- Validaciones ---
  if (!nombres?.trim() || !apellidoPaterno?.trim() || !correo?.trim() ||
      !fechaNacimiento || !telefono?.trim() || !password) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }
  if (!/^\S+@\S+\.\S+$/.test(correo)) {
    return res.status(400).json({ mensaje: 'El correo no es válido' });
  }
  const fechaISO = convertirFecha(fechaNacimiento);
  if (!fechaISO) {
    return res.status(400).json({ mensaje: 'La fecha debe tener el formato dd-mm-aaaa y ser real' });
  }
  const telefonoLimpio = telefono.replace(/[\s-]/g, '');
  if (!/^\d{10}$/.test(telefonoLimpio)) {
    return res.status(400).json({ mensaje: 'El teléfono debe tener 10 dígitos' });
  }
  if (password.length < 8) {
    return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 8 caracteres' });
  }

  // --- Guardado en una transacción ---
  const client = await pool.connect();
  try {
    const hash = await bcrypt.hash(password, 10);
    await client.query('BEGIN');

    const usuario = await client.query(
      `INSERT INTO usuarios (id_rol, correo, password_hash)
       VALUES ((SELECT id_rol FROM roles WHERE nombre = 'Cliente'), $1, $2)
       RETURNING id_usuario`,
      [correo.trim(), hash]
    );

    await client.query(
      `INSERT INTO clientes
         (id_usuario, nombres, apellido_paterno, apellido_materno, fecha_nacimiento, telefono)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        usuario.rows[0].id_usuario,
        nombres.trim(),
        apellidoPaterno.trim(),
        apellidoMaterno?.trim() || null,
        fechaISO,
        telefonoLimpio,
      ]
    );

    await client.query('COMMIT');
    res.status(201).json({ mensaje: 'Cuenta creada correctamente' });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') {
      return res.status(409).json({ mensaje: 'Ya existe una cuenta con ese correo' });
    }
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la cuenta' });
  } finally {
    client.release();
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  const { rol, correo, password } = req.body;

  if (!['Cliente', 'Administrador'].includes(rol) || !correo?.trim() || !password) {
    return res.status(400).json({ mensaje: 'Completa todos los campos' });
  }

  try {
    const resultado = await pool.query(
      `SELECT u.id_usuario, u.correo, u.password_hash, u.activo, r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON r.id_rol = u.id_rol
       WHERE LOWER(u.correo) = LOWER($1)`,
      [correo.trim()]
    );

    const usuario = resultado.rows[0];

    // Mismo mensaje para "no existe", "contraseña mala" o "rol incorrecto":
    // así no revelamos qué correos están registrados.
    const errorGenerico = { mensaje: 'Usuario o contraseña incorrectos' };

    if (!usuario || !usuario.activo || usuario.rol !== rol) {
      return res.status(401).json(errorGenerico);
    }

    const coincide = await bcrypt.compare(password, usuario.password_hash);
    if (!coincide) {
      return res.status(401).json(errorGenerico);
    }

    // Nombre para mostrar en la página
    const tabla = rol === 'Cliente' ? 'clientes' : 'administradores';
    const perfil = await pool.query(
      `SELECT nombres, apellido_paterno FROM ${tabla} WHERE id_usuario = $1`,
      [usuario.id_usuario]
    );

    await pool.query(
      'UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id_usuario = $1',
      [usuario.id_usuario]
    );

    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      rol: usuario.rol,
      correo: usuario.correo,
      nombre: `${perfil.rows[0].nombres} ${perfil.rows[0].apellido_paterno}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
});

module.exports = router;

