import React from "react";
import { Notificacion } from "./notificacionSolicitud";
import { NotificacionRenter } from "./notificacionRenter";

export const NotificacionesCampana: React.FC = () => {
  return (
    <div className="w-[400px] h-[500px] bg-white border rounded shadow-lg overflow-y-scroll p-4">
      <h2 className="text-lg font-semibold mb-2">Notificaciones</h2>

      <div className="mb-4">
        <h3 className="text-sm font-bold mb-1">Solicitudes a t(Host)</h3>
        <Notificacion tipo="host" />
        <Notificacion tipo="host" />
        <Notificacion tipo="host" />
      </div>

      <hr className="my-2 border-gray-400" />

      <div>
        <h3 className="text-sm font-bold mb-1">Solicitudes enviadas (Renter)</h3>
        <NotificacionRenter
            mensaje = "Tu solicitud fue enviada con exito"
            fecha= "14/05/2025 10:00 AM" 
        />
        <NotificacionRenter
            mensaje = "Hubo un fallo al enviar tu solicitud"
            fecha= "15/05/2025 10:00 AM" 
        />
      </div>
    </div>
  );
};
