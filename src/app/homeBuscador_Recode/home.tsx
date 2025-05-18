'use client';
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAutos } from '@/hooks/useAutos_hook_Recode';
import SearchBar from '@/components/recodeComponentes/seccionOrdenarMasResultados/RecodeSearchBar';
import HeaderBusquedaRecode from '@/components/recodeComponentes/seccionOrdenarMasResultados/HeaderBusquedaRecode';
import ResultadosAutos from '@/components/recodeComponentes/seccionOrdenarMasResultados/ResultadosAutos_Recode';
import Header from '@/components/ui/Header';

import DateRangeFilter from '@/components/filtrofechas_7-bits/DateRangeFilter'
import dynamic from "next/dynamic";
import Radio from "@/components/map/Radio";
import MapViwMobile from "@/components/map/MapViewMobile";
import { Map } from "lucide-react";

export default function Home() {
  const [radio, setradio] = useState(1)
  const [punto, setpunto] = useState({ lon: 0, alt: 0 })
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
  } = useAutos(8, radio, punto);

  const [busqueda, setBusqueda] = useState("");

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [gpsFilterActive, setGpsFilterActive] = useState(false);
  const toggleGPSFilter = () => {
    if (gpsFilterActive) {
      setpunto({ lon: 0, alt: 0 })
    }
    setGpsFilterActive(!gpsFilterActive);
    console.log(`Filtro GPS ${!gpsFilterActive ? 'activado' : 'desactivado'}`);
  };

  const ViewMap = useMemo(() => dynamic(
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
      <div className="flex flex-col lg:flex-row">
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">

          <section className="mb-8 grid grid-cols-1 justify-items-center gap-2 items-center text-center md:grid-cols-[3fr_1fr]">
            <SearchBar
              placeholder="Buscar por modelo, marca"
              onFiltrar={(query) => {
                setBusqueda(query);
                filtrarAutos(query, fechaInicio, fechaFin);
              }}
              obtenerSugerencia={obtenerSugerencia}
            />
            <button
              onClick={toggleGPSFilter}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium shadow-md border ${gpsFilterActive ? 'bg-black text-white' : 'bg-white text-black border-black'} transition-colors duration-300`}
            >
              <Map size={20} />
              <span className="font-bold">GPS: {gpsFilterActive ? 'ON' : 'OFF'}</span>
            </button>
          </section>

          <div className="grid grid-cols-1 justify-items-center md:items-start md:grid-cols-[1fr_1fr_1fr] gap-2 mb-4 w-full">
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
              autosActuales={autosActuales}
              autosTotales={autosFiltrados}
            />

            <Link href="/filtrarAeropuerto"
              className="text-black text-center font-semibold bg-white hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 rounded-md text-md px-4 py-2 me-2 mb-2 border border-gray-300"
            >
              Filtrar por Aeropuerto
            </Link>
            <Radio
              radio={radio}
              setRadio={setradio}
              punto={punto}
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
            <ViewMap
              posix={[-17.39438, -66.16018]}
              autos={autosFiltrados}
              radio={radio}
              punto={punto}
              setpunto={setpunto}
              estaActivoGPS={gpsFilterActive}
            />
          </div>
        </div>
      </div>

      <MapViwMobile
      >
        <ViewMap
          posix={[-17.39438, -66.16018]}
          autos={autosFiltrados}
          radio={radio}
          punto={punto}
          setpunto={setpunto}
          estaActivoGPS={gpsFilterActive}
        />
      </MapViwMobile>
    </div>
  );
}

