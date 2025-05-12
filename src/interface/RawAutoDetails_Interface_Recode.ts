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
    transmicion: string;
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
    usuario: {
        nombre: string;
    };

    combustiblesporCarro: {
        combustible?: {
            tipoDeCombustible: string;
        };
    }[];
    imagenes: {
        id: number;
        data: string;
        id_carro: number;
    }[];
    caracteristicasAdicionalesCarro: {
        carasteristicasAdicionales: {
            nombre: string;
        };
    }[];
}  