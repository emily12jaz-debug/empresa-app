import React from 'react';
import quienesSomosImg from '../Assets/Images/quienessomos.jpg';

export default function QuienesSomos() {
  return (
    <main className="container my-5 text-center">
      {/* Título superior centrado con letras negras */}
      <h1 className="fw-bold mb-4" style={{ color: '#000000' }}>
        ¿Quiénes somos?
      </h1>

      {/* Espacio para texto descriptivo */}
      <div 
        className="mx-auto mb-4 text-secondary" 
        style={{ maxWidth: '800px', fontSize: '1.05rem', lineHeight: '1.7' }}
      >
        <p>
          En ERGOSEATING somos especialistas en el diseño y distribución de soluciones 
          ergonómicas de mobiliario escolar y de oficina. Nuestro compromiso es transformar los espacios 
          de estudio y trabajo en entornos cómodos, funcionales y orientados al bienestar físico y la postura correcta.
        </p>
      </div>

      {/* Imagen centrada abajo */}
   <div className="d-flex justify-content-center">
  <img 
    src={quienesSomosImg} 
    alt="Equipo ERGOSEATING" 
    className="img-fluid"
    style={{ maxWidth: '612px', width: '100%', height: 'auto' }}
  />
</div>
    </main>
  );
}