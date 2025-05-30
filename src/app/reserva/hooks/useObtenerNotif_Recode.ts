import { useEffect, useState } from "react";
import { ObtenerNotif_Recode } from "@/app/reserva/interface/ObtenerNotif_Recode";

export function useObtenerNotif(idHost: number) {
  const [notificaciones, setNotificaciones] = useState<ObtenerNotif_Recode[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerNotificaciones = async () => {
      setCargando(true);
      setError(null);

      try {
        const respuesta = await fetch(`https://search-car-backend.vercel.app/correo/obtener/${idHost}`);

        if (!respuesta.ok) {
          throw new Error("Error al obtener las notificaciones");
        }

        const data: ObtenerNotif_Recode[] = await respuesta.json();
        setNotificaciones(data);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setCargando(false);
      }
    };

    if (idHost) {
      obtenerNotificaciones();
    }
  }, [idHost]);

  return { notificaciones, cargando, error };
}
