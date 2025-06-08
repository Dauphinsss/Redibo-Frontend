import axios, { AxiosResponse } from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const API_URL = `${API_BASE}/api/filterU5`; // Asegúrate del slash antes de "api"

/**
 * Estructura del dato que devuelve el endpoint de filtros iniciales
 */
export interface FiltroInicial {
  id: number;
  precio_por_dia: number;
  NumeroViajes: number;
  calificaciones: number[];
}

/**
 * Payload para filtro por precio
 */
export interface FiltroPrecioRequest {
  minPrecio: number;
  maxPrecio: number;
  idsCarros: number[];
}

/**
 * Payload para filtro por número de viajes
 */
export interface FiltroViajeRequest {
  minViajes: number;
  idsCarros: number[];
}

/**
 * Payload para filtro por calificación
 */
export interface FiltroCalificacionRequest {
  minCalificacion: number;
  idsCarros: number[];
}

/**
 * Obtiene los filtros iniciales (GET /api/filterU5/filtrosIniciales)
 */
export const obtenerFiltrosIniciales = async (): Promise<FiltroInicial[]> => {
  try {
    const response: AxiosResponse<FiltroInicial[]> = await axios.get(
      `${API_URL}/filtrosIniciales`
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener filtros iniciales:', error);
    throw new Error('No se pudieron obtener los filtros iniciales');
  }
};

/**
 * Envía el payload para filtrar por precio 
 * (POST /api/filterU5/filtroPrecio)
 */
export const filtrarPorPrecio = async (
  payload: FiltroPrecioRequest
): Promise<FiltroInicial[]> => {
  try {
    const response: AxiosResponse<FiltroInicial[]> = await axios.post(
      `${API_URL}/filtroPrecio`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error al filtrar por precio:', error);
    throw new Error('Error al aplicar filtro de precio');
  }
};

/**
 * Envía el payload para filtrar por número de viajes 
 * (POST /api/filterU5/filtroViaje)
 */
export const filtrarPorViajes = async (
  payload: FiltroViajeRequest
): Promise<FiltroInicial[]> => {
  try {
    const response: AxiosResponse<FiltroInicial[]> = await axios.post(
      `${API_URL}/filtroViaje`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error al filtrar por viajes:', error);
    throw new Error('Error al aplicar filtro de viajes');
  }
};

/**
 * Envía el payload para filtrar por calificación 
 * (POST /api/filterU5/filtroCalificacion)
 */
export const filtrarPorCalificacion = async (
  payload: FiltroCalificacionRequest
): Promise<FiltroInicial[]> => {
  try {
    const response: AxiosResponse<FiltroInicial[]> = await axios.post(
      `${API_URL}/filtroCalificacion`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error al filtrar por calificación:', error);
    throw new Error('Error al aplicar filtro de calificación');
  }
};
