// infinite-filter-carousel.tsx
"use client"

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Map } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import DateRangeFilter from "@/app/busqueda/components/filtrofechas_7-bits/DateRangeFilter";
import AirportsFilter from "../filtroAeropuertos_7-bits/AirportsFilter"
import { ButtonPrecio } from "../filtros/buttonPrecio";
import { ButtonCalif } from "../filtros/buttonCalif";
import { ButtonViajes } from "../filtros/buttonViajes";
import { ButtonHost } from "../filtros/buttonHost";
import { ButtonMarca } from "../filtros/buttonMarca";
import { ButtonTodos } from "../filtros/buttonTodos";
import { AutoCard_Interfaces_Recode as Auto } from '@/app/busqueda/interface/AutoCard_Interface_Recode';
import { ButtonGPS } from "../map/ButtonGPS";

// Interfaces para los nuevos filtros
interface Host {
  id: number;
  name: string;
  trips: number;
  rating?: number;
}

interface Marca {
  id: number;
  name: string;
  models: number;
  count: number;
  logo?: string;
}

// Props extendidas para incluir los nuevos filtros
interface InfiniteFilterCarouselProps {
  searchTerm: string
  fechaInicio: string
  fechaFin: string
  setFechaInicio: (fecha: string) => void
  setFechaFin: (fecha: string) => void
  autosActuales: Auto[]
  autosTotales: Auto[]
  //onAirportFilter: () => void
  autos: Auto[]
  setAutosFiltrados: (autos: Auto[]) => void

  gpsActive: boolean
  onGpsToggle: () => void
  radio: number
  setRadio: (value: number | ((prev: number) => number)) => void
  onPrecioFilter: (min: number, max: number) => void
  onCalifFilter: (calificacion: number) => void
  onViajesFilter: (minViajes: number) => void
  onHostFilter: (host: Host | null) => void
  onMarcaFilter: (marca: Marca | null) => void
  onMostrarTodos?: () => void // Función para mostrar todos los resultados
  isAllActive?: boolean // Indica si el filtro "Todos" está activo
  disabledPrecio?: boolean
  disabledCalif?: boolean
  disabledViajes?: boolean
  disabledHost?: boolean
  disabledMarca?: boolean
  disabledTodos?: boolean
  autoScrollDelay?: number
  className?: string
  // Nueva prop para pasar todos los autos disponibles para extraer marcas
  autosOriginales?: Auto[]
}

/**
 * @description Un carrusel de filtros infinito y personalizable con autoplay.
 * Ahora incluye filtros por Host, Marca y botón "Todos" para limpiar filtros.
 */
export function InfiniteFilterCarousel({
  searchTerm,
  fechaInicio,
  fechaFin,
  setFechaInicio,
  setFechaFin,
  autosActuales,
  autosTotales,
  //onAirportFilter,
  autos,
  setAutosFiltrados,  
  gpsActive,
  onGpsToggle,
  radio,
  setRadio,
  onPrecioFilter,
  onCalifFilter,
  onViajesFilter,
  onHostFilter,
  onMarcaFilter,
  onMostrarTodos,
  isAllActive = false,
  disabledPrecio,
  disabledCalif,
  disabledViajes,
  disabledHost,
  disabledMarca,
  disabledTodos = false,
  autoScrollDelay = 3000,
  className = "",
  autosOriginales = [],
}: InfiniteFilterCarouselProps) {

  const autoplayPlugin = React.useRef(
    Autoplay({ delay: autoScrollDelay, stopOnInteraction: true })
  )

  // Array de configuración para los filtros
  const filterItems = [
    ...(onMostrarTodos ? [{
      id: 'todos',
      component: (
        <ButtonTodos
          onMostrarTodos={onMostrarTodos}
          disabled={disabledTodos}
          isActive={isAllActive}
        />
      ),
    }] : []),
    {
      id: 'dateRange',
      component: (
        <DateRangeFilter
          searchTerm={searchTerm}
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          setFechaInicio={setFechaInicio}
          setFechaFin={setFechaFin}
          autosActuales={autosActuales}
          autosTotales={autosTotales}
          onAplicarFiltro={(inicio, fin) => {
            setFechaInicio(inicio);
            setFechaFin(fin);
          }}
        />
      )
    },
    {
      id: 'host',
      component: (
        <ButtonHost
          onFilterChange={onHostFilter}
          disabled={disabledHost}
          autos={autosOriginales.length > 0 ? autosOriginales : autosTotales}  //nuevo que añadi
        />
      ),
    },
    {
      id: 'marca',
      component: (
        <ButtonMarca
          onFilterChange={onMarcaFilter}
          disabled={disabledMarca}
          autos={autosOriginales.length > 0 ? autosOriginales : autosTotales}
        />
      ),
    },
    {
      id: 'precio',
      component: <ButtonPrecio onFilterChange={onPrecioFilter} disabled={disabledPrecio} />,
    },
    {
      id: 'calificacion',
      component: <ButtonCalif onFilterChange={onCalifFilter} disabled={disabledCalif} />,
    },
    {
      id: 'viajes',
      component: <ButtonViajes onFilterChange={onViajesFilter} disabled={disabledViajes} />,
    },
    {
      id: 'aeropuerto',
      component: (
        <AirportsFilter                    
          autos={autos}
          setAutosFiltrados={setAutosFiltrados}          
        />
      ),
      expandable: true,
    },
    {
      id: 'gps',
      component: (
        <ButtonGPS
          gpsActive={gpsActive}
          onGpsToggle={onGpsToggle}
          radio={radio}
          setRadio={setRadio}
        />
      ),
    },
  ]

  return (
    <div className={`w-full ${className}`}>
      <Carousel
        plugins={[autoplayPlugin.current]}
        className="w-full"
        opts={{
          align: 'start',
          loop: false,
          dragFree: true,
          containScroll: 'trimSnaps'
        }}
        onMouseEnter={autoplayPlugin.current.stop}
        onMouseLeave={() => autoplayPlugin.current.play()}
      >
        <CarouselContent className="-ml-2 md:-ml-4 overflow-visible">
          {filterItems.map((filter) => (
            <CarouselItem
              key={filter.id}
              className="pl-2 md:pl-4 basis-auto"
            >
              <div>
                {filter.component}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex absolute -left-7" />
        <CarouselNext className="hidden md:flex absolute -right-6" />
      </Carousel>
    </div>
  )
}