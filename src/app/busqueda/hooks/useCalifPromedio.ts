import { useState, useEffect } from "react";
import { getCarRatingsFromComments } from "@/app/reserva/services/services_reserva";

export function useCalificaciones(idAuto: string) {
  const [calificaciones, setCalificaciones] = useState<number[]>([]);
  const [promedioCalificacion, setPromedioCalificacion] =
    useState<string>("0.0");

  useEffect(() => {
    async function fetchCalificaciones() {
      const ratingsComments = await getCarRatingsFromComments(idAuto);

      setCalificaciones(ratingsComments);

      if (ratingsComments.length > 0) {
        const promedio = (
          ratingsComments.reduce((acc, cal) => acc + cal, 0.0) /
          ratingsComments.length
        ).toFixed(1);
        setPromedioCalificacion(promedio);
      } else {
        setPromedioCalificacion("0.0");
      }
    }

    fetchCalificaciones();
  }, [idAuto]);

  return { calificaciones, promedioCalificacion };
}
