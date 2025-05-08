"use client"
import { useState} from 'react';
import { Button } from "@/components/ui/button"
import CarsByLocation from '@/components/custom/CarsByLocation';
import Header from "@/components/ui/Header";
import data from "../../data/aeropuertos.json"
export default function Page() {    
  let [selectedValue, setSelectedValue] = useState('0');
  let [selectedLatitude, setSelectedLatitude] = useState(0);
  let [selectedLongitude, setSelectedLongitude] = useState(0);
 const handleClick = () => {
    const index = parseInt(selectedValue);    
    const lat = data[index].latitude;
    setSelectedLatitude(lat);
    const lon = data[index].longitude;
    setSelectedLongitude(lon);        
  }    
  return (
    <div>
     <Header />
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
      <p className="mb-4 font-semibold">Resultados</p><hr/>
      <CarsByLocation latitude={selectedLatitude} longitude={selectedLongitude}></CarsByLocation>
    </div>
    </div>
  );
}