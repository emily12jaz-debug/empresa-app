import React from 'react';

export default function Card({ title, model, price, image, onComprar }) {
  return (
    <div 
      className="card h-100 rounded-0 shadow-sm text-center p-3 d-flex flex-column bg-white"
      style={{ border: '1.5px solid #071f4c' }}
    >
      {/* Contenedor de la Imagen */}
      <div 
        className="border mb-3 d-flex align-items-center justify-content-center bg-white"
        style={{ height: '200px', overflow: 'hidden' }}
      >
        <img 
          src={image} 
          alt={title} 
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
        />
      </div>

      {/* Información del producto */}
      <div className="py-2 px-2 mb-3 bg-white">
        <p className="m-0 fw-bold text-dark">{title}</p>
        <p className="m-0 text-secondary small fw-medium">{model || 'Modelo: ERGO-Std'}</p>
        <p className="m-0 text-danger fw-bold fs-5 mt-1">{price}</p>
      </div>

      {/* Botón Comprar */}
      <button 
        type="button" 
        onClick={onComprar}
        className="w-100 rounded-0 fw-bold mt-auto btn text-white py-2"
        style={{
          backgroundColor: '#071f4c',
          border: '1px solid #081f44',
          fontSize: '0.95rem'
        }}
      >
        Comprar
      </button>
    </div>
  );
}