"use client"
import React, { useEffect, useState } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'
import CarrucelItem from './CarrucelItem'

function Carrucel() {
  const [data, setData] = useState([])
  const fetchData = async ()=>{
    try{
      const response = await fetch('http://localhost:4000/api/cars/most-rented')
      const jsonData = await response.json()
      setData(jsonData)
    }catch(e){
      console.error(e)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  return (
    <Carousel opts={{align: "start",loop:true,}} className="w-full max-w-6xl" 
      plugins={[
        Autoplay({
          delay: 3500,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]} 
    >
      <CarouselContent className="-ml-1">
        {data.map((car,idx) => (
          <CarrucelItem car={car} key={idx} />
        ))}
      </CarouselContent>
      <CarouselPrevious/>
      <CarouselNext/>
    </Carousel>
  )
}

export default Carrucel
