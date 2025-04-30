export interface RawAutoDetails_Interface_Recode {
    marca: string;
    modelo: string;
    placa: string;
    anio: number;
    asientos: number;
    puertas: number;
    soat: boolean;
    precio_por_dia: string;
    descripcion: string;
    transmision: string;
    direccion: {
        calle: string;
        zona: string;
        num_casa: string;
        provincia: {
            nombre: string;
            ciudad: {
                nombre: string;
            };
        };
    };
    usuario_rol: {
        usuario: {
        nombre: string;
        };
    };
    combustiblecarro: {
        tipocombustible?: {
            tipo_de_combustible: string;
            };
    }[];
    imagen: {
        id: number;
        data: string;
        id_carro: number;
    }[];
    caracteristicasadicionalescarro: {
        caracteristicas_adicionales: {
            nombre: string;
        };
    }[];
}  