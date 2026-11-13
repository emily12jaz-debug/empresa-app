// Quita acentos, signos y mayúsculas para comparar textos ("Butaca ERGO-E100" -> "butaca ergo e100")
export function normalizar(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Devuelve los productos que contienen TODAS las palabras escritas
// (en el nombre, el modelo o la descripción). Ej.: "butac ergo" encuentra "Butac Ergo. 1".
export function filtrarProductos(productos, consulta) {
  const palabras = normalizar(consulta).split(' ').filter(Boolean);
  if (palabras.length === 0) return [];
  return productos.filter((p) => {
    const texto = normalizar(`${p.titulo} ${p.modelo} ${p.descripcion}`);
    return palabras.every((palabra) => texto.includes(palabra));
  });
}
