import { useState } from "react";

interface Comentario {
  id: number;
  Usuario: { nombre: string };
  comentado_en: string;
  contenido: string;
  Calificacion: { calf_carro: number };
}

export function useFiltrarComentarios(comentarios: Comentario[]) { 
  const [filtroCalificacion, setFiltroCalificacion] = useState<number | null>(null);

  // Función para filtrar los comentarios según la calificación
  const comentariosFiltrados = filtroCalificacion !== null
    ? comentarios.filter((comentario) => comentario.Calificacion.calf_carro === filtroCalificacion)
    : comentarios;

  return { filtroCalificacion, setFiltroCalificacion, comentariosFiltrados };
}