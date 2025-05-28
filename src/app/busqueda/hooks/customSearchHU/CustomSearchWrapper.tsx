//Componente que usa el hook y se conecta con SearchBar
// app/busqueda/components/customSearchHU/CustomSearchWrapper.tsx
"use client";

import ResultadosAutos from "@/app/busqueda/components/seccionOrdenarMasResultados/ResultadosAutos_Recode";
import { useCustomSearch } from "@/app/busqueda/hooks/customSearchHU/useCustomSearch";
import { AutoCard_Interfaces_Recode as Auto } from "@/app/busqueda/interface/AutoCard_Interface_Recode";

interface Props {
  autosFiltrados: Auto[];
  autosVisibles: number;
  mostrarMasAutos: () => void;
  busqueda: string;
  cargando: boolean;
}

export default function CustomSearchWrapper({
  autosFiltrados,
  autosVisibles,
  mostrarMasAutos,
  busqueda,
  cargando,
}: Props) {
  const autosBuscados = useCustomSearch(autosFiltrados, busqueda);
  const autosActuales = autosBuscados.slice(0, autosVisibles);

  return (
    <ResultadosAutos
      cargando={cargando}
      autosActuales={autosActuales}
      autosFiltrados={autosBuscados}
      autosVisibles={autosVisibles}
      mostrarMasAutos={mostrarMasAutos}
    />
  );
}
