import { useState, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CarsByLocation = ({ latitude, longitude }: any) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      } catch {
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
    <ul className="max-w-lg divide-y divide-gray-200 dark:divide-gray-700">
      {// eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.map((item: any, i: number) => {
          const distance = haversineDistance(latitude, longitude, item.latitud, item.longitud);

          if (distance < 10) {
            return (
              <li key={i} className="pb-3 sm:pb-4">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="shrink-0">
                    <img className="w-8 h-8 rounded-full" src="https://placehold.co/64" alt="Neil image" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate dark:text-white">
                      {item.nombre}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {item.marca} distancia: ({distance})
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    {item.precioOficial}
                  </div>
                </div>
              </li>)
          }
        }
        )}
    </ul>
  );
};

export default CarsByLocation;