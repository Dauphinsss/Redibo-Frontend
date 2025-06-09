import { ComentariosCar } from "@/app/reserva/interface/ComentariosCar_Recode";
import { useEffect, useMemo, useState, useCallback } from "react";

export function useComentariosAuto(
  idCar: number,
  filtroCalificacion: number | null = null,
  ordenSeleccionado: string = "Mejor Calificación"
) {
  const [comentarios, setComentarios] = useState<ComentariosCar[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComentarios = useCallback(async () => {
    try {
      setCargando(true);
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const respuesta = await fetch(
        `${API_URL}/api/comentarios-carro?carroId=${idCar}`
      );
      const data = await respuesta.json();
      console.log("Comentarios recibidos:", data);
      setComentarios(Array.isArray(data) ? data : []);
    } catch {
      setError("Error al cargar los comentarios");
    } finally {
      setCargando(false);
    }
  }, [idCar]);

  useEffect(() => {
    fetchComentarios();
  }, [fetchComentarios]);

  const comentariosFiltrados = useMemo(() => {
    return [...comentarios]
      .filter((comentario) =>
        filtroCalificacion !== null
          ? comentario.calificacion === filtroCalificacion
          : true
      )
      .sort((a, b) => {
        const calA = a.calificacion ?? 0;
        const calB = b.calificacion ?? 0;

        const likesA = a.likes ?? 0;
        const likesB = b.likes ?? 0;

        const fechaA = new Date(a.comentado_en).getTime();
        const fechaB = new Date(b.comentado_en).getTime();

        switch (ordenSeleccionado) {
          case "Mejor Calificación":
            return calB - calA;
          case "Peor Calificación":
            return calA - calB;
          case "Más valorado":
            return likesB - likesA;
          case "Menos valorado":
            return likesA - likesB;
          case "Más reciente":
            return fechaB - fechaA;
          case "Más antiguo":
            return fechaA - fechaB;
          default:
            return 0;
        }
      });
  }, [comentarios, filtroCalificacion, ordenSeleccionado]);

  function formatearFecha(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  }

  return {
    comentariosFiltrados,
    cargando,
    error,
    formatearFecha,
    refetchComentarios: fetchComentarios,
  };
}
