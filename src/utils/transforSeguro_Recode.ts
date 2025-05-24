import { SeguroRaw_Recode } from "@/interface/SeguroRaw_Recode";
import { SeguroConCoberturas_Interface_Recode } from "@/interface/SeguroConCoberturas_Interface_Recode";

export function transformSeguroTodo_Recode(
    datos?: SeguroRaw_Recode[] | null
): SeguroConCoberturas_Interface_Recode | null {
    if (!Array.isArray(datos) || datos.length === 0) return null;

    const item = datos[0];
    return {
        // Carro
        id_carro: item?.Carro?.id ?? 0,
        modelo_carro: item?.Carro?.modelo ?? "Modelo desconocido",
        marca_carro: item?.Carro?.marca ?? "Marca desconocida",
        imagenURL_carro: "Sin imagen",

        // Propietario
        id_propietario: item?.Carro?.Usuario?.id ?? 0,
        nombre_propietario: item?.Carro?.Usuario?.nombre ?? "No especificado",
        telefono_propietario: item?.Carro?.Usuario?.telefono ?? "Sin telefono",
        fotoURL_propietario: item?.Carro?.Usuario?.foto ?? "Sin imagen",

        // Seguro
        fecha_inicio: item?.fechaInicio ?? "Sin fecha inicio",
        fecha_fin: item?.fechaFin ?? "Sin fecha fin",
        enlaceSeguroURL: item?.enlaceSeguro ?? "Sin enlace",
        id_seguro: item?.Seguro?.id ?? 0,
        nombre_empresa_seguro: item?.Seguro?.empresa ?? "Desconocida",
        nombre_seguro: item?.Seguro?.nombre ?? "Sin nombre",
        tipo_seguro: item?.Seguro?.tipoSeguro ?? "No definido",

        // Coberturas
        coberturas: Array.isArray(item?.tiposeguro)
            ? item.tiposeguro.map((c) => ({
                id_cobertura: c?.id ?? 0,
                tipodanio_cobertura: c?.tipoda_o ?? "Desconocido",
                descripcion_cobertura: c?.descripcion ?? "",
                cantida_cobertura: c?.cantidadCobertura ?? "0",
            }))
        : [],
    };
}
