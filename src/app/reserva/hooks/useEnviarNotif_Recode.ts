import { useState } from "react";
import { SolicitudRecodePost } from "@/app/reserva/interface/EnviarGuardarNotif_Recode";

export function useEnviarSolicitudRecode() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const enviarSolicitud = async (datos: SolicitudRecodePost) => {
    setCargando(true);
    setError(null);
    setExito(false);

    try {
      const respuesta = await fetch("https://search-car-backend.vercel.app/correo/enviarGuardar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      if (!respuesta.ok) {
        throw new Error("Error al enviar la solicitud");
      }

      setExito(true);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setCargando(false);
    }
  };

  return { enviarSolicitud, cargando, error, exito };
}
