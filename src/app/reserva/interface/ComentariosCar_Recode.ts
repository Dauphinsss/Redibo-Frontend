export interface ComentariosCar {
    id: number;
    contenido: string;
    comentado_en: string;
    Calificacion: {
        calf_carro: number;
    } | null; 
    likes: number | null; 
    dont_likes: number | null;  
    Usuario: {
        nombre: string;
        id: number;
    };
    respuestas: {
        id: number;
        contenido: string;
        comentado_en: string;
        Usuario: {
            nombre: string;
        };
    }[];
}
