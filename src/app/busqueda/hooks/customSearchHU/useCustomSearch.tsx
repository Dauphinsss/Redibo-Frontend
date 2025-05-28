import { useEffect, useState } from "react";
import { AutoCard_Interfaces_Recode as Auto } from "@/app/busqueda/interface/AutoCard_Interface_Recode";

export function useCustomSearch(autosFiltrados: Auto[], busqueda: string) {
  const [autosBuscados, setAutosBuscados] = useState<Auto[]>(autosFiltrados);

  useEffect(() => {
    const filtrados = autosFiltrados.filter(auto => {
      const textoAuto = `${auto.marca} ${auto.modelo}`;
      return textoAuto.includes(busqueda);
    });
    setAutosBuscados(filtrados);
  }, [autosFiltrados, busqueda]);

  return autosBuscados;
}