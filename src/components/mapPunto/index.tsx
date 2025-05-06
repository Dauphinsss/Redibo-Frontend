import { LatLng } from 'leaflet'
import React, { useState } from 'react'
import { Marker, useMapEvents, Circle } from 'react-leaflet'

interface HijoProps {
  actualizarPunto: (longitud: number, altitud: number) => void;
}

const MapPunto: React.FC<HijoProps> = ({ actualizarPunto }) => {
  const [position, setPosition] = useState<LatLng | null>(null)
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

export default MapPunto