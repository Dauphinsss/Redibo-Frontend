import React from "react";
import { NotificacionHost } from "./notificacionSolicitud";
import { NotificacionRenter } from "./notificacionRenter";
import { Notificacion } from "@/interface/NotificacionSolicitud_Recode";

interface NotificacionesCampanaProps {
  notificaciones: Notificacion[];
  onAceptar?: (id: string) => void;
  onRechazar?: (id: string) => void;
}

export const NotificacionesCampana: React.FC<NotificacionesCampanaProps> = ({ 
  notificaciones,
  onAceptar,
  onRechazar
}) => {
  return (
    <div className="w-[400px] h-[500px] bg-white border rounded shadow-lg overflow-y-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Notificaciones</h2>

      {notificaciones.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No hay notificaciones</p>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="text-sm font-bold mb-2">Solicitudes al Host</h3>
            {notificaciones
              .filter(n => n.tipo === 'host')
              .map(notif => (
                <NotificacionHost
                  key={notif.id}
                  notificacion={notif}
                  onAceptar={() => onAceptar?.(notif.id)}
                  onRechazar={() => onRechazar?.(notif.id)}
                />
              ))}
          </div>

          <hr className="my-4 border-gray-200" />

          <div>
            <h3 className="text-sm font-bold mb-2">Solicitudes de Renter</h3>
            {notificaciones
              .filter(n => n.tipo === 'renter')
              .map(notif => (
                <NotificacionRenter
                  key={notif.id}
                  notificacion={notif}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
};