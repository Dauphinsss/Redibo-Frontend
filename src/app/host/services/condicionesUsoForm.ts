import { apiCarById, apiFormularioCondicionesUsoAuto } from "@/api/apis_Recode";
import { CondicionesUsoPayload_Recode } from "@/app/host/interface/CondicionesUsoFormu_interface_Recode";
import axios, { AxiosError } from "axios";

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