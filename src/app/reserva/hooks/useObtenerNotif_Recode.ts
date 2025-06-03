import { useState } from "react";
import { ObtenerNotif_Recode } from "@/app/reserva/interface/ObtenerNotif_Recode";

export function useObtenerNotif() {
  const [notificaciones, setNotificaciones] = useState<ObtenerNotif_Recode[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotif = async (idHost: number) => {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await fetch(`https://search-car-backend.vercel.app/correo/obtener/${idHost}`);
      if (!respuesta.ok) {
        throw new Error("Error al obtener las notificaciones");
      }
      const data: ObtenerNotif_Recode[] = await respuesta.json();
      setNotificaciones(data);
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
      return [];
    } finally {
      setCargando(false);
    }
  };

  return { notificaciones, cargando, error, fetchNotif };
}
