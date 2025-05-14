import { ComentariosCar } from '@/interface/ComentariosCar_Recode';
import { useEffect, useMemo, useState } from "react";

export function useComentariosAuto(
  idCar: number,
  filtroCalificacion: number | null = null,
  ordenSeleccionado: string = "Mejor Calificación"
) {
  const [comentarios, setComentarios] = useState<ComentariosCar[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerComentarios = async () => {
      try {
        setCargando(true);
        const respuesta = await fetch(`https://search-car-backend.vercel.app/comments/${idCar}`);
        const data = await respuesta.json();
        setComentarios(data);
      } catch {
        setError("Error al cargar los comentarios");
      } finally {
        setCargando(false);
      }
    };

    obtenerComentarios();
  }, [idCar]);

 const comentariosFiltrados = useMemo(() => {
  return [...comentarios]
    .filter((comentario) =>
      filtroCalificacion !== null
        ? comentario.Calificacion && comentario.Calificacion.calf_carro === filtroCalificacion
        : true
    )
    .sort((a, b) => {
     
      const calA = a.Calificacion?.calf_carro ?? 0;  
      const calB = b.Calificacion?.calf_carro ?? 0;

      const likesA = a.likes ?? 0;
      const likesB = b.likes ?? 0;

      switch (ordenSeleccionado) {
        case "Mejor Calificación":
          return calB - calA;
        case "Peor Calificación":
          return calA - calB;
        case "Más valorado":
          return likesB - likesA;
        case "Menos valorado":
          return likesA - likesB;
        default:
          return 0;
      }
    });
}, [comentarios, filtroCalificacion, ordenSeleccionado]);

  function formatearFecha(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()+1).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  }

  return { comentariosFiltrados, cargando, error, formatearFecha };
}
