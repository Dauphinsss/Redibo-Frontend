import { useState, useEffect } from "react";
import { getCarRatingsFromAuto, getCarRatingsFromComments } from "@/app/busqueda/service/service_auto_recode";

export function useCalificaciones(idAuto: string) {
  const [calificaciones, setCalificaciones] = useState<number[]>([]);
  const [promedioCalificacion, setPromedioCalificacion] = useState<string>("0.0");

  useEffect(() => {
    async function fetchCalificaciones() {
      const ratingsAuto = await getCarRatingsFromAuto(idAuto);
      const ratingsComments = await getCarRatingsFromComments(idAuto);
      const todasCalificaciones = [...ratingsAuto, ...ratingsComments];

      setCalificaciones(todasCalificaciones);

      if (todasCalificaciones.length > 0) {
        const promedio = (todasCalificaciones.reduce((acc, cal) => acc + cal, 0.0) / todasCalificaciones.length).toFixed(1);
        setPromedioCalificacion(promedio);
      }
    }

    fetchCalificaciones();
  }, [idAuto]);

  return { calificaciones, promedioCalificacion };
}