import {
    CondicionesGenerales_Recode,
    EntregaAuto_Recode,
    DevolucionAuto_Recode,
    CondicionesUsoPayload_Recode
} from "@/interface/CondicionesUso_interface_Recode";

/**
 * Transforma los datos recolectados del formulario en el payload que espera la API.
 * @param id_carro - ID del vehículo al que pertenecen las condiciones
 * @param generales - Condiciones generales del auto
 * @param entrega - Estado del auto al momento de la entrega
 * @param devolucion - Estado esperado al devolver el auto
 * @returns Objeto listo para enviar por POST a /insertCondition
 */
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
