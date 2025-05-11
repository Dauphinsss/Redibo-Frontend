import { ComentariosCar } from '@/interface/ComentariosCar_Recode';

import { useEffect, useState } from "react";

export function useComentariosAuto(idCar: number) {
  const [comentarios, setComentarios] = useState<ComentariosCar[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerComentarios = async () => {
      try {
        const respuesta = await fetch(`https://search-car-backend.vercel.app/comments/${idCar}`);
        const data = await respuesta.json();
        setComentarios(data);
      } catch (err) {
        setError("Error al cargar los comentarios");
      } finally {
        setCargando(false);
      }
    };

    obtenerComentarios();
  }, [idCar]);

  return { comentarios, cargando, error };
}
