import { apiRecodeGeneral } from "@/api/apis_Recode";
import { CarCardProps, CarApiResponse, Aseguradora, AseguradoraCardPropsRaw_Recode } from "@/app/validarSeguro/interface/ListaAutoSeguro_Interface_Recode";
import { transformarCarrosListSeguros, transformarSeguroListAseguradoras, transformSeguroTodo_Recode } from "@/app/validarSeguro/utils/transforSeguro_Recode";
import { SeguroConCoberturas_Interface_Recode } from "../interface/SeguroConCoberturas_Interface_Recode";
import { SeguroRaw_Recode } from "../interface/SeguroRaw_Recode";

export async function getCarsSeguro(): Promise<CarCardProps[]> {
    try {
        const response = await apiRecodeGeneral.get<CarApiResponse[]>("/detailCarInsurance");
        return transformarCarrosListSeguros(response.data);
    } catch (error) {
        console.error("Error al obtener los autos:", error);
        return [];
    }
}

export async function getSegurosCards(idAuto: number): Promise<Aseguradora[]> {
    try {
        const response = await apiRecodeGeneral.get<AseguradoraCardPropsRaw_Recode[]>(`/detailCompany/${idAuto}`);
        return transformarSeguroListAseguradoras(response.data);
    } catch (error) {
        console.error("Error al obtener los seguros del auto:", error);
        return [];
    }
}

export async function getSeguroCompletoPorId(idAuto: number): Promise<SeguroConCoberturas_Interface_Recode | null> {
    try {
        const response = await apiRecodeGeneral.get<SeguroRaw_Recode[]>(`/infoSeguro/${idAuto}`);
        return transformSeguroTodo_Recode(response.data);
    } catch (error) {
        console.error("Error al obtener el seguro completo por ID:", error);
        return null;
    }
}