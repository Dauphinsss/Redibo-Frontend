"use client"
import React from 'react'
import { useState } from 'react';
import { useAirports } from '@/api/queries/useAirports'
import { Button } from "@/components/ui/button"
import CarsByLocation from '@/components/custom/CarsByLocation';

export default function Page() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: content = [], isLoading, isError } = useAirports();
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
  const cities = new Map([
    [1, "Beni"],
    [2, "Chuquisaca"],
    [3, "Cochabamba"],
    [4, "La Paz"],
    [5, "Oruro"],
    [6, "Pando"],
    [7, "Potosí"],
    [8, "Santa Cruz"],
    [9, "Tarija"]
  ]);
  return (
    <div className="max-w-xl mx-auto pt-4">
      <h1 className="text-center text-2xl mb-4 font-semibold">Filtar Por Aeropuerto</h1>
      <p className="mb-4 font-semibold">Seleccione un Aeropuerto</p>
      <div className="flex gap-1 mb-4">
        <select id="aeropuertos" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
          value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}
        >
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            content.map((item: any, i: number) => (
              <option key={i} value={i} data-latitude={item.latitud} data-longitude={item.longitud}>
                {item.nombre} ({cities.get(item.id_ciudad)})
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
  );
}