export interface CondicionesGeneralesVisual {
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

export interface EntregaAutoVisual {
    estado_combustible: string;
    esterior_limpio: boolean;
    inter_limpio: boolean;
    rayones: boolean;
    llanta_estado: boolean;
    interior_da_o: boolean;
}

export interface DevolucionAutoVisual {
    interior_limpio: boolean;
    exterior_limpio: boolean;
    rayones: boolean;
    herramientas: boolean;
    cobrar_da_os: boolean;
    combustible_igual: boolean;
}

export interface CondicionesUsoResponse {
    condiciones_generales: CondicionesGeneralesVisual;
    entrega_auto: EntregaAutoVisual;
    devolucion_auto: DevolucionAutoVisual;
}