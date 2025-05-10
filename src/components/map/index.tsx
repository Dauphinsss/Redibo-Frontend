"use client"

import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L, { DivIcon, LatLngExpression, LatLngTuple } from "leaflet"
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import MapPunto from "../mapPunto";
import { AutoMap } from "@/interface/map";
import "@/styles/priceMarker.css"
import { estaDentroDelRadio } from "./filtroGPS";


interface MapProps {
  posix: LatLngExpression | LatLngTuple,
  zoom?: number,
  autos?: AutoMap[],
  radio: number,
  punto: { lon: number, alt: number },
  setpunto: (punto: { lon: number, alt: number }) => void;
}

const defaults = {
  zoom: 12,
}
const Map = ({ zoom = defaults.zoom, posix, autos = [], radio, punto, setpunto }: MapProps) => {
  const router = useRouter();
  return (
    <MapContainer
      center={posix}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {autos.map((auto) => {
        const sinFiltro = punto.alt === 0 && punto.lon === 0;
        const dentroDelRadio = estaDentroDelRadio(punto.alt, punto.lon, auto.latitud, auto.longitud, radio * 1000);
        if (sinFiltro || dentroDelRadio) {
          const customIcon: DivIcon = L.divIcon({
            html: `<div class="price-marker">BOB ${auto.precio}</div>`,
            className: "",
            iconSize: [80, 30],
            iconAnchor: [40, 8],
          });

          return (
            <Marker key={auto.id} position={[auto.latitud, auto.longitud]} icon={customIcon}>
              <Popup>
                <div className="text-sm space-y-1">
                  <div><strong>Marca:</strong> {auto.marca}</div>
                  <div><strong>Modelo:</strong> {auto.modelo}</div>
                  <div><strong>Año:</strong> {auto.anio}</div>
                  <div><strong>Precio:</strong>BOB {auto.precio} / día</div>
                  <button
                    className="mt-2 px-2 py-1 bg-black text-white rounded hover:bg-gray-800 cursor-pointer"
                    onClick={() => router.push(`/infoAuto_Recode/${auto.id}`)}
                  >
                    Ver oferta
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        }
      })}
      <MapPunto radio={radio} punto={punto} setpunto={setpunto} />
    </MapContainer>
  );
}

export default Map;
