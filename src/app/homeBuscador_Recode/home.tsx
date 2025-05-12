'use client';
import Link from "next/link";
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
  const [busqueda, setBusqueda] = useState("");

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
  const [radio, setradio] = useState(3)
  const increment = () => setradio(prev => prev + 1);
  const decrement = () => setradio(prev => prev - 1);
  const reset = () => setradio(0);
  const [punto, setpunto] = useState({ lon: 0, alt: 0 })


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
              onFiltrar={(query) => {
                setBusqueda(query);
                filtrarAutos(query, fechaInicio, fechaFin);
              }}
              obtenerSugerencia={obtenerSugerencia}
            />
            {/* <div className="mt-6">RecodeCarousel aquí (opcional)</div> */}
          </section>
          <div className="flex gap-2 justify-start mb-2 w-full">

            {/* Filtro de Fechas */}
            <DateRangeFilter
              searchTerm={busqueda}
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              setFechaInicio={(fecha) => {
                setFechaInicio(fecha);
                filtrarAutos(busqueda, fecha, fechaFin);
              }}
              setFechaFin={(fecha) => {
                setFechaFin(fecha);
                filtrarAutos(busqueda, fechaInicio, fecha)
              }}
              onAplicarFiltro={(inicio, fin) => filtrarAutos(busqueda, inicio, fin)}
            />

            <Link href="/filtrarAeropuerto"
              className="text-white text-center font-semibold bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 rounded-lg text-md px-4 py-2 me-2 mb-2"
            >Filtrar por Aeropuerto</Link>
          </div>

          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-black text-white text-center p-2 rounded-md shadow-sm w-fit mx-auto">
              <h2 className="text-sm font-medium mb-2">Radio: {radio}</h2>
              <div className="space-x-1">
                <button
                  onClick={decrement}
                  className="bg-gray-700 hover:bg-gray-600 text-xs px-2 py-1 rounded"
                >
                  -
                </button>
                <button
                  onClick={reset}
                  className="bg-gray-500 hover:bg-gray-400 text-xs px-2 py-1 rounded"
                >
                  Reset
                </button>
                <button
                  onClick={increment}
                  className="bg-gray-700 hover:bg-gray-600 text-xs px-2 py-1 rounded"
                >
                  +
                </button>
              </div>
            </div>

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
              <ViewMap posix={[-17.39438, -66.16018]} autos={carsMap} radio={radio} punto={punto} setpunto={setpunto} />
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
        <div className="fixed inset-0 bg-white bg-opacity-70 z-[9999] flex items-center justify-center lg:hidden">
          <div className="relative w-full h-full bg-white rounded-t-xl overflow-hidden">

            <div className="sticky top-0 left-0 w-full bg-white ">
              <div className="flex justify-end items-center h-10">
                <button
                  className="p-2 bg-white rounded-full shadow-md mx-4"
                  onClick={() => setShowMap(false)}
                >
                  <X size={20} className="text-black" />
                </button>
              </div>
            </div>

            <div className="w-full h-[calc(100%-40px)]">
              {!loadingMap &&
                <ViewMap posix={[-17.39438, -66.16018]} autos={carsMap} radio={radio} punto={punto} setpunto={setpunto} />
              }
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

