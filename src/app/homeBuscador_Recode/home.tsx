'use client';

import { useAutos } from '@/hooks/useAutos_hook_Recode';
import SearchBar from '@/components/recodeComponentes/seccionOrdenarMasResultados/RecodeSearchBar';
import HeaderBusquedaRecode from '@/components/recodeComponentes/seccionOrdenarMasResultados/HeaderBusquedaRecode';
import ResultadosAutos from '@/components/recodeComponentes/seccionOrdenarMasResultados/ResultadosAutos_Recode';
import Header from '@/components/ui/Header';

import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function Home() {
  const {
    autos,
    autosFiltrados,
    autosActuales,
    autosVisibles,
    ordenSeleccionado,
    setOrdenSeleccionado,
    setAutosFiltrados,
    mostrarMasAutos,
    cargando,
    filtrarAutos,
    obtenerSugerencia,
  } = useAutos(8);

  const Map = useMemo(() => dynamic(
    () => import('@/components/map/'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false,
    }
  ), []);

  return (
    <div className="relative">

      <div className="sticky top-0 z-50 bg-white shadow">
        <Header />
      </div>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Buscador */}
        <section className="mb-8 flex flex-col items-center text-center">
          <SearchBar
            placeholder="Buscar por modelo, marca"
            onFiltrar={filtrarAutos}
            obtenerSugerencia={obtenerSugerencia}
          />
          {/* <div className="mt-6">RecodeCarousel aquí (opcional)</div> */}
        </section>

        {/* Contenido principal */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna izquierda: lista */}
          <div className="flex-1 max-w-full">
            <div className="w-full max-w-4xl mx-auto">
              <HeaderBusquedaRecode
                autosTotales={autos}
                autosFiltrados={autosFiltrados}
                autosMostrados={autosActuales}
                ordenSeleccionado={ordenSeleccionado}
                setOrdenSeleccionado={setOrdenSeleccionado}
                setAutosFiltrados={setAutosFiltrados}
              />

              <ResultadosAutos
                cargando={cargando}
                autosActuales={autosActuales}
                autosFiltrados={autosFiltrados}
                autosVisibles={autosVisibles}
                mostrarMasAutos={mostrarMasAutos}
              />
            </div>
          </div>

          {/* Columna derecha: mapa (solo en desktop) */}
          <div className="hidden lg:flex lg:w-1/3 h-[700px] bg-gray-100 rounded shadow-inner items-center justify-center text-gray-500">
            <Map posix={[4.79029, -75.69003]} />
          </div>
        </div>
      </main>
    </div>
  );
}
