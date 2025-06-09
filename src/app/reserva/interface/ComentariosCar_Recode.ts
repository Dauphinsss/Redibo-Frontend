export interface ComentariosCar {
    id: number;
    contenido: string;
    comentario: string;
    fecha_creacion: string;
    comentado_en: string;
    Calificacion: {
        calf_carro: number;
    } | null; 
    likes: number | null; 
    dont_likes: number | null;  
    usuario: {
        nombre: string;
        id: number;
    };
    respuestas: {
        id: number;
        comentario: string;
        comentado_en: string;
        respuesta: string;
        host: {
            nombre: string;
        };
    }[];
}
