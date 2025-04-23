// src/services/CarService.ts
import axios from 'axios';

// Base URL del backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v2/cars';
const DEV_TOKEN_ROUTE = `${API_URL}/dev-token`;

// Interfaces del backend
interface BackendCar {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
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

// Interfaces del frontend
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

// Payload para crear carro completo
export interface FullCarPayload {
  provinciaId: number;
  calle: string;
  zona: string;
  num_casa?: string;

  vim: string;
  anio: number;
  marca: string;
  modelo: string;
  placa: string;

  asientos: number;
  puertas: number;
  soat: boolean;
  transmicion: 'manual' | 'automatica';
  estado: string;
  descripcion?: string;

  combustibleIds: number[];
  extraIds: number[];
  imagesBase64: string[];
  precio_por_dia: number;
  num_mantenimientos: number;
}

// Obtener/almacenar token de desarrollo
async function getDevToken(): Promise<string> {
  const tokenKey = 'token';
  const stored = localStorage.getItem(tokenKey);
  if (stored) return stored;
  const resp = await axios.get<{ success: boolean; token: string }>(DEV_TOKEN_ROUTE);
  if (resp.data.success && resp.data.token) {
    localStorage.setItem(tokenKey, resp.data.token);
    return resp.data.token;
  }
  throw new Error('No se pudo obtener token de desarrollo');
}

// Crear instancia de axios con interceptor para token
const api = axios.create();
api.interceptors.request.use(async config => {
  const token = await getDevToken();
  config.headers = config.headers || {};
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Obtener lista de carros (paginado) para un host
export async function getCars({ skip = 0, take = 10, hostId = 1 } = {}): Promise<{ data: Car[]; total: number }> {
  const resp = await api.get<GetCarsResponse>(API_URL, {
    params: { hostId, start: skip, limit: take }
  });
  const transformed: Car[] = resp.data.data.map(bc => ({
    id: bc.id,
    brand: bc.marca,
    model: bc.modelo,
    year: bc.anio,
    price: bc.precio_por_dia,
    status: bc.estado,
    vin: bc.vim,
    plate: bc.placa,
    image: ''
  }));
  return { data: transformed, total: resp.data.total };
}

// Crear un carro completo con todas sus relaciones
export async function createFullCar(payload: FullCarPayload): Promise<any> {
  const resp = await api.post('/cars/full', payload);
  return resp.data;
}
