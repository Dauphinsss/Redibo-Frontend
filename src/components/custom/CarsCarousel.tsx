"use client"
import React, { useEffect, useState } from 'react'
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import CarsCarouselItem from "@/components/custom/CarsCarouselItem"

function CarsCarousel() {
  const [content, setcontent] = useState([])
  useEffect(() => {
    const fetchData = () => {
      fetch('http://localhost:4000/api/cars/most-rented') 
      .then(response => response.json())
      .then(data => setcontent(data))
      .catch(error => console.error('Error al obtener usuarios:', error));
    };
    fetchData();
    const interval = setInterval(fetchData, 7000);
    return () => clearInterval(interval);
  }, [])

  const plugin = React.useRef(Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true }))
  
  return (
    <div className="flex flex-col items-center justify-center from-muted/40">
      <div className="w-[100%] max-w-sm md:w-[70%] md:max-w-3xl">
        {content.length === 0 ? (
          <p className="text-center text-xl font-semibold text-muted-foreground">
            No hay autos disponibles por el momento
          </p>
        ) : (
          <Carousel opts={{loop: true}} plugins={[plugin.current]}>
            <CarouselContent>
              {content.map((car, idx) => (
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