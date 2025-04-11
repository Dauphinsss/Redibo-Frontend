"use client"
import React from 'react'
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import CarsCarouselItem from "@/components/custom/CarsCarouselItem"

function CarsCarousel() {
  const plugin = React.useRef(Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true }))
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
    {
      name: "Toyota Corolla",
      image: "https://hips.hearstapps.com/hmg-prod/images/2025-toyota-gr-corolla-114-6716726ea18f7.jpg?crop=0.880xw:0.743xh;0.0849xw,0.207xh&resize=1200:*",
      rented: 200,
      price: 50
    },
    {
      name: "Honda Civic",
      image: "https://upload.wikimedia.org/wikipedia/commons/6/61/2022_Honda_Civic_Sedan_EX_in_Platinum_White_Pearl,_front_left.jpg",
      rented: 150,
      price: 60
    },
    {
      name: "Ford Focus",
      image: "https://media.gettyimages.com/id/458474319/photo/ford-focus.jpg?s=612x612&w=0&k=20&c=TlOCM-3Tin90MhU_ZCzgp10D1uSe3kwQyctBGk50rM8=",
      rented: 120,
      price: 55
    },
  ]
  return (
    <div className="flex flex-col items-center justify-center from-muted/40">
      <div className="w-[100%] max-w-sm md:w-[70%] md:max-w-3xl">
        {cars.length === 0 ? (
          <p className="text-center text-xl font-semibold text-muted-foreground">
            No hay autos disponibles por el momento
          </p>
        ) : (
          <Carousel opts={{loop: true}} plugins={[plugin.current]}>
            <CarouselContent>
              {cars.map((car, idx) => (
                <CarsCarouselItem key={idx} car={car} />
              ))}
            </CarouselContent>
            <div className="hidden md:flex">
              <CarouselPrevious/>
              <CarouselNext/>
            </div>
          </Carousel>
        )}
      </div>
    </div>
  )
}

export default CarsCarousel