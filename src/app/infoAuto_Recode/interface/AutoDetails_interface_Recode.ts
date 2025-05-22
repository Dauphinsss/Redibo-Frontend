export interface AutoDetails_interface_Recode {
    marca: string;
    modelo: string;
    placa: string;
    anio: number;
    asientos: number;
    puertas: number;
    soat: boolean;
    precio: number;
    descripcion: string;
    transmision: string;
    calle: string;
    zona: string;
    ciudad: string;
    provincia: string;
    nombreHost: string;
    combustibles: string[];
    imagenes: { id: number; data: string }[];
    caracteristicasAdicionales: string[];
}