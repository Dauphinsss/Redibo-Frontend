"use client";

import ResultadosAutos from "@/app/busqueda/components/seccionOrdenarMasResultados/ResultadosAutos_Recode";
import { useCustomSearch } from "@/app/busqueda/hooks/customSearchHU/useCustomSearch"; // Importar hook
import { AutoCard_Interfaces_Recode as Auto } from "@/app/busqueda/interface/AutoCard_Interface_Recode";

interface Props {
  // ... (sin cambios en Props)
}

export default function CustomSearchWrapper({
  autosFiltrados,
  autosVisibles,
  mostrarMasAutos,
  busqueda,
  cargando,
}: Props) {
  // Usar el hook
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