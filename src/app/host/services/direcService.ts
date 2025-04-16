import axios from "axios";

// Define la URL base para las peticiones
const API_URL = "http://localhost:4000/api";

// ──────────────────────────────────────────────────────────────
// Interfaces del backend
// ──────────────────────────────────────────────────────────────

interface BackendCountry {
  id: number;
  nombre: string;
}

interface BackendCity {
  id: number;
  nombre: string;
  id_pais: number;
}

interface BackendProvincia {
  id: number;
  nombre: string;
}

interface BackendCarroConDireccion {
  paisId: number;
  ciudadId: number;
  provinciaId: number;
  calle: string;
  num_casa: string;
}

// ──────────────────────────────────────────────────────────────
// Interfaces públicas para el frontend
// ──────────────────────────────────────────────────────────────

export interface Country {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  countryId: number;
}

export interface Provincia {
  id: number;
  name: string;
}

export interface CarroConDireccion {
  paisId: number;
  ciudadId: number;
  provinciaId: number;
  calle: string;
  numCasa: string;
}

// ──────────────────────────────────────────────────────────────
// Funciones de interacción con el backend
// ──────────────────────────────────────────────────────────────

/**
 * Obtiene la lista de países desde el backend.
 * Si ocurre un error, se retorna Bolivia como única opción por defecto.
 */
export async function getCountries(): Promise<Country[]> {
  try {
    const response = await axios.get<BackendCountry[]>(`${API_URL}/paises`);
    const transformedData: Country[] = response.data.map(p => ({
      id: p.id,
      name: p.nombre,
    }));
    return transformedData;
  } catch (error: any) {
    console.error("Error fetching countries, using default country Bolivia:", error.response?.data || error.message);
    // Retorna Bolivia como opción por defecto; ajusta el id si es necesario
    return [{ id: 1, name: "Bolivia" }];
  }
}

/**
 * Obtiene la lista completa de ciudades.
 */
export async function getCities(): Promise<City[]> {
  try {
    const response = await axios.get<BackendCity[]>(`${API_URL}/cities`);
    return response.data.map(c => ({
      id: c.id,
      name: c.nombre,
      countryId: c.id_pais,
    }));
  } catch (error: any) {
    console.error("Error fetching cities:", error.response?.data || error.message);
    throw new Error("Error al obtener las ciudades");
  }
}

/**
 * Obtiene las ciudades filtradas por ID de país.
 */
export async function getCitiesByCountryId(countryId: number): Promise<City[]> {
  try {
    const response = await axios.get<BackendCity[]>(`${API_URL}/ciudades/${countryId}`);
    return response.data.map(c => ({
      id: c.id,
      name: c.nombre,
      countryId: c.id_pais,
    }));
  } catch (error: any) {
    console.error("Error fetching cities for country:", error.response?.data || error.message);
    throw new Error("Error al obtener las ciudades para el país");
  }
}

/**
 * Obtiene las provincias asociadas a una ciudad.
 */
export async function getProvinciasByCityId(cityId: number): Promise<Provincia[]> {
  try {
    const response = await axios.get<BackendProvincia[]>(`${API_URL}/provincias/${cityId}`);
    return response.data.map(p => ({ id: p.id, name: p.nombre }));
  } catch (error: any) {
    console.error("Error fetching provinces:", error.response?.data || error.message);
    throw new Error("Error al obtener las provincias");
  }
}

/**
 * Obtiene la información de dirección asociada a un carro.
 */
export async function getCarroConDireccion(carroId: number): Promise<CarroConDireccion> {
  try {
    const response = await axios.get<BackendCarroConDireccion>(`${API_URL}/carro/direccion/${carroId}`);
    const carro = response.data;
    return {
      paisId: carro.paisId,
      ciudadId: carro.ciudadId,
      provinciaId: carro.provinciaId,
      calle: carro.calle,
      numCasa: carro.num_casa,
    };
  } catch (error: any) {
    console.error("Error fetching car address data:", error.response?.data || error.message);
    throw new Error("Error al obtener los datos del vehículo");
  }
}

/**
 * Actualiza la dirección de un vehículo.
 */
export async function updateDireccion(
  carroId: number,
  direccion: {
    paisId: number | null;
    ciudadId: number | null;
    provinciaId: number | null;
    calle: string;
    num_casa: string;
  }
): Promise<void> {
  try {
    await axios.put(`${API_URL}/actualizar-direccion/${carroId}`, direccion);
  } catch (error: any) {
    console.error("Error updating address:", error.response?.data || error.message);
    throw new Error("Error al actualizar la dirección");
  }
}
