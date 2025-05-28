import { useEffect, useState } from "react";
import { AutoCard_Interfaces_Recode as Auto } from "@/app/busqueda/interface/AutoCard_Interface_Recode";

export function useCustomSearch(autosFiltrados: Auto[], busqueda: string) {
  // ... (useState sin cambios)
  useEffect(() => {
    const textoBusqueda = busqueda.trim().toLowerCase(); // Cambio aquí
    if (!textoBusqueda) {
      setAutosBuscados(autosFiltrados);
      return;
    }

    const filtrados = autosFiltrados.filter(auto => {
      const textoAuto = `${auto.marca} ${auto.modelo}`.toLowerCase(); // Cambio aquí
      return textoAuto.includes(textoBusqueda);
    });
    setAutosBuscados(filtrados);
  }, [autosFiltrados, busqueda]);

  return autosBuscados;
}