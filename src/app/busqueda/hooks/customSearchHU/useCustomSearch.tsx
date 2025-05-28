//Encapsula la busqueda sobre autosFiltrados
// app/busqueda/hooks/customSearchHU/useCustomSearch.tsx
import { useEffect, useState } from "react";
import { AutoCard_Interfaces_Recode as Auto } from "@/app/busqueda/interface/AutoCard_Interface_Recode";

export function useCustomSearch(autosFiltrados: Auto[], busqueda: string) {
  const [autosBuscados, setAutosBuscados] = useState<Auto[]>([]);

  const normalizar = (texto: string) =>
    texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  useEffect(() => {
    const textoNormalizado = normalizar(busqueda.trim());

    if (!textoNormalizado) {
      setAutosBuscados(autosFiltrados);
      return;
    }

    const palabras = textoNormalizado.split(" ");

    const filtrados = autosFiltrados.filter(auto => {
      const textoAuto = `${auto.marca} ${auto.modelo}`;
      const textoNormal = normalizar(textoAuto).replace(/[^\p{L}\p{N}\s.\-\/]/gu, "").trim();
      return palabras.every(palabra => textoNormal.includes(palabra));
    });

    setAutosBuscados(filtrados);
  }, [autosFiltrados, busqueda]);

  return autosBuscados;
}