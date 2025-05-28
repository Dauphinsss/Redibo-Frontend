import {
    CondicionesGenerales_Recode,
    EntregaAuto_Recode,
    DevolucionAuto_Recode,
    CondicionesUsoPayload_Recode
} from "@/app/host/interface/CondicionesUsoFormu_interface_Recode";

export function transformCondicionesUso_Recode(
    id_carro: number,
    generales: CondicionesGenerales_Recode,
    entrega: EntregaAuto_Recode,
    devolucion: DevolucionAuto_Recode
): CondicionesUsoPayload_Recode {
    return {
        id_carro,
        condiciones_uso: {
            condiciones_generales: generales,
            entrega_auto: entrega,
            devolucion_auto: devolucion,
        }
    };
}
