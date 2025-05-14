"use client"
import React, { ChangeEvent } from 'react';
import { useState } from 'react';
import { useAirports } from '@/api/queries/useAirports'
import { Button } from "@/components/ui/button"
import CarsByLocation from '@/components/custom/CarsByLocation';
import Header from "@/components/ui/Header";

export default function Page() {  
  const cities = [
    ["Cochabamba"],
    ["Beni"],
    ["Chuquisaca"],
    ["La Paz"],
    ["Oruro"],
    ["Pando"],
    ["Potosí"],
    ["Santa Cruz"],
    ["Tarija"]
  ]
  const radius =[5,10,15,20]
  const { data: content = [], isLoading, isError } = useAirports();
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedCity, setSelectedCity] = useState(cities[0].toString());
  const [selectedLatitude, setSelectedLatitude] = useState(0);
  const [selectedLongitude, setSelectedLongitude] = useState(0);  
  const [selectedRadius, setSelectedRadius] = useState(0);  
  
  const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {    
    setSelectedCity(e.target.value)
    setSelectedValue('');
    setSelectedLatitude(0);
    setSelectedLongitude(0);    
  }  

  const handleClick = () => { 
    if(selectedValue != ''){
      const index = parseInt(selectedValue);
      const latitude = content[index].latitud    
      setSelectedLatitude(latitude);
      const longitude = content[index].longitud
      setSelectedLongitude(longitude);      
    }
  }  
  
  return (
    <div>
    <Header />
    <div className="max-w-3xl flex flex-col justify-items-center mx-auto p-3">
      <h1 className="text-center text-2xl mb-4 font-semibold">Filtar Por Aeropuerto</h1>
      <p className="mb-4 font-semibold text-gray-500 text-sm">Seleccione una ciudad un Aeropuerto y haga click en Buscar</p>
      {(() => {
        if (isLoading) {
          return (
            <p className="text-center text-md mt-4 font-semibold text-muted-foreground">
            Cargando Aeropuertos...
            </p>
          )
        }
        if (isError) {
        return (
          <p className="text-center text-md mt-4 text-blue-700">
            Error al cargar los Aeropuertos
          </p>
        )
        }
      })()} 
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <div>
          <label>Ciudad</label>
          <select id="ciudades" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
          value={selectedCity} onChange={(e) => handleCityChange(e)}>
          <option key='' value=''>Seleccione una Ciudad</option>
          {cities.map((city,i) => (
              <option key={i} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Aeropuerto</label>
          <select id="aeropuertos" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}         
          >
            <option key='' value=''>Seleccione un Aeropuerto</option>
            {content.map((item, i: number) => (              
                (item.ciudad.nombre == selectedCity) &&
                <option key={i} value={i} data-latitude={item.latitud} data-longitude={item.longitud}>
                  {item.nombre}
                </option>
              ))}            
          </select>
        </div>
        <div>          
          <label>Radio</label>
          <select id="radio" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
          value={selectedRadius} onChange={(e) => setSelectedRadius(parseInt(e.target.value))}
          >
            <option key='' value='0'>Seleccione un Radio</option>
            {radius.map((item, i: number) => (  
              <option key={i} value={item}>{item} Km.</option>
            ))}            
          </select>
        </div>
        <div className='flex items-end'>
          <Button variant="default" className='w-full'
            onClick={handleClick}
          >Buscar</Button>
        </div>
      </div>
      <p className="mb-4 font-semibold">Resultados</p>
      <CarsByLocation 
      latitude={selectedLatitude} 
      longitude={selectedLongitude} 
      radius={selectedRadius}></CarsByLocation>
    </div>
    </div>
  );
}