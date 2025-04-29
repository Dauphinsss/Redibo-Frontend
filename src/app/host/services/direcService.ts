import axios from "axios";

// Define la URL base para las peticiones
const API_URL = "https://redibo-backend-sprinteros1.onrender.com/api";

interface BackendCountry {
  id: number;
  nombre: string; // Nombre en el backend
}

export interface Country {
  id: number;
  name: string; // Nombre en el frontend
}

export async function getCountries(): Promise<Country[]> {
  try {
    const response = await axios.get<BackendCountry[]>(`${API_URL}/paises`);

    // Verificar si la respuesta es un array válido y no está vacía
    if (!Array.isArray(response.data) || response.data.length === 0) {
      console.warn("No countries data received from the backend.");
      return [];
    }

    // Transformar al modelo frontend
    return response.data.map((backendCountry) => ({
      id: backendCountry.id,
      name: backendCountry.nombre,
    }));
  } catch (error: unknown) {
    // Manejo seguro de errores
    if (axios.isAxiosError<unknown>(error) && error.response) {
      const data = error.response.data as { message?: string; [key: string]: unknown };
      console.error("Error fetching countries:", data);
      throw new Error(data.message ?? "Error al obtener los países");
    } else if (error instanceof Error) {
      console.error("Error fetching countries:", error.message);
      throw new Error(error.message);
    } else {
      console.error("Error fetching countries (no identificado):", error);
      throw new Error("Error al obtener los países");
    }
  }
}

interface BackendCity {
  id: number;
  nombre: string;
  id_pais: number;
}

export interface City {
  id: number;
  name: string;
  countryId: number;
}

export async function getCities(): Promise<City[]> {
  try {
    const response = await axios.get<BackendCity[]>(`${API_URL}/cities`);

    // Verificar si la respuesta es un array válido y no está vacía
    if (!Array.isArray(response.data) || response.data.length === 0) {
      console.warn("No cities data received from the backend.");
      return [];
    }

    // Transformar al modelo frontend
    return response.data.map((backendCity) => ({
      id: backendCity.id,
      name: backendCity.nombre,
      countryId: backendCity.id_pais,
    }));
  } catch (error: unknown) {
    // Manejo seguro de errores
    if (axios.isAxiosError<unknown>(error) && error.response) {
      const data = error.response.data as { message?: string; [key: string]: unknown };
      console.error("Error fetching cities:", data);
      throw new Error(data.message ?? "Error al obtener las ciudades");
    } else if (error instanceof Error) {
      console.error("Error fetching cities:", error.message);
      throw new Error(error.message);
    } else {
      console.error("Error fetching cities (no identificado):", error);
      throw new Error("Error al obtener las ciudades");
    }
  }
}
