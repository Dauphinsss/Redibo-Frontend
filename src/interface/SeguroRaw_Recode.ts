export interface SeguroRaw_Recode {
    id: number;
    fechaInicio: string;
    fechaFin: string;
    enlaceSeguro: string;
    Carro: {
        id: number;
        marca: string;
        modelo: string;
        Usuario: {
            id: number;
            nombre: string;
            telefono: string;
            foto: string;
            UsuarioRol: {
                Rol: {
                    rol: string;
                };
            }[];
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