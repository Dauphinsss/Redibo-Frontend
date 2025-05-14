export interface DetalleHost{
    id: number;
    nombre: string;
    fecha_nacimiento: string;
    genero: string;
    nombreCiudad: string;
    correo: string;
    telefono: number;
    foto: string;
    carro:{
        modelo: string;
        marca: string;
        Imagen:{
            id: number;
            data: string;
            id_carro: number;
        }[];
    }[];
}
