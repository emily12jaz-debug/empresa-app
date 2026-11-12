import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usuarioIcon from '../Assets/Icons/usuario.svg';
import flechaAbajoIcon from '../Assets/Icons/flechabajo.svg';

import { API_URL } from '../api';

const estiloInput = {
  height: '38px',
  border: '1.5px solid #000000',
  outline: 'none',
  padding: '0 10px',
  fontSize: '0.95rem',
};

export default function IniciarSesion() {
  const [rol, setRol] = useState('Cliente');
  const [menuRolAbierto, setMenuRolAbierto] = useState(false);
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  const toggleSelector = () => {
    setMenuRolAbierto(!menuRolAbierto);
  };

  const seleccionarRol = (nuevoRol) => {
    setRol(nuevoRol);
    setMenuRolAbierto(false);
    setError('');
  };

  const manejarEntrada = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!correo.trim() || !password) {
      setError('Ingresa tu usuario y contraseña');
      return;
    }

    setEnviando(true);
    try {
      // Conexión con el backend / base de datos
      const respuesta = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rol, correo, password }),
      });
      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        setError(resultado.mensaje || 'No se pudo iniciar sesión');
        return;
      }

      // Guardamos la sesión en el navegador (token del backend + datos de la sesión)
      localStorage.setItem(
        'sesion',
        JSON.stringify({
          token: resultado.token,
          rol: resultado.rol,
          nombre: resultado.nombre,
          correo: resultado.correo || correo,
        })
      );

      // Navegación según el rol devuelto por el servidor
      if (resultado.rol === 'Cliente') {
        navigate('/cuenta-cliente');
      } else {
        navigate('/cuenta-admin');
      }
    } catch {
      setError('No se pudo conectar con el servidor. Verifica que el backend esté encendido.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="container my-5 d-flex flex-column align-items-center">
      {/* Selector de rol */}
      <div className="position-relative mb-3 text-center">
        <div
          onClick={toggleSelector}
          className="d-inline-flex align-items-center justify-content-center gap-2 user-select-none"
          style={{ cursor: 'pointer' }}
        >
          <span className="fw-bold" style={{ color: '#000000', fontSize: '1.4rem' }}>
            {rol}
          </span>
          {/* Flecha oculta por defecto, solo visible si el menú está desplegado */}
          {menuRolAbierto && (
            <img
              src={flechaAbajoIcon}
              alt="Desplegar"
              style={{ width: '14px', height: '14px', objectFit: 'contain' }}
            />
          )}
        </div>

        {/* Menú desplegable */}
        {menuRolAbierto && (
          <div
            className="position-absolute bg-white border border-dark start-50 translate-middle-x mt-1 shadow-sm"
            style={{ top: '100%', zIndex: 100, minWidth: '150px' }}
          >
            <div
              onClick={() => seleccionarRol('Cliente')}
              className="px-3 py-2 text-dark text-start"
              style={{
                cursor: 'pointer',
                borderBottom: '1px solid #dee2e6',
                fontSize: '0.95rem',
                backgroundColor: rol === 'Cliente' ? '#f8f9fa' : '#ffffff',
              }}
            >
              Cliente
            </div>
            <div
              onClick={() => seleccionarRol('Administrador')}
              className="px-3 py-2 text-dark text-start"
              style={{
                cursor: 'pointer',
                fontSize: '0.95rem',
                backgroundColor: rol === 'Administrador' ? '#f8f9fa' : '#ffffff',
              }}
            >
              Administrador
            </div>
          </div>
        )}
      </div>

      {/* Icono de usuario */}
      <div className="mb-4 text-center">
        <img
          src={usuarioIcon}
          alt="Usuario-Correo electronico"
          style={{ width: '70px', height: '70px', objectFit: 'contain' }}
        />
      </div>

      {/* Campos */}
      <form style={{ width: '100%', maxWidth: '380px' }} onSubmit={manejarEntrada}>
        <div className="mb-4 text-center">
          <label className="d-block mb-2 fw-medium" style={{ color: '#000000', fontSize: '1.05rem' }}>
            Usuario
          </label>
          <input
            type="text"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-100 bg-white"
            style={estiloInput}
          />
        </div>

        <div className="mb-4 text-center">
          <label className="d-block mb-2 fw-medium" style={{ color: '#000000', fontSize: '1.05rem' }}>
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-100 bg-white"
            style={estiloInput}
          />
        </div>

        {error && <p className="text-center text-danger fw-medium">{error}</p>}

        {/* Registrarse (solo clientes) */}
        {rol === 'Cliente' && (
          <div className="mb-4 text-center" style={{ fontSize: '0.9rem', color: '#000000' }}>
            <span>Si no tienes una cuenta da click en </span>
            <span
              style={{ color: '#0d6efd', cursor: 'pointer', fontWeight: '500' }}
              onClick={() => navigate('/registro')}
            >
              Registrarse
            </span>
          </div>
        )}

        {/* Entrar */}
        <div className="text-center mt-3">
          <button
            type="submit"
            disabled={enviando}
            className="btn text-white fw-medium px-4 py-2"
            style={{ backgroundColor: '#071f4c', borderRadius: '0px', minWidth: '130px', fontSize: '1rem' }}
          >
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>
    </main>
  );
}