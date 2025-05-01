// src/app/host/services/imageService.ts
import axios from 'axios';

const API_URL = "http://localhost:4000/api/v2/images";

export interface Image {
  id: number;
  url: string; // URL para mostrar directamente la imagen.
}

export interface GetImagesResponse {
  success: boolean;
  data: Image[];
  total: number;
}

export async function getImagesByCarId(carId: number): Promise<GetImagesResponse> {
  try {
    const response = await axios.get<GetImagesResponse>(API_URL, {
      params: { carId }
    });
    return response.data;
  } catch (error: unknown) {
    console.error('Error al obtener imágenes:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error al obtener imágenes');
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Error desconocido al obtener imágenes');
    }
  }
}
