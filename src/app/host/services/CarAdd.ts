import axios, { AxiosInstance, AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ||"http://localhost:4000";

interface BackendFeature {
id: number;
marca: string;
modelo: string;
año: number;
vim: string;
placa: string;
}

export interface Feature {
id: number;
brand: string;
model: string;
year: number;
vin: string;
plate: string;
}

export async function getFeatures(carId: number): Promise<Feature[]> {
try {
    const response = await axios.get<BackendFeature[]>(`${API_URL}/api/v1/sprinteros/Par_1/controlador/rutas?carId=${carId}`);

    const transformed = response.data.map((item) => ({
    id: item.id,
    brand: item.marca,
    model: item.modelo,
    year: item.año,
    vin: item.vim,
    plate: item.placa
    }));

    return transformed;
} catch (error: unknown) {
    if (axios.isAxiosError(error)) {
        console.error("Error al obtener características principales:", error.response?.data || error.message);
    } else if (error instanceof Error) {
        console.error("Error al obtener características principales:", error.message);
    } else {
        console.error("Error desconocido al obtener características principales");
    }
    throw new Error("No se pudieron obtener los datos principales");
}

}
