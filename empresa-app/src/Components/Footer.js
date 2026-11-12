import React from 'react';
import telefonoIcon from '../Assets/Icons/telefono.svg';

export default function Footer() {
  return (
    // Agregamos backgroundColor para el tono gris y quitamos border-top si prefieres la barra sólida
    <footer 
      className="py-4 mt-5 border-top border-dark"
      style={{ backgroundColor: '#8a939bd2' }} 
    >
      <div className="container">
        {/* justify-content-center centra las 2 columnas en la pantalla */}
        <div className="row justify-content-center text-center text-md-start">
          
          {/* Columna 1: Medios de contacto (6 espacios de 12) */}
          <div className="col-12 col-md-6 border-end border-dark px-4 mb-3 mb-md-0 d-flex flex-column align-items-center align-items-md-start">
            <h5 className="fw-bold mb-3" style={{ color: '#000000' }}>
              Medios de contacto
            </h5>
            <p className="mb-2 d-flex align-items-center gap-2">
              <img src={telefonoIcon} alt="Teléfono" style={{ width: '18px', height: '18px' }} />
              <span>Teléfono 1: 55-4123-8901</span>
            </p>
            <p className="mb-0 d-flex align-items-center gap-2">
              <img src={telefonoIcon} alt="Teléfono" style={{ width: '18px', height: '18px' }} />
              <span>Teléfono 2: 55-9876-5432</span>
            </p>
          </div>

          {/* Columna 2: Métodos de pago (6 espacios de 12) */}
          <div className="col-12 col-md-6 px-4 d-flex flex-column align-items-center align-items-md-start ps-md-5">
            <h5 className="fw-bold mb-3" style={{ color: '#000000' }}>
              Métodos de pago
            </h5>
            <p className="mb-1">Mercado Libre</p>
            <p className="mb-1">BBVA</p>
            <p className="mb-0">Santander</p>
          </div>

        </div>
      </div>
    </footer>
  );
}