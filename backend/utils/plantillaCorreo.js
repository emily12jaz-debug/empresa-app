// Diseño del correo de confirmación de compra (HTML con tablas y estilos en línea,
// que es lo que mejor se ve en Gmail, Outlook, Apple Mail y celulares).
const AZUL = '#071f4c';
const CAFE = '#af6c3c';
const FUENTE = "Arial, Helvetica, sans-serif";

const escapar = (t) =>
  String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const dinero = (n) =>
  `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;

const formatoFecha = (fecha) =>
  new Date(fecha).toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City', // el servidor en la nube trabaja en UTC
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

function correoConfirmacion({ idPedido, nombre, items, total, fecha, urlCuenta }) {
  const unidades = items.reduce((suma, i) => suma + i.cantidad, 0);

  const filas = items
    .map((i) => {
      const subtotal = Number(i.precio) * i.cantidad;
      return `
      <tr>
        <td style="padding:14px 12px;border-bottom:1px solid #e6e6e6;font-family:${FUENTE};">
          <div style="font-size:15px;font-weight:bold;color:#1a1a1a;">${escapar(i.titulo)}</div>
          <div style="font-size:12px;color:#777777;margin-top:3px;">Modelo ${escapar(i.modelo)} &middot; ${dinero(i.precio)} c/u</div>
        </td>
        <td align="center" style="padding:14px 8px;border-bottom:1px solid #e6e6e6;font-family:${FUENTE};font-size:15px;color:#1a1a1a;">${i.cantidad}</td>
        <td align="right" style="padding:14px 12px;border-bottom:1px solid #e6e6e6;font-family:${FUENTE};font-size:15px;font-weight:bold;color:#1a1a1a;white-space:nowrap;">${dinero(subtotal)}</td>
      </tr>`;
    })
    .join('');

  const paso = (numero, titulo, texto) => `
      <tr>
        <td width="44" valign="top" style="padding:0 0 14px 0;">
          <div style="width:30px;height:30px;line-height:30px;border-radius:15px;background-color:${AZUL};color:#ffffff;font-family:${FUENTE};font-size:14px;font-weight:bold;text-align:center;">${numero}</div>
        </td>
        <td valign="top" style="padding:0 0 14px 0;font-family:${FUENTE};">
          <div style="font-size:15px;font-weight:bold;color:#1a1a1a;">${titulo}</div>
          <div style="font-size:13px;color:#666666;line-height:1.5;margin-top:2px;">${texto}</div>
        </td>
      </tr>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>Confirmación de tu pedido #${idPedido}</title>
</head>
<body style="margin:0;padding:0;background-color:#f3ede7;">
  <!-- Texto de vista previa en la bandeja de entrada -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f3ede7;">
    Recibimos tu pedido #${idPedido} por ${dinero(total)}. Gracias por confiar en ERGOSEATING.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f3ede7" style="background-color:#f3ede7;">
    <tr>
      <td align="center" style="padding:24px 12px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

          <!-- Encabezado -->
          <tr>
            <td align="center" bgcolor="${CAFE}" style="background-color:${CAFE};padding:28px 20px;border-radius:6px 6px 0 0;">
              <div style="font-family:${FUENTE};font-size:30px;font-weight:bold;letter-spacing:3px;color:#000000;">ERGOSEATING</div>
              <div style="font-family:${FUENTE};font-size:13px;letter-spacing:1px;color:#2b1a0e;margin-top:6px;">BUTACAS ERGON&Oacute;MICAS ESCOLARES</div>
            </td>
          </tr>

          <!-- Cuerpo -->
          <tr>
            <td bgcolor="#ffffff" style="background-color:#ffffff;padding:32px 28px 8px 28px;">
              <div style="font-family:${FUENTE};font-size:24px;font-weight:bold;color:${AZUL};line-height:1.3;">&iexcl;Gracias por tu compra, ${escapar(nombre)}!</div>
              <p style="font-family:${FUENTE};font-size:15px;color:#444444;line-height:1.6;margin:12px 0 22px 0;">
                Recibimos tu pedido correctamente. Aqu&iacute; tienes el resumen para que lo conserves.
              </p>

              <!-- Datos del pedido -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f6f8" style="background-color:#f5f6f8;border-left:4px solid ${AZUL};">
                <tr>
                  <td style="padding:14px 16px;font-family:${FUENTE};">
                    <div style="font-size:11px;letter-spacing:1px;color:#888888;">N&Uacute;MERO DE PEDIDO</div>
                    <div style="font-size:20px;font-weight:bold;color:${AZUL};margin-top:2px;">#${idPedido}</div>
                  </td>
                  <td align="right" style="padding:14px 16px;font-family:${FUENTE};">
                    <div style="font-size:11px;letter-spacing:1px;color:#888888;">FECHA</div>
                    <div style="font-size:13px;color:#333333;margin-top:4px;">${escapar(formatoFecha(fecha))}</div>
                  </td>
                </tr>
              </table>

              <!-- Productos -->
              <div style="font-family:${FUENTE};font-size:16px;font-weight:bold;color:#1a1a1a;margin:28px 0 10px 0;">Tu pedido (${unidades} ${unidades === 1 ? 'unidad' : 'unidades'})</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr bgcolor="${AZUL}" style="background-color:${AZUL};">
                  <td style="padding:10px 12px;font-family:${FUENTE};font-size:12px;letter-spacing:1px;color:#ffffff;">PRODUCTO</td>
                  <td align="center" style="padding:10px 8px;font-family:${FUENTE};font-size:12px;letter-spacing:1px;color:#ffffff;">CANT.</td>
                  <td align="right" style="padding:10px 12px;font-family:${FUENTE};font-size:12px;letter-spacing:1px;color:#ffffff;">SUBTOTAL</td>
                </tr>
                ${filas}
                <tr>
                  <td colspan="2" align="right" style="padding:18px 8px 6px 12px;font-family:${FUENTE};font-size:15px;color:#555555;">Total del pedido</td>
                  <td align="right" style="padding:18px 12px 6px 8px;font-family:${FUENTE};font-size:22px;font-weight:bold;color:${AZUL};white-space:nowrap;">${dinero(total)}</td>
                </tr>
              </table>

              <!-- Botón -->
              <table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" style="margin:30px auto 8px auto;">
                <tr>
                  <td align="center" bgcolor="${AZUL}" style="background-color:${AZUL};border-radius:4px;">
                    <a href="${escapar(urlCuenta)}" target="_blank" style="display:inline-block;padding:14px 34px;font-family:${FUENTE};font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;">Ver mi pedido</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Qué sigue -->
          <tr>
            <td bgcolor="#ffffff" style="background-color:#ffffff;padding:8px 28px 30px 28px;">
              <div style="border-top:1px solid #e6e6e6;padding-top:22px;font-family:${FUENTE};font-size:16px;font-weight:bold;color:#1a1a1a;margin-bottom:14px;">&iquest;Qu&eacute; sigue?</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${paso(1, 'Revisamos tu pedido', 'Nuestro equipo lo revisa y se pone en contacto contigo para confirmar los detalles.')}
                ${paso(2, 'Lo preparamos y enviamos', 'Te avisaremos cuando tu pedido salga hacia su destino.')}
                ${paso(3, 'Lo recibes', 'Puedes seguir el estado en cualquier momento desde &laquo;Compras en proceso&raquo; en tu cuenta.')}
              </table>
            </td>
          </tr>

          <!-- Pie -->
          <tr>
            <td align="center" bgcolor="#2b2b2b" style="background-color:#2b2b2b;padding:24px 20px;border-radius:0 0 6px 6px;">
              <div style="font-family:${FUENTE};font-size:14px;font-weight:bold;color:#ffffff;">&iquest;Dudas sobre tu pedido?</div>
              <div style="font-family:${FUENTE};font-size:13px;color:#d0d0d0;line-height:1.7;margin-top:6px;">
                Tel&eacute;fono 1: 55-4123-8901<br>Tel&eacute;fono 2: 55-9876-5432
              </div>
              <div style="font-family:${FUENTE};font-size:11px;color:#9a9a9a;line-height:1.5;margin-top:16px;">
                Recibes este correo porque realizaste una compra en ERGOSEATING.<br>
                Es un mensaje autom&aacute;tico, por favor no respondas a esta direcci&oacute;n.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = { correoConfirmacion };
