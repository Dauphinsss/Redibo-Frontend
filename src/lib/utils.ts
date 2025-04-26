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
  const minAgeDate = new Date(birthDate);
  minAgeDate.setFullYear(minAgeDate.getFullYear() + edadMinima);

  return today < minAgeDate;
};
