import { 
    SeguroConCoberturas_Interface_Recode, 
    CoberturaTransformada
} from "@/app/admin/validarSeguro/interface/SeguroConCoberturas_Interface_Recode";
import { SeguroRaw_Recode } from "@/app/admin/validarSeguro/interface/SeguroRaw_Recode";
import { 
    Aseguradora, 
    AseguradoraCardPropsRaw_Recode, 
    CarApiResponse, 
    CarCardProps 
} from "@/app/admin/validarSeguro/interface/ListaAutoSeguro_Interface_Recode";

export function formatearFechaDDMMAAAA(fechaISO: string): string {
    if (!fechaISO) return ""; 
    const fecha = new Date(fechaISO);
    if (isNaN(fecha.getTime())) return "Fecha inválida"; 
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

export function transformSeguroTodo_Recode(
    datos?: SeguroRaw_Recode[] | null
): SeguroConCoberturas_Interface_Recode | null {
    if (!Array.isArray(datos) || datos.length === 0) return null;
    const item = datos[0];

    if (!item.Carro || !item.Seguro || !item.Carro.Usuario) {
        console.warn("Datos incompletos en SeguroRaw_Recode, no se puede transformar:", item);
        return null;
    }

    // Transformación de coberturas
    const coberturasTransformadas: CoberturaTransformada[] = Array.isArray(item.tiposeguro)
        ? item.tiposeguro.map((c) => ({
            id_cobertura: c.id,
            tipodanio_cobertura: c.tipoda_o || "No especificado", 
            descripcion_cobertura: c.descripcion || "", 
            cantida_cobertura: c.cantidadCobertura || "0", 
        }))
        : [];

    return {
        id_poliza_seguro_carro: item.id,
        
        // Datos del carro
        id_carro: item.Carro.id,
        modelo_carro: item.Carro.modelo || "Modelo desconocido",
        marca_carro: item.Carro.marca || "Marca desconocida",
        imagenURL_carro: item.Carro.Imagen?.[0]?.data || "/images/Auto_Default.png",

        // Datos del propietario
        id_propietario: item.Carro.Usuario.id,
        nombre_propietario: item.Carro.Usuario.nombre || "No especificado",
        telefono_propietario: item.Carro.Usuario.telefono || "N/A",
        fotoURL_propietario: item.Carro.Usuario.foto || "/images/User_Default.png",

        // Datos del seguro (tipo de seguro general)
        id_seguro: item.Seguro.id, 
        nombre_seguro: item.Seguro.nombre || "Sin nombre",
        tipo_seguro: item.Seguro.tipoSeguro || "Sin tipo",
        nombre_empresa_seguro: item.Seguro.empresa || "Desconocida",
        enlaceSeguroURL: item.enlaceSeguro || null,
        fecha_inicio: formatearFechaDDMMAAAA(item.fechaInicio),
        fecha_fin: formatearFechaDDMMAAAA(item.fechaFin),

        // Coberturas
        coberturas: coberturasTransformadas,
    };
}


export function transformarCarrosListSeguros(apiData: CarApiResponse[]): CarCardProps[] {
    return apiData.map((car) => ({
        idAuto: car.id,
        modelo: car.modelo,
        marca: car.marca,
        asientos: car.asientos,
        puertas: car.puertas,
        transmision: car.transmicion,
        combustibles: car.CombustibleCarro.map(c => c.TipoCombustible.tipoDeCombustible),
        host: car.Usuario.nombre,
        ubicacion: `${car.Direccion.Provincia.Ciudad.nombre}, ${car.Direccion.calle}`,
        src: car.Imagen.length > 0 && car.Imagen[0]?.data
        ? car.Imagen[0].data
        : "/images/Auto_Default.png",
        alt: `Imagen del auto ${car.modelo}`
    }));
}

export function transformarSeguroListAseguradoras(apiData: AseguradoraCardPropsRaw_Recode[]): Aseguradora[] {
    return apiData.map((aseguradora) => ({
        idAseguradora: aseguradora.id,
        empresa: aseguradora.Seguro.empresa || "Desconocida",
        nombre: aseguradora.Seguro.nombre || "Sin nombre",
        tipoSeguro: aseguradora.Seguro.tipoSeguro || "Sin tipo",
        fechaInicio: formatearFechaDDMMAAAA(aseguradora.fechaInicio) || "Sin fecha de inicio",
        fechaFin: formatearFechaDDMMAAAA(aseguradora.fechaFin) || "Sin fecha de fin",
    }));
}