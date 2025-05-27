import axios from 'axios';

const API_URL = 'http://localhost:4000/api/filterU5';

export interface FiltroInicial {
    id: number;
    precio_por_dia: number;
    NumeroViajes: number;
    calificaciones: number[];
}

export interface FiltroPrecioRequest {
    minPrecio: number;
    maxPrecio: number;
    idsCarros: number[];
}

export interface FiltroViajeRequest {
    minViajes: number;
    idsCarros: number[];
}

export interface FiltroCalificacionRequest {
    minCalificacion: number;
    idsCarros: number[];
}

export const obtenerFiltrosIniciales = async (): Promise<FiltroInicial[]> => {
    try {
        const response = await axios.get(`${API_URL}/filtrosIniciales`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener filtros iniciales:', error);
        throw new Error('No se pudieron obtener los filtros iniciales');
    }
};

export const filtrarPorPrecio = async (request: FiltroPrecioRequest) => {
    try {
        const response = await axios.post(`${API_URL}/filtroPrecio`, request);
        return response.data;
    } catch (error) {
        console.error('Error al filtrar por precio:', error);
        throw new Error('Error al aplicar filtro de precio');
    }
};

export const filtrarPorViajes = async (request: FiltroViajeRequest) => {
    try {
        const response = await axios.post(`${API_URL}/filtroViaje`, request);
        return response.data;
    } catch (error) {
        console.error('Error al filtrar por viajes:', error);
        throw new Error('Error al aplicar filtro de viajes');
    }
};

export const filtrarPorCalificacion = async (request: FiltroCalificacionRequest) => {
    try {
        const response = await axios.post(`${API_URL}/filtroCalificacion`, request);
        return response.data;
    } catch (error) {
        console.error('Error al filtrar por calificación:', error);
        throw new Error('Error al aplicar filtro de calificación');
    }
}; 