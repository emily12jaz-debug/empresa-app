import React, { useState, useEffect } from 'react';
import { api, formatoPrecio } from '../api';

export default function AdminPedidos() {
  const [subPestana, setSubPestana] = useState('Pedido');
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState('');

  // Pedidos reales desde la base de datos
  useEffect(() => {
    let activo = true;
    api('/pedidos')
      .then((datos) => activo && setPedidos(datos))
      .catch((e) => activo && setError(e.message));
    return () => {
      activo = false;
    };
  }, []);

  const cambiarEstadoPedido = async (id, nuevoEstado) => {
    setError('');
    try {
      await api(`/pedidos/${id}/estado`, { method: 'PUT', body: { estado: nuevoEstado } });
      setPedidos((previos) => previos.map((p) => (p.id_pedido === id ? { ...p, estado: nuevoEstado } : p)));
    } catch (e) {
      setError(e.message);
    }
  };

  const pedidosFiltrados = pedidos.filter((p) => p.estado === subPestana);

  const subPestanas = [
    { clave: 'Pedido', etiqueta: 'Pedidos realizados' },
    { clave: 'Pendiente', etiqueta: 'Pedidos pendientes por contestar' },
    { clave: 'Enviado', etiqueta: 'Pedidos enviados' },
    { clave: 'Finalizado', etiqueta: 'Compras finalizadas' },
    { clave: 'Cancelado', etiqueta: 'Compras canceladas' },
  ];

  const celdaEncabezado = { backgroundColor: 'rgb(175, 108, 60)' };

  return (
    <div className="w-100">
      {error && <p className="text-danger fw-medium">{error}</p>}

      <div className="d-flex flex-wrap gap-2 mb-4 border-bottom pb-3">
        {subPestanas.map((sp) => (
          <button
            key={sp.clave}
            type="button"
            onClick={() => setSubPestana(sp.clave)}
            className={`btn rounded-0 fw-medium px-3 py-2 ${subPestana === sp.clave ? 'text-white' : 'btn-outline-dark bg-white'}`}
            style={subPestana === sp.clave ? { backgroundColor: '#000', borderColor: '#000' } : {}}
          >
            {sp.etiqueta}
          </button>
        ))}
      </div>

      <div className="table-responsive bg-white p-3" style={{ borderWidth: '1.5px' }}>
        <table className="table table-hover align-middle m-0">
          <thead>
            <tr>
              <th className="text-black" style={celdaEncabezado}>Pedido</th>
              <th className="text-black" style={celdaEncabezado}>Usuario</th>
              <th className="text-black" style={celdaEncabezado}>Productos</th>
              <th className="text-black" style={celdaEncabezado}>Total</th>
              <th className="text-black" style={{ width: '220px', ...celdaEncabezado }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.length > 0 ? (
              pedidosFiltrados.map((item) => (
                <tr key={item.id_pedido}>
                  <td className="fw-semibold text-dark">
                    #{item.id_pedido}
                    <div className="small text-muted fw-normal">{new Date(item.fecha).toLocaleDateString('es-MX')}</div>
                  </td>
                  <td className="fw-semibold text-dark">{item.correo}</td>
                  <td>
                    {item.items.map((i, idx) => (
                      <div key={idx}>
                        {i.cantidad} × {i.titulo} <span className="text-muted small">({i.modelo})</span>
                      </div>
                    ))}
                  </td>
                  <td>{formatoPrecio(item.total)}</td>
                  <td>
                    <select
                      className="form-select border-dark rounded-0 fw-medium"
                      value={item.estado}
                      onChange={(e) => cambiarEstadoPedido(item.id_pedido, e.target.value)}
                    >
                      <option value="Pedido">Pedido realizado</option>
                      <option value="Pendiente">Pendiente por contestar</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Finalizado">Finalizado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">
                  No hay pedidos en esta categoría actualmente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
