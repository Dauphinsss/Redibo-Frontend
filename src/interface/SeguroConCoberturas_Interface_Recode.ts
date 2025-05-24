export interface SeguroConCoberturas_Interface_Recode {
    // Información del vehículo
    id_carro: number;
    modelo_carro: string;
    marca_carro: string;
    imagenURL_carro: string;

    // Información del propietario
    id_propietario: number;
    nombre_propietario: string;
    telefono_propietario: string;
    fotoURL_propietario: string;

    // Información del seguro
    id_seguro: number;
    nombre_seguro: string;
    tipo_seguro: string;
    nombre_empresa_seguro: string;
    enlaceSeguroURL: string;
    fecha_inicio: string; // ISO string
    fecha_fin: string;    // ISO string

    // Coberturas asociadas
    coberturas: CoberturaTransformada[];
}

/**
 * Cobertura transformada para uso en la UI
 */
export interface CoberturaTransformada {
    id_cobertura: number;
    tipodanio_cobertura: string;
    descripcion_cobertura?: string;
    cantida_cobertura: string;
}
