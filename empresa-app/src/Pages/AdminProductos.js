import React, { useState, useEffect } from 'react';
import Card from '../Components/Card';
import { api, IMAGENES, formatoPrecio } from '../api';

const VACIO = { id: null, title: '', model: '', price: '', descripcion: '', imagen: 'silla1' };
const aUI = (p) => ({
  id: p.id_producto,
  title: p.titulo,
  model: p.modelo,
  price: p.precio,
  descripcion: p.descripcion,
  imagen: p.imagen,
});

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [recarga, setRecarga] = useState(0);
  const [error, setError] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEliminar, setIdEliminar] = useState(null); // Estado para controlar la confirmación de eliminación
  const [productoActual, setProductoActual] = useState(VACIO);

  // Carga el inventario desde la base de datos
  useEffect(() => {
    let activo = true;
    api('/productos')
      .then((datos) => {
        if (activo) {
          setProductos(datos.map(aUI));
          setError('');
        }
      })
      .catch((e) => activo && setError(e.message));
    return () => {
      activo = false;
    };
  }, [recarga]);

  const recargar = () => setRecarga((n) => n + 1);

  const abrirModalAgregar = () => {
    setProductoActual(VACIO);
    setModoEdicion(false);
    setMostrarModal(true);
  };

  const abrirModalEditar = (prod) => {
    setProductoActual(prod);
    setModoEdicion(true);
    setMostrarModal(true);
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    setError('');
    const cuerpo = {
      titulo: productoActual.title,
      modelo: productoActual.model,
      precio: Number(productoActual.price),
      descripcion: productoActual.descripcion,
      imagen: productoActual.imagen,
    };
    try {
      if (modoEdicion) {
        await api(`/productos/${productoActual.id}`, { method: 'PUT', body: cuerpo });
      } else {
        await api('/productos', { method: 'POST', body: cuerpo });
      }
      setMostrarModal(false);
      recargar();
    } catch (err) {
      setError(err.message);
    }
  };

  const solicitarEliminacion = (id) => {
    setIdEliminar(id);
  };

  const confirmarEliminacion = async () => {
    if (!idEliminar) return;
    try {
      await api(`/productos/${idEliminar}`, { method: 'DELETE' });
      setIdEliminar(null);
      recargar();
    } catch (err) {
      setIdEliminar(null);
      setError(err.message);
    }
  };

  return (
    <div className="w-100">
      {error && <p className="text-danger fw-medium">{error}</p>}

      {/* Sección 1: Cambios recientes */}
      <section className="mb-5">
        <h5 className="fw-bold mb-3 text-dark">Cambios recientes</h5>
        <div className="row g-4">
          {productos.slice(0, 3).map((prod) => (
            <div key={prod.id} className="col-12 col-md-4">
              <div className="position-relative">
                <Card title={prod.title} model={prod.model} price={formatoPrecio(prod.price)} image={IMAGENES[prod.imagen] || IMAGENES.silla1} />
                <div className="d-flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => abrirModalEditar(prod)}
                    className="btn text-white rounded-0 w-50 fw-bold py-2"
                    style={{ backgroundColor: '#071f4c', borderColor: '#081f44' }}
                  >
                    Modificar
                  </button>
                  <button
                    type="button"
                    onClick={() => solicitarEliminacion(prod.id)}
                    className="btn btn-danger rounded-0 w-50 fw-bold py-2"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección 2: Productos disponibles a la venta */}
      <section className="mb-4">
        <h5 className="fw-bold mb-3 text-dark">Productos disponibles a la venta</h5>
        <div className="row g-4">
          {/* Tarjeta especial + Agregar producto */}
          <div className="col-12 col-md-4">
            <div
              onClick={abrirModalAgregar}
              className="card h-100 border border-dark rounded-0 shadow-sm text-center p-4 d-flex flex-column align-items-center justify-content-center bg-light user-select-none"
              style={{ borderWidth: '1.5px', borderStyle: 'dashed', cursor: 'pointer', minHeight: '320px' }}
            >
              <span className="display-1 fw-bold text-dark">+</span>
              <span className="fw-bold mt-2 text-dark fs-5">Agregar producto</span>
            </div>
          </div>

          {/* Listado de tarjetas existentes */}
          {productos.map((prod) => (
            <div key={prod.id} className="col-12 col-md-4">
              <div className="position-relative">
                <Card title={prod.title} model={prod.model} price={formatoPrecio(prod.price)} image={IMAGENES[prod.imagen] || IMAGENES.silla1} />
                <div className="d-flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => abrirModalEditar(prod)}
                    className="btn text-white rounded-0 w-50 fw-bold py-2"
                    style={{ backgroundColor: '#071f4c', borderColor: '#081f44' }}
                  >
                    Modificar
                  </button>
                  <button
                    type="button"
                    onClick={() => solicitarEliminacion(prod.id)}
                    className="btn btn-danger rounded-0 w-50 fw-bold py-2"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Agregar / Modificar Producto Extendido */}
      {mostrarModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
        >
          <div className="bg-white p-4 border border-dark shadow" style={{ borderWidth: '1.5px', maxWidth: '550px', width: '100%' }}>
            <h5 className="fw-bold mb-3 text-dark border-bottom pb-2">
              {modoEdicion ? 'Modificar Producto' : 'Agregar Nuevo Producto'}
            </h5>
            <form onSubmit={guardarProducto}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="d-block mb-1 small fw-semibold">Nombre del producto:</label>
                  <input
                    type="text"
                    className="w-100 p-2 bg-white"
                    style={{ border: '1.5px solid #000', outline: 'none' }}
                    value={productoActual.title}
                    onChange={(e) => setProductoActual({ ...productoActual, title: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="d-block mb-1 small fw-semibold">Modelo:</label>
                  <input
                    type="text"
                    className="w-100 p-2 bg-white"
                    style={{ border: '1.5px solid #000', outline: 'none' }}
                    value={productoActual.model}
                    onChange={(e) => setProductoActual({ ...productoActual, model: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="d-block mb-1 small fw-semibold">Precio ($ MXN):</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    className="w-100 p-2 bg-white"
                    style={{ border: '1.5px solid #000', outline: 'none' }}
                    value={productoActual.price}
                    onChange={(e) => setProductoActual({ ...productoActual, price: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="d-block mb-1 small fw-semibold">Imagen del producto:</label>
                  <select
                    className="w-100 p-2 bg-white"
                    style={{ border: '1.5px solid #000', outline: 'none' }}
                    value={productoActual.imagen}
                    onChange={(e) => setProductoActual({ ...productoActual, imagen: e.target.value })}
                  >
                    <option value="silla1">Imagen Modelo 1</option>
                    <option value="silla2">Imagen Modelo 2</option>
                    <option value="silla3">Imagen Modelo 3</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="d-block mb-1 small fw-semibold">Descripción detallada:</label>
                  <textarea
                    rows="3"
                    className="w-100 p-2 bg-white"
                    style={{ border: '1.5px solid #000', outline: 'none' }}
                    value={productoActual.descripcion}
                    onChange={(e) => setProductoActual({ ...productoActual, descripcion: e.target.value })}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-2 border-top">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="btn btn-outline-dark rounded-0 px-3 py-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn text-white rounded-0 px-4 py-1" style={{ backgroundColor: '#071f4c' }}>
                  {modoEdicion ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Eliminar */}
      {idEliminar !== null && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1060 }}
        >
          <div className="bg-white p-4 border border-dark shadow text-center" style={{ borderWidth: '1.5px', maxWidth: '420px', width: '100%' }}>
            <h5 className="fw-bold mb-3 text-dark border-bottom pb-2">Confirmar Eliminación</h5>
            <p className="text-secondary mb-4" style={{ fontSize: '0.95rem' }}>
              ¿Estás seguro de que deseas eliminar este producto de la venta? Esta acción no se puede deshacer.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <button
                type="button"
                onClick={() => setIdEliminar(null)}
                className="btn btn-outline-dark rounded-0 px-4 py-2"
                style={{ fontSize: '0.9rem' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarEliminacion}
                className="btn btn-danger rounded-0 px-4 py-2"
                style={{ fontSize: '0.9rem' }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}