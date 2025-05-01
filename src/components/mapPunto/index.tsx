import { LatLng, LatLngExpression, LatLngTuple } from 'leaflet'
import React, { useState } from 'react'
import { Marker, useMapEvents,Popup } from 'react-leaflet'

function index() {
  const [position, setPosition] = useState<LatLng>()
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng)
      map.locate()
    },
  })
  return (
    <>
      {
        position && (
          <Marker position={position} draggable={false} >
            <Popup>
              
            </Popup>
          </Marker>
        )
      }
    </>
  )
}

export default index