import { UsuarioInterfazRecode } from "../interface/Ususario_Interfaz_Recode";

export function UsuarioTransforms_Recode (data: UsuarioInterfazRecode): UsuarioInterfazRecode {
    return {
        id: data.id,
        nombre: data.nombre || "Sin nombre",
        correo: data.correo || "Sin correo",
    };
}