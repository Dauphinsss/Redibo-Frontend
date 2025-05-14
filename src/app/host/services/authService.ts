// src/app/host/services/authService.ts
import axios from "axios";

const TOKEN_KEY = "token";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v2";
const DEV_TOKEN_ENDPOINT = `${API_BASE}/cars/dev-token`;

/**
 * Verifica si el código se está ejecutando en el navegador
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Almacena el token en localStorage (solo navegador) o en memoria (SSR)
 */
let memoryToken: string | null = null;

/**
 * Almacena un token en el storage disponible
 */
export function storeToken(token: string): void {
  if (isBrowser) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.warn("No se pudo almacenar el token en localStorage:", e);
    }
  }
  // Siempre guardamos en memoria como respaldo
  memoryToken = token;
}

/**
 * Recupera el token almacenado, ya sea de localStorage o memoria
 */
export function getToken(): string | null {
  if (isBrowser) {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) return storedToken;
    } catch (e) {
      console.warn("No se pudo acceder a localStorage:", e);
    }
  }
  return memoryToken;
}

/**
 * Elimina el token almacenado
 */
export function removeToken(): void {
  if (isBrowser) {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.warn("No se pudo eliminar el token de localStorage:", e);
    }
  }
  memoryToken = null;
}

/**
 * Verifica si un token es válido (implementación simple)
 * En un caso real, deberías validar la firma JWT o hacer una petición al servidor
 */
export function isTokenValid(token: string): boolean {
  if (!token) return false;
  
  try {
    // Verificación básica de estructura JWT
    const parts = token.split('.');
    return parts.length === 3;
    //catch (e)
  } catch{
    return false;
  }
}

/**
 * Obtiene y almacena un token de desarrollo.
 * Si ya existe uno válido, lo devuelve directamente.
 */
export async function getDevToken(): Promise<string> {
  // Primero verificamos si ya tenemos un token almacenado
  const existingToken = getToken();
  if (existingToken) {
    return existingToken;
  }

  try {
    const response = await axios.get<{ success: boolean; token: string }>(DEV_TOKEN_ENDPOINT);
    if (response.data.success && response.data.token) {
      const newToken = response.data.token;
      storeToken(newToken);
      return newToken;
    }
    throw new Error("La respuesta del servidor no incluyó un token válido");
  } catch (error) {
    console.error("Error al obtener el token de desarrollo:", error);
    throw new Error("No se pudo obtener el token de desarrollo");
  }
}