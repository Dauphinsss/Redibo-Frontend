import { useState, useEffect } from 'react';
const CarsByLocation = ({ latitude, longitude }: any) => {  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const haversineDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
    const R = 6371; // Earth radius in kilometers
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

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data/autos.json'); // Assuming data.json is in the public directory
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }
 
  let count = 0;
  return (<div>
  <ul className="max-w-xl divide-y divide-gray-200 dark:divide-gray-700">
    {data.map((item:any, i:number) => {
      const distance =  haversineDistance(latitude, longitude, item.latitud, item.longitud);      
      if(distance <10){
        count++;
        return(
      <li key={i} className="pb-3 sm:pb-4">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
         <div className="shrink-0">
            <img className="w-16 h-16 rounded-sm mt-2" src="https://placehold.co/64" alt="imagen auto" />
         </div>
         <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate dark:text-white">
              {item.nombre}
            </p>
            <p className="text-sm text-gray-500 truncate">
            Marca:{item.marca}  &#124; {item.calificacion} &#9733; &#124; distancia: ({distance} Km)
            </p>
            <p className="text-sm text-gray-800 truncate">
            Asientos:{item.asientos} &#124; puertas: {item.puertas} &#124; transmision: {item.transmision} 
            </p>
         </div>
         <div className="inline-flex items-center text-base font-semibold text-gray-900">
            {item.precioOficial}
         </div>
         <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-xs rounded-lg text-xs px-3 py-2 me-2 mb-2 mt-4">
          Ver Detalles</button>
      </div>        
      </li>)   
      }       
    }        
    )}    
  </ul>  
  {count == 0 ?<p>No hay vehiculos cercanos</p>:<p></p>}  
  </div>    
  );  
};

export default CarsByLocation;