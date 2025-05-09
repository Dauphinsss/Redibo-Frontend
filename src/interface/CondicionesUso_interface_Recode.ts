export interface HerramientaBasica_Recode {
    nombre: string;
    cantidad: number;
}

export interface CondicionesGenerales_Recode {
    edad_minima: number;
    edad_maxima: number;
    kilometraje_max_dia: number;
    fumar: boolean;
    mascota: boolean;
    dev_mismo_conb: boolean;
    uso_fuera_ciudad: boolean;
    multa_conductor: boolean;
    dev_mismo_lugar: boolean;
    uso_comercial: boolean;
}

export interface EntregaAuto_Recode {
    estado_combustible: string;
    esterior_limpio: boolean;
    inter_limpio: boolean;
    rayones: boolean;
    llanta_estado: boolean;
    interior_da_o: boolean;
    herramientas_basicas: HerramientaBasica_Recode[];
}

export interface DevolucionAuto_Recode {
    interior_limpio: boolean;
    exterior_limpio: boolean;
    rayones: boolean;
    herramientas: boolean;
    cobrar_da_os: boolean;
    combustible_igual: boolean;
}

export interface CondicionesUsoPayload_Recode {
    id_carro: number;
    condiciones_uso: {
        condiciones_generales: CondicionesGenerales_Recode;
        entrega_auto: EntregaAuto_Recode;
        devolucion_auto: DevolucionAuto_Recode;
    };
}
