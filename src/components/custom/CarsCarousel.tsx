"use client"
import React, { useEffect } from 'react'
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import CarsCarouselItem from "@/components/custom/CarsCarouselItem"

function CarsCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const plugin = React.useRef(
    Autoplay({ delay: 2500, stopOnInteraction: true, stopOnMouseEnter: true })
  )
  const cars = [
    {
      name: "Audi A4",
      image: "https://pictures.dealer.com/a/audinorthhoustonaoa/1937/994b6925b0a1cda8fe6430d6536cb395x.jpg",
      rented: 127,
      price: 65
    },
    {
      name: "BMW Serie 3",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a3/BMW_E21_front_20080331.jpg",
      rented: 98,
      price: 75
    },
    {
      name: "Mercedes Clase C",
      image: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Mercedes-AMG_C_43_(W206)_IMG_0249.jpg",
      rented: 145,
      price: 80
    },
    {
      name: "Volkswagen Golf",
      image: "https://media.gettyimages.com/id/1405478733/photo/volkswagen-golf-gti-mk-8.jpg?s=612x612&w=0&k=20&c=zbutJsB5SFxXcyJyM0kMY0qDa_pB5l0V3bRI649IDZ8=",
      rented: 176,
      price: 55
    },
  ]

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className="flex flex-col items-center justify-center from-muted/40">
      <div className="w-[100%] max-w-sm md:w-[70%] md:max-w-3xl">
        {cars.length === 0 ? (
          <p className="text-center text-xl font-semibold text-muted-foreground">
            No hay autos disponibles por el momento
          </p>
        ) : (
          <Carousel opts={{ loop: true }} setApi={setApi} plugins={[plugin.current]}>
            <CarouselContent>
              {cars.map((car, idx) => (
                <CarsCarouselItem key={idx} car={car} />
              ))}
            </CarouselContent>
            <div className="hidden md:flex">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        )}
      </div>
    </div>
  )
}

export default CarsCarousel