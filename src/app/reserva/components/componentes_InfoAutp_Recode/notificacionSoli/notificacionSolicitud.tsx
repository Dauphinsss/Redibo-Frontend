import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Notificacion } from "@/app/reserva/interface/NotificacionSolicitud_Recode";
import axios from "axios";

interface NotificacionHostProps {
  notificacion: Notificacion;
  onAceptar?: () => void;
  onRechazar?: () => void;
}

export const NotificacionHost: React.FC<NotificacionHostProps> = ({
  notificacion,
  onAceptar,
  onRechazar,
}) => {
  const [estado, setEstado] = useState<boolean | null>(
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

  const idLimpio = notificacion.id.replace("notif-", "");

  const handleRespuesta = async (nuevoEstado: boolean) => {
  try {
      const response = await axios.put(
    `https://search-car-backend.vercel.app/correo/updateEstadoCorreo/${idLimpio}?estado=${nuevoEstado}`
  );

  console.log("Respuesta del servidor:", response.data);
    setEstado(nuevoEstado);

    if (nuevoEstado && onAceptar) onAceptar();
    if (!nuevoEstado && onRechazar) onRechazar();
  } catch (error: any) {
    if (error.response) {
      console.error("Respuesta del servidor:", error.response.data);
      console.error("Código de estado:", error.response.status);
    } else {
      console.error("Error desconocido:", error.message);
    }
    alert("Hubo un error al actualizar. Intenta nuevamente.");
  }
};


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
                onClick={() => handleRespuesta(true)}
                className="bg-black text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
              >
                Aceptar
              </button>
              <button
                onClick={() => handleRespuesta(false)}
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
