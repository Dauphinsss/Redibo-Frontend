export interface RawAuto_Interface_Recode {
    id: number;
    modelo: string;
    marca: string;
    asientos: number;
    puertas: number;
    transmicion: string;
    precio_por_dia: number;
    a_o: number;
    CombustibleCarro: {
        TipoCombustible: {
            tipoDeCombustible: string;
        };
    }[];
    estado: string;
    Usuario: {
        nombre: string;
    };
    Direccion: {
        calle: string;
        latitud: number;
        longitud: number;
        Provincia: {
            Ciudad: {
                nombre: string;
            };
        };
    };
    Imagen: {
        id: number;
        data: string;
        id_carro: number;
    }[];
    caracteristicasAdicionalesCarro: {
        caracteristicas_adicionales?: {
            nombre: string;
        };
    }[];
    Reserva: {
        fecha_inicio: string;
        fecha_fin: string;
        estado: string;
    }[];
}