'use client';

import { useMemo, useState } from "react";
import { X, Map } from "lucide-react";
import { useAutos } from '@/hooks/useAutos_hook_Recode';
import SearchBar from '@/components/recodeComponentes/seccionOrdenarMasResultados/RecodeSearchBar';
import HeaderBusquedaRecode from '@/components/recodeComponentes/seccionOrdenarMasResultados/HeaderBusquedaRecode';
import ResultadosAutos from '@/components/recodeComponentes/seccionOrdenarMasResultados/ResultadosAutos_Recode';
import Header from '@/components/ui/Header';
import SidebarFiltros from '@/components/filtros/SidebarFiltros';
import dynamic from "next/dynamic";
import { ButtonPrecio } from '@/components/filtros/buttonPrecio';
import { ButtonCalif } from '@/components/filtros/buttonCalif';
import { ButtonViajes } from '@/components/filtros/buttonViajes';
import { SlidersHorizontal } from 'lucide-react';// Icono de filtro

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
    filtrosCombustible,
    setFiltrosCombustible,
    filtrosCaracteristicas,
    setFiltrosCaracteristicas, // Asegúrate de exponer esta función desde useAutos
    filtrosTransmision, 
    setFiltrosTransmision,
    setFiltrosCaracteristicasAdicionales,
    filtrosCaracteristicasAdicionales,
  } = useAutos();

  const [showMap, setShowMap] = useState(false);
  const [mostrarSidebar, setMostrarSidebar] = useState(false);

  const ViewMap = useMemo(() => dynamic(
    () => import('@/components/map/'),
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
        setFiltrosCombustible={setFiltrosCombustible} // Pasar correctamente
        setFiltrosCaracteristicas={setFiltrosCaracteristicas} // Pasar para manejar asientos y puertas
        setFiltrosTransmision={setFiltrosTransmision}
        filtrosTransmision={filtrosTransmision} 
        setFiltrosCaracteristicasAdicionales={setFiltrosCaracteristicasAdicionales}
        filtrosCaracteristicasAdicionales={filtrosCaracteristicasAdicionales}
      />

      {/* Botón abrir sidebar */} 
      <button
        onClick={() => setMostrarSidebar(true)}
        className="fixed top-24 left-4 z-40 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition"
      >      
          <SlidersHorizontal size={24} />          
      </button>


      {/* Contenido principal */}
      <div className="relative z-10">
        <div className="sticky top-0 z-30 bg-white shadow">
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
          </section>

          {/* Contenido principal */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Columna izquierda */}
            <div className="flex-1 max-w-full">
              <div className="w-full max-w-4xl mx-auto">

                {/* Filtros por botones */}
                <div className="mb-6 flex flex-wrap gap-4">
                  <ButtonPrecio onFilterChange={(min, max) => console.log('Filtro precio:', min, max)} />
                  <ButtonCalif onFilterChange={(min) => console.log('Filtro calificación:', min)} />
                  <ButtonViajes onFilterChange={(min) => console.log('Filtro viajes:', min)} />
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
            </div>

            {/* Mapa escritorio */}
            <div className="hidden lg:block lg:w-1/3">
              <div className="sticky top-20 h-[690px] bg-gray-100 rounded shadow-inner">
                <ViewMap posix={[4.79029, -75.69003]} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Botón mapa móvil */}
      <div className="fixed bottom-0 right-6 z-50 lg:hidden">
        <button
          onClick={() => setShowMap(true)}
          className="bg-black text-white p-3 rounded-full shadow-lg mb-6"
        >
          <Map size={24} />
        </button>
      </div>

      {/* Modal de mapa móvil */}
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
              <ViewMap posix={[4.79029, -75.69003]} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
