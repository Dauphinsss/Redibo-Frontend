export interface RawHostDetails_Recode {
    id: number;
    nombre: string;
    fecha_nacimiento: string;
    genero: string;
    Ciudad: {
        nombre: string;
    };
    correo: string;
    telefono: string;
    foto: string | "Sin imagen";
    Carro: {
        modelo: string;
        marca: string;
        Imagen: {
            id: number;
            data: string | "Sin imagen";
            id_carro: number;
        }[];
    }[];
}
