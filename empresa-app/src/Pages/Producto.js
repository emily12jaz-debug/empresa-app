import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api, obtenerSesion, IMAGENES, formatoPrecio } from '../api';

export default function Producto() {
  const navigate = useNavigate();
  const sesion = obtenerSesion();

  // Producto elegido en la tarjeta (se guarda al presionar "Comprar")
  const [producto] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('productoSeleccionado'));
    } catch {
      return null;
    }
  });
  const [cantidad, setCantidad] = useState(1);
  const [avisoCarrito, setAvisoCarrito] = useState({ tipo: '', texto: '' });
  const [agregando, setAgregando] = useState(false);

  const agregarAlCarrito = async () => {
    const unidades = Number(cantidad);
    if (!Number.isInteger(unidades) || unidades < 1) {
      setAvisoCarrito({ tipo: 'danger', texto: 'Ingresa una cantidad válida (1 o más)' });
      return;
    }
    setAgregando(true);
    try {
      await api('/carrito', { method: 'POST', body: { idProducto: producto.id_producto, cantidad: unidades } });
      setAvisoCarrito({ tipo: 'success', texto: 'Producto agregado a tu carrito' });
    } catch (error) {
      setAvisoCarrito({ tipo: 'danger', texto: error.message });
    } finally {
      setAgregando(false);
    }
  };

  // Comentarios guardados en la base de datos (se cargan según el producto)
  const [comentarios, setComentarios] = useState([]);
  const [cargandoComentarios, setCargandoComentarios] = useState(true);
  const [avisoComentario, setAvisoComentario] = useState({ tipo: '', texto: '' });
  const [publicando, setPublicando] = useState(false);

  useEffect(() => {
    if (!producto) return undefined;
    let activo = true;
    api(`/productos/${producto.id_producto}/comentarios`)
      .then((datos) => activo && setComentarios(datos))
      .catch((error) => activo && setAvisoComentario({ tipo: 'danger', texto: error.message }))
      .finally(() => activo && setCargandoComentarios(false));
    return () => {
      activo = false;
    };
  }, [producto]);

  // Estados locales para el formulario de nuevo comentario
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaCalificacion, setNuevaCalificacion] = useState(5);
  const [nuevoTexto, setNuevoTexto] = useState('');

  // Guarda el comentario en la base de datos y lo agrega al listado
  const manejarEnvioComentario = async (e) => {
    e.preventDefault();

    if (!nuevoTexto.trim()) {
      setAvisoComentario({ tipo: 'danger', texto: 'Escribe un comentario antes de publicar.' });
      return;
    }

    setPublicando(true);
    try {
      const creado = await api(`/productos/${producto.id_producto}/comentarios`, {
        method: 'POST',
        body: { nombre: nuevoNombre, calificacion: Number(nuevaCalificacion), comentario: nuevoTexto },
      });
      setComentarios((anteriores) => [creado, ...anteriores]);

      // Limpiar formulario
      setNuevoNombre('');
      setNuevoTexto('');
      setNuevaCalificacion(5);
      setAvisoComentario({ tipo: 'success', texto: 'Tu comentario fue publicado' });
    } catch (error) {
      setAvisoComentario({ tipo: 'danger', texto: error.message });
    } finally {
      setPublicando(false);
    }
  };

  // Función auxiliar para dibujar las estrellas Unicode
  const renderEstrellas = (num) => {
    const llenas = '★'.repeat(num);
    const vacias = '☆'.repeat(5 - num);
    return `${llenas}${vacias}`;
  };

  if (!sesion || sesion.rol !== 'Cliente') return <Navigate to="/iniciar-sesion" replace />;
  if (!producto) return <Navigate to="/cuenta-cliente" replace />;

  return (
    <main className="container my-5">
      {/* Sección Superior: Producto */}
      <div className="row g-4 mb-4">
        {/* Imagen */}
        <div className="col-12 col-md-6 d-flex">
          <div 
            className="w-100 bg-white p-4 d-flex align-items-center justify-content-center"
            style={{ borderWidth: '1.5px', minHeight: '350px' }}
          >
            <img 
              src={IMAGENES[producto.imagen] || IMAGENES.silla1} 
              alt={producto.titulo} 
              className="img-fluid"
              style={{ maxHeight: '300px', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Detalles */}
        <div className="col-12 col-md-6 d-flex flex-column justify-content-between py-2">
          <div>
            <h3 className="fw-bold m-0" style={{ color: '#000000' }}>
              {producto.titulo}
            </h3>
            <p className="text-secondary m-0 mt-1" style={{ fontSize: '0.95rem' }}>
              Modelo: {producto.modelo}
            </p>

            <div className="mt-3">
              <span className="fw-bold fs-3" style={{ color: '#d9534f' }}>
                {formatoPrecio(producto.precio)}
              </span>
            </div>

            <div className="mt-3 d-flex align-items-end gap-3 flex-wrap">
              <div>
                <label className="d-block mb-1 small fw-semibold text-dark">Cantidad:</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  className="bg-white p-2"
                  style={{ border: '1.5px solid #000000', outline: 'none', width: '100px' }}
                />
              </div>
              <button
                type="button"
                disabled={agregando}
                className="btn text-white fw-medium px-4 py-2"
                style={{ backgroundColor: '#071f4c', borderRadius: '0px', fontSize: '0.95rem', minWidth: '170px' }}
                onClick={agregarAlCarrito}
              >
                {agregando ? 'Agregando...' : 'Agregar al carrito'}
              </button>
              <button
                type="button"
                className="btn btn-outline-dark fw-medium px-4 py-2"
                style={{ borderRadius: '0px', fontSize: '0.95rem' }}
                onClick={() => navigate('/cuenta-cliente')}
              >
                Ir a mi cuenta
              </button>
            </div>
            {avisoCarrito.texto && (
              <p className={`mt-2 mb-0 fw-medium text-${avisoCarrito.tipo}`}>{avisoCarrito.texto}</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-top">
            <h5 className="fw-bold mb-2" style={{ color: '#000000' }}>
              Descripción detallada del producto
            </h5>
            <p className="m-0 text-secondary" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
              {producto.descripcion}
            </p>
          </div>
        </div>
      </div>

      {/* Sección Inferior: Formulario + Comentarios */}
      <div 
        className="bg-white p-4 mt-2"
        style={{ borderWidth: '1.5px' }}
      >
        <h5 className="fw-bold mb-3" style={{ color: '#000000' }}>
          Opiniones y Comentarios
        </h5>

        {/* Formulario para publicar comentario */}
        <form onSubmit={manejarEnvioComentario} className="mb-4 pb-4 border-bottom">
          <div className="row g-3">
            <div className="col-12 col-md-8">
              <label className="d-block mb-1 small fw-semibold text-dark">Nombre:</label>
              <input
                type="text"
                placeholder="Ej. Escuela Secundaria No. 12"
                className="w-100 bg-white p-2"
                style={{ border: '1px solid #000000', fontSize: '0.9rem', outline: 'none' }}
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="d-block mb-1 small fw-semibold text-dark">Calificación:</label>
              <select
                className="w-100 bg-white p-2"
                style={{ border: '1px solid #000000', fontSize: '0.9rem', outline: 'none' }}
                value={nuevaCalificacion}
                onChange={(e) => setNuevaCalificacion(e.target.value)}
              >
                <option value={5}>★★★★★ (5/5)</option>
                <option value={4}>★★★★☆ (4/5)</option>
                <option value={3}>★★★☆☆ (3/5)</option>
                <option value={2}>★★☆☆☆ (2/5)</option>
                <option value={1}>★☆☆☆☆ (1/5)</option>
              </select>
            </div>

            <div className="col-12">
              <label className="d-block mb-1 small fw-semibold text-dark">Tu comentario:</label>
              <textarea
                rows="3"
                placeholder="Escribe tu opinión sobre el producto..."
                className="w-100 bg-white p-2"
                style={{ border: '1px solid #000000', fontSize: '0.9rem', outline: 'none' }}
                value={nuevoTexto}
                onChange={(e) => setNuevoTexto(e.target.value)}
              ></textarea>
            </div>

            {avisoComentario.texto && (
              <div className="col-12">
                <p className={`m-0 fw-medium text-${avisoComentario.tipo}`}>{avisoComentario.texto}</p>
              </div>
            )}

            <div className="col-12 text-end">
              <button
                type="submit"
                disabled={publicando}
                className="btn text-white fw-medium px-4 py-2"
                style={{ backgroundColor: '#071f4c', borderRadius: '0px', fontSize: '0.9rem' }}
              >
                {publicando ? 'Publicando...' : 'Publicar comentario'}
              </button>
            </div>
          </div>
        </form>
    
      {/* Listado dinámico de comentarios */}
        <div className="d-flex flex-column gap-3">
          {cargandoComentarios && <p className="text-secondary m-0">Cargando comentarios…</p>}
          {!cargandoComentarios && comentarios.length === 0 && (
            <p className="text-secondary m-0">Aún no hay comentarios. Sé el primero en opinar.</p>
          )}
          {comentarios.map((c) => (
            <div key={c.id_comentario} className="border-bottom pb-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-semibold text-dark" style={{ fontSize: '0.92rem' }}>
                  {c.nombre}
                </span>
                <span style={{ color: '#ffc107', fontSize: '0.95rem' }}>
                  {renderEstrellas(c.calificacion)}
                </span>
              </div>
              <p className="m-0 text-secondary" style={{ fontSize: '0.88rem' }}>
                {c.comentario}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}