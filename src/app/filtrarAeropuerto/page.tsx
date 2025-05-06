"use client"
//import React from 'react'
import { useState, useEffect } from 'react';

//import {useAirports } from '@/api/queries/useAirports'
import { Button } from "@/components/ui/button"
import CarsByLocation from '@/components/custom/CarsByLocation';

export default function Page() {  
  //const { data: content = [], isLoading, isError } = useAirports();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);  
  let [selectedValue, setSelectedValue] = useState('0');
  let [selectedLatitude, setSelectedLatitude] = useState(0);
  let [selectedLongitude, setSelectedLongitude] = useState(0);
 const handleClick = () => {
    const index = parseInt(selectedValue);    
    const lat = data[index].latitude;
    setSelectedLatitude(lat);
    const long = data[index].longitude;
    setSelectedLongitude(long);    
    
  }
  /*const cities = new Map([
    [1, "Beni"],
    [2, "Chuquisaca"],
    [3, "Cochabamba"],
    [4, "La Paz"],
    [5, "Oruro"],
    [6, "Pando"],
    [7, "Potosí"],
    [8, "Santa Cruz"],
    [9, "Tarija"]
  ]);*/
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data/aeropuertos.json'); // Assuming data.json is in the public directory
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
      } catch (e) {
        //setError(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  /*if (error) {
    return <p>Error</p>;
  }*/

  return (
    <div className="max-w-xl mx-auto pt-4">
        <h1 className="text-center text-2xl mb-4 font-semibold">Filtar Por Aeropuerto</h1>
        <p className="mb-4 font-semibold">Seleccione un Aeropuerto</p>
        <div className="flex gap-1 mb-4">
          <select id="aeropuertos" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 me-1"
          value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}
          >
          {data.map((item:any, i:number) => (
          <option key={i} value={i} data-latitude={item.latitude} data-longitude={item.longitude}>
              {item.name} ({item.location}) 
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