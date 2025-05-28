import { useEffect, useState } from "react";
import { AutoCard_Interfaces_Recode as Auto } from "@/app/busqueda/interface/AutoCard_Interface_Recode";

export function useCustomSearch(autosFiltrados: Auto[], busqueda: string) {
  const [autosBuscados, setAutosBuscados] = useState<Auto[]>([]);

  const normalizar = (texto: string) =>
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  useEffect(() => {
    // ... (lógica anterior sin cambios, aún no se usa normalizar)
    const textoBusqueda = busqueda.trim().toLowerCase();
    if (!textoBusqueda) {
      setAutosBuscados(autosFiltrados);
      return;
    }
    const filtrados = autosFiltrados.filter(auto => {
      const textoAuto = `${auto.marca} ${auto.modelo}`.toLowerCase();
      return textoAuto.includes(textoBusqueda);
    });
    setAutosBuscados(filtrados);
  }, [autosFiltrados, busqueda]);

  return autosBuscados;
}