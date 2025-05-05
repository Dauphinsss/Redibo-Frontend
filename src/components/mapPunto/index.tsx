import { number } from 'framer-motion';
import { LatLng, LatLngExpression, LatLngTuple } from 'leaflet'
import React, { useState } from 'react'
import { Marker, useMapEvents,Popup, CircleMarker, Circle } from 'react-leaflet'

interface HijoProps {
  actualizarPunto: (longitud:number,altitud:number) => void;
}

const index: React.FC<HijoProps> = ({actualizarPunto})=>{
  const [position, setPosition] = useState<LatLng|null>(null)
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      actualizarPunto(lng, lat);
      map.locate();
    },
  })

const fillBlueOptions = { fillColor: 'blue' }
  return (
    <>
      {
        position && (
        <div>
          <Circle center={position} pathOptions={fillBlueOptions} radius={3000} />
          <Marker position={position} draggable={false}></Marker>
        </div>
        )
      }
    </>
  )
}

export default index