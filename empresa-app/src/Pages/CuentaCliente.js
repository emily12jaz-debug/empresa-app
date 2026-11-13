import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Card from '../Components/Card';
import usuarioIcon from '../Assets/Icons/usuario.svg';
import { api, obtenerSesion, IMAGENES, formatoPrecio } from '../api';

const estiloEncabezado = { backgroundColor: 'rgb(175, 108, 60)' };

export default function CuentaCliente() {
  const navigate = useNavigate();
  const sesion = obtenerSesion();
  const esCliente = sesion?.rol === 'Cliente';

  const [seccionAbierta, setSeccionAbierta] = useState(null); // 'carrito', 'procesos', 'historial'
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [datosCliente, setDatosCliente] = useState({ correo: sesion?.correo || '', telefono: '' });
  const [recarga, setRecarga] = useState(0);
  const [aviso, setAviso] = useState({ tipo: '', texto: '' });
  const [comprando, setComprando] = useState(false);

  const [mostrarModalDatos, setMostrarModalDatos] = useState(false);
  const [formDatos, setFormDatos] = useState({ correo: '', telefono: '' });
  const [errorDatos, setErrorDatos] = useState('');

  // Carga todo desde la base de datos
  useEffect(() => {
    if (!esCliente) return undefined;
    let activo = true;
    Promise.all([api('/productos'), api('/carrito'), api('/pedidos/mios'), api('/perfil')])
      .then(([prods, car, peds, perfil]) => {
        if (!activo) return;
        setProductos(prods);
        setCarrito(car);
        setPedidos(peds);
        if (perfil.correo) setDatosCliente({ correo: perfil.correo, telefono: perfil.telefono });
      })
      .catch((e) => activo && setAviso({ tipo: 'danger', texto: e.message }));
    return () => {
      activo = false;
    };
  }, [recarga, esCliente]);

  if (!esCliente) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  const recargar = () => setRecarga((n) => n + 1);

  const misPedidosEnProceso = pedidos.filter((p) => p.estado !== 'Finalizado' && p.estado !== 'Cancelado');
  const historial = pedidos.filter((p) => p.estado === 'Finalizado' || p.estado === 'Cancelado');
  const unidadesCarrito = carrito.reduce((suma, i) => suma + i.cantidad, 0);
  const subtotalCarrito = carrito.reduce((suma, i) => suma + Number(i.precio) * i.cantidad, 0);
  const descuentoCarrito = unidadesCarrito >= 100 ? Math.round(subtotalCarrito * 0.10 * 100) / 100 : 0;
  const totalCarrito = subtotalCarrito - descuentoCarrito;

  const verDetalleProducto = (producto) => {
    localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
    navigate('/producto');
  };

  const quitarDelCarrito = async (idProducto) => {
    try {
      await api(`/carrito/${idProducto}`, { method: 'DELETE' });
      recargar();
    } catch (e) {
      setAviso({ tipo: 'danger', texto: e.message });
    }
  };

  const finalizarCompra = async () => {
    setAviso({ tipo: '', texto: '' });
    setComprando(true);
    try {
      const r = await api('/pedidos/checkout', { method: 'POST' });
      setAviso({
        tipo: 'success',
        texto: r.correoEnviado
          ? `¡Compra realizada! Tu pedido #${r.idPedido} quedó registrado y te enviamos un correo de confirmación a ${r.correo}.`
          : `¡Compra realizada! Tu pedido #${r.idPedido} quedó registrado. No pudimos enviar el correo de confirmación, pero puedes seguir tu pedido en "Compras en proceso".`,
      });
      setSeccionAbierta('procesos');
      recargar();
    } catch (e) {
      setAviso({ tipo: 'danger', texto: e.message });
    } finally {
      setComprando(false);
    }
  };

  const abrirModalDatos = () => {
    setFormDatos({ ...datosCliente });
    setErrorDatos('');
    setMostrarModalDatos(true);
  };

  const guardarNuevosDatos = async (e) => {
    e.preventDefault();
    setErrorDatos('');
    try {
      const r = await api('/perfil', { method: 'PUT', body: formDatos });
      setDatosCliente({ correo: r.correo, telefono: r.telefono });
      localStorage.setItem('sesion', JSON.stringify({ ...sesion, correo: r.correo }));
      setMostrarModalDatos(false);
    } catch (err) {
      setErrorDatos(err.message);
    }
  };

  const toggleSeccion = (nombre) => {
    setSeccionAbierta(seccionAbierta === nombre ? null : nombre);
  };

  const tablaPedidos = (lista, vacio) =>
    lista.length > 0 ? (
      <div className="table-responsive bg-white border border-dark">
        <table className="table align-middle m-0">
          <thead>
            <tr>
              <th className="text-white" style={estiloEncabezado}>Pedido</th>
              <th className="text-white" style={estiloEncabezado}>Productos</th>
              <th className="text-white" style={estiloEncabezado}>Total</th>
              <th className="text-white" style={estiloEncabezado}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((p) => (
              <tr key={p.id_pedido}>
                <td className="fw-bold">
                  #{p.id_pedido}
                  <div className="small text-muted fw-normal">{new Date(p.fecha).toLocaleDateString('es-MX')}</div>
                </td>
                <td>
                  {p.items.map((i, idx) => (
                    <div key={idx}>
                      {i.cantidad} × {i.titulo} <span className="text-muted small">({i.modelo})</span>
                    </div>
                  ))}
                </td>
                <td>{formatoPrecio(p.total)}</td>
                <td>
                  <span className="badge bg-primary rounded-0 px-3 py-2">{p.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-muted m-0">{vacio}</p>
    );

  const botonPestana = (clave, texto) => (
    <button
      type="button"
      onClick={() => toggleSeccion(clave)}
      className={`btn rounded-0 fw-bold px-3 py-2 ${seccionAbierta === clave ? 'text-white' : 'btn-outline-dark bg-white'}`}
      style={seccionAbierta === clave ? { backgroundColor: '#000', borderColor: '#000' } : {}}
    >
      {texto}
    </button>
  );

  return (
    <main className="container my-4">
      {/* Encabezado Perfil */}
      <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
        <img src={usuarioIcon} alt="Usuario" style={{ width: '110px', height: '110px' }} />
        <div className="d-flex flex-column align-items-start">
          <div className="bg-white px-3 py-2 mb-2" style={{ borderWidth: '1.5px', maxWidth: '480px' }}>
            <span className="fw-bold d-block text-dark fs-4 lh-sm">{sesion.nombre || 'Cliente ERGO'}</span>
            <span className="text-secondary small">{datosCliente.correo}</span>
          </div>
          <button
            type="button"
            onClick={abrirModalDatos}
            className="btn btn-sm text-white rounded-0 px-2 py-1 ms-2"
            style={{ backgroundColor: '#071f4c', fontSize: '0.85rem' }}
          >
            Modificar datos
          </button>
        </div>
      </div>

      {aviso.texto && (
        <div className={`alert alert-${aviso.tipo} rounded-0 fw-medium`} role="alert">
          {aviso.texto}
        </div>
      )}

      {/* Botones de Control (Pestañas a demanda) */}
      <div className="d-flex flex-wrap gap-3 mb-5 border-bottom pb-3">
        {botonPestana('carrito', `Mi Carrito (${carrito.length})`)}
        {botonPestana('procesos', `Compras en proceso (${misPedidosEnProceso.length})`)}
        {botonPestana('historial', 'Historial de compras')}
      </div>

      {/* Desplegable 1: Mi Carrito */}
      {seccionAbierta === 'carrito' && (
        <section className="mb-5 p-3 border" style={{ backgroundColor: '#cfd2d498' }}>
          <h5 className="fw-bold mb-3 text-dark">Mi Carrito de Compras</h5>
          {carrito.length > 0 ? (
            <>
              <div className="row g-4">
                {carrito.map((item) => (
                  <div key={item.id_producto} className="col-12 col-md-4">
                    <Card
                      title={item.titulo}
                      model={`Modelo: ${item.modelo}`}
                      price={formatoPrecio(item.precio)}
                      image={IMAGENES[item.imagen] || IMAGENES.silla1}
                      onComprar={() => verDetalleProducto(item)}
                    />
                    <div className="d-flex justify-content-between align-items-center bg-white border px-2 py-2 mt-1">
                      <span className="fw-semibold">Cantidad: {item.cantidad}</span>
                      <button
                        type="button"
                        onClick={() => quitarDelCarrito(item.id_producto)}
                        className="btn btn-sm btn-outline-danger rounded-0"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-end align-items-center gap-4 mt-4 pt-3 border-top flex-wrap">
                <div className="text-end">
  {descuentoCarrito > 0 && (
    <>
      <div className="text-secondary">Subtotal: {formatoPrecio(subtotalCarrito)}</div>
      <div className="text-success">Descuento por mayoreo (10%): -{formatoPrecio(descuentoCarrito)}</div>
    </>
  )}
  <span className="fw-bold fs-5 text-dark">Total: {formatoPrecio(totalCarrito)}</span>
</div>
                <button
                  type="button"
                  onClick={finalizarCompra}
                  disabled={comprando}
                  className="btn text-white fw-bold rounded-0 px-4 py-2"
                  style={{ backgroundColor: '#071f4c' }}
                >
                  {comprando ? 'Procesando...' : 'Finalizar compra'}
                </button>
              </div>
            </>
          ) : (
            <p className="text-muted m-0">Tu carrito está vacío actualmente.</p>
          )}
        </section>
      )}

      {/* Desplegable 2: Compras en proceso */}
      {seccionAbierta === 'procesos' && (
        <section className="mb-5 p-3 border" style={{ backgroundColor: '#cfd2d498' }}>
          <h5 className="fw-bold mb-3 text-dark">Estado de mis pedidos en proceso</h5>
          {tablaPedidos(misPedidosEnProceso, 'No tienes pedidos activos en proceso.')}
        </section>
      )}

      {/* Desplegable 3: Historial */}
      {seccionAbierta === 'historial' && (
        <section className="mb-5 p-3 border" style={{ backgroundColor: '#cfd2d498' }}>
          <h5 className="fw-bold mb-3 text-dark">Historial de compras pasadas</h5>
          {tablaPedidos(historial, 'Aún no tienes compras finalizadas o canceladas.')}
        </section>
      )}

      {/* Sección Fija: También te podría interesar */}
      <section className="mb-4">
        <h4 className="fw-bold mb-3 text-dark">También te podría interesar</h4>
        <div className="row g-4">
          {productos.slice(0, 3).map((b) => (
            <div key={b.id_producto} className="col-12 col-md-4">
              <Card
                title={b.titulo}
                model={`Modelo: ${b.modelo}`}
                price={formatoPrecio(b.precio)}
                image={IMAGENES[b.imagen] || IMAGENES.silla1}
                onComprar={() => verDetalleProducto(b)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Modal Modificar Datos */}
      {mostrarModalDatos && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="bg-white p-4 border border-dark shadow" style={{ borderWidth: '1.5px', maxWidth: '450px', width: '100%' }}>
            <h5 className="fw-bold mb-3 border-bottom pb-2">Modificar mis datos</h5>
            <form onSubmit={guardarNuevosDatos}>
              <div className="mb-3">
                <label className="d-block mb-1 small fw-semibold">Correo:</label>
                <input
                  type="email"
                  className="w-100 p-2"
                  style={{ border: '1.5px solid #000' }}
                  value={formDatos.correo}
                  onChange={(e) => setFormDatos({ ...formDatos, correo: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="d-block mb-1 small fw-semibold">Teléfono (10 dígitos):</label>
                <input
                  type="tel"
                  className="w-100 p-2"
                  style={{ border: '1.5px solid #000' }}
                  value={formDatos.telefono}
                  onChange={(e) => setFormDatos({ ...formDatos, telefono: e.target.value })}
                  required
                />
              </div>
              {errorDatos && <p className="text-danger fw-medium">{errorDatos}</p>}
              <div className="d-flex justify-content-end gap-2 border-top pt-3">
                <button type="button" onClick={() => setMostrarModalDatos(false)} className="btn btn-outline-dark rounded-0">
                  Cancelar
                </button>
                <button type="submit" className="btn text-white rounded-0" style={{ backgroundColor: '#071f4c' }}>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
