"use client"

import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L, { DivIcon, LatLngExpression, LatLngTuple } from "leaflet"
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

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
            //iconSize: [80, 30],
            iconAnchor: [38, 8],
          });

          return (
            <Marker key={auto.id} position={[auto.latitud, auto.longitud]} icon={customIcon}>
              <Popup>
                <Card className="w-[250px] p-0 shadow-lg rounded-xl overflow-hidden">
                  <div className="p-3 space-y-1">
                    <div className="font-semibold text-base">
                      {auto.marca} {auto.modelo} {auto.anio}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-right">
                        <div className="font-bold text-base">BOB {auto.precio} / día</div>
                      </div>
                    </div>
                    <Button
                      className="mt-2 w-full"
                      onClick={() => router.push(`/infoAuto_Recode/${auto.id}`)}
                    >
                      Ver oferta
                    </Button>
                  </div>
                </Card>
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
