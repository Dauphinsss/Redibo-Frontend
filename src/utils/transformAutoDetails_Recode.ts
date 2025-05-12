import { RawAutoDetails_Interface_Recode } from "@/interface/RawAutoDetails_Interface_Recode";
import { AutoDetails_interface_Recode } from "@/interface/AutoDetails_interface_Recode";

export const transformAutoDetails_Recode = (
    item: RawAutoDetails_Interface_Recode
): AutoDetails_interface_Recode => ({
    marca: item.marca,
    modelo: item.modelo,
    placa: item.placa,
    anio: item.anio,
    asientos: item.asientos,
    puertas: item.puertas,
    soat: item.soat,
    precio: Number(item.precio_por_dia),
    descripcion: item.descripcion,
    transmision: item.transmicion,
    calle: item.direccion?.calle || "",
    zona: item.direccion?.zona || "",
    ciudad: item.direccion?.provincia?.ciudad?.nombre || "",
    provincia: item.direccion?.provincia?.nombre || "",
    nombreHost: item.usuario?.nombre || "",
    combustibles:
        item.combustiblesporCarro?.map(
            (c) => c.combustible?.tipoDeCombustible
        ).filter(Boolean) as string[] || [],
    imagenes:
        item.imagenes?.map(({ id, data }) => ({ id, data })) || [],
    caracteristicasAdicionales:
        item.caracteristicasAdicionalesCarro?.map(
            (c) => c.carasteristicasAdicionales?.nombre
        ) || [],
});
