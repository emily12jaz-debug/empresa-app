const bcrypt = require('bcryptjs');
const pool = require('./db');

// Uso: node crearAdmin.js correo contraseña "Nombres" "ApellidoPaterno"
const [correo, password, nombres, apellidoPaterno] = process.argv.slice(2);

if (!correo || !password || !nombres || !apellidoPaterno) {
  console.log('Uso: node crearAdmin.js correo contraseña "Nombres" "ApellidoPaterno"');
  process.exit(1);
}
if (password.length < 8) {
  console.log('La contraseña debe tener al menos 8 caracteres');
  process.exit(1);
}

(async () => {
  const client = await pool.connect();
  try {
    const hash = await bcrypt.hash(password, 10);
    await client.query('BEGIN');

    const usuario = await client.query(
      `INSERT INTO usuarios (id_rol, correo, password_hash)
       VALUES ((SELECT id_rol FROM roles WHERE nombre = 'Administrador'), $1, $2)
       RETURNING id_usuario`,
      [correo.trim(), hash]
    );

    await client.query(
      `INSERT INTO administradores (id_usuario, nombres, apellido_paterno)
       VALUES ($1, $2, $3)`,
      [usuario.rows[0].id_usuario, nombres.trim(), apellidoPaterno.trim()]
    );

    await client.query('COMMIT');
    console.log('Administrador creado correctamente');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error.code === '23505' ? 'Ese correo ya existe' : error);
  } finally {
    client.release();
    await pool.end();
  }
})();
