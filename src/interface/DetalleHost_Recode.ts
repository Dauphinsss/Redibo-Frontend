export interface DetalleHost_Recode {
    id: number;
    nombre: string;
    edad: number;
    genero: string;
    ciudad: string;
    correo: string;
    telefono: string;
    foto: string | "Sin imagen";
    autos: {
        modelo: string;
        marca: string;
        imagen: string | "Sin imagen"; 
    }[];
}
