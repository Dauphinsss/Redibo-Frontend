export interface RawAuto_Interface_Recode {
    id: number;
    modelo: string;
    marca: string;
    asientos: number;
    puertas: number;
    transmision: string;
    precio_por_dia: number;
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
        provincia?: {
            ciudad?: {
                nombre?: string;
            };
        };
    };
    imagen?: {
        data?: string;
    }[];
}  