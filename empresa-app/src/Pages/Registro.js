import React, { useState } from 'react';
import flechaIzquierdaIcon from '../Assets/Icons/flechaizquierda.svg';
import { useNavigate } from 'react-router-dom';

import { API_URL } from '../api';

const estiloInput = {
  height: '38px',
  border: '1.5px solid #000000',
  outline: 'none',
  padding: '0 10px',
  fontSize: '0.95rem',
};

function Campo({ etiqueta, name, valor, onChange, type = 'text', placeholder }) {
  return (
    <div className="mb-3 text-center text-md-start">
      <label className="d-block mb-2 fw-medium" style={{ color: '#000000', fontSize: '1rem' }}>
        {etiqueta}
      </label>
      <input
        type={type}
        name={name}
        value={valor}
        onChange={onChange}
        placeholder={placeholder}
        className="w-100 bg-white"
        style={estiloInput}
      />
    </div>
  );
}

export default function Registro() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState({
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    fechaNacimiento: '',
    telefono: '',
    password: '',
    confirmar: '',
  });

  // Estados para la casilla de verificación y la ventana modal
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [mostrarModalTerminos, setMostrarModalTerminos] = useState(false);

  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [enviando, setEnviando] = useState(false);

  const manejarCambio = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const registrar = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    // Validación 1: Aceptar Términos y Condiciones
    if (!aceptaTerminos) {
      setError('Necesitas aceptar términos y condiciones para poder registrarte.');
      return;
    }

    // Validación 2: Coincidencia de contraseñas
    if (datos.password !== datos.confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setEnviando(true);
    try {
      const { confirmar, ...cuerpo } = datos;
      const respuesta = await fetch(`${API_URL}/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuerpo),
      });
      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        setError(resultado.mensaje || 'No se pudo crear la cuenta');
      } else {
        setExito('Cuenta creada correctamente. Redirigiendo para iniciar sesión...');
        setTimeout(() => navigate('/iniciar-sesion'), 1800);
      }
    } catch {
      setError('No se pudo conectar con el servidor. Verifica que el backend esté encendido.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="container my-5 d-flex flex-column align-items-center position-relative">
      <h2 className="fw-bold mb-3 text-center" style={{ color: '#000000', fontSize: '1.4rem' }}>
        Creación de cuenta:
      </h2>

      <p className="text-center text-secondary mb-4 mx-auto" style={{ maxWidth: '650px', fontSize: '0.95rem' }}>
        Por favor ingresa tus datos personales en los siguientes campos para dar de alta tu cuenta en la plataforma.
      </p>

      <form style={{ width: '100%', maxWidth: '720px' }} onSubmit={registrar}>
        <div className="row g-4 mb-4">
          {/* Columna izquierda */}
          <div className="col-12 col-md-6">
            <Campo etiqueta="Nombre(s)" name="nombres" valor={datos.nombres} onChange={manejarCambio} />
            <Campo etiqueta="Apellido materno" name="apellidoMaterno" valor={datos.apellidoMaterno} onChange={manejarCambio} />
            <Campo
              etiqueta="Fecha de nacimiento (dd-mm-aaaa)"
              name="fechaNacimiento"
              valor={datos.fechaNacimiento}
              onChange={manejarCambio}
              placeholder="dd-mm-aaaa"
            />
            <Campo etiqueta="Contraseña (mínimo 8 caracteres)" name="password" type="password" valor={datos.password} onChange={manejarCambio} />
          </div>

          {/* Columna derecha */}
          <div className="col-12 col-md-6">
            <Campo etiqueta="Apellido paterno" name="apellidoPaterno" valor={datos.apellidoPaterno} onChange={manejarCambio} />
            <Campo etiqueta="Correo electrónico" name="correo" type="email" valor={datos.correo} onChange={manejarCambio} />
            <Campo etiqueta="Número telefónico (10 dígitos)" name="telefono" type="tel" valor={datos.telefono} onChange={manejarCambio} />
            <Campo etiqueta="Confirmar contraseña" name="confirmar" type="password" valor={datos.confirmar} onChange={manejarCambio} />
          </div>
        </div>

        {/* Casilla interactiva de Términos y Condiciones corregida */}
        <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
          <div
            onClick={() => setAceptaTerminos(!aceptaTerminos)}
            className="d-flex align-items-center justify-content-center bg-white user-select-none"
            style={{
              width: '20px',
              height: '20px',
              border: '1.5px solid #000000',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 'bold',
            }}
          >
            {aceptaTerminos && '✓'}
          </div>

          <span style={{ fontSize: '0.95rem', color: '#000000' }}>
            Acepto{' '}
            <button
              type="button"
              onClick={() => setMostrarModalTerminos(true)}
              className="btn btn-link p-0 border-0 align-baseline"
              style={{
                color: '#0d6efd',
                textDecoration: 'underline',
                fontWeight: '500',
                fontSize: '0.95rem',
                boxShadow: 'none'
              }}
            >
              Términos y condiciones de uso
            </button>
          </span>
        </div>

        {/* Mensajes de alerta */}
        {error && <p className="text-center text-danger fw-medium mb-3" style={{ fontSize: '0.92rem' }}>{error}</p>}
        {exito && <p className="text-center text-success fw-medium mb-3" style={{ fontSize: '0.92rem' }}>{exito}</p>}

        {/* Botón Registrarse */}
        <div className="text-center mt-3">
          <button
            type="submit"
            disabled={enviando}
            className="btn text-white fw-medium px-4 py-2"
            style={{ backgroundColor: '#071f4c', borderRadius: '0px', minWidth: '150px', fontSize: '1rem' }}
          >
            {enviando ? 'Registrando...' : 'Registrarse'}
          </button>
        </div>

        {/* Botón Regresar */}
        <div className="text-center mt-3">
          <button
            type="button"
            onClick={() => navigate('/iniciar-sesion')}
            className="btn text-white fw-medium px-4 py-2 d-inline-flex align-items-center justify-content-center gap-2"
            style={{ backgroundColor: '#071f4c', borderRadius: '0px', minWidth: '150px', fontSize: '1rem' }}
          >
            <img
              src={flechaIzquierdaIcon}
              alt="Regresar"
              style={{ width: '18px', height: '18px', filter: 'brightness(0) invert(1)' }}
            />
            <span>Regresar</span>
          </button>
        </div>
      </form>

      {/* Ventana Modal de Términos y Condiciones */}
      {mostrarModalTerminos && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
        >
          <div
            className="bg-white p-4 border border-dark shadow"
            style={{ borderWidth: '1.5px', maxWidth: '650px', maxHeight: '80vh', overflowY: 'auto' }}
          >
            <h4 className="fw-bold mb-3 text-dark border-bottom pb-2">
              Términos y Condiciones de Uso
            </h4>

            <div className="text-secondary" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <p>
                Bienvenido a nuestra tienda en línea. Al crear una cuenta y utilizar nuestra plataforma para realizar la compra de nuestros productos, aceptas los siguientes términos y condiciones. Si no creas una cuenta no te sera posible realizar compras en linea, por lo que te recomendamos leerlos detenidamente antes de continuar con tu registro.
              </p>

              <h6 className="fw-bold text-dark mt-3">1. Registro de cuenta</h6>
              <p>
                Para realizar compras en nuestra plataforma, el usuario deberá proporcionar información personal verdadera, actualizada y completa. Cada usuario es responsable de mantener la confidencialidad de su contraseña y de todas las actividades realizadas desde su cuenta.
              </p>

              <h6 className="fw-bold text-dark mt-3">2. Uso de la plataforma</h6>
              <p>
                El usuario se compromete a utilizar la página de manera responsable, sin realizar actividades fraudulentas, ilegales o que puedan afectar el funcionamiento de la plataforma o perjudicar a otros usuarios.
              </p>

              <h6 className="fw-bold text-dark mt-3">3. Productos y precios</h6>
              <p>
                Todos los productos publicados están sujetos a disponibilidad. Los precios, promociones y características pueden cambiar sin previo aviso. Los precios mostrados serán respetados conforme a las condiciones de compra confirmadas.
              </p>

              <h6 className="fw-bold text-dark mt-3">4. Pagos y pedidos</h6>
              <p>
                El usuario se compromete a proporcionar información correcta al realizar sus pedidos y a utilizar métodos de pago autorizados. Los pedidos estarán sujetos a la confirmación del pago y a la disponibilidad de los productos.
              </p>

              <h6 className="fw-bold text-dark mt-3">5. Envíos y devoluciones</h6>
              <p>
                Los tiempos de entrega pueden variar dependiendo de la ubicación del comprador y del servicio de paquetería. Las solicitudes de cambios, devoluciones o reembolsos se atenderán de acuerdo con las políticas establecidas por la tienda y la legislación aplicable.
              </p>

              <h6 className="fw-bold text-dark mt-3">6. Privacidad y protección de datos</h6>
              <p>
                La información personal proporcionada durante el registro y las compras será utilizada únicamente para gestionar las cuentas, procesar pedidos, realizar entregas y brindar atención al cliente, conforme a nuestro Aviso de Privacidad.
              </p>

              <h6 className="fw-bold text-dark mt-3">7. Responsabilidad del usuario</h6>
              <p>
                El usuario será responsable de mantener actualizados sus datos y de notificar cualquier actividad sospechosa relacionada con su cuenta. La tienda no será responsable por inconvenientes derivados de información incorrecta proporcionada por el usuario.
              </p>

              <h6 className="fw-bold text-dark mt-3">8. Modificaciones de los términos</h6>
              <p>
                Nos reservamos el derecho de actualizar estos términos y condiciones cuando sea necesario. Cualquier modificación será publicada en esta sección para que los usuarios puedan consultarla.
              </p>

              <h6 className="fw-bold text-dark mt-3">9. Aceptación de los términos</h6>
              <p>
                Al seleccionar la casilla de aceptación y completar el registro, el usuario declara que ha leído, comprendido y aceptado estos términos y condiciones. Si no estás de acuerdo con alguno de estos términos, te recomendamos no continuar con el registro.
              </p>
            </div>

            <div className="text-end mt-4 border-top pt-3">
              <button
                type="button"
                onClick={() => setMostrarModalTerminos(false)}
                className="btn text-white fw-medium px-4 py-2"
                style={{ backgroundColor: '#071f4c', borderRadius: '0px', fontSize: '0.9rem' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}