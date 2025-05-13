export interface ComentariosCar{
    id: number;
    contenido: string;
    comentado_en: string;
    Calificacion:{
        calf_carro: number;
    }
    likes: number;
    dont_likes: number;
    Usuario:{
        nombre: string;
    }; 
}