// src/contexts/seguros/types.ts

export interface SeguroAdicional {
  id: number;
  nombre: string;
  tipoSeguro: string;
  empresa: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion?: string;
  enlace?: string
}

export interface SegurosContextType {
  segurosAdicionales: SeguroAdicional[];
  isLoading: boolean;
  error: string | null;
  setSegurosAdicionales: (seguros: SeguroAdicional[]) => void;
  agregarSeguro: (seguro: SeguroAdicional) => void;
  eliminarSeguro: (id: number) => void;
  actualizarSeguro: (id: number, seguro: Partial<SeguroAdicional>) => void;
  resetSeguros: () => void;
}

// Clave para localStorage
export const SEGUROS_STORAGE_KEY = 'app_seguros_adicionales';