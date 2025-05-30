import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Notificacion } from "@/app/reserva/interface/NotificacionSolicitud_Recode";
import axios from "axios";
import { getCarById, getDetalleHost_Recode } from "@/service/services_Recode";
import { transformAutoDetails_Recode } from "@/app/reserva/utils/transformAutoDetails_Recode";
import { AutoDetails_interface_Recode } from "@/app/reserva/interface/AutoDetails_interface_Recode";
import { DetalleHost_Recode as DetalleHost } from "@/app/reserva/interface/DetalleHost_Recode";
interface NotificacionHostProps {
  notificacion: Notificacion;
  onAceptar?: () => void;
  onRechazar?: () => void;
}

export const NotificacionHost: React.FC<NotificacionHostProps> = ({notificacion,onAceptar,onRechazar,}) => {
  
  const [estado] = useState<boolean | null>(
    typeof notificacion.estado === "boolean" ? notificacion.estado : null
  );
  

  const {
    nombreUsuario = "Usuario",
    marcaVehiculo = "Vehículo",
    modeloVehiculo = "",
    fechaInicio = "",
    fechaFin = "",
    lugarRecogida = "Ubicación no especificada",
    lugarDevolucion = "Ubicación no especificada",
  } = notificacion.datos;

  return (
    <div className="bg-gray-100 border rounded p-3 mb-3 shadow-sm">
      <div className="flex items-start gap-2">
        <Bell className="text-black mt-1" size={20} />
        <div className="flex-1">
          <h4 className="font-bold text-sm">{notificacion.mensaje}</h4>
          <p className="text-sm text-gray-800 mt-1">
            {nombreUsuario} está interesado en alquilar tu {marcaVehiculo}{" "}
            {modeloVehiculo}.<br />
            Con fecha desde {fechaInicio} hasta {fechaFin}.<br />
            A recoger de {lugarRecogida} y devolución en {lugarDevolucion}
          </p>

          {notificacion.tipo === "host" && estado === null && (
            <div className="flex gap-2 mt-3">
              <button
                //onClick={() => handleRespuesta(true)}
                className="bg-black text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
              >
                Aceptar
              </button>
              <button
                //onClick={() => handleRespuesta(false)}
                className="bg-black text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
              >
                Rechazar
              </button>
            </div>
          )}

          {estado !== null && (
            <p
              className={`text-sm mt-2 font-medium ${
                estado ? "text-green-700" : "text-red-700"
              }`}
            >
              Estado: {estado ? "Aceptado" : "Rechazado"}
            </p>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">{notificacion.fecha}</p>
    </div>
  );
};
