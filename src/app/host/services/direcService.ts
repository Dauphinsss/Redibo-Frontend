import axios from 'axios';

const API_URL = "http://localhost:4000/api/v2/direc";

interface BackendCountry {
    id: number;
    nombre: string;
}

export interface Country {
    id: number;
    name: string;
}

export async function getCountries(): Promise<Country[]> {
    try {
        const response = await axios.get<BackendCountry[]>(`${API_URL}/paises`);
        if (!Array.isArray(response.data) || response.data.length === 0) {
            console.warn("No countries data received from the backend.");
            return [];
        }
        return response.data.map(backendCountry => ({
            id: backendCountry.id,
            name: backendCountry.nombre,
        }));
    } catch (error: any) {
        console.error('Error fetching countries:', error.response?.data || error.message);
        throw new Error("Error al obtener los países");
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

export async function getCities(countryId?: string): Promise<City[]> {
    let url = `${API_URL}/cities`;
    if (countryId) {
        url = `${API_URL}/paises/${countryId}/cities`;
    }
    try {
        const response = await axios.get<BackendCity[]>(url);
        if (!Array.isArray(response.data) || response.data.length === 0) {
            console.warn("No cities data received from the backend.");
            return [];
        }
        return response.data.map(backendCity => ({
            id: backendCity.id,
            name: backendCity.nombre,
            countryId: backendCity.id_pais,
        }));
    } catch (error: any) {
        console.error('Error fetching cities:', error.response?.data || error.message);
        throw new Error("Error al obtener los departamentos");
    }
}

interface BackendProvince {
    id: number;
    nombre: string;
    id_ciudad: number;
}

export interface Province {
    id: number;
    name: string;
    cityId: number;
}

export async function getProvinces(cityId?: string): Promise<Province[]> {
    let url = `${API_URL}/provinces`; // Ruta base por si no hay cityId
    if (cityId) {
      url = `${API_URL}/cities/${cityId}/provinces`;
    }
    console.log("URL de la API para provincias:", url);  // Agrega esto
  
    try {
      const response = await axios.get<BackendProvince[]>(url);
      console.log("Respuesta de la API para provincias:", response.data); // Agrega esto
  
      if (!Array.isArray(response.data) || response.data.length === 0) {
        console.warn("No provinces data received from the backend.");
        return [];
      }
  
      const transformedData: Province[] = response.data.map(backendProvince => ({
        id: backendProvince.id,
        name: backendProvince.nombre,
        cityId: backendProvince.id_ciudad,
      }));
  
      return transformedData;
    } catch (error: any) {
      console.error('Error fetching provinces:', error.response?.data || error.message);
      throw new Error("Error al obtener las provincias");
    }
  }