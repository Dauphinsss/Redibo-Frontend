import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. Definimos la interfaz del estado para que acepte strings
interface SearchState {
    ciudad: string | null;
    fechaInicio: string | null; // Guardará 'DD-MM-AAAA'
    fechaFin: string | null;    // Guardará 'DD-MM-AAAA'
    setFechas: (inicio: string | null, fin: string | null) => void;
    setCiudad: (ciudad: string | null) => void;
    resetSearch: () => void;
}

// 2. Creamos el store con persistencia en localStorage
export const useSearchStore = create<SearchState>()(
    persist(
        (set) => ({
            // Estado inicial
            ciudad: null,
            fechaInicio: null,
            fechaFin: null,
            
            // Acciones para actualizar el estado
            setFechas: (inicio, fin) => set({ fechaInicio: inicio, fechaFin: fin }),
            setCiudad: (ciudad) => set({ ciudad }),
            resetSearch: () => set({ ciudad: null, fechaInicio: null, fechaFin: null }),
        }),
        {
            name: 'search-storage', // Nombre para guardar en localStorage
            storage: createJSONStorage(() => localStorage), // Usar localStorage
        }
    )
);