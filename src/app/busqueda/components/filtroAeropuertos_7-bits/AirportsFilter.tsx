"use client"
import React, { ChangeEvent } from 'react';
import { useState } from 'react';
import haversine from 'haversine-distance'
import { AutoCard_Interfaces_Recode as Auto } from '@/app/busqueda/interface/AutoCard_Interface_Recode';
import { useAirports } from '@/app/busqueda/hooks/useAirports'
import { Button } from "@/components/ui/button"
import { useMapStore } from "@/app/busqueda/store/mapStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Airports } from "../../constants";

interface Props {            
    autos: Auto[];
    setAutosFiltrados: (autos: Auto[]) => void;    
}

const AirportsFilter: React.FC<Props> = ({            
    autos,
    setAutosFiltrados,    
}) => {

  const cities = [
    "Cochabamba",
    "Beni",
    "Chuquisaca",
    "La Paz",
    "Oruro",
    "Pando",
    "Potosí",
    "Santa Cruz",
    "Tarija"
  ]

  const radius = [5, 10, 15, 20]
  //const { data: content = [] } = useAirports();
  const content = Airports;
  const [selectedAirport, setSelectedAirport] = useState('');
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [selectedLatitude, setSelectedLatitude] = useState(0);
  const [selectedLongitude, setSelectedLongitude] = useState(0);
  const [selectedRadius, setSelectedRadius] = useState(5);
  const [showMessage, setShowMessage] = useState(false);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);

  const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value)
    setSelectedAirport('');
    setSelectedLatitude(0);
    setSelectedLongitude(0);
  }

  const cars = [...autos]

  const handleClick = () => {      
    if (selectedAirport != '') {
      setShowMessage(false);
      setOpen(false)
      const index = parseInt(selectedAirport);
      const latitude = content[index].latitud      
      setSelectedLatitude(latitude)
      const longitude = content[index].longitud
      setSelectedLongitude(longitude)
      setSelectedPoint({ lat: latitude, lon: longitude})
      setActive(true)
      const filteredCars = cars.filter((item) => {
        const distance =  calcularDistancia(latitude, longitude, item.latitud, item.longitud);
        if(distance <= selectedRadius){           
          return item
        }
      })      

      setAutosFiltrados(filteredCars);            
    }
    else{
      setShowMessage(true);
    }
  }

  const handleRemove = () => {
    setSelectedAirport('');
    setShowMessage(false);
    setAutosFiltrados(cars);
    setOpen(false)
    setActive(false)
    setSelectedPoint({ lat: -17.39449, lon: -66.16003})
  }  

  function calcularDistancia(latAeropuerto: number, lonAeropuerto: number, latAuto: number, lonAuto: number) {
    const a = { lat: latAeropuerto, lng: lonAeropuerto }
    const b = { lat: latAuto, lon: lonAuto }
    const distanceM = haversine(a,b)
    const distanceKm = Math.round(((distanceM/1000) + Number.EPSILON) * 100) / 100;
    return distanceKm;      
  } 
  
  const setSelectedPoint = useMapStore((state) => state.setSelectedPoint);
    
  return (    
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={active ? "default" : "outline"}
          className={`w-[200px] justify-between ${open ? "ring-2 ring-gray-300" : ""}`}          
        >
          Filtro por Aeropuertos
          <span className="ml-2">↓</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-90">        
        <div className="flex flex-col items-center gap-2">
          <div className='w-full'>
            <label>Ciudad</label>
            <select id="ciudades" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
              value={selectedCity} onChange={(e) => handleCityChange(e)}>              
              {cities.map((city, i) => (
                <option key={i} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className='w-full'>
            <label>Aeropuerto</label>
            <select id="aeropuertos" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
              value={selectedAirport} onChange={(e) => setSelectedAirport(e.target.value)}
            >
              <option key='' value=''>Seleccione Aeropuerto</option>
              {content.map((item, i: number) => (
                (item.ciudad.nombre == selectedCity) &&
                <option key={i} value={i} data-latitude={item.latitud} data-longitude={item.longitud}>
                  {item.nombre}
                </option>
              ))}              
            </select>
            {(showMessage) && <p className='text-red-500 text-xs'>Debe seleccionar un Aeropuerto</p>}
          </div>
          <div className='w-full'>
            <label>Radio</label>
            <select id="radio" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
              value={selectedRadius} onChange={(e) => setSelectedRadius(parseInt(e.target.value))}
            >
              {radius.map((item, i: number) => (
                <option key={i} value={item}>{item} Km.</option>
              ))}
            </select>
          </div>          
          <div className='flex gap-2 w-full'>
            <Button variant="default" className='flex-grow-1' 
              onClick={handleClick}
            >Aplicar Filtro</Button>
            <Button variant="secondary" 
              onClick={handleRemove}
            >Remover Filtro</Button>
          </div>
        </div> 
      </PopoverContent>
    </Popover>
 ); 

}

export default AirportsFilter;