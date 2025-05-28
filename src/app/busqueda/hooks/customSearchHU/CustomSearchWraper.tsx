"use client";

import ResultadosAutos from "@/app/busqueda/components/seccionOrdenarMasResultados/ResultadosAutos_Recode";
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
  cargando,
}: Props) {
  const autosActuales = autosFiltrados.slice(0, autosVisibles);

  return (
    <ResultadosAutos
      cargando={cargando}
      autosActuales={autosActuales}
      autosFiltrados={autosFiltrados}
      autosVisibles={autosVisibles}
      mostrarMasAutos={mostrarMasAutos}
    />
  );
}