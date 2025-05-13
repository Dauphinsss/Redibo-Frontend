export interface RawAutoDetails_Interface_Recode {
    marca: string;
    modelo: string;
    placa: string;
    a_o: number;
    asientos: number;
    puertas: number;
    soat: boolean;
    precio_por_dia: number;
    descripcion: string;
    transmicion: string;
    Direccion: {
        calle: string;
        zona: string;
        num_casa: string;
        Provincia: {
            nombre: string;
            Ciudad: {
            nombre: string;
            };
        };
    };
    Usuario: {
        nombre: string;
    };
    CombustibleCarro: {
       TipoCombustible: {
       tipoDeCombustible: string;
       };
    }[];
    Imagen: {
        id: number;
        id_carro: number;
        data: string;
    }[];
    caracteristicasAdicionalesCarro: {
        caracteristicas_adicionales?: {
            nombre: string;
        };
    }[];
}