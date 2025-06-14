import React from 'react'
import { CarouselItem } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Car } from '@/app/home/types/apitypes';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type CarrucelItemProps = {
  car: Car
}

function CarrucelItem({ car }: CarrucelItemProps) {
  const router = useRouter();

  return (
    <CarouselItem className="pl-1 sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4">
      <div className="p-1 ">
        <Card className='p-0 rounded-t-2xl bg-black border-0'>
          <CardContent className="flex flex-col items-center justify-items-start p-0 text-white">
            <div className="relative w-full h-40">
              {
                car.imagenes ? (
                  <Image
                    src={car.imagenes}
                    alt={`${car.marca} ${car.modelo}`}
                    fill
                    className="object-cover rounded-t-2xl"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-t-2xl">
                    <span className="text-md font-medium bg-gray-700 text-white py-2 px-4 rounded">Sin imagen</span>
                  </div>
                )
              }
            </div>
            <div className='w-full flex justify-between items-center'>
              <span className='text-2xl font-bold px-2'>{car.marca}</span>
              <span className='text-ms font-bold opacity-60 px-2'>{car.modelo} {car.anio}</span>
            </div>
            <span className='font-bold'> <span className='text-sm opacity-60'>Alquilado:</span> {car.veces_alquilado}</span>
            <div className='w-15 py-1 px-3 font-bold bg-white text-black rounded-md flex gap-0.5 justify-items-center items-center m-1'>
              <span className='text-[11px] opacity-80 text-center'>Bs</span>
              <span className=' text-center'>{car.precio_por_dia}</span>
            </div>
            <button
              className='text-black bg-white px-9 py-1 rounded-sm m-2 font-bold cursor-pointer'
              onClick={() => router.push(`/reserva/page/infoAuto_Recode/${car.id}`)}
            >
              Reservar
            </button>
          </CardContent>
        </Card>
      </div>
    </CarouselItem>
  )
}

export default CarrucelItem