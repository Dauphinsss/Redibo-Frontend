import axios from 'axios';

// URL base del endpoint para imágenes
const API_URL = "http://localhost:4000/api/v2/images";

export interface Image {
    id: number;
    data: string; // Este string ya estará codificado en base64.
}

export interface GetImagesResponse {
  success: boolean;
  data: Image[];
  total: number;
}

/**
 * Función para obtener las imágenes de un carro específico, identificado por su ID.
 * @param carId - ID del carro.
 * @returns La respuesta de la API que incluye las imágenes.
 */
export async function getImagesByCarId(carId: number): Promise<GetImagesResponse> {
  try {
    const response = await axios.get<GetImagesResponse>(API_URL, {
      params: { carId }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener imágenes:', error);
    throw new Error(error.response?.data?.message || 'Error al obtener imágenes');
  }
}

// Puedes agregar funciones para crear, actualizar o eliminar imágenes
// si fuese necesario implementar operaciones de CRUD en el futuro.
