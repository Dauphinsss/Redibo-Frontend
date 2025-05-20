import { apiCarById } from "@/api/apis_Recode";
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