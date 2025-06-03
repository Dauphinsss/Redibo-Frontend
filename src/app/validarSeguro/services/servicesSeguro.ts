import {apiRecodeGeneral } from "@/api/apis_Recode";
import { CarCardProps, CarApiResponse, Aseguradora, AseguradoraCardPropsRaw_Recode } from "@/app/validarSeguro/interface/ListaAutoSeguro_Interface_Recode";
import { transformarCarrosListSeguros, transformarSeguroListAseguradoras, transformSeguroTodo_Recode } from "@/app/validarSeguro/utils/transforSeguro_Recode";
import {PutCoberturaPayload, SeguroConCoberturas_Interface_Recode } from "../interface/SeguroConCoberturas_Interface_Recode";
import { SeguroRaw_Recode } from "@/app/validarSeguro/interface/SeguroRaw_Recode";
import { AxiosError } from "axios";
import { CoberturaInterface } from "../interface/CoberturaForm_Interface_Recode";

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

export const postCobertura = async (data: {
    id_SeguroCarro: number;
    tipodaño: string;
    descripcion: string;
    cantidadCobertura: string;
}): Promise<CoberturaInterface> => {
    const response = await apiRecodeGeneral.post("/insertSeguro", data);
    return response.data;
};


export const putCobertura = async (
    idCobertura: number,
    payload: PutCoberturaPayload
): Promise<void> => {
    try {
        const response = await apiRecodeGeneral.put(`/updateSeguro/${idCobertura}`, payload);
        console.log("Cobertura actualizada:", response.data);
    } catch (error) {
        const axiosError = error as AxiosError;

        console.error("Error al actualizar la cobertura:");
        console.error("Mensaje:", axiosError.message);
        console.error("Código:", axiosError.code);
        console.error("Status:", axiosError.response?.status);
        console.error("Data:", axiosError.response?.data);

        throw new Error("No se pudo actualizar la cobertura.");
    }
};

export const deleteCobertura = async (idCobertura: number): Promise<void> => {
    if (!idCobertura) {
        console.warn("ID inválido para eliminar cobertura:", idCobertura);
        return;
    }

    try {
        const response = await apiRecodeGeneral.delete(`/deleteSeguro/${idCobertura}`);
        console.log("✅ Cobertura eliminada correctamente:", response.data);
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error("❌ Error al eliminar cobertura:");
        console.error("Mensaje:", axiosError.message);
        console.error("Código:", axiosError.code);
        console.error("Status:", axiosError.response?.status);
        console.error("Data:", axiosError.response?.data);
        throw new Error("No se pudo eliminar la cobertura.");
    }
};