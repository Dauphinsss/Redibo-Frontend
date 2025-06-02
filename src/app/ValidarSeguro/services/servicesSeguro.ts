import { apiRecodeGeneral } from "@/api/apis_Recode";
import { CarCardProps, CarApiResponse } from "@/app/validarSeguro/interface/ListaAutoSeguro_Interface_Recode";
import { transformarCarrosListSeguros } from "@/app/validarSeguro/utils/transforSeguro_Recode";

export async function getCarsSeguro(): Promise<CarCardProps[]> {
    try {
        const response = await apiRecodeGeneral.get<CarApiResponse[]>("/detailCarInsurance");
        return transformarCarrosListSeguros(response.data);
    } catch (error) {
        console.error("Error al obtener los autos:", error);
        return [];
    }
}