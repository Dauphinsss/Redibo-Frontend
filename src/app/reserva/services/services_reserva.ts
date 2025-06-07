import { apiCarById, apiRecodeComentario, apiRecodePuntos } from "@/api/apis_Recode";
import { apiCobertura } from "@/api/apis_Recode";
import { RawHostDetails_Recode } from "@/app/reserva/interface/RawHostDetails_Recode";
import { transformDetailsHost_Recode } from "@/app/reserva/utils/transformDetailsHost_Recode";
import { CondicionesUsoResponse } from "@/app/reserva/interface/CondicionesUsoVisual_interface_Recode";
import { RawCondicionesUsoResponse } from "../interface/RawCondicionesUsoVisuali_Interface_Recode";
import { transformCondiciones_Recode } from "@/app/reserva/utils/transformCondicionesVisuali_Recode";
import { ValidarInterface, SeguroRawRecode } from "@/app/reserva/interface/CoberturaForm_Interface_Recode";
import { transformSeguroTodo_Recode } from "../utils/transforSeguro_Recode";
import axios from "axios";

export const getCarById = async (id: string) => {
    try {
        const response = await apiCarById.get(`/detailCar/${id}`);
        return await response.data;
    } catch (error: unknown) {
        // Si el error es 404 (auto no existe), devolvemos null
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.warn(`Auto con ID ${id} no encontrado.`);
            return null;
        }
        // Si es otro tipo de error, lo lanzamos para que lo maneje error.tsx
        console.error(`Error inesperado al obtener el auto con ID ${id}:`, error);
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

export const getDetalleHost_Recode = async (id_host: number) => {
    try {
        const response = await apiCarById.get<RawHostDetails_Recode>(`/detailHost/${id_host}`);
        return transformDetailsHost_Recode(response.data);
    } catch (error) {
        console.error("Error al obtener condiciones visuales:", error);
        return null;
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

//enpoint de la hu 14 15  y 19

export const getCalificacionesHost = async (id_host: number) => {
  try {
    const response = await apiRecodePuntos.get(`/userhost/calificacionesGet/${id_host}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener calificaciones del host:", error);
    return null;
  }
};

export const getComentariosHost = async (id_host: number) => {
  try {
    const response = await apiRecodeComentario.get(`/userhost/comentarioGet/${id_host}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener comentarios del host:", error);
    return null;
  }
};

export const postComentarioHost = async (id_host: number, id_renter: number, comentario: string) => {
  try {
    const response = await apiRecodeComentario.post("/userhost/comentarioHostPost", {
      id_host,
      id_renter,
      comentario,
    });
    return response.data;
  } catch (error) {
    console.error("Error al comentar al host:", error);
    return null;
  }
};

export const postCalificacionHost = async (id_host: number, id_renter: number, calificacion: number) => {
  try {
    const response = await apiRecodePuntos.post("/userhost/calificacionesPost", {
      id_host,
      id_renter,
      calificacion,
    });
    return response.data;
  } catch (error) {
    console.error("Error al calificar al host:", error);
    return null;
  }
};
