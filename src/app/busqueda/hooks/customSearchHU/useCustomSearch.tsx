import { useEffect, useState } from "react";
import { AutoCard_Interfaces_Recode as Auto } from "@/app/busqueda/interface/AutoCard_Interface_Recode";

export function useCustomSearch(autosFiltrados: Auto[], busqueda: string) {
  const [autosBuscados, setAutosBuscados] = useState<Auto[]>(autosFiltrados);

  useEffect(() => {
    // La lógica de filtrado vendrá después
  }, [autosFiltrados, busqueda]);

  return autosBuscados;
}