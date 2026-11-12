import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminProductos from './AdminProductos';
import AdminPedidos from './AdminPedidos';
import usuarioIcon from '../Assets/Icons/usuario.svg';

export default function CuentaAdmin() {
  const [pestanaActiva, setPestanaActiva] = useState('productos');

  let sesion = null;
  try {
    sesion = JSON.parse(localStorage.getItem('sesion'));
  } catch {
    sesion = null;
  }

  if (!sesion || sesion.rol !== 'Administrador') {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  return (
    <main className="container my-4">
      {/* Encabezado con Correo del Administrador */}
      <div className="d-flex align-items-center gap-4 mb-4">
        <div>
          <img
            src={usuarioIcon}
            alt="Administrador"
            style={{ width: '85px', height: '85px', objectFit: 'contain' }}
          />
        </div>

        <div
          className="d-flex align-items-center bg-white px-4"
          style={{
            height: '95px',
            width: '100%',
            maxWidth: '520px'
          }}
        >
          <span className="fw-bold" style={{ color: '#000000', fontSize: '1.4rem' }}>
            {sesion.correo || sesion.nombre || 'admin@ergoseating.com'}
          </span>
        </div>
      </div>

      {/* Botones principales de navegación (2 Pestañas) */}
      <div className="d-flex gap-3 mb-4">
        <button
          type="button"
          onClick={() => setPestanaActiva('productos')}
          className={`btn fw-bold px-4 py-2 rounded-0 ${
            pestanaActiva === 'productos' ? 'text-white' : 'btn-outline-dark bg-white text-dark'
          }`}
          style={{
            backgroundColor: pestanaActiva === 'productos' ? '#071f4c' : 'transparent',
            fontSize: '1rem'
          }}
        >
          Gestionar productos en la web
        </button>

        <button
          type="button"
          onClick={() => setPestanaActiva('pedidos')}
          className={`btn fw-bold px-4 py-2 rounded-0 ${
            pestanaActiva === 'pedidos' ? 'text-white' : 'btn-outline-dark bg-white text-dark'
          }`}
          style={{
            backgroundColor: pestanaActiva === 'pedidos' ? '#071f4c' : 'transparent',
            fontSize: '1rem'
          }}
        >
          Gestionar pedidos
        </button>
      </div>

      {/* Carga de Sub-componentes */}
      {pestanaActiva === 'productos' ? <AdminProductos /> : <AdminPedidos />}
    </main>
  );
}