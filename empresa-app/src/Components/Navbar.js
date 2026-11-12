import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../Assets/Images/logo.jpg';
import logotipo from '../Assets/Images/logotipo.jpg';
import menuIcon from '../Assets/Icons/menu.svg';
import usuarioIcon from '../Assets/Icons/usuario.svg';
import lupaIcon from '../Assets/Icons/lupa.svg';

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarModalCerrarSesion, setMostrarModalCerrarSesion] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Comprobación de sesión activa
  const haySesion = !!localStorage.getItem('sesion');

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const irA = (ruta) => {
    setMenuAbierto(false);
    navigate(ruta);
  };

  const confirmarCerrarSesion = () => {
    localStorage.removeItem('sesion');
    setMostrarModalCerrarSesion(false);
    setMenuAbierto(false);
    // Redirige a la raíz pública
    navigate('/', { replace: true });
  };

  // Evaluamos de forma estricta las rutas donde DEBE decir "Ir a inicio"
  const esLogin = 
    location.pathname === '/iniciar-sesion' || 
    location.pathname === '/registro' || 
    location.pathname === '/cuenta-cliente' ||
    location.pathname === '/cuenta-admin' ||
    location.pathname === '/producto';

  return (
    <header className="w-100">
      {/* Barra café */}
      <div 
        className="header-top d-flex justify-content-between align-items-center px-4" 
        style={{ height: '75px', backgroundColor: 'rgb(175, 108, 60)' }}
      >
        <img 
          src={logo} 
          alt="Logo ERGOSEATING" 
          onClick={() => irA('/')}
          style={{ 
            width: '90px', 
            height: 'auto', 
            cursor: 'pointer',
            objectFit: 'contain' 
          }} 
        />

        <img 
          src={logotipo} 
          alt="Logotipo ERGOSEATING" 
          style={{ 
            width: '290px', 
            height: 'auto', 
            cursor: 'pointer',
            objectFit: 'contain' 
          }} 
        />

        {/* Buscador condicional: solo visible si hay sesión iniciada */}
        {haySesion ? (
          <div className="d-flex align-items-center bg-white border border-dark px-2" style={{ height: '36px', borderRadius: '4px' }}>
            <input 
              type="text" 
              placeholder="Buscar articulos" 
              className="border-0 bg-transparent"
              style={{ outline: 'none', fontSize: '0.9rem', padding: '4px' }}
            />
            <img src={lupaIcon} alt="Buscar" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
          </div>
        ) : (
          <div style={{ width: '90px' }}></div>
        )}
      </div>

      {/* Barra negra */}
      <nav 
        className={`text-white d-flex align-items-center px-4 ${
          haySesion ? 'justify-content-end' : 'justify-content-between'
        }`}
        style={{ height: '48px', backgroundColor: '#000000', position: 'relative' }}
      >
        {haySesion ? (
          <button
            type="button"
            onClick={() => setMostrarModalCerrarSesion(true)}
            className="btn btn-outline-light btn-sm rounded-0 fw-medium px-4"
            style={{ fontSize: '0.95rem' }}
          >
            Cerrar sesión
          </button>
        ) : (
          <>
            <div className="d-flex align-items-center gap-2">
              <button 
                type="button" 
                onClick={toggleMenu} 
                className="btn p-0 border-0 d-flex align-items-center"
                style={{ background: 'none' }}
              >
                <img 
                  src={menuIcon} 
                  alt="Menú" 
                  className="filter-white" 
                  style={{ width: '22px', height: '22px', cursor: 'pointer' }} 
                />
              </button>

              <span 
                className="user-select-none"
                onClick={toggleMenu}
                style={{ cursor: 'pointer' }}
              >
                Sobre nosotros
              </span>
            </div>

            {menuAbierto && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '16px',
                  backgroundColor: '#000000',
                  border: '1px solid #ffffff',
                  zIndex: 1050,
                  minWidth: '230px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'none'
                }}
              >
                <div 
                  onClick={() => irA('/')}
                  style={{ color: '#ffffff', padding: '9px 14px', fontSize: '0.9rem', borderBottom: '1px solid #ffffff', cursor: 'pointer' }}
                >
                  Inicio
                </div>
                <div 
                  onClick={() => irA('/quienes-somos')}
                  style={{ color: '#ffffff', padding: '9px 14px', fontSize: '0.9rem', borderBottom: '1px solid #ffffff', cursor: 'pointer' }}
                >
                  ¿Quiénes somos?
                </div>
                <div 
                  onClick={() => irA('/mision-vision')}
                  style={{ color: '#ffffff', padding: '9px 14px', fontSize: '0.9rem', borderBottom: '1px solid #ffffff', cursor: 'pointer' }}
                >
                  Misión, visión y objetivos
                </div>
                <div 
                  onClick={() => irA('/contactanos')}
                  style={{ color: '#ffffff', padding: '9px 14px', fontSize: '0.9rem', borderBottom: '1px solid #ffffff', cursor: 'pointer' }}
                >
                  Contáctanos
                </div>
                <div 
                  onClick={() => irA('/aviso-privacidad')}
                  style={{ color: '#ffffff', padding: '9px 14px', fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  Avisos de privacidad
                </div>
              </div>
            )}

            <div className="d-flex align-items-center gap-2">
              {!esLogin && (
                <img src={usuarioIcon} alt="Usuario" className="filter-white" style={{ width: '22px', height: '22px' }} />
              )}
              <button 
                type="button" 
                onClick={() => irA(esLogin ? '/' : '/iniciar-sesion')}
                className="btn btn-outline-light btn-sm rounded-0"
              >
                {esLogin ? 'Ir a inicio' : 'Iniciar sesión'}
              </button>
            </div>
          </>
        )}
      </nav>

      {/* Modal Cierre de Sesión */}
      {mostrarModalCerrarSesion && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
        >
          <div
            className="bg-white p-4 border border-dark shadow text-center"
            style={{ borderWidth: '1.5px', maxWidth: '400px', width: '100%' }}
          >
            <h5 className="fw-bold mb-3 text-dark border-bottom pb-2">Confirmación</h5>

            <p className="text-secondary mb-4" style={{ fontSize: '0.95rem' }}>
              ¿Estás seguro de que deseas cerrar sesión?
            </p>

            <div className="d-flex justify-content-center gap-3">
              <button
                type="button"
                onClick={() => setMostrarModalCerrarSesion(false)}
                className="btn btn-outline-dark rounded-0 px-4 py-2"
                style={{ fontSize: '0.9rem' }}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarCerrarSesion}
                className="btn text-white rounded-0 px-4 py-2"
                style={{ backgroundColor: '#071f4c', fontSize: '0.9rem' }}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
      );
}