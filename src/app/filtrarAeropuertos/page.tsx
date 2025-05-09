"use client"
import React from 'react'
import { useState } from 'react';
import { useAirports } from '@/api/queries/useAirports'
import { Button } from "@/components/ui/button"
import CarsByLocation from '@/components/custom/CarsByLocation';
import Header from "@/components/ui/Header";

export default function Page() {  
  const { data: content = []} = useAirports();
  const [selectedValue, setSelectedValue] = useState('0');
  const [selectedLatitude, setSelectedLatitude] = useState(0);
  const [selectedLongitude, setSelectedLongitude] = useState(0);
  const handleClick = () => {
    const index = parseInt(selectedValue);
    const latitude = content[index].latitud
    setSelectedLatitude(latitude);
    const longitude = content[index].longitud
    setSelectedLongitude(longitude);
  }  
  return (
    <div>
    <Header />
    <div className="max-w-xl mx-auto pt-4">
      <h1 className="text-center text-2xl mb-4 font-semibold">Filtar Por Aeropuerto</h1>
      <p className="mb-4 font-semibold">Seleccione un Aeropuerto y haga click en Buscar</p>
      <div className="flex gap-1 mb-4">
        <select id="aeropuertos" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
          value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}
        >
          {            
            content.map((item, i: number) => (
              <option key={i} value={i} data-latitude={item.latitud} data-longitude={item.longitud}>
                {item.nombre} ({item.ciudad.nombre})
              </option>
            ))}
        </select>
        <Button variant="default"
          onClick={handleClick}
        >Buscar</Button>
      </div>
      <p className="mb-4 font-semibold">Resultados</p>
      <CarsByLocation latitude={selectedLatitude} longitude={selectedLongitude}></CarsByLocation>

    </div>
    </div>
  );
}