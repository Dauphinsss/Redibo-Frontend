// src/app/host/services/authService.ts
import axios, { AxiosError } from "axios";

const STORAGE_KEY = "auth_token";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const ID_USER_ENDPOINT = `${API_BASE}/api/v2/cars/idUser`;

/**
 * Detecta si el código corre en el navegador
 */
const isBrowser = typeof window !== 'undefined';

let memoryToken: string | null = null;

/**
 * Guarda el JWT en storage disponible (localStorage o memoria)
 */
export function storeToken(token: string): void {
  if (isBrowser) {
    try {
      localStorage.setItem(STORAGE_KEY, token);
    } catch (e) {
      console.warn("No se pudo guardar el token en localStorage:", e);
    }
  }
  memoryToken = token;
}

/**
 * Recupera el JWT de storage (preferencia a localStorage)
 */
export function getToken(): string | null {
  if (isBrowser) {
    try {
      const t = localStorage.getItem(STORAGE_KEY);
      if (t) return t;
    } catch (e) {
      console.warn("No se pudo leer el token de localStorage:", e);
    }
  }
  return memoryToken;
}

/**
 * Elimina el JWT de storage y memoria
 */
export function removeToken(): void {
  if (isBrowser) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("No se pudo eliminar el token de localStorage:", e);
    }
  }
  memoryToken = null;
}

/**
 * Verifica la forma básica de un JWT (tres secciones separadas por puntos)
 */
export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  const parts = token.split('.');
  return parts.length === 3;
}

/**
 * Consulta al backend si el usuario autenticado tiene rol HOST y retorna su ID
 */
export async function getHostUserId(): Promise<number> {
  const token = getToken();
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  try {
    const response = await axios.get<{ message: string; userId: number }>(ID_USER_ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.userId;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        throw new Error('Token inválido o expirado');
      }
      if (status === 403) {
        throw new Error('Acceso denegado: no eres un HOST');
      }
    }
    throw new Error('Error al verificar rol de HOST');
  }
}
