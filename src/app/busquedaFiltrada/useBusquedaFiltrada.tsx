// src/features/busquedaFiltrada/hook/useBusquedaFiltrada.ts
import { useEffect, useState, useCallback } from 'react';
import { AutoCard_Interfaces_Recode as Auto } from '@/interface/AutoCard_Interface_Recode';
import { getAllCars } from '@/service/services_Recode';
import { transformAuto } from '@/utils/transformAuto_Recode';

export function useBusquedaFiltrada() {
  const [autosOriginales, setAutosOriginales] = useState<Auto[]>([]);
  const [autosFiltrados, setAutosFiltrados] = useState<Auto[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setCargando(true);
      try {
        const data = await getAllCars();
        const transformados = data.map(transformAuto);
        setAutosOriginales(transformados);
        setAutosFiltrados(transformados);
      } catch (error) {
        console.error('Error al cargar autos:', error);
      } finally {
        setCargando(false);
      }
    };
    fetch();
  }, []);

  const normalizar = (t: string) =>
    t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

  const filtrarPorTexto = useCallback((texto: string) => {
    const normalizado = normalizar(texto.trim());
    const palabras = normalizado.split(" ");
    const resultado = autosOriginales.filter(auto => {
      const comp = normalizar(`${auto.marca} ${auto.modelo}`);
      return palabras.every(p => comp.includes(p));
    });
    setAutosFiltrados(resultado);
  }, [autosOriginales]);

  return {
    cargando,
    autosFiltrados,
    filtrarPorTexto
  };
}