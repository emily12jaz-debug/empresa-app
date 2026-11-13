import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../Assets/Images/logo.jpg';
import logotipo from '../Assets/Images/logotipo.jpg';
import menuIcon from '../Assets/Icons/menu.svg';
import usuarioIcon from '../Assets/Icons/usuario.svg';
import lupaIcon from '../Assets/Icons/lupa.svg';
import { api, obtenerSesion, IMAGENES, formatoPrecio } from '../api';
import { filtrarProductos } from '../busqueda';

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarModalCerrarSesion, setMostrarModalCerrarSesion] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Comprobación de sesión activa
  const haySesion = !!localStorage.getItem('sesion');

  // ---- Buscador (solo para clientes) ----
  const esCliente = obtenerSesion()?.rol === 'Cliente';
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [catalogo, setCatalogo] = useState([]);
  const [sugerenciasAbiertas, setSugerenciasAbiertas] = useState(false);
  const cajaBusqueda = useRef(null);

  const cargarCatalogo = () => {
    api('/productos')
      .then((datos) => setCatalogo(datos))
      .catch(() => {});
  };

  // Carga el catálogo cuando hay un cliente con sesión
  useEffect(() => {
    if (esCliente) cargarCatalogo();
  }, [esCliente]);

  // Cierra las sugerencias al hacer clic fuera del buscador
  useEffect(() => {
    const cerrar = (e) => {
      if (cajaBusqueda.current && !cajaBusqueda.current.contains(e.target)) {
        setSugerenciasAbiertas(false);
      }
    };
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, []);

  // En la página de resultados, el cuadro muestra lo que se buscó
  useEffect(() => {
    if (location.pathname === '/buscar') {
      setTextoBusqueda(new URLSearchParams(location.search).get('q') || '');
    }
  }, [location.pathname, location.search]);

  const sugerencias = filtrarProductos(catalogo, textoBusqueda).slice(0, 6);
  const hayConsulta = textoBusqueda.trim().length > 0;

  const buscar = (e) => {
    e.preventDefault();
    const consulta = textoBusqueda.trim();
    if (!consulta) return;
    setSugerenciasAbiertas(false);
    navigate(`/buscar?q=${encodeURIComponent(consulta)}`);
  };

  const verProducto = (producto) => {
    localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
    setSugerenciasAbiertas(false);
    setTextoBusqueda('');
    navigate('/producto');
  };

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

        {/* Buscador: solo visible para clientes con sesión iniciada */}
        {esCliente ? (
          <div ref={cajaBusqueda} style={{ position: 'relative' }}>
            <form
              onSubmit={buscar}
              className="d-flex align-items-center bg-white border border-dark px-2"
              style={{ height: '36px', borderRadius: '4px' }}
            >
              <input
                type="text"
                value={textoBusqueda}
                onChange={(e) => {
                  setTextoBusqueda(e.target.value);
                  setSugerenciasAbiertas(true);
                }}
                onFocus={() => {
                  setSugerenciasAbiertas(true);
                  cargarCatalogo();
                }}
                placeholder="Buscar artículos"
                aria-label="Buscar artículos"
                autoComplete="off"
                className="border-0 bg-transparent"
                style={{ outline: 'none', fontSize: '0.9rem', padding: '4px', width: '210px' }}
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="btn p-0 border-0 d-flex align-items-center"
                style={{ background: 'none' }}
              >
                <img src={lupaIcon} alt="" style={{ width: '18px', height: '18px' }} />
              </button>
            </form>

            {sugerenciasAbiertas && hayConsulta && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  right: 0,
                  width: '380px',
                  maxWidth: '90vw',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #071f4c',
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)',
                  zIndex: 1060,
                }}
              >
                {sugerencias.length > 0 ? (
                  <>
                    {sugerencias.map((p) => (
                      <div
                        key={p.id_producto}
                        role="button"
                        tabIndex={0}
                        onClick={() => verProducto(p)}
                        onKeyDown={(e) => e.key === 'Enter' && verProducto(p)}
                        className="d-flex align-items-center gap-3 px-3 py-2 border-bottom"
                        style={{ cursor: 'pointer' }}
                      >
                        <img
                          src={IMAGENES[p.imagen] || IMAGENES.silla1}
                          alt=""
                          style={{ width: '52px', height: '52px', objectFit: 'contain' }}
                        />
                        <div className="flex-grow-1 text-start">
                          <div className="fw-bold text-dark" style={{ fontSize: '0.92rem' }}>{p.titulo}</div>
                          <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Modelo: {p.modelo}</div>
                        </div>
                        <div className="fw-bold text-danger" style={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                          {formatoPrecio(p.precio)}
                        </div>
                      </div>
                    ))}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={buscar}
                      onKeyDown={(e) => e.key === 'Enter' && buscar(e)}
                      className="px-3 py-2 text-center fw-medium"
                      style={{ cursor: 'pointer', color: '#071f4c', fontSize: '0.9rem' }}
                    >
                      Ver todos los resultados para “{textoBusqueda.trim()}”
                    </div>
                  </>
                ) : (
                  <div className="px-3 py-3 text-center text-secondary" style={{ fontSize: '0.9rem' }}>
                    No encontramos productos para “{textoBusqueda.trim()}”.
                  </div>
                )}
              </div>
            )}
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