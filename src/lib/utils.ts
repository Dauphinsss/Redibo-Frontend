import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Verificarr si una persona es menor de una edad mínima
export const isUnderage = (birthdateString: string, edadMinima: number = 18): boolean => {
  if (!birthdateString) return false;

  const today = new Date();
  const birthDate = new Date(birthdateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  const d = today.getDate() - birthDate.getDate();

  if (m < 0 || (m === 0 && d < 0)) {
    age--;
  }

  return age < edadMinima;
};
