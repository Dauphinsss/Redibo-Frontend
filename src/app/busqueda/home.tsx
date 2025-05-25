'use client';

import { useMemo, useState } from "react";
import { Map, SlidersHorizontal } from "lucide-react";
import { useAutos } from '@/app/busqueda/hooks/useAutos_hook_Recode';
import SearchBar from '@/app/busqueda/components/seccionOrdenarMasResultados/RecodeSearchBar';
import HeaderBusquedaRecode from '@/app/busqueda/components/seccionOrdenarMasResultados/HeaderBusquedaRecode';
import ResultadosAutos from '@/app/busqueda/components/seccionOrdenarMasResultados/ResultadosAutos_Recode';
import Header from '@/components/ui/Header';
import SidebarFiltros from '@/app/busqueda/components/filtros/SidebarFiltros';
import dynamic from "next/dynamic";

import DateRangeFilter from "@/app/busqueda/components/filtrofechas_7-bits/DateRangeFilter"
import Radio from "@/app/busqueda/components/map/Radio"
import MapViwMobile from "@/app/busqueda/components/map/MapViewMobile";
import Link from "next/link";

export default function Home() {
  const [radio, setradio] = useState(1)
  const [punto, setpunto] = useState({ lon: 0, alt: 0 })
  
  // Estados para sidebar (agregados del primer código)
  const [mostrarSidebar, setMostrarSidebar] = useState(false);
  const [filtrosCombustible, setFiltrosCombustible] = useState([]);
  const [filtrosCaracteristicas, setFiltrosCaracteristicas] = useState({});
  const [filtrosTransmision, setFiltrosTransmision] = useState([]);
  const [filtrosCaracteristicasAdicionales, setFiltrosCaracteristicasAdicionales] = useState([]);
  
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
  };

  const ViewMap = useMemo(() => dynamic(
    () => import('@/app/busqueda/components/map/'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false,
    }
  ), []);

  return (
    <div className="relative">
      {/* Sidebar de filtros (agregado del primer código) */}
      <SidebarFiltros
        mostrar={mostrarSidebar}
        onCerrar={() => setMostrarSidebar(false)}
        setFiltrosCombustible={setFiltrosCombustible}
        setFiltrosCaracteristicas={setFiltrosCaracteristicas}
        setFiltrosTransmision={setFiltrosTransmision}
        filtrosTransmison={filtrosTransmision}
        setFiltrosCaracteristicasAdicionales={setFiltrosCaracteristicasAdicionales}
        filtrosCaracteristicasAdicionales={filtrosCaracteristicasAdicionales}
      />

      {/* Botón abrir sidebar (agregado del primer código) */}
      <button
        onClick={() => setMostrarSidebar(true)}
        className="fixed top-[100px] left-4 z-[60] bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition"
      >      
        <SlidersHorizontal size={24} />          
      </button>

      <div className="sticky top-0 z-50 bg-white shadow overflow-visible">
        <div className="border-b">
          <Header />
        </div>
        <div className="border-t px-4 sm:px-6 lg:px-8 py-3 flex justify-center">
          <div className="w-full max-w-2xl">
            <SearchBar
              placeholder="Buscar por modelo, marca"
              onFiltrar={(query) => {
                setBusqueda(query);
                filtrarAutos(query, fechaInicio, fechaFin);
              }}
              obtenerSugerencia={obtenerSugerencia}
            />
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col lg:flex-row">
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Columna izquierda: lista */}
          <div className="max-w-full pt-6 gap-8">

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
              <button
                onClick={toggleGPSFilter}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium shadow-md border ${gpsFilterActive ? 'bg-black text-white' : 'bg-white text-black border-black'} transition-colors duration-300`}
              >
                <Map size={20} />
                <span className="font-bold">GPS: {gpsFilterActive ? 'ON' : 'OFF'}</span>
              </button>
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
          </div>
        </main>
        <div className="hidden lg:block w-[40%]">
          <div className="sticky top-[140px] h-[calc(100vh-140px)] bg-gray-100 rounded shadow-inner">
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

      <MapViwMobile>
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