import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Home from './Pages/Home';
import IniciarSesion from './Pages/IniciarSesion';
import Registro from './Pages/Registro';
import Producto from './Pages/Producto';
import Buscar from './Pages/Buscar';
import CuentaCliente from './Pages/CuentaCliente';
import CuentaAdmin from './Pages/CuentaAdmin';
import Contactanos from './Pages/Contactanos';
import QuienesSomos from './Pages/QuienesSomos';
import MisionVision from './Pages/MisionVision';
import Aviso from './Pages/Aviso';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

// Producto lee el artículo elegido al abrirse: la "key" lo recarga si eliges otro desde el buscador
function ProductoActual() {
  const location = useLocation();
  return <Producto key={location.key} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/producto" element={<ProductoActual />} />
        <Route path="/buscar" element={<Buscar />} />
        <Route path="/cuenta-cliente" element={<CuentaCliente />} />
        <Route path="/cuenta-admin" element={<CuentaAdmin />} />
        <Route path="/contactanos" element={<Contactanos />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/mision-vision" element={<MisionVision />} />
        <Route path="/aviso-privacidad" element={<Aviso />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
