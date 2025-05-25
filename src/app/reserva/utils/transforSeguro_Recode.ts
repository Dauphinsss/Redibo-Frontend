import { CoberturaInterface, SeguroRawRecode, ValidarInterface } from "@/app/reserva/interface/CoberturaForm_Interface_Recode";

export function transformSeguro_Recode(data: CoberturaInterface): CoberturaInterface {
    return {
        id_carro: data.id_carro,
        tipodaño: data.tipodaño,
        descripcion: data.descripcion,
        valides: data.valides
    };
}
function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
export function transformSeguroTodo_Recode(data: SeguroRawRecode[]): ValidarInterface {
    const seguro = data[0];
    return {
        id_carro: seguro.id_carro,
        fecha_inicio: formatDate(seguro.fechaInicio) || "N/A",
        fecha_fin: formatDate(seguro.fechaFin) || "N/A",
        enlace: seguro.enlace || "Sin enlace",
        Seguro: {
            empresa: seguro.Seguro?.empresa || "Desconocida",
            nombre: seguro.Seguro?.nombre || "Sin nombre",
            tipoSeguro: seguro.Seguro?.tipoSeguro || "No especificado",
        },
        tiposeguro: seguro.tiposeguro?.map((item) => ({
            tipoda_o: item.tipoda_o ?? "Desconocido",
            descripcion: item.descripcion ?? "Sin descripción",
            valides: item.valides ?? "Sin validez",
        })) || [],
    };
}