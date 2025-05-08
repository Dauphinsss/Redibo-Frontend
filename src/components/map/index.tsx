"use client"

import { MapContainer, TileLayer, Marker, Popup, Pane } from "react-leaflet"
import L, { DivIcon, LatLngExpression, LatLngTuple } from "leaflet"

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import MapPunto from "../mapPunto";
import { AutoMap } from "@/interface/map";
import "@/styles/priceMarker.css"
import { useState } from "react";
import { estaDentroDelRadio } from "./filtroGPS";


interface MapProps {
  posix: LatLngExpression | LatLngTuple,
  zoom?: number,
  autos?: AutoMap[],
}

const defaults = {
  zoom: 12,
}
const Map = ({ zoom = defaults.zoom, posix, autos = [] }: MapProps) => {
  const [punto, setpunto] = useState({ altitud: 0, longitud: 0 })
  const actualizarPunto = (longitud: number, altitud: number) => {
    setpunto({
      longitud,
      altitud
    })
  }
  return (
    <>
    <span className="">Longitud:{punto.longitud} Altitud:{punto.altitud}</span>
    <MapContainer
      center={posix}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {autos.map((auto) => {
        const sinFiltro = punto.altitud === 0 && punto.longitud === 0;
        const dentroDelRadio = estaDentroDelRadio(punto.altitud, punto.longitud, auto.latitud, auto.longitud, 3000);
        if (sinFiltro || dentroDelRadio) {
          const customIcon: DivIcon = L.divIcon({
            html: `<div class="price-marker">$${auto.precio}</div>`,
            className: "",
            iconSize: [50, 30],
            iconAnchor: [25, 30],
          });

          return (
            <Marker key={auto.id} position={[auto.latitud, auto.longitud]} icon={customIcon}>
              <Popup>
                <div className="text-sm space-y-1">
                  <div><strong>Marca:</strong> {auto.marca}</div>
                  <div><strong>Modelo:</strong> {auto.modelo}</div>
                  <div><strong>Año:</strong> {auto.anio}</div>
                  <div><strong>Precio:</strong> ${auto.precio} / día</div>
                  <button className="mt-2 px-2 py-1 bg-black text-white rounded hover:bg-gray-800">
                    Ver detalles
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        }
      })}
      <MapPunto actualizarPunto={actualizarPunto} />
    </MapContainer>
    </>
  );
}

export default Map;
