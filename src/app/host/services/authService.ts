// src/services/authService.ts
import axios from "axios";

const TOKEN_KEY = "token";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://redibo-backend-sprinteros1.onrender.com/api/v2";
const DEV_TOKEN_ENDPOINT = `${API_BASE}/cars/dev-token`;

/**
 * Obtiene y almacena en localStorage un token de desarrollo.
 * Si ya existe uno, lo devuelve directamente.
 */
export async function getDevToken(): Promise<string> {
  const stored = localStorage.getItem(TOKEN_KEY);
  if (stored) return stored;

  const response = await axios.get<{ success: boolean; token: string }>(DEV_TOKEN_ENDPOINT);
  if (response.data.success && response.data.token) {
    localStorage.setItem(TOKEN_KEY, response.data.token);
    return response.data.token;
  }

  throw new Error("No se pudo obtener el token de desarrollo");
}

/**
 * Recupera el token almacenado en localStorage, o null si no existe.
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
