require('dotenv').config();
const { Pool } = require('pg');

// En la nube (Neon, Render...) se usa DATABASE_URL; en tu PC, las variables DB_*
const conexion = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };

const pool = new Pool({
  ...conexion,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000, // da tiempo a que la base "despierte" si estaba en reposo
});

// Evita que el servidor se caiga si la base cierra una conexión inactiva
pool.on('error', (error) => console.error('Conexión inactiva cerrada por la base:', error.message));

module.exports = pool;
