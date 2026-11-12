require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// Páginas autorizadas a llamar a esta API (separadas por coma en FRONTEND_URL)
const origenes = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',').map((s) => s.trim());
app.use(cors({ origin: origenes }));
app.use(express.json());

// Comprueba que el servidor y la base respondan (también sirve para mantener el servicio despierto)
app.get('/api/salud', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (error) {
    console.error(error.message);
    res.status(503).json({ ok: false });
  }
});

app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/productos'));
app.use('/api', require('./routes/carrito'));
app.use('/api', require('./routes/pedidos'));
app.use('/api', require('./routes/perfil'));

process.on('unhandledRejection', (error) => console.error('Promesa sin atender:', error));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
