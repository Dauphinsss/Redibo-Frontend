import { Ciudad } from '@/utils/types';
export interface RawHostDetails_Recode{
    id: number;
    nombre: string;
    fecha_nacimiento: string;
    genero: string;
    Ciudad: {
        nombre: string;
    };
    correo: string;
    telefono: number;
    foto: string;
    Carro:{
        modelo: string;
        marca: string;
    }[];
}