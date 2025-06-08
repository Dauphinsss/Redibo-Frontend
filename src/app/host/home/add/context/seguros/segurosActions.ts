// src/contexts/seguros/segurosActions.ts
import { SeguroAdicional } from './types';
import { segurosService, SeguroAdicionalPayload } from '@/app/host/services/segurosService';
import { saveSegurosToStorage } from './segurosStorage';

// Estado local de seguros (fuera del closure para acceso global)
let _segurosAdicionales: SeguroAdicional[] = [];
let _setSegurosAdicionales: React.Dispatch<React.SetStateAction<SeguroAdicional[]>> | null = null;

// Exportar la función resetSeguros directamente
export function resetSeguros() {
  // Limpiar la variable global
  _segurosAdicionales = [];
  
  // Limpiar el estado del contexto si existe
  if (_setSegurosAdicionales) {
    _setSegurosAdicionales([]);
  }
  
  // Limpiar el localStorage
  saveSegurosToStorage([]);
}

// Acciones para manejar los seguros
export const createSegurosActions = (
  setSegurosAdicionales: React.Dispatch<React.SetStateAction<SeguroAdicional[]>>,
) => {
  // Guardar la referencia al setter del estado
  _setSegurosAdicionales = setSegurosAdicionales;
  
  return {
    setSegurosAdicionales: (seguros: SeguroAdicional[]) => {
      _segurosAdicionales = seguros;
      setSegurosAdicionales(seguros);
      // Actualizar también el localStorage
      saveSegurosToStorage(seguros);
    },
    
    agregarSeguro: (seguro: SeguroAdicional) => {
      const updated = [..._segurosAdicionales, seguro];
      _segurosAdicionales = updated;
      setSegurosAdicionales(updated);
      // Actualizar también el localStorage
      saveSegurosToStorage(updated);
    },
    
    eliminarSeguro: (id: number) => {
      const updated = _segurosAdicionales.filter(seguro => seguro.id !== id);
      _segurosAdicionales = updated;
      setSegurosAdicionales(updated);
      // Actualizar también el localStorage
      saveSegurosToStorage(updated);
    },
    
    actualizarSeguro: (id: number, seguroActualizado: Partial<SeguroAdicional>) => {
      const updated = _segurosAdicionales.map(seguro =>
        seguro.id === id ? { ...seguro, ...seguroActualizado } : seguro
      );
      _segurosAdicionales = updated;
      setSegurosAdicionales(updated);
      // Actualizar también el localStorage
      saveSegurosToStorage(updated);
    },
    
    resetSeguros: () => {
      resetSeguros(); // Usar la función global de reset
    }
  };
};

// Permite obtener los seguros adicionales actuales
export function getSegurosAdicionales(): SeguroAdicional[] {
  return _segurosAdicionales;
}

// Transforma los seguros adicionales al formato que espera el backend
export function toSeguroAdicionalPayloads(): SeguroAdicionalPayload[] {
  return _segurosAdicionales.map(seguro => ({
    id_seguro: seguro.id,
    fechaInicio: seguro.fechaInicio,
    fechaFin: seguro.fechaFin,
    enlace: seguro.enlace || undefined,
  }));
}

// Llama a segurosService para asociar los seguros al carro
export async function enviarSegurosAlBackend(carId: number): Promise<{ success: boolean; count?: number; error?: string }> {
  const payloads = toSeguroAdicionalPayloads();
  if (!payloads.length) return { success: true, count: 0 };
  try {
    const result = await segurosService.createSegurosCarroBatch(carId, payloads);
    return result;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al asociar seguros';
    return { success: false, error: errorMessage };
  }
}