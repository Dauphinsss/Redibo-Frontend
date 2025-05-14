export const solicitudCorreo = (params: {
  fecha: string;
  host: string;
  renter: string;
  modelo: string;
  precio: string;
  recogida: string;
  devolucion: string;
  lugarRecogida: string;
  lugarDevolucion: string;
}) => {
  return `
  <!DOCTYPE html>
  <html>
  <body style="font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border: 1px solid #ccc;">
      <h2 style="color: black;">REDIBO</h2>
      <h3 style="text-align: center;">Solicitud de Reserva</h3>

      <p>${params.fecha}</p>
      <p>${params.host},</p>

      <p>
        El renter <strong>${params.renter}</strong> solicita la renta del auto
        <strong>${params.modelo}</strong>. A continuación, los detalles de la solicitud:
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr><td style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">Precio:</td><td style="border: 1px solid #ddd; padding: 8px;">${params.precio}</td></tr>
        <tr><td style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">Fecha y hora de recogida:</td><td style="border: 1px solid #ddd; padding: 8px;">${params.recogida}</td></tr>
        <tr><td style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">Fecha y hora de devolución:</td><td style="border: 1px solid #ddd; padding: 8px;">${params.devolucion}</td></tr>
        <tr><td style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">Lugar de Recogida:</td><td style="border: 1px solid #ddd; padding: 8px;">${params.lugarRecogida}</td></tr>
        <tr><td style="font-weight: bold; border: 1px solid #ddd; padding: 8px;">Lugar de Devolución:</td><td style="border: 1px solid #ddd; padding: 8px;">${params.lugarDevolucion}</td></tr>
      </table>

      <div style="margin-top: 30px; text-align: center;">
        <button style="background-color: #ccc; color: white; padding: 10px 20px; margin-right: 10px; border: none;">Aceptar</button>
        <button style="background-color: #ccc; color: white; padding: 10px 20px; border: none;">Rechazar</button>
      </div>
    </div>
  </body>
  </html>
  `;
};
