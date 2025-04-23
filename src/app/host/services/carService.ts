// src/services/carService.ts
import axios, { AxiosInstance, AxiosError } from "axios";
import { getDevToken, getToken } from "./authService";

const API: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v2",
});

API.interceptors.request.use(
  async (config) => {
    try {
      let token = getToken();
      if (!token) {
        token = await getDevToken();
      }
      if (config.headers && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Error al obtener/inyectar token:", err);
      // aquí podrías: localStorage.removeItem("token"),
      // o seguir sin header (si tu backend lo permite para GET),
      // pero **no** lanzar otra excepción
    }
    return config;
  },
  (error) => {
    // si el interceptor itself recibe un error inesperado
    return Promise.reject(error);
  }
);


export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  status: string;
  vin: string;
  plate: string;
  image: string;
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
}

interface GetCarsResponse {
  success: boolean;
  data: BackendCar[];
  total: number;
}

export async function getCars({ skip = 0, take = 10, hostId = 1 } = {}): Promise<{ data: Car[]; total: number }> {
  const response = await API.get<GetCarsResponse>("/cars", {
    params: { hostId, start: skip, limit: take },
  });
  const cars: Car[] = response.data.data.map((b) => ({
    id: b.id,
    brand: b.marca,
    model: b.modelo,
    year: b.año,
    price: b.precio_por_dia,
    status: b.estado,
    vin: b.vim,
    plate: b.placa,
    image: "",
  }));
  return { data: cars, total: response.data.total };
}

export interface FullCarPayload {
  id_provincia: number;
  calle: string;
  zona: string;
  num_casa: string | null;
  vim: string;
  año: number;
  marca: string;
  modelo: string;
  placa: string;
  asientos: number;
  puertas: number;
  soat: boolean;
  transmicion: "manual" | "automatica";
  combustibleIds: number[];
  extraIds: number[];
  precio_por_dia: number;
  num_mantenimientos: number;
  estado: string;
  descripcion?: string;
  imagesBase64: string[];
}

export interface CreateFullCarResponse {
  success: boolean;
  data: any;
  message?: string;
}

export async function createFullCar(
  payload: FullCarPayload
): Promise<CreateFullCarResponse> {
  try {
    // Primera petición
    const response = await API.post<CreateFullCarResponse>("/cars/full", payload);
    return response.data;
  } catch (err: any) {
    const axiosErr = err as AxiosError;
    if (axiosErr.response?.status === 403) {
      // 1) Token inválido/expirado
      localStorage.removeItem("token");
      // 2) Forzar obtención de uno nuevo
      await getDevToken();
      // 3) Reintentar la petición original
      const retry = await API.post<CreateFullCarResponse>("/cars/full", payload);
      return retry.data;
    }
    // Si no es 403, propagamos el error
    throw err;
  }
}
