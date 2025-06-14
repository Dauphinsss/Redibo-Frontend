export interface ComentarioConCalificacion {
  id: number;
  comentario: string;
  calificacion: number;
  fecha_creacion: string;
  Usuario: {
    nombre: string;
  };
}
