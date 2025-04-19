export interface RawAuto_Interface_Recode {
    id: number;
    modelo: string;
    marca: string;
    asientos: number;
    puertas: number;
    transmision: string;
    precio_por_dia: string;
    combustiblecarro: {
        tipocombustible?: {
            tipo_de_combustible: string;
        };
    }[];
    estado: string;
    usuario_rol?: {
        usuario?: {
        nombre?: string;
        };
    };
    direccion?: {
        calle?: string;
        zona?: string;
    };
    imagen?: {
        data?: string;
    }[];
}  