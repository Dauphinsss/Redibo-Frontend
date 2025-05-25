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
  const { data: content = []} = useCars();
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

  return (<div className="flex flex-col-reverse gap-3 md:flex-row">
  <div className="w-full">
  <ul className="divide-y divide-gray-300">
    {filteredCars.map((item, i:number) => {
      const distance =  calcularDistancia(latitude, longitude, item.latitud, item.longitud);            
      return(
      <li key={i} className="pb-3 sm:pb-4">
        <div className="flex flex-col md:flex-row items-center gap-2">
            <img className="w-42 rounded-sm mt-2" src={(item.imagenes)?(item.imagenes):
              'https://placehold.co/600x400?text=Sin+Imagen'
            } 
            alt="imagen auto" />         
         <div className="w-full">
            <p className="text-md font-semibold text-gray-900">
              {item.marca} {item.modelo}
            </p>
            <p className="text-sm text-gray-700">
            Distancia: 
            <span className="bg-gray-100 text-gray-800 text-sm font-semibold me-2 px-2 py-0.5 rounded-sm">
              {distance} Km
            </span> 
            </p>
            <p className="inline-flex text-sm text-gray-800 flex-wrap">
              <IoPeople className="mt-1" />{item.asientos} asientos
              <GiCarDoor className="mt-1 ml-2" />{item.puertas} puertas 
              <TbManualGearboxFilled className="mt-1 ml-2" /> {item.transmision} 
            </p>
            <p className="text-sm text-gray-600">
              Año: {item.anio}  
            </p>
         </div>
         <div className="inline-flex flex-col w-full items-end text-sm font-semibold text-gray-900">
          <p>BOB. {item.precio_por_dia}</p>          
          <Link href={"infoAuto_Recode/" + item.id} target="blank" 
          className="text-gray-900 text-xs font-semibold bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 rounded-sm px-2.5 py-2 ms-2 mt-2">
          Ver Oferta</Link>
         </div>         
      </div>        
      </li>)         
    }        
    )}    
  </ul>   
  </div>
  {(filteredCars.length == 0 ) ? <p>No hay vehiculos cercanos</p>:
  <div className="w-full">
  <MapComponent latitude={latitude} longitude={longitude} radius={radius} cars={filteredCars}/>
  </div>
  }
  </div>    
  );  
};

export default CarsByLocation;