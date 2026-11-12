const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const cabecera = req.headers.authorization || '';
  const token = cabecera.startsWith('Bearer ') ? cabecera.slice(7) : null;
  if (!token) return res.status(401).json({ mensaje: 'Inicia sesión para continuar' });
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET); // { id, rol }
    next();
  } catch {
    res.status(401).json({ mensaje: 'Tu sesión expiró, inicia sesión de nuevo' });
  }
}

function soloRol(rol) {
  return (req, res, next) =>
    req.usuario?.rol === rol ? next() : res.status(403).json({ mensaje: 'No tienes permiso para esta acción' });
}

module.exports = { verificarToken, soloRol };
