
import { RawCondicionesUsoResponse } from "@/interface/RawCondiciones_Interface_Recode";
import { CondicionesUsoResponse } from "@/interface/Condiciones_Interface_Recode";

export function transformCondiciones_Recode(raw: RawCondicionesUsoResponse): CondicionesUsoResponse {
  return {
    generales: raw.condiciones_uso.condiciones_generales,
    devolucion: raw.condiciones_uso.devolucion_auto,
    entrega: raw.condiciones_uso.entrega_auto,
  };
}
