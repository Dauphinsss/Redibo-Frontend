import { differenceInYears } from 'date-fns';
import { RawHostDetails_Recode } from '@/interface/RawHostDetails_Recode';
import { DetalleHost_Recode } from '@/interface/DetalleHost_Recode';

export function transformDetailsHost_Recode(data: RawHostDetails_Recode): DetalleHost_Recode {
    return {
        id: data.id,
        nombre: data.nombre,
        edad: data.fecha_nacimiento,
        genero: data.genero,
        ciudad: data.Ciudad?.nombre || 'No definida',
        correo: data.correo,
        telefono: data.telefono,
        foto: data.foto,
        autos: data.Carro.map((auto) => ({
            modelo: auto.modelo,
            marca: auto.marca,
            imagen: auto.Imagen?.[0]?.data || "Sin imagen"
        }))
    };
}