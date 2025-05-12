import { RawAutoDetails_Interface_Recode } from "@/interface/RawAutoDetails_Interface_Recode";
import { AutoDetails_interface_Recode } from "@/interface/AutoDetails_interface_Recode";

export const transformAutoDetails_Recode = (
    item: RawAutoDetails_Interface_Recode
    ): AutoDetails_interface_Recode => ({
    marca: item.marca,
    modelo: item.modelo,
    placa: item.placa,
    anio: item.a_o,
    asientos: item.asientos,
    puertas: item.puertas,
    soat: item.soat,
    precio: item.precio_por_dia,
    descripcion: item.descripcion,
    transmision: item.transmicion,
    calle: item.Direccion?.calle || "",
    zona: item.Direccion?.zona || "",
    ciudad: item.Direccion?.Provincia?.Ciudad?.nombre || "",
    provincia: item.Direccion?.Provincia?.nombre || "",
    nombreHost: item.Usuario?.nombre || "",
    telefonoHost: item.Usuario?.telefono || "",
    combustibles:
        item.CombustibleCarro?.map(
        (c) => c?.TipoCombustible?.tipoDeCombustible
        ).filter((c): c is string => typeof c === "string") || [],
    imagenes: item.Imagen?.map(({ id, data }) => ({ id, data })) || [],
    caracteristicasAdicionales:
        item.caracteristicasAdicionalesCarro?.map(
        (c) => c.caracteristicas_adicionales?.nombre
        ).filter((nombre): nombre is string => typeof nombre === "string") || [],
});
