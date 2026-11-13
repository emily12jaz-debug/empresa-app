import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../Components/Card';
import { api, obtenerSesion, IMAGENES, formatoPrecio } from '../api';
import { filtrarProductos } from '../busqueda';

export default function Buscar() {
  const navigate = useNavigate();
  const [parametros] = useSearchParams();
  const consulta = parametros.get('q') || '';

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    api('/productos')
      .then((datos) => activo && setProductos(datos))
      .catch((e) => activo && setError(e.message))
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, []);

  // El buscador es solo para clientes con sesión
  if (obtenerSesion()?.rol !== 'Cliente') {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  const resultados = filtrarProductos(productos, consulta);

  const verProducto = (producto) => {
    localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
    navigate('/producto');
  };

  return (
    <main className="container my-5" style={{ minHeight: '50vh' }}>
      <h2 className="fw-bold mb-1" style={{ fontSize: '1.4rem', color: '#000000' }}>
        Resultados para “{consulta}”
      </h2>

      {!cargando && !error && (
        <p className="text-secondary mb-4">
          {resultados.length === 1 ? '1 producto encontrado' : `${resultados.length} productos encontrados`}
        </p>
      )}

      {cargando && <p className="text-secondary">Buscando productos…</p>}
      {error && <p className="text-danger fw-medium">{error}</p>}

      {!cargando && !error && resultados.length === 0 && (
        <div className="text-center py-5">
          <p className="mb-2 fw-medium">No encontramos productos con “{consulta}”.</p>
          <p className="text-secondary mb-4">
            Revisa la ortografía o prueba con el modelo (por ejemplo, ERGO-E100).
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn text-white rounded-0 px-4 py-2"
            style={{ backgroundColor: '#071f4c' }}
          >
            Ver todos los productos
          </button>
        </div>
      )}

      <div className="row g-4">
        {resultados.map((prod) => (
          <div key={prod.id_producto} className="col-12 col-md-4">
            <Card
              title={prod.titulo}
              model={`Modelo: ${prod.modelo}`}
              price={formatoPrecio(prod.precio)}
              image={IMAGENES[prod.imagen] || IMAGENES.silla1}
              onComprar={() => verProducto(prod)}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
