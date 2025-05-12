import {
  RawCondicionesUsoResponse
} from "@/interface/RawCondicionesUsoVisuali_Interface_Recode";

import {
  CondicionesUsoResponse
} from "@/interface/CondicionesUsoVisual_interface_Recode";

export function transformCondiciones_Recode(raw: RawCondicionesUsoResponse): CondicionesUsoResponse {
  return {
    condiciones_generales: raw.condiciones_uso.condiciones_generales,
    entrega_auto: raw.condiciones_uso.entrega_auto,
    devolucion_auto: raw.condiciones_uso.devolucion_auto,
  };
}