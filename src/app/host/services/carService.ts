import axios from 'axios';

const API_URL = "http://localhost:4000/api/v2/cars";

// Interfaz ajustada a los nombres REALES del backend
interface BackendCar {
  id: number;
  marca: string;         // -> brand
  modelo: string;        // -> model
  año: number;           // -> year
  precio_por_dia: number; // -> price
  estado: string;        // -> status
  vim: string;           // -> vin (corregir nombre)
  placa: string;         // -> plate
}

// Interfaz para el frontend (nombres en inglés)
export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  status: string;
  vin: string;
  plate: string;
  image: string; // Valor por defecto si no existe
}

interface GetCarsResponse {
  success: boolean;
  data: BackendCar[];
  total: number;
}

// Función para obtener el token de desarrollo
async function getDevToken(): Promise<string> {
  try {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      return storedToken;
    }

    const response = await axios.get<{ success: boolean; token: string }>(
      "http://localhost:4000/api/v2/cars/dev-token"
    );

    if (response.data.success && response.data.token) {
      localStorage.setItem("token", response.data.token);
      return response.data.token;
    }

    throw new Error("No se pudo obtener el token de desarrollo");
  } catch (error: any) {
    console.error("Error al obtener el token de desarrollo:", error.response?.data || error.message);
    throw new Error("Error al obtener el token de desarrollo");
  }
}

export async function getCars({ skip = 0, take = 10, hostId = 1 } = {}): Promise<{ data: Car[]; total: number }> {
  try {
    const token = await getDevToken(); // Obtener el token de desarrollo

    const response = await axios.get<GetCarsResponse>(API_URL, {
      params: {
        hostId,
        start: skip,    // El backend usa "start" en lugar de "skip"
        limit: take     // El backend usa "limit" en lugar de "take"
      },
      headers: {
        Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
      },
    });

    // Transformación de datos
    const transformedData: Car[] = response.data.data.map(backendCar => ({
      id: backendCar.id,
      brand: backendCar.marca,
      model: backendCar.modelo,
      year: backendCar.año,
      price: backendCar.precio_por_dia,
      status: backendCar.estado,
      vin: backendCar.vim,  // Mapear vim -> vin
      plate: backendCar.placa,
      image: "" // Valor temporal (ajustar según necesidad)
    }));

    console.log("Datos transformados:", transformedData); // Para debug

    return {
      data: transformedData,
      total: response.data.total
    };
    
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    throw new Error("Error al obtener los vehículos");
  }
}

// Define, si es necesario, funciones para crear, actualizar o eliminar
// export async function createCar(data) { ... }
// export async function updateCar(id, data) { ... }
// export async function deleteCar(id) { ... }