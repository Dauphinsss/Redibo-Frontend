'use client';

import { useMemo, useState } from "react";
import { X, Map } from "lucide-react";
import { useAutos } from '@/hooks/useAutos_hook_Recode';
import SearchBar from '@/components/recodeComponentes/seccionOrdenarMasResultados/RecodeSearchBar';
import HeaderBusquedaRecode from '@/components/recodeComponentes/seccionOrdenarMasResultados/HeaderBusquedaRecode';
import ResultadosAutos from '@/components/recodeComponentes/seccionOrdenarMasResultados/ResultadosAutos_Recode';
import Header from '@/components/ui/Header';
import { useCarsMap } from "@/hooks/useAutosMapa";

import DateRangeFilter from '@/components/filtrofechas_7-bits/DateRangeFilter'
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

  const startDate = '2025-07-17';
  const endDate = '2025-07-27';

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [showMap, setShowMap] = useState(false);

  const ViewMap = useMemo(() => dynamic(
    () => import('@/components/map/'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false,
    }
  ), []);

  const { data: carsMap, isLoading: loadingMap } = useCarsMap(startDate, endDate);

  return (
    <div className="relative">

      <div className="sticky top-0 z-50 bg-white shadow">
        <Header />
      </div>
      <div className="flex flex-col lg:flex-row">
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Buscador */}
          <section className="mb-8 flex flex-col items-center text-center">
            <SearchBar
              placeholder="Buscar por modelo, marca"
              onFiltrar={filtrarAutos}
              obtenerSugerencia={obtenerSugerencia}
            />
            {/* <div className="mt-6">RecodeCarousel aquí (opcional)</div> */}
          </section>

          {/* Filtro de Fechas */}
          <div className="flex flex-col md:flex-row items-center justify-start gap-4 mb-4 w-full">
            <DateRangeFilter
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              setFechaInicio={setFechaInicio}
              setFechaFin={setFechaFin}
            />
          </div>

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
        </main>

        <div className="hidden lg:block lg:w-[40%]">
          <div className="sticky top-[64px] h-[calc(100vh-64px)] bg-gray-100 rounded shadow-inner">
            {!loadingMap &&
              <ViewMap posix={[-17.39438, -66.16018]} autos={carsMap} />
            }
          </div>
        </div>
      </div>

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

            <div className="w-full h-full">
              {!loadingMap &&
                <ViewMap posix={[-17.39438, -66.16018]} autos={carsMap} />
              }
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
