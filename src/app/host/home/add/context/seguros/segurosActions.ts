// src/contexts/seguros/segurosActions.ts
import { SeguroAdicional } from './types';
import { segurosService, SeguroAdicionalPayload } from '@/app/host/services/segurosService';

// Estado local de seguros (fuera del closure para acceso global)
let _segurosAdicionales: SeguroAdicional[] = [];

// Acciones para manejar los seguros
export const createSegurosActions = (
  setSegurosAdicionales: React.Dispatch<React.SetStateAction<SeguroAdicional[]>>,
) => {
  return {
    setSegurosAdicionales: (seguros: SeguroAdicional[]) => {
      _segurosAdicionales = seguros;
      setSegurosAdicionales(seguros);
    },
    
    agregarSeguro: (seguro: SeguroAdicional) => {
      _segurosAdicionales = [..._segurosAdicionales, seguro];
      setSegurosAdicionales(prev => {
        const next = [...prev, seguro];
        _segurosAdicionales = next;
        return next;
      });
    },
    
    eliminarSeguro: (id: number) => {
      _segurosAdicionales = _segurosAdicionales.filter(seguro => seguro.id !== id);
      setSegurosAdicionales(prev => {
        const next = prev.filter(seguro => seguro.id !== id);
        _segurosAdicionales = next;
        return next;
      });
    },
    
    actualizarSeguro: (id: number, seguroActualizado: Partial<SeguroAdicional>) => {
      _segurosAdicionales = _segurosAdicionales.map(seguro =>
        seguro.id === id ? { ...seguro, ...seguroActualizado } : seguro
      );
      setSegurosAdicionales(prev => {
        const next = prev.map(seguro =>
          seguro.id === id ? { ...seguro, ...seguroActualizado } : seguro
        );
        _segurosAdicionales = next;
        return next;
      });
    },
    
    resetSeguros: () => {
      _segurosAdicionales = [];
      setSegurosAdicionales([]);
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