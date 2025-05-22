// src/contexts/seguros/segurosStorage.ts
import { SeguroAdicional, SEGUROS_STORAGE_KEY } from './types';

export const loadSegurosFromStorage = (): { 
  seguros: SeguroAdicional[]; 
  error: string | null 
} => {
  try {
    const storedData = localStorage.getItem(SEGUROS_STORAGE_KEY);
    if (storedData) {
      return { 
        seguros: JSON.parse(storedData),
        error: null
      };
    }
    return {
      seguros: [],
      error: null
    };
  } catch (err) {
    console.error('Error al cargar los seguros desde localStorage:', err);
    return {
      seguros: [],
      error: 'No se pudieron cargar los datos de seguros guardados'
    };
  }
};

export const saveSegurosToStorage = (
  seguros: SeguroAdicional[]
): { success: boolean; error: string | null } => {
  try {
    localStorage.setItem(SEGUROS_STORAGE_KEY, JSON.stringify(seguros));
    return { success: true, error: null };
  } catch (err) {
    console.error('Error al guardar los seguros en localStorage:', err);
    return { 
      success: false, 
      error: 'No se pudieron guardar los cambios' 
    };
  }
};