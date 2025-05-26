// src/app/host/services/carService.ts
import axios, { AxiosInstance, AxiosError } from "axios";
import { getDevToken, getToken, removeToken} from "./authService";
import { uploadImage, updateImage, deleteImage } from "./imageService";
import type { Image } from "./imageService";

// Configuración de logger basado en entorno (simplificado)
const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(`[INFO] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  }
};

// Crear instancia de Axios con configuración base
const API: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v2",
  timeout: 10000,
});

// Interceptor para añadir token de autenticación
API.interceptors.request.use(
  async (config) => {
    try {
      // Intentar obtener token existente
      let token = getToken();
      
      // Si no hay token, obtener uno nuevo
      if (!token) {
        token = await getDevToken();
      }
      
      // Añadir token a los headers si está disponible
      if (config.headers && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Error en el interceptor de autenticación:", err);
    }
    
    return config;
  },
  (error) => {
    console.error("Error en interceptor de solicitud:", error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores comunes
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      // Eliminar token actual que podría ser inválido
      removeToken();
      
      // Si podemos recuperar la configuración original de la petición
      const originalRequest = error.config;
      if (originalRequest) {
        try {
          // Obtener nuevo token
          const newToken = await getDevToken();
          
          // Configurar el nuevo token en la petición original
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          
          // Reintentar la petición original con el nuevo token
          return axios(originalRequest);
        } catch (tokenError) {
          console.error("Error al renovar token:", tokenError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Interfaces y tipos
export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  status: string;
  vin: string;  // Corregido: consistencia en nomenclatura
  plate: string;
  num_mantenimientos?: number;
  descripcion?: string;
  images?: Image[];
}

interface BackendCar {
  id: number;
  marca: string;
  modelo: string;
  año: number;
  precio_por_dia: number;
  estado: string;
  vim: string;  // Mantenemos vim para compatibilidad con API
  placa: string;
  num_mantenimientos?: number;
  descripcion?: string;
}

interface GetCarsResponse {
  success: boolean;
  data: BackendCar[];
  total: number;
}

// Función para transformar datos del backend al formato de frontend
function transformBackendCar(backendCar: BackendCar): Car {
  return {
    id: backendCar.id,
    brand: backendCar.marca,
    model: backendCar.modelo,
    year: backendCar.año,
    price: backendCar.precio_por_dia,
    status: backendCar.estado,
    vin: backendCar.vim,  // Nota: Transformamos vim a vin en la interfaz
    plate: backendCar.placa,
    num_mantenimientos: backendCar.num_mantenimientos || 0,
    descripcion: backendCar.descripcion || "",
    images: [],
  };
}

// Funciones de API

export async function getCars({ 
    skip = 0, 
    take = 10, 
    hostId = 1 
  } = {}): Promise<{ data: Car[]; total: number }> {
    try {
      const response = await API.get<GetCarsResponse>("/cars", {
        params: { hostId, start: skip, limit: take },
      });
  
      // Si la respuesta no tiene data, loguea y retorna vacío
      if (!response.data || !Array.isArray(response.data.data)) {
        logger.warn("Respuesta inesperada de /cars:", response.data);
        return { data: [], total: response.data?.total || 0 };
      }
  
      // Mapeo seguro
      const cars: Car[] = response.data.data.map((b) => ({
        id: b.id,
        brand: b.marca,
        model: b.modelo,
        year: b.año,
        price: b.precio_por_dia,
        status: b.estado,
        vin: b.vim,
        plate: b.placa,
        num_mantenimientos: b.num_mantenimientos || 0,
        descripcion: b.descripcion || "",
        images: [],
      }));
  
      return { 
        data: cars, 
        total: response.data.total || 0 
      };
    } catch (error) {
      logger.error("Error al obtener lista de carros:", error);
      return { data: [], total: 0 };
    }
  }


export interface CreateFullCarPayload {
  id_provincia: number;
  calle: string;
  zona: string;
  num_casa: string | null;
  latitud: number;
  longitud: number;
  vim: string;  // Mantenemos vim para compatibilidad con API
  año: number;
  marca: string;
  modelo: string;
  placa: string;
  asientos: number;
  puertas: number;
  soat: boolean;
  transmicion: "Manual" | "Automatica";
  combustibleIds: number[];
  extraIds: number[];
  precio_por_dia: number;
  num_mantenimientos: number;
  estado: string;
  descripcion?: string;
}

export interface CreateFullCarResponse {
  success: boolean;
  data: { id: number };
  message?: string;
}

export async function createFullCar(
  payload: CreateFullCarPayload,
  images: File[] = []
): Promise<CreateFullCarResponse> {
  try {
    const resp = await API.post<CreateFullCarResponse>('/cars/full', payload);
    const result = resp.data;
    
    // Si la creación fue exitosa y hay imágenes, subirlas
    if (result.success && result.data.id && images.length) {
      const carId = result.data.id;
      
      try {
        await Promise.all(images.map(file => uploadImage(carId, file)));
      } catch (imageError) {
        console.error("Error al subir imágenes:", imageError);
        // No fallamos la operación completa si solo fallan las imágenes
      }
    }
    
    return result;
  } catch (err) {
    console.error("Error al crear vehículo:", err);
    // Devolvemos un objeto con success: false para indicar error
    return { 
      success: false, 
      data: { id: -1 },
      message: "No se pudo crear el vehículo"
    };
  }
}

export async function getCarById(carId: number): Promise<Car | null> {
  try {
    const resp = await API.get<{ success: boolean; data: BackendCar }>(`/cars/${carId}`);
    
    if (resp.data.success && resp.data.data) {
      return transformBackendCar(resp.data.data);
    }
    
    return null;
  } catch (error) {
    console.error(`Error al obtener el carro ID ${carId}:`, error);
    return null;
  }
}

export async function updateCar(
  carId: number,
  data: { num_mantenimientos: number; precio_por_dia: number; descripcion?: string }
): Promise<boolean> {
  try {
    await API.put(`/cars/${carId}`, data);
    return true;
  } catch (error) {
    console.error(`Error al actualizar el carro ID ${carId}:`, error);
    return false;
  }
}

export async function replaceCarImage(imageId: number, file: File): Promise<Image | null> {
  try {
    return await updateImage(imageId, file);
  } catch (error) {
    console.error(`Error al reemplazar la imagen ID ${imageId}:`, error);
    return null;
  }
}

export async function removeCarImage(imageId: number): Promise<boolean> {
  try {
    await deleteImage(imageId);
    return true;
  } catch (error) {
    console.error(`Error al eliminar la imagen ID ${imageId}:`, error);
    return false;
  }
}