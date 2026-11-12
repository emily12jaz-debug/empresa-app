import React from 'react';
import misionImg from '../Assets/Images/misionvision.jpeg';

export default function MisionVision() {
  return (
    <main className="container my-5 text-center">
      {/* mision */}
      <h1 className="fw-bold mb-4" style={{ color: '#000000' }}>
        Misión
      </h1>
      <div 
        className="mx-auto mb-4 text-secondary" 
        style={{ maxWidth: '800px', fontSize: '1.05rem', lineHeight: '1.7' }}
      >
        <p>
          Diseñar y producir butacas escolares duraderas que promuevan la concentración y la comodidad 
          durante las horas de estudio, ofreciendo soluciones innovadoras que satisfagan las necesidades del entorno educativo.
        </p>
      </div>
    
      {/* vision */}
      <h1 className="fw-bold mb-4" style={{ color: '#000000' }}>
        Visión
      </h1>
      <div 
        className="mx-auto mb-4 text-secondary" 
        style={{ maxWidth: '800px', fontSize: '1.05rem', lineHeight: '1.7' }}
      >
        <p>
          Ser líder en la fabricación de butacas escolares que priorizan la comodidad y el bienestar de los estudiantes, 
          contribuyendo a un ambiente de aprendizaje óptimo en las aulas.
        </p>
      </div>

      {/* objetivo */}
      <h1 className="fw-bold mb-4" style={{ color: '#000000' }}>
        Objetivo
      </h1>
      <div 
        className="mx-auto mb-4 text-secondary" 
        style={{ maxWidth: '800px', fontSize: '1.05rem', lineHeight: '1.7' }}
      >
        <p>
          Diseñar, fabricar y comercializar butacas escolares ergonómicas de alta calidad que mejoren la postura y comodidad 
          de los estudiantes, respaldando su distribución a nivel nacional mediante una plataforma web de comercio electrónico 
          eficiente y segura.
        </p>
      </div>

      {/* imagen */}
      <div className="d-flex justify-content-center">
        <img 
          src={misionImg} 
          alt="Misión y Visión ERGOSEATING" 
          className="img-fluid"
          style={{ maxWidth: '612px', width: '100%', height: 'auto' }}
        />
      </div>
    </main>
  );
}