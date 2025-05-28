import { useEffect, useState } from "react";
import { AutoCard_Interfaces_Recode as Auto } from "@/app/busqueda/interface/AutoCard_Interface_Recode";

export function useCustomSearch(autosFiltrados: Auto[], busqueda: string) {
  // ... (useState y normalizar sin cambios)
  useEffect(() => {
    const textoNormalizado = normalizar(busqueda.trim());
    if (!textoNormalizado) {
      setAutosBuscados(autosFiltrados);
      return;
    }
    const palabras = textoNormalizado.split(" "); // Cambio aquí

    const filtrados = autosFiltrados.filter(auto => {
      const textoAuto = `${auto.marca} ${auto.modelo}`;
      const textoNormal = normalizar(textoAuto);
      return palabras.every(palabra => textoNormal.includes(palabra)); // Cambio aquí
    });
    setAutosBuscados(filtrados);
  }, [autosFiltrados, busqueda]);

  return autosBuscados;
}