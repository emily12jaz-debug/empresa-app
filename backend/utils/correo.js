// Envío de correos. Funciona con Brevo (API por HTTPS, recomendado en la nube) o con SMTP (ej. Gmail en tu PC).
async function enviarCorreo({ to, subject, html }) {
  const nombre = process.env.MAIL_FROM_NAME || 'ERGOSEATING';

  if (process.env.BREVO_API_KEY) {
    const respuesta = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: { name: nombre, email: process.env.MAIL_FROM },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!respuesta.ok) throw new Error(`Brevo respondió ${respuesta.status}: ${await respuesta.text()}`);
    return true;
  }

  if (process.env.SMTP_HOST) {
    const nodemailer = require('nodemailer');
    const puerto = Number(process.env.SMTP_PORT || 587);
    const transporte = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: puerto,
      secure: puerto === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 10000,
      socketTimeout: 10000,
    });
    await transporte.sendMail({
      from: `"${nombre}" <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  }

  console.warn('Correo no configurado (falta BREVO_API_KEY o SMTP_HOST en .env): no se envió el correo');
  return false;
}

module.exports = { enviarCorreo };
