import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CarouselItem } from '@/components/ui/carousel'
import ReservationConfirmedMessage from './ReservationConfirmation/ReservationConfirmedMessage'

function CarsCarouselItem({ car }: { car: { marca: string; modelo: string; anio: string ; precio_por_dia: number ; imagenes: string; veces_alquilado: number} }) {

  return (
    <CarouselItem className="pl-5 md:basis-1/3 basis-full">
      <Card className="relative rounded-3x shadow-xl overflow-hidden transition-shadow duration-300 hover:shadow-2xl p-0 gap-0">
        <div className="absolute top-4 left-4 flex flex-col items-start z-10">
          <span className="bg-black text-white px-3 py-1 text-xs font-semibold rounded-full shadow">
            ${car.precio_por_dia}
          </span>
        </div>

        <div className="h-55 md:h-40 overflow-hidden bg-gray-200 rounded-3x">
          <img src={car.imagenes} alt={car.modelo} className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-105" />
        </div>

        <CardContent className="p-4 bg-white">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 uppercase">{car.modelo}</h3>
          <h3 className="text-lg font-semibold text-gray-800 mb-1 uppercase">{car.marca}</h3>
          <h3 className="text-lg font-semibold text-gray-800 mb-1 uppercase">{car.anio}</h3>

          <div className="flex items-center">
            <span className="text-sm text-gray-500">Alquilado:</span>
            <span className="ml-2 bg-blue-200 text-blue-700 text-xs font-semibold rounded-full px-3 py-1">
              {car.veces_alquilado} veces
            </span>
          </div>
          {/*<ReservationConfirmedMessage />*/}
        </CardContent>
      </Card>
    </CarouselItem>
  )
}

export default CarsCarouselItem
