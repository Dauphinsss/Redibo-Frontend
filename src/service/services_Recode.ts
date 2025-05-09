import {apiAllCards,apiCarById, apiFormularioCondicionesUsoAuto} from "@/api/apis_Recode";
import { CondicionesUsoPayload_Recode } from "@/interface/CondicionesUso_interface_Recode";
import {RawAuto_Interface_Recode as RawAuto} from "@/interface/RawAuto_Interface_Recode"

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
export async function getCarRatings(id: string): Promise<number[]> {
    const response = await fetch(`https://search-car-backend.vercel.app/detailCar/${id}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.Calificacion.map((c: { calf_carro: number }) => c.calf_carro);
}

export const postCondicionesUso_Recode = async (payload: CondicionesUsoPayload_Recode) => {
    try{
        const response = await apiFormularioCondicionesUsoAuto.post("/insertCondition", payload);
        return response.data
    } catch (error) {
        console.error("Error al enviar las condiciones de uso:", error);
        throw new Error("No se pudo enviar las condiciones de uso. Intenta de nuevo más tarde.");
    }
    
};

export const getCondicionesUso_Recode = async (id_carro: number): Promise<CondicionesUsoPayload_Recode> => {
    try{
        const res = await apiFormularioCondicionesUsoAuto.get(`/getCondition/${id_carro}`);
        return res.data;
    }catch (error) {
        console.error("Error al obtener las condiciones de uso:", error);
        throw new Error("No se pudo cargar las condiciones de uso. Intenta de nuevo más tarde.");
    }
};