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
import { useRouter } from 'next/navigation';
import CustomSearchWrapper from "@/app/busqueda/hooks/customSearchHU/CustomSearchWrapper";

// Interfaces para el filtro de marca
interface Marca {
  id: number;
  name: string;
  models: number;
  count: number;
  logo?: string;
}

interface Host {
  id: number;
  name: string;
  trips: number;
  rating?: number;
}

export default function Home() {
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
    cargandoFiltros,
    aplicarFiltroPrecio,
    aplicarFiltroViajes,
    aplicarFiltroCalificacion,
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
  
  // Estados para los nuevos filtros
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<Marca | null>(null);
  const [mostrarTodos, setMostrarTodos] = useState(true);

  // Handlers para los filtros
  const handlePrecioFilter = (min: number, max: number) => {
    aplicarFiltroPrecio(min, max);
    console.log('Filtro por precio:', { min, max });
  };
  
  const handleCalifFilter = (calificacion: number) => {
    aplicarFiltroCalificacion(calificacion);
    console.log('Filtro por calificación:', calificacion);
  };
  
  const handleViajesFilter = (minViajes: number) => {
    aplicarFiltroViajes(minViajes);
    console.log('Filtro por viajes:', minViajes);
  };
  
  const handleAirportFilter = () => {
    router.push('/filtrarAeropuerto');
  };
  
  const toggleGPSFilter = () => {
    if (gpsActive) setPunto({ lon: 0, alt: 0 });
    setGpsActive((prev) => !prev);
  };

  // Handler para el filtro de marca - conecta con la lógica existente
  const handleMarcaFilter = (marca: Marca | null) => {
    setMarcaSeleccionada(marca);
    setMostrarTodos(false);
    
    if (marca) {
      // Usar la función filtrarAutos existente con el nombre de la marca
      setBusqueda(marca.name);
      filtrarAutos(marca.name, fechaInicio, fechaFin);
    } else {
      // Limpiar filtro de marca
      setBusqueda("");
      filtrarAutos("", fechaInicio, fechaFin);
    }
  };

  // Handler para mostrar todos los resultados
  const handleMostrarTodos = () => {
    setMostrarTodos(true);
    setMarcaSeleccionada(null);
    setBusqueda("");
    filtrarAutos("", fechaInicio, fechaFin);
  };

  // Handler para el filtro de host (placeholder)
  const handleHostFilter = (host: Host | null) => {
    console.log('Filtro por host:', host);
    // Aquí puedes implementar la lógica de filtrado por host
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
      {/* Sidebar de filtros */}
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
                setMarcaSeleccionada(null); // Limpiar marca seleccionada si se busca manualmente
                setMostrarTodos(false);
                // Se borró la llamada automática para que no se vuelva a buscar en todos los carros
              }}
              onClearBusqueda={() => {
                setBusqueda("");
                setMarcaSeleccionada(null);
                setMostrarTodos(true);
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
            onAirportFilter={handleAirportFilter}
            gpsActive={gpsActive}
            onGpsToggle={toggleGPSFilter}
            radio={radio}
            setRadio={setRadio}
            onPrecioFilter={handlePrecioFilter}
            onCalifFilter={handleCalifFilter}
            onViajesFilter={handleViajesFilter}
            onHostFilter={handleHostFilter}
            onMarcaFilter={handleMarcaFilter}
            onMostrarTodos={handleMostrarTodos}
            isAllActive={mostrarTodos}
            autoScrollDelay={4000}
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
                autosMostrados={autosFiltrados}
                ordenSeleccionado={ordenSeleccionado}
                setOrdenSeleccionado={setOrdenSeleccionado}
                setAutosFiltrados={setAutosFiltrados}
              />

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
          <div className="sticky top-[200px] h-[calc(100vh-200px)] bg-gray-100 rounded shadow-inner">
            <ViewMap
              posix={[-17.39438, -66.16018]}
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
          posix={[-17.39438, -66.16018]}
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