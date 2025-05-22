import { apiAllCards } from "@/api/apis_Recode";
import {RawAuto_Interface_Recode as RawAuto} from "@/app/busqueda/interface/RawAuto_Interface_Recode"

export const getAllCars = async (): Promise<RawAuto[]> => {
    try {
        const response = await apiAllCards.get("/autos");
        return response.data;
    } catch (error) {
        console.error("Error al obtener los autos:", error);
        throw new Error("No se pudo cargar los autos. Intenta de nuevo más tarde.");
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