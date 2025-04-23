// src/services/authService.ts
import axios from 'axios';

const TOKEN_KEY = 'token';

export async function getDevToken(): Promise<string> {
  const stored = localStorage.getItem(TOKEN_KEY);
  if (stored) return stored;

  const res = await axios.get<{ success: boolean; token: string }>(
    `${process.env.NEXT_PUBLIC_API_URL}/cars/dev-token`
  );
  if (res.data.success && res.data.token) {
    localStorage.setItem(TOKEN_KEY, res.data.token);
    return res.data.token;
  }
  throw new Error('No se obtuvo token de desarrollo');
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
