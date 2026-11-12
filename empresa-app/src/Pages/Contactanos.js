import React from 'react';
import telefonoIcon from '../Assets/Icons/telefono.svg';
import whatsappIcon from '../Assets/Icons/whatsapp.svg';
import correoIcon from '../Assets/Icons/correo.svg';
import edificioIcon from '../Assets/Icons/edificio.svg';
import facebookIcon from '../Assets/Icons/facebook.svg';
import instagramIcon from '../Assets/Icons/instagram.svg';

export default function Contactanos() {
  return (
    <main className="container my-4">
      {/* Título centrado en negro */}
      <h1 className="fw-bold mb-4 text-center" style={{ color: '#000000' }}>
        Contáctanos
      </h1>

      <p className="text-center text-secondary mb-4 mx-auto" style={{ maxWidth: '700px' }}>
        ¿Tienes dudas sobre nuestros productos o requieres una cotización personalizada para tu institución? 
        Comunícate con nosotros a través de cualquiera de nuestros canales oficiales.
      </p>

      {/* cuadro de informacion de contacto */}
      <div 
        className="mx-auto p-5 border border-dark bg-white" 
        style={{ maxWidth: '850px' }}
      >
        <div className="row g-4">
          {/* directo */}
          <div className="col-12 col-md-6 border-end-md">
            <h4 className="fw-bold mb-4" style={{ color: '#000000' }}>
              Atención directa
            </h4>

            {/* Teléfono */}
            <div className="d-flex align-items-center mb-3">
              <img src={telefonoIcon} alt="Teléfono" style={{ width: '24px', height: '24px', marginRight: '14px' }} />
              <div>
                <span className="d-block text-muted small">Línea telefónica</span>
                <span className="fw-semibold text-dark">55-4123-8901 / 55-9876-5432</span>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="d-flex align-items-center mb-3">
              <img src={whatsappIcon} alt="WhatsApp" style={{ width: '24px', height: '24px', marginRight: '14px' }} />
              <div>
                <span className="d-block text-muted small">WhatsApp ventas</span>
                <span className="fw-semibold text-dark">55-1234-5678</span>
              </div>
            </div>

            {/* Correo */}
            <div className="d-flex align-items-center mb-3">
              <img src={correoIcon} alt="Correo" style={{ width: '24px', height: '24px', marginRight: '14px' }} />
              <div>
                <span className="d-block text-muted small">Correo electrónico</span>
                <span className="fw-semibold text-dark">contacto@ergoseating.com.mx</span>
              </div>
            </div>

            {/* ubicacion */}
            <div className="d-flex align-items-start">
              <img src={edificioIcon} alt="Ubicación" style={{ width: '24px', height: '24px', marginRight: '14px', marginTop: '3px' }} />
              <div>
                <span className="d-block text-muted small">Oficinas y planta</span>
                <span className="fw-semibold text-dark">Av. República de El Salvador 52, Centro, Cuauhtémoc, CDMX</span>
              </div>
            </div>
          </div>

          {/* redes sociales */}
          <div className="col-12 col-md-6 ps-md-4">
            <h4 className="fw-bold mb-4" style={{ color: '#000000' }}>
              Redes sociales
            </h4>

            {/* facebook */}
            <div className="d-flex align-items-center mb-3">
              <img src={facebookIcon} alt="Facebook" style={{ width: '24px', height: '24px', marginRight: '14px' }} />
              <div>
                <span className="d-block text-muted small">Facebook</span>
                <span className="fw-semibold text-dark">/ErgoSeatingOficial</span>
              </div>
            </div>

            {/* instagram */}
            <div className="d-flex align-items-center mb-3">
              <img src={instagramIcon} alt="Instagram" style={{ width: '24px', height: '24px', marginRight: '14px' }} />
              <div>
                <span className="d-block text-muted small">Instagram</span>
                <span className="fw-semibold text-dark">@ergoseating_mx</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* cuadro de horario */}
      <div 
        className="mx-auto mt-4 p-4 border border-dark bg-white"
        style={{ maxWidth: '850px' }}
      >
        <h4 className="fw-bold mb-2 text-center" style={{ color: '#000000' }}>Horario de atención</h4>
        <p className="m-0 text-dark" style={{ fontSize: '0.95rem' }}>
          <strong>Lunes a Viernes:</strong> 8:00 AM – 6:00 PM  </p> 
        <p className="m-0 text-dark" style={{ fontSize: '0.95rem' }}> 
          <strong>Sábados:</strong> 9:00 AM – 2:00 PM </p>
      </div>
    </main>
  );
}