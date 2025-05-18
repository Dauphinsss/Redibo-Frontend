import { LatLng } from 'leaflet'
import React, { useEffect, useState } from 'react'
import { Marker, useMapEvents, Circle } from 'react-leaflet'

interface HijoProps {
  radio: number,
  punto: { lon: number, alt: number },
  setpunto: (punto: { lon: number, alt: number }) => void;
  estaActivoGPS: boolean;
}
const MapPunto = ({ radio, punto, setpunto, estaActivoGPS }: HijoProps) => {
  const [position, setPosition] = useState<LatLng | null>(null)
  const [ubicacionEnviada, setUbicacionEnviada] = useState(false);
  function actualizarPunto(lon: number, alt: number) {
    setpunto({ lon, alt })
  }
  function borrarDibujo() {
    setPosition(null);
    setUbicacionEnviada(false);
    // Reinicia el punto a valores predeterminados o nulos según lo que necesites
    setpunto({ lon: 0, alt: 0 });
  }
  useEffect(() => {
    if (!estaActivoGPS) {
      borrarDibujo();
    }
  }, [estaActivoGPS]);
  const map = useMapEvents({
    click(e) {
      if (estaActivoGPS) {
        const { lat, lng } = e.latlng;
        setPosition(e.latlng);
        actualizarPunto(lng, lat);
        map.locate()
        map.flyTo(e.latlng, map.getZoom(), {
          duration: 0.7,
        })
      }
    },
  })

  const fillBlueOptions = { fillColor: 'blue' }
  return (
    <>
      {
        position && (
          <div>
            <Circle
              center={position}
              pathOptions={fillBlueOptions}
              radius={radio * 1000}
            />
            <Marker position={position} draggable={false}></Marker>
          </div>
        )
      }
    </>
  )
}

export default MapPunto