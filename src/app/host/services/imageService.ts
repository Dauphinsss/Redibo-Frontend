// src/app/host/services/imageService.ts
import axios, { AxiosRequestConfig } from 'axios';
import { getToken } from './authService';

// Configuración de logger basado en entorno
const isDev = process.env.NODE_ENV === 'development';
const logger = {
  //se puso unknown en vez any daba error para deployar
  info: (message: string, ...args: unknown[]) => {
    if (isDev) console.log(`[IMG-INFO] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[IMG-ERROR] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    if (isDev) console.warn(`[IMG-WARN] ${message}`, ...args);
  }
};

// Usar la misma base URL que en el resto de la aplicación
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v2";
const API_URL = `${API_BASE}/images`;

// Interfaces
export interface Image {
  id: number;
  data: string;      // URL de la imagen
  public_id: string; // ID interno de Cloudinary
  width?: number;
  height?: number;
  format?: string;
}

export interface GetImagesResponse {
  success: boolean;
  data: Image[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

/**
 * Función auxiliar para crear configuración con token de autenticación
 */
function getAuthConfig(): AxiosRequestConfig {
  const token = getToken();
  return {
    headers: token ? { 
      'Authorization': `Bearer ${token}` 
    } : undefined
  };
}

/**
 * 1. Obtener todas las imágenes de un carro (con paginación opcional)
 */
export async function getImagesByCarId(
  carId: number,
  page = 1,
  pageSize = 20
): Promise<GetImagesResponse> {
  try {
    logger.info(`Obteniendo imágenes para el carro ID: ${carId}, página: ${page}`);
    
    const resp = await axios.get<GetImagesResponse>(
      `${API_URL}/${carId}`, 
      {
        ...getAuthConfig(),
        params: { page, pageSize }
      }
    );
    
    logger.info(`Recibidas ${resp.data.data.length} imágenes`);
    return resp.data;
  } catch (error) {
    logger.error(`Error al obtener imágenes para el carro ID ${carId}:`, error);
    throw new Error("No se pudieron cargar las imágenes del vehículo. Por favor, intente nuevamente.");
  }
}

/**
 * 2. Subir una nueva imagen para un carro
 */
export async function uploadImage(
  carId: number,
  file: File
): Promise<Image> {
  try {
    logger.info(`Subiendo imagen para el carro ID: ${carId}, archivo: ${file.name}`);
    
    // Validar el archivo antes de enviarlo
    validateImageFile(file);
    
    const form = new FormData();
    form.append('file', file);

    const config = getAuthConfig();
    // Asegurar que el Content-Type se establezca correctamente
    const headers = { 
      ...config.headers,
      'Content-Type': 'multipart/form-data' 
    };

    const resp = await axios.post<{ success: boolean; image: Image }>(
      `${API_URL}/${carId}`,
      form,
      { ...config, headers }
    );
    
    logger.info(`Imagen subida correctamente, ID: ${resp.data.image.id}`);
    return resp.data.image;
  } catch (error) {
    logger.error(`Error al subir imagen para el carro ID ${carId}:`, error);
    throw new Error("No se pudo cargar la imagen. Por favor, verifique el formato e intente nuevamente.");
  }
}

/**
 * 3. Reemplazar una imagen existente
 */
export async function updateImage(
  imageId: number,
  file: File
): Promise<Image> {
  try {
    logger.info(`Actualizando imagen ID: ${imageId}, archivo: ${file.name}`);
    
    // Validar el archivo antes de enviarlo
    validateImageFile(file);
    
    const form = new FormData();
    form.append('file', file);

    const config = getAuthConfig();
    // Asegurar que el Content-Type se establezca correctamente
    const headers = { 
      ...config.headers,
      'Content-Type': 'multipart/form-data' 
    };

    const resp = await axios.put<{ success: boolean; image: Image }>(
      `${API_URL}/${imageId}`,
      form,
      { ...config, headers }
    );
    
    logger.info(`Imagen actualizada correctamente, ID: ${resp.data.image.id}`);
    return resp.data.image;
  } catch (error) {
    logger.error(`Error al actualizar imagen ID ${imageId}:`, error);
    throw new Error("No se pudo actualizar la imagen. Por favor, verifique el formato e intente nuevamente.");
  }
}

/**
 * 4. Eliminar una imagen
 */
export async function deleteImage(imageId: number): Promise<void> {
  try {
    logger.info(`Eliminando imagen ID: ${imageId}`);
    
    await axios.delete(
      `${API_URL}/${imageId}`,
      getAuthConfig()
    );
    
    logger.info(`Imagen ID ${imageId} eliminada correctamente`);
  } catch (error) {
    logger.error(`Error al eliminar imagen ID ${imageId}:`, error);
    throw new Error("No se pudo eliminar la imagen. Por favor, intente nuevamente.");
  }
}

/**
 * Función auxiliar para validar archivos de imagen
 */
function validateImageFile(file: File): void {
  // Verificar tamaño (máximo 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error(`La imagen es demasiado grande. El tamaño máximo permitido es 5MB.`);
  }
  
  // Verificar tipo de archivo
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Formato de imagen no soportado. Use JPEG, PNG, WebP o GIF.`);
  }
}

/**
 * 5. Función para precargar todas las imágenes de un carro y agregarlas al objeto Car
 */
export async function loadCarImages(carId: number): Promise<Image[]> {
  try {
    const response = await getImagesByCarId(carId);
    return response.data;
  } catch (error) {
    logger.warn(`No se pudieron cargar imágenes para el carro ID ${carId}:`, error);
    return []; // Devolver array vacío para evitar errores en el componente
  }
}