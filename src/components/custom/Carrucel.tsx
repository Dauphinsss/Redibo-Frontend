"use client"
import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'
import CarrucelItem from './CarrucelItem'
import { useMostRentedCars } from '@/api/queries/useMostRentedCars'

function Carrucel() {
  const { data: content = [], isLoading, isError } = useMostRentedCars();

  if (isLoading) {
    return <p className="text-center text-xl font-semibold text-muted-foreground"> cargando autos...</p>
  }
  if (isError) {
    return <p className="text-center text-xl text-blue-950">Error al cargar los autos</p>
  }
  if (content.length === 0) {
    return (
      <p className="text-center text-xl font-semibold text-muted-foreground">
        No hay autos disponibles por el momento
      </p>
    )
  }
  return (
    <Carousel opts={{ align: "start", loop: true, }} className="w-full max-w-6xl"
      plugins={[
        Autoplay({
          delay: 3500,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent className="-ml-1">
        {content.map((car, idx) => (
          <CarrucelItem car={car} key={idx} />
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default Carrucel
