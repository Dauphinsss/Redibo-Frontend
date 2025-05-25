    "use client"
    import React from 'react';
    import Link from "next/link";
    import { MapContainer, TileLayer, Marker, Popup, Circle} from 'react-leaflet';
    import markerIconPng from "leaflet/dist/images/marker-icon.png"
    import aiportLocationPng from '../assets/airport-location.png';
    import {Icon} from 'leaflet'
    import RecenterAutomatically from './RecenterAutomatically';
    import 'leaflet/dist/leaflet.css';
    interface car{
      id:number;
      latitud:number;
      longitud:number;
      marca: string;
      modelo: string;  
      imagenes:string;    
    };    
    interface MapComponentProps {
    latitude: number;
    longitude: number;
    radius: number;
    cars: car[];
    }

    const MapComponent: React.FC<MapComponentProps>  = ({ latitude, longitude, radius, cars}) => {        
      const circleOptions = { color: 'red', fillColor: 'red', fillOpacity: 0.1 };     
      return (
        <MapContainer center={[latitude, longitude]} zoom={12} style={{ height: '500px', width: '100%' }}>
          <Circle center={[latitude,longitude]} radius={radius*1000} pathOptions={circleOptions} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[latitude,longitude]} icon={new Icon({iconUrl: aiportLocationPng.src, iconSize: [26, 26], iconAnchor: [13, 26]})} >
            <Popup>
              Aeropuerto
            </Popup>
          </Marker>                    
           {cars.map((item, i:number) => {
            return(
            (item.latitud && item.longitud) &&
          <Marker key={i} position={[item.latitud,item.longitud]} icon={new Icon({iconUrl: markerIconPng.src, iconSize: [16, 26], iconAnchor: [8, 26]})} >
            <Popup>              
              <span className='font-semibold text-xs'>{item.marca} {item.modelo}</span>
              <img src={(item.imagenes)? item.imagenes:'https://placehold.co/600x400?text=Sin+Imagen'} width={300} />
              <Link href={"infoAuto_Recode/" + item.id} target="blank" 
              className="block text-gray-900 text-xs text-center font-semibold bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 rounded-sm px-2.5 py-2 ms-2 mt-2">
              Ver Oferta</Link>
            </Popup>
          </Marker>)
           })}
          <RecenterAutomatically lat={latitude} lng={longitude} />
        </MapContainer>
      );
    }

    export default MapComponent;