import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CarouselItem } from '@/components/ui/carousel'
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ChevronRight } from "lucide-react"

function CarsCarouselItem({ car }: { car: { name: string; image: string; rented: number; price: number} }) {
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }
  return (
    <CarouselItem className="pl-5 md:basis-1/3 basis-full">
      <Card className="relative rounded-3x shadow-xl overflow-hidden transition-shadow duration-300 hover:shadow-2xl p-0 gap-0">
        <div className="absolute top-4 left-4 flex flex-col items-start z-10">
          <span className="bg-black text-white px-3 py-1 text-xs font-semibold rounded-full shadow">
            ${car.price}
          </span>
        </div>

        <div className="h-55 md:h-40 overflow-hidden bg-gray-200 rounded-3x">
          <img src={car.image} alt={car.name} className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-105" />
        </div>

        <CardContent className="p-4 bg-white">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 uppercase">{car.name}</h3>

          <div className="flex items-center">
            <span className="text-sm text-gray-500">Alquilado:</span>
            <span className="ml-2 bg-blue-200 text-blue-700 text-xs font-semibold rounded-full px-3 py-1">
              {car.rented} veces
            </span>
          </div>
          <Button
              variant="outline"
              size="sm"
              onClick={handleClick}
              disabled={loading}
              className="flex justify-end"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Reservar"
              )}
          </Button>
        </CardContent>
      </Card>
    </CarouselItem>
  )
}

export default CarsCarouselItem
