import { RawAuto_Interface_Recode as RawAuto} from "@/interface/RawAuto_Interface_Recode";
import { AutoCard_Interfaces_Recode as AutoCard } from "@/interface/AutoCard_Interface_Recode";

export const transformAuto = (item: RawAuto): AutoCard => ({
    idAuto: String(item.id),
    modelo: item.modelo,
    marca: item.marca,
    asientos: item.asientos,
    puertas: item.puertas,
    transmision: item.transmision,
    combustibles: Array.isArray(item.combustiblecarro)
        ? item.combustiblecarro
            .map((c) => c?.tipocombustible?.tipo_de_combustible)
            .filter((c): c is string => typeof c === "string")
        : [],
    estadoAlquiler: item.estado,
    nombreHost: item.usuario_rol?.usuario?.nombre || "Sin nombre",
    calificacionAuto: 4.5,
    ciudad: item.direccion?.provincia?.ciudad?.nombre || "Desconocido",
    calle: item.direccion?.calle || "No especificada",
    precioOficial: Number(item.precio_por_dia),
    precioDescuento: Number(item.precio_por_dia),
    precioPorDia: Number(item.precio_por_dia),
    imagenURL: item.imagen?.[0]?.data || "",
});
