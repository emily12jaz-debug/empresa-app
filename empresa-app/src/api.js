import silla1 from './Assets/Images/silla1.png';
import silla2 from './Assets/Images/silla2.jpg';
import silla3 from './Assets/Images/silla3.jpg';

// En tu PC apunta al backend local; en la nube se define con REACT_APP_API_URL
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export const IMAGENES = { silla1, silla2, silla3 };

export const formatoPrecio = (n) =>
  `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} MXN`;

export function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem('sesion'));
  } catch {
    return null;
  }
}

// Llamada a la API: agrega el token de la sesión y devuelve el JSON (o lanza un Error con el mensaje)
export async function api(ruta, { method = 'GET', body } = {}) {
  const sesion = obtenerSesion();
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (sesion?.token) headers.Authorization = `Bearer ${sesion.token}`;

  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Intenta de nuevo en unos segundos.');
  }

  const datos = await respuesta.json().catch(() => ({}));

  if (respuesta.status === 401 && sesion?.token) {
    localStorage.removeItem('sesion'); // el token venció
    window.location.href = '/iniciar-sesion';
  }
  if (!respuesta.ok) throw new Error(datos.mensaje || 'Ocurrió un error');
  return datos;
}
