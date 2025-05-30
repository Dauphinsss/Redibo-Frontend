'use client';

import { useMemo, useState } from "react";
import { useAutos } from '@/app/busqueda/hooks/useAutos_hook_Recode';
import SearchBar from '@/app/busqueda/components/seccionOrdenarMasResultados/RecodeSearchBar';
import HeaderBusquedaRecode from '@/app/busqueda/components/seccionOrdenarMasResultados/HeaderBusquedaRecode';
import ResultadosAutos from '@/app/busqueda/components/seccionOrdenarMasResultados/ResultadosAutos_Recode';
import Header from '@/components/ui/Header';
import SidebarFiltros from '@/app/busqueda/components/filtros/SidebarFiltros';
import { SlidersHorizontal } from 'lucide-react';
import dynamic from "next/dynamic";
import MapViwMobile from "@/app/busqueda/components/map/MapViewMobile";
import { InfiniteFilterCarousel } from "@/app/busqueda/components/fitroCarusel/infinite-filter-carousel";
import { CIUDADES_BOLIVIA } from "./constants";
import { useRouter } from 'next/navigation';
import CustomSearchWrapper from "@/app/busqueda/hooks/customSearchHU/CustomSearchWrapper";

type Props = {
  ciudad?: string;
};

export default function Home({ ciudad }: Props) {
  const router = useRouter();
  const [radio, setRadio] = useState(1);
  const [punto, setPunto] = useState({ lon: 0, alt: 0 });

  const [mostrarSidebar, setMostrarSidebar] = useState(false);

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
    //cargandoFiltros,
    //aplicarFiltroPrecio,
    //aplicarFiltroViajes,
    //aplicarFiltroCalificacion,
    filtrosCombustible,
    setFiltrosCombustible,
    filtrosCaracteristicas,
    setFiltrosCaracteristicas,
    filtrosTransmision,
    setFiltrosTransmision,
    setFiltrosCaracteristicasAdicionales,
    filtrosCaracteristicasAdicionales,
  } = useAutos(8, radio, punto);

  const [busqueda, setBusqueda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [gpsActive, setGpsActive] = useState(false);

  // Handlers para los filtros
  const handlePrecioFilter = (min: number, max: number) => {
    // Aquí deberías filtrar los autos por precio
    // filtrarAutos(busqueda, fechaInicio, fechaFin, ...otrosFiltros, min, max)
    console.log('Filtro por precio:', { min, max });
  };
  const handleCalifFilter = (calificacion: number) => {
    // Aquí deberías filtrar los autos por calificación
    console.log('Filtro por calificación:', calificacion);
  };
  const handleViajesFilter = (minViajes: number) => {
    // Aquí deberías filtrar los autos por viajes
    console.log('Filtro por viajes:', minViajes);
  };
  const handleAirportFilter = () => {
    router.push('/filtrarAeropuerto');
  };
  const toggleGPSFilter = () => {
    if (gpsActive) setPunto({ lon: 0, alt: 0 });
    setGpsActive((prev) => !prev);
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
        filtrosTransmision={filtrosTransmision}
        setFiltrosCaracteristicasAdicionales={setFiltrosCaracteristicasAdicionales}
        filtrosCaracteristicasAdicionales={filtrosCaracteristicasAdicionales}
      />

      <div className="sticky top-0 z-50 bg-white shadow overflow-visible">
        <div className="border-b">
          <Header />
        </div>
        <div className="border-t px-4 sm:px-6 lg:px-8 py-3 flex justify-center items-center gap-4">
          {/* Botón de filtros alineado en el header */}
          <button
            onClick={() => setMostrarSidebar(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black border border-gray-300 rounded-md font-semibold hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 transition"
          >
            <SlidersHorizontal size={20} />
            Filtros
          </button>
          <div className="w-full max-w-2xl">
            <SearchBar
              placeholder="Buscar por modelo, marca"
              onFiltrar={(query) => {
                setBusqueda(query);
                //Se borro para que no se vuelva a buscar en todos los carros
                //filtrarAutos(query, fechaInicio, fechaFin);
              }}
              //NUEVO
              onClearBusqueda={() => {
                setBusqueda(""); // 🔁 borra el texto y reactiva el autosFiltrados base
              }}

              obtenerSugerencia={obtenerSugerencia}
            />
          </div>
        </div>

        {/* Carrusel de filtros */}
        <div className="px-4 sm:px-6 lg:px-8 py-3 border-t bg-gray-50">
          <InfiniteFilterCarousel
            searchTerm={busqueda}
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
            setFechaInicio={setFechaInicio}
            setFechaFin={setFechaFin}
            autosActuales={autosActuales}
            autosTotales={autosFiltrados}
            //onAirportFilter={handleAirportFilter}
            setAutosFiltrados={setAutosFiltrados}
            autos={autos}

            gpsActive={gpsActive}
            onGpsToggle={toggleGPSFilter}
            radio={radio}
            setRadio={setRadio}
            onPrecioFilter={handlePrecioFilter}
            onCalifFilter={handleCalifFilter}
            onViajesFilter={handleViajesFilter}
            onHostFilter={() => { }}
            onMarcaFilter={() => { }}
            autoScrollDelay={4000}
            onMostrarTodos={() => {
              console.log("Mostrar todos los resultados");
            }}
          />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col lg:flex-row">
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-full pt-6 gap-8">
            <div className="w-full max-w-4xl mx-auto">
              <HeaderBusquedaRecode
                autosTotales={autos}
                autosFiltrados={autosFiltrados}
                //autosMostrados={autosActuales}
                autosMostrados={autosFiltrados}
                ordenSeleccionado={ordenSeleccionado}
                setOrdenSeleccionado={setOrdenSeleccionado}
                setAutosFiltrados={setAutosFiltrados}
              />

              {/* <ResultadosAutos
                cargando={cargando}
                autosActuales={autosActuales}
                autosFiltrados={autosFiltrados}
                autosVisibles={autosVisibles}
                mostrarMasAutos={mostrarMasAutos}
              /> */}
              <CustomSearchWrapper
                autosFiltrados={autosFiltrados}
                autosVisibles={autosVisibles}
                mostrarMasAutos={mostrarMasAutos}
                busqueda={busqueda}
                cargando={cargando}
              />
            </div>
          </div>
        </main>
        {/* Mapa en desktop */}
        <div className="hidden lg:block w-[40%]">
          <div className="sticky top-[204px] h-[calc(100vh-204px)] bg-gray-100 rounded shadow-inner">
            <ViewMap
              posix={(ciudad)? CIUDADES_BOLIVIA[ciudad as keyof typeof CIUDADES_BOLIVIA] : CIUDADES_BOLIVIA['Cochabamba']}
              autos={autosFiltrados}
              radio={radio}
              punto={punto}
              setpunto={setPunto}
              estaActivoGPS={gpsActive}
            />
          </div>
        </div>
      </div>
      {/* Mapa en mobile */}
      <MapViwMobile>
        <ViewMap
          posix={(ciudad)? CIUDADES_BOLIVIA[ciudad as keyof typeof CIUDADES_BOLIVIA] : CIUDADES_BOLIVIA['Cochabamba']}
          autos={autosFiltrados}
          radio={radio}
          punto={punto}
          setpunto={setPunto}
          estaActivoGPS={gpsActive}
        />
      </MapViwMobile>
    </div>
  );
}