import React from 'react';

export default function Aviso() {
  return (
    <main className="container my-5">
      {/* titulo */}
      <h1 className="fw-bold mb-4 text-center" style={{ color: '#000000' }}>
        Aviso de privacidad
      </h1>

      {/* Espacio para texto descriptivo */}
      <div 
        className="mx-auto mb-4 text-secondary" 
        style={{ maxWidth: '1100px', fontSize: '1.075rem', lineHeight: '1.7', textAlign: 'justify' }}
      >
        <p>
          Publicado última modificación 2 de enero del 2026
           </p>

          <p>
          Abastecedora ERGOSEATING, S.A. de C.V., conocida comercialmente como “Lumen” y/o 
          “HiperERGOSEATING” (en lo sucesivo nos referiremos como “El Responsable”), con domicilio
           en Avenida República de El Salvador número 52 y 54, colonia Centro, Alcaldía Cuauhtémoc, 
           código postal 06000, Ciudad de México, es el responsable del uso y protección de sus 
           datos personales que nos proporciona en virtud de las operaciones comerciales y demás 
           actos que realiza con nosotros sea de forma física, telefónica o electrónica, por lo 
           que al respecto le informamos lo siguiente:
           Datos personales que serán sometidos a tratamiento.
           Los datos que podríamos utilizar para llevar a cabo las finalidades descritas en el presente aviso 
           en virtud de la relación comercial, laboral, de negocios o que por cualquiera otra razón Usted nos 
           proporcione; utilizaremos datos personales de identificación, contacto, laborales, académicos y 
           datos patrimoniales.
           </p>
           
            <h4 className="fw-bold mb-3" style={{ color: '#000000' }}>
            Para limitar el uso o divulgación de sus datos Usted puede ejercer sus derechos ARCO
          </h4>

          <p>
           Le informamos que, conforme a la Ley Feral de Protección de Datos Personales en Posesión de los Particulares, 
           Usted cuenta con los derechos siguientes:
           </p>
                 <p>Acceso: Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos 
                 y las condiciones del uso que les damos. </p>
                 <p>Rectificación: Es su derecho solicitar la corrección de su información personal en caso de que esté 
                 desactualizada, sea inexacta o incompleta. </p>
                 <p>Cancelación: Es su derecho la eliminación de nuestros registros o bases de datos cuando considere que
                 la misma no está siendo utilizada conforme a los principios, deberes y obligaciones previstas en la Ley 
                 Federal de Protección de Datos Personales en Posesión de los Particulares y demás normativa aplicable. </p>
                 <p>Oposición: Es su derecho oponerse al uso de sus datos personales para fines específicos.
                 *Estos derechos se conocen como derechos ARCO. </p>

           <p>
            El procedimiento y requisitos para el ejercicio de estos derechos es el siguiente: deberá enviar al correo 
            electrónico su solicitud, en la que deberá acreditar ser el titular de los datos personales sobre los que 
            prentende ejercer el derecho ARCO, y acreditar su identidad (anexar copia de su identificacion oficial, en 
            su caso, acreditar que cuenta con facultades para representar al Titular de los derechos ARCO). En su s
            olicitud deberá precisar el derecho ARCO sobre el cual ejerce su petición, así como los datos de contacto 
            para recibir la respuesta que corresponda. En caso de que su petición no sea clara o no acredite ser el 
            titular de los datos personales sobre los cuales se pretende ejercer el derecho ARCO, el Responsable podrá 
            solicitarle información adicional de acuerdo con lo señalado en la Ley Federal de Protección de Datos 
            Personales en Posesión de los Particulares, su Reglamento y demás disposiciones legales aplicables.

             Los datos de contacto del departamento que dará trámite a las solicitudes para el ejercicio de los 
             derechos ARCO, así como atender cualquier duda que pudiera tener respecto al tratamiento de su información, 
             será por conducto de nuestro Departamento Administrativo, cuyos datos de contacto son los siguientes: </p>
             <p>Teléfono 55-47-47-82-23 </p>
            <p>Correo electrónico: arco@ergoseating.com.mx.  </p>
      </div>

    </main>
  );
}