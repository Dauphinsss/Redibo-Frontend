import L, { LatLng } from 'leaflet';
import React, { useState } from 'react'
import { Marker, Tooltip, useMapEvents } from 'react-leaflet';

function PuntoUsuario() {
  const customIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/3603/3603850.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });
  const [position, setPosition] = useState<LatLng | null>(null)
  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      setPosition(e.latlng)
    },
  })
  return (
    <>
      {
        position && (
          <div>
            <Marker position={position} icon={customIcon}>
              <Tooltip permanent direction="top" offset={[0, -40]}>
                👤 Estás aquí
              </Tooltip>
            </Marker>
          </div>
        )
      }
    </>
  )
}

export default PuntoUsuario