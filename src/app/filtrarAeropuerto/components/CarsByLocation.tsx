import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { GiCarDoor } from "react-icons/gi";
import { IoPeople } from "react-icons/io5";
import { TbManualGearboxFilled } from "react-icons/tb";
import { useCars } from '@/app/filtrarAeropuerto/hooks/useCars'
import haversine from 'haversine-distance'
interface ComponentProps {
  latitude: number;
  longitude: number;
  radius: number;  
}
const CarsByLocation: React.FC<ComponentProps>  = ({ latitude, longitude, radius}) => {  
    const MapComponent = useMemo(() => dynamic(
        () => import('@/app/filtrarAeropuerto/components/MapComponent'),
        {
            loading: () => <p>El mapa se esta cargando</p>,
            ssr: false
        }
    ), [])  
  
  const { data: content = [], isLoading, isError } = useCars();
  function calcularDistancia(latAeropuerto: number, lonAeropuerto: number, latAuto: number, lonAuto: number) {
    const a = { lat: latAeropuerto, lng: lonAeropuerto }
    const b = { lat: latAuto, lon: lonAuto }
    const distanceM = haversine(a,b)
    const distanceKm = Math.round(((distanceM/1000) + Number.EPSILON) * 100) / 100;
    return distanceKm;      
  }  
  
  const filteredCars = content.filter((item) => {
    const distance =  calcularDistancia(latitude, longitude, item.latitud, item.longitud);      
    if(item.latitud && item.longitud && distance <= radius){      
      return item
    }
  })

  if (isLoading) {
    return (
    <p className="text-center text-md mt-4 font-semibold text-muted-foreground">
    Cargando Autos...
    </p>
    )
  }
  if (isError) {
    return (
        <p className="text-center text-md mt-4 text-blue-700">
        Error al cargar los Autos
        </p>
    )
  }

  return (<div className="flex flex-col-reverse gap-4 md:flex-row">
  <div className="w-full">
    {(filteredCars.length == 0)?<p>No hay vehiculos Cercanos</p>:
    <p>Se encontraron {filteredCars.length} vehiculos</p>}
  <ul className="divide-y divide-gray-300">
    {filteredCars.map((item, i:number) => {
      const distance =  calcularDistancia(latitude, longitude, item.latitud, item.longitud);            
      return(
      <li key={i} className="pb-3 sm:pb-4">
        <div className="flex flex-col md:flex-row items-center gap-2">
            <img className="w-full md:max-w-42 rounded-sm mt-2" src={(item.imagenes)?(item.imagenes):
              'https://placehold.co/600x400?text=Sin+Imagen'
            } 
            alt="imagen auto" />         
         <div className="w-full flex flex-col gap-1">
            <p className="text-md font-semibold text-gray-900">
              {item.marca} {item.modelo}
            </p>
            <p className="inline-flex flex-wrap text-sm text-gray-700">
            Distancia: 
            <span className="bg-gray-200 text-gray-800 font-semibold me-2 px-2 py-0.5 rounded-sm">
              {distance} Km
            </span> 
            </p>
            <div className="flex gap-1 text-sm text-gray-800 flex-wrap">
              <p className="inline-flex"><IoPeople className="mt-1" />{item.asientos} asientos</p>
              <p className="inline-flex"><GiCarDoor className="mt-1" />{item.puertas} puertas </p>
              <p className="inline-flex"><TbManualGearboxFilled className="mt-1" /> {item.transmision} </p>
            </div>
            <p className="text-sm text-gray-600">
              Año: {item.anio}  
            </p>
         </div>
         <div className="flex flex-col w-full items-end text-sm font-semibold text-gray-900">
          <p>BOB. {item.precio_por_dia}</p>          
          <Link href={"infoAuto_Recode/" + item.id} target="blank" 
          className="text-gray-900 text-xs font-semibold bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 rounded-sm px-2.5 py-2 mt-2">
          Ver Oferta</Link>
         </div>         
      </div>        
      </li>)         
    }        
    )}    
  </ul>   
  </div>
  {(filteredCars.length > 0 ) &&
  <div className="w-full md:w-4xl md:sticky md:top-0 md:self-start">
  <MapComponent latitude={latitude} longitude={longitude} radius={radius} cars={filteredCars}/>
  </div>
  }
  </div>    
  );  
};

export default CarsByLocation;