// src/app/host/services/carService.ts

import axios, { AxiosInstance, AxiosError } from "axios";
import { getDevToken, getToken } from "./authService";
import { uploadImage, updateImage, deleteImage } from "./imageService";
import type { Image } from "./imageService";

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
    }
    return config;
  },
  (error) => Promise.reject(error)
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
}

interface GetCarsResponse {
  success: boolean;
  data: BackendCar[];
  total: number;
}

export async function getCars({
  skip = 0,
  take = 10,
  hostId = 1,
} = {}): Promise<{ data: Car[]; total: number }> {
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
    images: [],
  }));
  return { data: cars, total: response.data.total };
}

export interface CreateFullCarPayload {
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
}

export interface CreateFullCarResponse {
  success: boolean;
  data: {
    id: number;
    [key: string]: unknown;
  };
  message?: string;
}

export async function createFullCar(
  payload: CreateFullCarPayload,
  images: File[] = []
): Promise<CreateFullCarResponse> {
  try {
    const response = await API.post<CreateFullCarResponse>(
      "/cars/full",
      payload
    );
    const result = response.data;
    if (result.success && result.data.id && images.length) {
      const carId = result.data.id;
      await Promise.all(images.map((file) => uploadImage(carId, file)));
    }
    return result;
  } catch (err: unknown) {
    const axiosErr = err as AxiosError;
    if (axiosErr.response?.status === 403) {
      localStorage.removeItem("token");
      await getDevToken();
      const retry = await API.post<CreateFullCarResponse>(
        "/cars/full",
        payload
      );
      const result = retry.data;
      if (result.success && result.data.id && images.length) {
        const carId = result.data.id;
        await Promise.all(images.map((file) => uploadImage(carId, file)));
      }
      return result;
    }
    throw err;
  }
}

export async function replaceCarImage(
  imageId: number,
  file: File
): Promise<Image> {
  return updateImage(imageId, file);
}

export async function removeCarImage(imageId: number): Promise<void> {
  return deleteImage(imageId);
}
