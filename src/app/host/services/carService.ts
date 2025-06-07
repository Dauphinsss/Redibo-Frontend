// src/app/host/services/carService.ts
import axios, { AxiosInstance, AxiosError } from "axios";
import { getToken, removeToken, getHostUserId } from "./authService";
import { uploadImage, updateImage, deleteImage } from "./imageService";
import type { Image } from "./imageService";

// Logger simplificado
const logger = {
  info: (msg: string, ...args: unknown[]) => console.log(`[INFO] ${msg}`, ...args),
  error: (msg: string, ...args: unknown[]) => console.error(`[ERROR] ${msg}`, ...args),
  warn: (msg: string, ...args: unknown[]) => console.warn(`[WARN] ${msg}`, ...args),
};

// Instancia Axios
const API: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  timeout: 10000,
});

// Interceptor para inyectar JWT
API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (config.headers && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar 401/403
API.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      removeToken();
    }
    return Promise.reject(error);
  }
);

// Tipos de datos
export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  status: string;
  vin: string;
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
  vim: string;
  placa: string;
  num_mantenimientos?: number;
  descripcion?: string;
}

interface GetCarsResponse {
  success: boolean;
  data: BackendCar[];
  total: number;
}

export interface CreateFullCarPayload {
  id_provincia: number;
  calle: string;
  zona: string;
  num_casa: string | null;
  latitud?: number;
  longitud?: number;
  vim: string;
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

// Transformación de datos
function transformBackendCar(b: BackendCar): Car {
  return {
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
  };
}

// Clase principal del servicio
class CarService {
  // Obtener lista de carros de un host autenticado
  async getCars(
    skip = 0,
    take = 10
  ): Promise<{ data: Car[]; total: number }> {
    try {
      const hostId = await getHostUserId();
      const response = await API.get<GetCarsResponse>("/api/v2/cars", {
        params: { hostId, start: skip, limit: take },
      });

      if (!response.data || !Array.isArray(response.data.data)) {
        logger.warn("Respuesta inesperada de /cars:", response.data);
        return { data: [], total: response.data?.total || 0 };
      }

      const cars = response.data.data.map(transformBackendCar);
      return { data: cars, total: response.data.total || 0 };
    } catch (error) {
      logger.error("Error al obtener lista de carros:", error);
      return { data: [], total: 0 };
    }
  }

  async createFullCar(
    payload: CreateFullCarPayload,
    images: File[] = []
  ): Promise<CreateFullCarResponse> {
    try {
      const resp = await API.post<CreateFullCarResponse>(
        "/api/v2/cars/full",
        payload
      );
      const result = resp.data;

      if (result.success && result.data.id && images.length) {
        const carId = result.data.id;
        try {
          await Promise.all(images.map(file => uploadImage(carId, file)));
        } catch (imgErr) {
          logger.error("Error al subir imágenes:", imgErr);
        }
      }

      return result;
    } catch (err) {
      logger.error("Error al crear vehículo:", err);
      return { 
        success: false, 
        data: { id: -1 }, 
        message: "No se pudo crear el vehículo" 
      };
    }
  }

  async getCarById(carId: number): Promise<Car | null> {
    try {
      const resp = await API.get<{ success: boolean; data: BackendCar }>(
        `/api/v2/cars/${carId}`
      );
      if (resp.data.success && resp.data.data) {
        return transformBackendCar(resp.data.data);
      }
      return null;
    } catch (error) {
      logger.error(`Error al obtener el carro ID ${carId}:`, error);
      return null;
    }
  }

  async updateCar(
    carId: number,
    data: { num_mantenimientos: number; precio_por_dia: number; descripcion?: string }
  ): Promise<boolean> {
    try {
      await API.put(`/api/v2/cars/${carId}`, data);
      return true;
    } catch (error) {
      logger.error(`Error al actualizar el carro ID ${carId}:`, error);
      return false;
    }
  }

  async replaceCarImage(imageId: number, file: File): Promise<Image | null> {
    try {
      return await updateImage(imageId, file);
    } catch (error) {
      logger.error(`Error al reemplazar la imagen ID ${imageId}:`, error);
      return null;
    }
  }

  async removeCarImage(imageId: number): Promise<boolean> {
    try {
      await deleteImage(imageId);
      return true;
    } catch (error) {
      logger.error(`Error al eliminar la imagen ID ${imageId}:`, error);
      return false;
    }
  }

  async deleteCar(carId: number): Promise<boolean> {
    try {
      await API.delete(`/api/v2/cars/${carId}`);
      return true;
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  // Método auxiliar para manejo de errores
  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      const status: number | undefined = error.response?.status;
      const message: string = error.response?.data?.message || 'Error desconocido';

      switch (status) {
        case 400:
          logger.error('Error de validación:', message);
          break;
        case 404:
          logger.error('Recurso no encontrado:', message);
          break;
        case 500:
          logger.error('Error del servidor:', message);
          break;
        default:
          logger.error('Error en la operación:', message);
      }
    } else {
      logger.error('Error no controlado:', error);
    }
  }
}

// Exportamos una instancia única del servicio
export const carService = new CarService();

// Exportamos las funciones como alias de los métodos de la instancia
export const createFullCar = carService.createFullCar.bind(carService);
export const getCarById = carService.getCarById.bind(carService);
export const updateCar = carService.updateCar.bind(carService);
export const replaceCarImage = carService.replaceCarImage.bind(carService);
export const removeCarImage = carService.removeCarImage.bind(carService);
export const deleteCar = carService.deleteCar.bind(carService);