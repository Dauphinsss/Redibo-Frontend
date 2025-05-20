import {apiCarById, apiCobertura, apiFormularioCondicionesUsoAuto} from "@/api/apis_Recode";
import { CondicionesUsoPayload_Recode } from "@/interface/CondicionesUsoFormu_interface_Recode";
import { CondicionesUsoResponse } from "@/app/reserva/interface/CondicionesUsoVisual_interface_Recode";
import { CoberturaInterface, SeguroRawRecode, ValidarInterface } from "@/interface/CoberturaForm_Interface_Recode";
import { EnlaceInterface } from "@/interface/CoberturaForm_Interface_Recode";

import { RawCondicionesUsoResponse } from "@/app/reserva/interface/RawCondicionesUsoVisuali_Interface_Recode";
import { transformCondiciones_Recode } from "@/app/reserva/utils/transformCondicionesVisuali_Recode";
import axios, { AxiosError } from "axios";
import { RawHostDetails_Recode } from "@/app/reserva/interface/RawHostDetails_Recode";
import { transformDetailsHost_Recode } from "@/app/reserva/utils/transformDetailsHost_Recode";
import { transformSeguroTodo_Recode } from "@/utils/transforSeguro_Recode";




export async function getCarRatingsFromComments(idCar: string): Promise<number[]> {
    const response = await fetch(`https://search-car-backend.vercel.app/comments/${idCar}`);
    if (!response.ok) return [];

    const data = await response.json();
    
    return data.map((comentario: { Calificacion?: { calf_carro: number } }) => 
        comentario.Calificacion?.calf_carro ?? 0 // Si no tiene calificación, asigna 0
    );
}
export async function getCarRatingsFromAuto(id: string): Promise<number[]> {
    const response = await fetch(`https://search-car-backend.vercel.app/detailCar/${id}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.Calificacion.map((c: { calf_carro: number }) => c.calf_carro);
};
export const postCondicionesUso_Recode = async (payload: CondicionesUsoPayload_Recode): Promise<void> => {
    try {
        const response = await apiFormularioCondicionesUsoAuto.post("/insertCondition", payload);
        console.log("Condiciones enviadas correctamente:", response.data);
    } catch (error) {
        const axiosError = error as AxiosError;

        console.error("Error al enviar las condiciones de uso:");
        console.error("Mensaje:", axiosError.message);
        console.error("Código:", axiosError.code);
        console.error("Status:", axiosError.response?.status);
        console.error("Data:", axiosError.response?.data);

        throw new Error("No se pudo enviar las condiciones de uso. Intenta de nuevo más tarde.");
    }
};

export async function getCondicionesUsoVisual_Recode(id_carro: number): Promise<CondicionesUsoResponse | null> {
    try {
        const response = await apiCarById.get<RawCondicionesUsoResponse>(`/useConditon/${id_carro}`);
        return transformCondiciones_Recode(response.data);
    } catch (error) {
        console.error("Error al obtener condiciones visuales:", error);
        return null;
    }
};

export const postCobertura = async (payload: CoberturaInterface): Promise<void> => {
    try {
        const response = await apiCobertura.post("/insertedInsurance", payload);
        console.log("Enviado los datos de Cobertura", response.data);
    } catch (error) {
        const axiosError = error as AxiosError;

        console.error("Error al enviar las condiciones de uso:");
        console.error("Mensaje:", axiosError.message);
        console.error("Código:", axiosError.code);
        console.error("Status:", axiosError.response?.status);
        console.error("Data:", axiosError.response?.data);

        throw new Error("No se pudo enviar las condiciones de uso. Intenta de nuevo más tarde.");
    }
};

export const postCoberturaEnlace = async (payload: EnlaceInterface): Promise<void> => {
    try {
        const response = await apiCobertura.post("/insertEnlace", payload);
        console.log("Enviado el enlace de imagen:", response.data);
    } catch (error) {
        const axiosError = error as AxiosError;

        console.error("Error al enviar el enlace:");
        console.error("Mensaje:", axiosError.message);
        console.error("Código:", axiosError.code);
        console.error("Status:", axiosError.response?.status);
        console.error("Data:", axiosError.response?.data);

        throw new Error("No se pudo guardar el enlace. Intenta de nuevo más tarde.");
    }
};

export const getInsuranceByID = async (id_carro: string): Promise<ValidarInterface | null> => {
    try {
        const response = await apiCobertura.get<SeguroRawRecode[]>(`/insurance/${id_carro}`);

        // Validar que sea array no vacío
        if (!Array.isArray(response.data) || response.data.length === 0) {
            console.warn(`No se encontró seguro para el ID ${id_carro}`);
            return null;
        }

        return transformSeguroTodo_Recode(response.data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.warn(`Auto con ID ${id_carro} no encontrado.`);
            return null;
        }

        console.error(`Error inesperado al obtener el auto con ID ${id_carro}:`, error);
        throw error;
    }
};

export const getDetalleHost_Recode = async (id_host: number) => {
    try {
        const response = await apiCarById.get<RawHostDetails_Recode>(`/detailHost/${id_host}`);
        return transformDetailsHost_Recode(response.data);
    } catch (error) {
        console.error("Error al obtener condiciones visuales:", error);
        return null;
    }
}; 