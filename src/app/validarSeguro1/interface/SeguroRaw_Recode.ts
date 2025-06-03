export interface SeguroRaw_Recode {
    id: number;
    fechaInicio: string;
    fechaFin: string;
    enlaceSeguro: string | null;

    Carro: {
        id: number;
        marca: string;
        modelo: string;
        Imagen: {
            id: number;
            data: string;
            id_carro: number;
        }[];
        Usuario: {
            id: number;
            nombre: string;
            telefono: string;
            foto: string | null;
        };
    };

    Seguro: {
        id: number;
        empresa: string;
        nombre: string;
        tipoSeguro: string;
    };

    tiposeguro: {
        id: number;
        tipoda_o: string;
        descripcion: string;
        cantidadCobertura: string;
    }[];
}