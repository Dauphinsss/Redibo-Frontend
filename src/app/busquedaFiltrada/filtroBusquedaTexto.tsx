'use client';

import SearchBar from '@/components/recodeComponentes/seccionOrdenarMasResultados/RecodeSearchBar';
import { useBusquedaFiltrada } from './useBusquedaFiltrada';
import ResultadosAutos from '@/components/recodeComponentes/seccionOrdenarMasResultados/ResultadosAutos_Recode';

export default function FiltroBusquedaTexto() {
  const { autosFiltrados, filtrarPorTexto, cargando } = useBusquedaFiltrada();

  return (
    <div className="w-full">
      <SearchBar
        placeholder="Buscar por modelo, marca"
        onFiltrar={filtrarPorTexto}
        obtenerSugerencia={() => ''}
      />

      <ResultadosAutos
        cargando={cargando}
        autosActuales={autosFiltrados}
        autosFiltrados={autosFiltrados}
        autosVisibles={autosFiltrados.length}
        mostrarMasAutos={() => {}}
      />
    </div>
  );
}
