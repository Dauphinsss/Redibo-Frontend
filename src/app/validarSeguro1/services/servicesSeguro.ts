import { apiRecodeGeneral } from "@/api/apis_Recode";
import { CarCardProps, CarApiResponse, Aseguradora, AseguradoraCardPropsRaw_Recode } from "@/app/validarSeguro1/interface/ListaAutoSeguro_Interface_Recode";
import { transformarCarrosListSeguros, transformarSeguroListAseguradoras } from "@/app/validarSeguro1/utils/transforSeguro_Recode";

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