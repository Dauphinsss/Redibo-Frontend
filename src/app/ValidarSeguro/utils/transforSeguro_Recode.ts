import { SeguroConCoberturas_Interface_Recode } from "@/app/validarSeguro/interface/SeguroConCoberturas_Interface_Recode";
import { SeguroRaw_Recode } from "@/app/validarSeguro/interface/SeguroRaw_Recode";
import { CarApiResponse, CarCardProps } from "@/app/validarSeguro/interface/ListaAutoSeguro_Interface_Recode";

export function transformSeguroTodo_Recode(
    datos?: SeguroRaw_Recode[] | null
): SeguroConCoberturas_Interface_Recode | null {
    if (!Array.isArray(datos) || datos.length === 0) return null;

    const carro = datos[0];
    const seguroData = carro.SeguroCarro?.[0];

    if (!carro.Usuario || !seguroData || !seguroData.Seguro) return null;

    return {
        // Datos del carro
        id_carro: carro.id,
        modelo_carro: carro.modelo || "Modelo desconocido",
        marca_carro: carro.marca || "Marca desconocida",
        imagenURL_carro: carro.Imagen?.[0]?.data || "/images/Auto_Default.png",

        // Datos del propietario
        id_propietario: carro.Usuario.id,
        nombre_propietario: carro.Usuario.nombre || "No especificado",
        telefono_propietario: carro.Usuario.telefono || "",
        fotoURL_propietario: carro.Usuario.foto || "/images/User_Default.png",

        // Datos del seguro
        id_seguro: seguroData.Seguro.id,
        nombre_seguro: seguroData.Seguro.nombre || "Sin nombre",
        tipo_seguro: seguroData.Seguro.tipoSeguro || "Sin tipo",
        nombre_empresa_seguro: seguroData.Seguro.empresa || "Desconocida",
        enlaceSeguroURL: seguroData.enlaceSeguro || "#",
        fecha_inicio: seguroData.fechaInicio || "",
        fecha_fin: seguroData.fechaFin || "",

        // Coberturas
        coberturas: Array.isArray(seguroData.tiposeguro)
        ? seguroData.tiposeguro.map((c) => ({
            id_cobertura: c.id,
            tipodanio_cobertura: c.tipoda_o,
            descripcion_cobertura: c.descripcion,
            cantida_cobertura: c.cantidadCobertura,
            }))
        : [],
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

