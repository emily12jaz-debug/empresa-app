import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Components/Card'; // Reutilizamos tu componente Card
import publicidadImg from '../Assets/Images/principal.png';
import { api, obtenerSesion, IMAGENES, formatoPrecio } from '../api';

export default function Home() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');

  // Catálogo desde la base de datos
  useEffect(() => {
    let activo = true;
    api('/productos')
      .then((datos) => activo && setProductos(datos))
      .catch((e) => activo && setError(e.message));
    return () => {
      activo = false;
    };
  }, []);

  // Con sesión de cliente va al detalle del producto; sin sesión, al inicio de sesión
  const comprar = (producto) => {
    const sesion = obtenerSesion();
    if (sesion?.rol === 'Cliente') {
      localStorage.setItem('productoSeleccionado', JSON.stringify(producto));
      navigate('/producto');
    } else {
      navigate('/iniciar-sesion');
    }
  };

  return (
    <main className="container-fluid px-0">
      {/* Cartel publicitario principal */}
      <section className="container mt-4">
        <img src={publicidadImg} alt="Cartel publicitario ERGOSEATING" className="img-fluid w-100" />
      </section>

      {/* Catálogo de productos usando el componente Card */}
      <section className="container my-5">
        {error && <p className="text-danger fw-medium text-center">{error}</p>}
        <div className="row g-4">
          {productos.map((prod) => (
            <div key={prod.id_producto} className="col-12 col-md-4">
              <Card
                title={prod.titulo}
                model={`Modelo: ${prod.modelo}`}
                price={formatoPrecio(prod.precio)}
                image={IMAGENES[prod.imagen] || IMAGENES.silla1}
                onComprar={() => comprar(prod)}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
