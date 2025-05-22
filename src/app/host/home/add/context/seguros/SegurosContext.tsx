// src/contexts/seguros/SegurosContext.tsx
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

import { SegurosContextType, SeguroAdicional } from './types';
import { createSegurosActions } from './segurosActions';
import { loadSegurosFromStorage, saveSegurosToStorage } from './segurosStorage';

const SegurosContext = createContext<SegurosContextType | undefined>(undefined);

export function SegurosProvider({ children }: { children: ReactNode }) {
  const [segurosAdicionales, setSegurosAdicionales] = useState<SeguroAdicional[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos de localStorage al iniciar
  useEffect(() => {
    const { seguros, error } = loadSegurosFromStorage();
    setSegurosAdicionales(seguros);
    if (error) setError(error);
    setIsLoading(false);
  }, []);

  // Guardar en localStorage cada vez que cambian los datos
  useEffect(() => {
    if (!isLoading) {
      const { error } = saveSegurosToStorage(segurosAdicionales);
      if (error) setError(error);
    }
  }, [segurosAdicionales, isLoading]);

  // Crear acciones para el contexto
  const segurosActions = useMemo(
    () => createSegurosActions(setSegurosAdicionales),
    []
  );

  // Construir el valor del contexto
  const value = useMemo(
    () => ({
      segurosAdicionales,
      isLoading,
      error,
      ...segurosActions
    }),
    [segurosAdicionales, isLoading, error, segurosActions]
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