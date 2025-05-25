import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
interface RecenterAutomaticallyProps {
  lat: number;
  lng: number; 
}
const RecenterAutomatically: React.FC<RecenterAutomaticallyProps>= ({lat,lng}) => {
 const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng]);
  return null;
}

export default RecenterAutomatically