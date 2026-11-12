// Crea las tablas en la base configurada en .env:  npm run db:init
const fs = require('fs');
const path = require('path');
const pool = require('./db');

(async () => {
  try {
    await pool.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
    console.log('Base de datos lista: tablas creadas / actualizadas correctamente');
  } catch (error) {
    console.error('Error al crear las tablas:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
