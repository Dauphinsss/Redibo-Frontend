export interface CarCardProps {
    idAuto: number;
    modelo: string;
    marca: string;
    asientos: number;
    puertas: number;
    transmision: string;
    combustibles: string[];
    host: string;
    ubicacion: string;
    src?: string | null;
    alt: string;
    onVerAseguradoras?: (idAuto: number) => void;
}

export interface CarDetailsProps {
    modelo: string;
    marca: string;
    asientos: number;
    puertas: number;
    transmision: string;
    combustibles: string[];
    host: string;
    ubicacion: string;
}

export interface CarImageProps {
    src?: string | null;
    alt: string;
}

export interface CarApiResponse {
    id: number;
    modelo: string;
    marca: string;
    asientos: number;
    puertas: number;
    transmicion: string;
    CombustibleCarro: {
        TipoCombustible: {
            tipoDeCombustible: string;
        };
    }[];
    Usuario: {
        id: number;
        nombre: string;
    };
    Direccion: {
        calle: string;
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
}


//Empieza todo sobre las aseguradoras

export interface Aseguradora {
    id: number;
    empresa: string;
    fechaInicio: string;
    fechaFin: string;
}
export interface TipoSeguro {
    id: string;
    nombre: string;
    descripcion?: string;
}

export interface PlanSeguro {
    nombre: string;
    tipos: TipoSeguro[];
}

