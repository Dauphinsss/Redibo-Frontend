import Link from "next/link";
import { GiCarDoor } from "react-icons/gi";
import { IoPeople } from "react-icons/io5";
import { TbManualGearboxFilled } from "react-icons/tb";
import { useCars } from '@/api/queries/useCars'
const CarsByLocation = ({ latitude, longitude, radius}: any) => {  
  const { data: content = []} = useCars();
  const haversineDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
    const R = 6371; // Radio de la tierra en kilometros
    const toRad = (value: number) => (value * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = Math.round(((R * c) + Number.EPSILON) * 100) / 100;
    return distance;
  };  
  let count = 0;  
  return (<div>
  <ul className="max-w-4xl divide-y divide-gray-200 dark:divide-gray-700">
    {content.map((item, i:number) => {
      const distance =  haversineDistance(latitude, longitude, item.latitud, item.longitud);      
      if(distance < radius){
        count++;
        return(
      <li key={i} className="pb-3 sm:pb-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
         <div className="shrink-0">
            <img className="w-20 rounded-sm mt-2" src={item.imagenes} alt="imagen auto" />
         </div>
         <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {item.marca} {item.modelo}
            </p>
            <p className="text-sm text-gray-700">
            Distancia: {distance} Km
            </p>
            <p className="inline-flex text-sm text-gray-800">
            <IoPeople className="mt-1" />{item.asientos} <GiCarDoor className="mt-1 ml-1" />{item.puertas}  <TbManualGearboxFilled className="mt-1 ml-1" /> {item.transmision} 
            </p>
         </div>
         <div className="inline-flex flex-col md:flex-row items-center text-sm font-semibold text-gray-900">
          <p>BOB. {item.precio_por_dia}</p>
          <Link href={"infoAuto_Recode/" + item.id} target="blank" 
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-xs rounded-sm text-xs px-2 py-2 ms-2 mt-2">
          Ver Oferta</Link>
          </div>
      </div>        
      </li>)   
      }       
    }        
    )}    
  </ul>   
  {(count == 0 ) && <p>No hay vehiculos cercanos</p>}
  </div>    
  );  
};

export default CarsByLocation;