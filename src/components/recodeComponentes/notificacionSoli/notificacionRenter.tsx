import React from "react";
import { Bell } from "lucide-react";
import { Notificacion } from "@/interface/NotificacionSolicitud_Recode";

interface NotificacionRenterProps {
  notificacion: Notificacion;
}

export const NotificacionRenter: React.FC<NotificacionRenterProps> = ({ 
  notificacion 
}) => {
  const {
    nombreHost = 'Anfitrión',
    marcaVehiculo = 'Vehículo',
    modeloVehiculo = '',
    fechaInicio = '',
    fechaFin = ''
  } = notificacion.datos;

  return (
    <div className="bg-gray-100 border rounded p-3 mb-3 shadow-sm">
      <div className="flex items-start gap-2">
        <Bell className="text-black mt-1" size={20} />
        <div className="flex-1">
          <h4 className="font-bold text-sm">{notificacion.mensaje}</h4>
          <p className="text-sm text-gray-800 mt-1">
            Has solicitado el {marcaVehiculo} {modeloVehiculo} de {nombreHost}.<br />
            Para las fechas {fechaInicio} al {fechaFin}.<br />
            Estado: <span className="font-semibold">{notificacion.estado || 'pendiente'}</span>
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">{notificacion.fecha}</p>
    </div>
  );
};