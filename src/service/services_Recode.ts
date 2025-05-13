import {apiAllCards,apiCarById, apiCobertura, apiFormularioCondicionesUsoAuto} from "@/api/apis_Recode";
import { CondicionesUsoPayload_Recode } from "@/interface/CondicionesUsoFormu_interface_Recode";
import { CondicionesUsoResponse } from "@/interface/CondicionesUsoVisual_interface_Recode";
import { CoberturaInterface } from "@/interface/CoberturaForm_Interface_Recode";
import { EnlaceInterface } from "@/interface/CoberturaForm_Interface_Recode";
import { ValidarInterface } from "@/interface/CoberturaForm_Interface_Recode";

import {RawAuto_Interface_Recode as RawAuto} from "@/interface/RawAuto_Interface_Recode"
import { RawCondicionesUsoResponse } from "@/interface/RawCondicionesUsoVisuali_Interface_Recode";
import { transformCondiciones_Recode } from "@/utils/transformCondicionesVisuali_Recode";
import { AxiosError } from "axios";
import { DetalleHost } from "@/interface/DetalleHost_Recode";
import { RawHostDetails_Recode } from "@/interface/RawHostDetails_Recode";
import { transformDetailsHost_Recode } from "@/utils/transformDetailsHost_Recode";

export const getAllCars = async (): Promise<RawAuto[]> => {
    try {
        const response = await apiAllCards.get("/autos");
        return response.data;
    } catch (error) {
        console.error("Error al obtener los autos:", error);
        throw new Error("No se pudo cargar los autos. Intenta de nuevo más tarde.");
    }
};

export const getCarById = async (id: string) => {
    try {
        const response = await apiCarById.get(`/detailCar/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener el auto con ID ${id}:`, error);
        throw error;
    }
};

export const getCarsByModelDesc = async () => {
    try {
        const response = await apiAllCards.get("/filterCar", {
        params: {
            ordenar: "modelo_desc",
        },
        });
        return response.data;
    } catch (error) {
        console.error("Error al filtrar autos por modelo descendente:", error);
        throw error;
    }
};

export const getCarsByModelAsc = async () => {
    try {
        const response = await apiAllCards.get("/filterCar", {
        params: {
            ordenar: "modelo_asc",
        },
        });
        return response.data;
    } catch (error) {
        console.error("Error al filtrar autos por modelo ascendente:", error);
        throw error;
    }
};

export const getCarsByPriceAsc = async () => {
    try {
        const response = await apiAllCards.get("/filterCar", {
        params: {
            ordenar: "precio_asc",
        },
        });
        return response.data;
    } catch (error) {
        console.error("Error al filtrar autos por precio ascendente:", error);
        throw error;
    }
};

export const getCarsByPriceDesc = async () => {
    try {
        const response = await apiAllCards.get("/filterCar", {
        params: {
            ordenar: "precio_desc",
        },
        });
        return response.data;
    } catch (error) {
        console.error("Error al filtrar autos por precio descendente:", error);
        throw error;
    }
};
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
    const response = await apiCobertura.post("/insertedInsurance", payload);
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

export const getInsuranceByID = async <T = ValidarInterface>(id: string): Promise<T> => {
  try {
    const response = await apiCarById.get(`/insurance/${id}`);
    return response.data as T;
  } catch (error) {
    console.error(`Error al obtener el seguro con ID ${id}:`, error);
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


