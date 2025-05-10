import { LatLng } from 'leaflet'
import React, { useState } from 'react'
import { Marker, useMapEvents, Circle } from 'react-leaflet'

interface HijoProps {
  radio: number,
  punto: {lon:number,alt:number},
  setpunto: (punto:{lon:number,alt:number}) => void;
}


const MapPunto= ({radio,punto,setpunto }:HijoProps) => {
  const [position, setPosition] = useState<LatLng | null>(null)
  function actualizarPunto(lon:number,alt:number) {
    setpunto({lon,alt})
  }
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      actualizarPunto(lng,lat);
      map.locate();
    },
  })

  const fillBlueOptions = { fillColor: 'blue' }
  return (
    <>
      {
        position && (
          <div>
            <Circle center={position} pathOptions={fillBlueOptions} radius={radio*1000} />
            <Marker position={position} draggable={false}></Marker>
          </div>
        )
      }
    </>
  )
}

export default MapPunto