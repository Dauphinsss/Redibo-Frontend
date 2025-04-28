import {apiAllCards,apiCarById} from "@/api/apis_Recode";
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
