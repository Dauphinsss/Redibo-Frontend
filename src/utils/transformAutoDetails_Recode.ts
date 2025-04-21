import { AutoData } from './../interface/autosInterface';

export function transformAutoDetails_Recode(autoData: AutoData) {
    return {
        nombre: `${autoData.marca || "Marca desconocida"} ${autoData.modelo || "Modelo desconocido"}`,
        imagenes: autoData.imagen?.map((img) => ({
            id: img.id,
            data: img.data,
            })) || [],
        descripcion: `Auto ${autoData.marca || "desconocido"} ${autoData.modelo || "desconocido"} en excelente estado`,
        host: {
            nombre: "Anfitrión Ejemplo",
            calificacion: 4.8,
            autosCount: 3,
            },
        ubicacion: `${autoData.direccion?.calle || "Calle desconocida"}, ${autoData.direccion?.zona || "Zona desconocida"}`,
        precio: autoData.precio_por_dia || "Precio no disponible",
        combustible: Array.isArray(autoData.combustiblecarro) && autoData.combustiblecarro.length > 0
        ? autoData.combustiblecarro[0]?.tipocombustible?.tipo_de_combustible || "No especificado"
        : "No especificado"
    };
}
