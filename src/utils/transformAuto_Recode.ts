import { RawAuto_Interface_Recode as RawAuto } from "@/interface/RawAuto_Interface_Recode";
import { AutoCard_Interfaces_Recode as AutoCard } from "@/interface/AutoCard_Interface_Recode";

export const transformAuto = (item: RawAuto): AutoCard => ({
    idAuto: String(item.id),
    modelo: item.modelo,
    marca: item.marca,
    asientos: item.asientos,
    puertas: item.puertas,
    transmision: item.transmicion,
    combustibles: Array.isArray(item.combustiblesporCarro)
        ? item.combustiblesporCarro
            .map((c) => c?.combustible?.tipoDeCombustible)
            .filter((c): c is string => typeof c === "string")
        : [],
    estadoAlquiler: item.estado,
    nombreHost: item.usuario?.nombre || "Sin nombre",
    calificacionAuto: 4.5,
    ciudad: item.direccion?.provincia?.ciudad?.nombre || "Desconocido",
    calle: item.direccion?.calle || "No especificada",
    precioOficial: Number(item.precio_por_dia),
    precioDescuento: Number(item.precio_por_dia),
    precioPorDia: Number(item.precio_por_dia),
    disponible_desde: item.disponible_desde || "Sin fecha de inicio",
    disponible_hasta: item.disponible_hasta || "Sin fecha de fin",
    imagenURL: item.imagenes?.[0]?.data || "",
});
