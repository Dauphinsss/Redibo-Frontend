import { DetalleHost } from "@/interface/DetalleHost_Recode";
import { RawHostDetails_Recode } from "@/interface/RawHostDetails_Recode";


export const transformDetailsHost_Recode = (
    item: RawHostDetails_Recode
    ): DetalleHost => ({
    id: item.id,
    nombre: item.nombre,
    fecha_nacimiento: item.fecha_nacimiento,
    genero:item.genero,
    nombreCiudad: item.Ciudad.nombre,
    correo: item.correo,
    telefono: item.telefono,
    foto: item.foto,
    carro: item.Carro?.map(({ modelo, marca }) => ({ modelo, marca })) || [],
});
