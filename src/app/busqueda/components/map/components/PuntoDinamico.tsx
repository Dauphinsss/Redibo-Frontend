import { LatLng } from 'leaflet'
import React, { useCallback, useEffect, useState } from 'react'
import { Marker, useMapEvents, Circle } from 'react-leaflet'

interface HijoProps {
  radio: number,
  punto?: { lon: number, alt: number },
  setpunto: (punto: { lon: number, alt: number }) => void;
  estaActivoGPS: boolean;
}
const MapPunto = ({ radio, setpunto, estaActivoGPS }: HijoProps) => {
  const [position, setPosition] = useState<LatLng | null>(null)
  const actualizarPunto = useCallback((lon: number, alt: number) => {
    setpunto({ lon, alt })
  }, [setpunto]);

  const borrarDibujo = useCallback(() => {
    setPosition(null);
    setpunto({ lon: 0, alt: 0 });
  }, [setpunto]);
  useEffect(() => {
    if (!estaActivoGPS) {
      borrarDibujo();
    }
  }, [estaActivoGPS, borrarDibujo]);
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