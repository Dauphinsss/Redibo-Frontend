'use client';

import { useMemo, useState } from "react";
import { X, Map } from "lucide-react";
import { useAutos } from '@/app/busqueda/hooks/useAutos_hook_Recode';
import SearchBar from '@/app/busqueda/components/seccionOrdenarMasResultados/RecodeSearchBar';
import HeaderBusquedaRecode from '@/app/busqueda/components/seccionOrdenarMasResultados/HeaderBusquedaRecode';
import ResultadosAutos from '@/app/busqueda/components/seccionOrdenarMasResultados/ResultadosAutos_Recode';
import Header from '@/components/ui/Header';
import dynamic from "next/dynamic";

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

  const [showMap, setShowMap] = useState(false);

  const ViewMap = useMemo(() => dynamic(
    () => import('@/app/busqueda/components/map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false,
    }
  ), []);

  return (
    <div className="relative">

      <div className="sticky top-0 z-50 bg-white shadow overflow-visible">
        <div className="border-b px-4 sm:px-6 lg:px-8 py-7">
          <Header />
        </div>
        <div className="border-t px-4 sm:px-6 lg:px-8 py-3 flex justify-center">
          <div className="w-full max-w-2xl">
            <SearchBar
              placeholder="Buscar por modelo, marca"
              onFiltrar={filtrarAutos}
              obtenerSugerencia={obtenerSugerencia}
            />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
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

          <div className="hidden lg:block lg:w-1/3">
            <div className="sticky top-20 h-[690px] bg-gray-100 rounded shadow-inner">
              <ViewMap posix={[4.79029, -75.69003]} />
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 right-6 z-50  lg:hidden">
        <button
          onClick={() => setShowMap(true)}
          className="bg-black  text-white p-3 rounded-full shadow-lg mb-6"
        >
          <Map size={24} />
        </button>
      </div>

      {showMap && (
        <div className="fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center lg:hidden">
          <div className="relative w-full h-full bg-white rounded-t-xl overflow-hidden">

            <div className="w-full flex justify-center pt-8 pb-2">
              <button
                className="absolute top-0.5 right-4 p-2 bg-white rounded-full shadow-md z-50"
                onClick={() => setShowMap(false)}
              >
                <X size={20} className="text-black" />
              </button>
            </div>

            <div className="hidden lg:flex lg:w-1/3">
              <div className="w-full h-[calc(100vh-6rem)] sticky top-[6rem] bg-gray-100 rounded shadow-inner">
                <ViewMap posix={[4.79029, -75.69003]} />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
