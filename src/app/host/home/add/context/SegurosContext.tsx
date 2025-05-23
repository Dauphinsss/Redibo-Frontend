// src/contexts/SegurosContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useEffect
} from "react";

export interface SeguroAdicional {
  id: number;
  nombre: string;
  tipoSeguro: string;
  empresa: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion?: string;
}

interface SegurosContextType {
  segurosAdicionales: SeguroAdicional[];
  isLoading: boolean;
  error: string | null;
  setSegurosAdicionales: (seguros: SeguroAdicional[]) => void;
  agregarSeguro: (seguro: SeguroAdicional) => void;
  eliminarSeguro: (id: number) => void;
  actualizarSeguro: (id: number, seguro: Partial<SeguroAdicional>) => void;
  resetSeguros: () => void;
}

const SegurosContext = createContext<SegurosContextType | undefined>(undefined);

// Clave para localStorage
const SEGUROS_STORAGE_KEY = 'app_seguros_adicionales';

export function SegurosProvider({ children }: { children: ReactNode }) {
  const [segurosAdicionales, setSegurosAdicionales] = useState<SeguroAdicional[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos de localStorage al iniciar
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(SEGUROS_STORAGE_KEY);
      if (storedData) {
        setSegurosAdicionales(JSON.parse(storedData));
      }
    } catch (err) {
      console.error('Error al cargar los seguros desde localStorage:', err);
      setError('No se pudieron cargar los datos de seguros guardados');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar en localStorage cada vez que cambian los datos
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(SEGUROS_STORAGE_KEY, JSON.stringify(segurosAdicionales));
      } catch (err) {
        console.error('Error al guardar los seguros en localStorage:', err);
        setError('No se pudieron guardar los cambios');
      }
    }
  }, [segurosAdicionales, isLoading]);

  const updateSegurosAdicionales = useCallback((seguros: SeguroAdicional[]) => {
    setSegurosAdicionales(seguros);
  }, []);

  const agregarSeguro = useCallback((seguro: SeguroAdicional) => {
    setSegurosAdicionales(prev => [...prev, seguro]);
  }, []);

  const eliminarSeguro = useCallback((id: number) => {
    setSegurosAdicionales(prev => prev.filter(seguro => seguro.id !== id));
  }, []);

  const actualizarSeguro = useCallback((id: number, seguroActualizado: Partial<SeguroAdicional>) => {
    setSegurosAdicionales(prev => 
      prev.map(seguro => 
        seguro.id === id ? { ...seguro, ...seguroActualizado } : seguro
      )
    );
  }, []);

  const resetSeguros = useCallback(() => {
    setSegurosAdicionales([]);
  }, []);

  // Usar useMemo para el valor del contexto como en FormContext
  const value = useMemo(
    () => ({
      segurosAdicionales,
      isLoading,
      error,
      setSegurosAdicionales: updateSegurosAdicionales,
      agregarSeguro,
      eliminarSeguro,
      actualizarSeguro,
      resetSeguros
    }),
    [segurosAdicionales, isLoading, error, updateSegurosAdicionales, agregarSeguro, eliminarSeguro, actualizarSeguro, resetSeguros]
  );

  return (
    <SegurosContext.Provider value={value}>
      {children}
    </SegurosContext.Provider>
  );
}

export function useSegurosContext() {
  const context = useContext(SegurosContext);
  if (!context) {
    throw new Error("useSegurosContext debe usarse dentro de un SegurosProvider");
  }
  return context;
}