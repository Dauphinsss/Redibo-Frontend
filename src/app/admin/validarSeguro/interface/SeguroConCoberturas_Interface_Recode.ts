export interface SeguroConCoberturas_Interface_Recode {
    id_poliza_seguro_carro: number; 
    id_carro: number; 
    modelo_carro: string;
    marca_carro: string;
    imagenURL_carro: string;
    id_propietario: number;
    nombre_propietario: string;
    telefono_propietario: string;
    fotoURL_propietario: string;
    id_seguro: number; 
    nombre_seguro: string;
    tipo_seguro: string;
    nombre_empresa_seguro: string;
    enlaceSeguroURL: string | null;
    fecha_inicio: string;
    fecha_fin: string;
    coberturas: CoberturaTransformada[];
}

export interface CoberturaTransformada {
    id_cobertura: number;
    tipodanio_cobertura: string;
    descripcion_cobertura?: string | null; 
    cantida_cobertura: string;
}


export interface PostCoberturaPayload {
    id_SeguroCarro: number; 
    tipodaño: string;
    descripcion: string;
    cantidadCobertura: string;
}

export interface PutCoberturaPayload {
    id_seguro: number; 
    tipoda_o: string;
    descripcion: string;
    cantidadCobertura: string;
}

export interface CoberturaInterface {
    id: number;
    id_poliza: number;
    tipodaño: string;
    descripcion: string | ""; 
    valides: string;
}