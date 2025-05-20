import haversine from 'haversine-distance'
import { AutoCard_Interfaces_Recode as Auto } from '@/app/busqueda/interface/AutoCard_Interface_Recode';

export function estaDentroDelRadio(latUsuario: number, lonUsuario: number, latAuto: number, lonAuto: number, radioKm: number) {
    const a = { lat: latUsuario, lng: lonUsuario }
    const b = { lat: latAuto, lon: lonAuto }
    return haversine(b, a) <= radioKm;
}

export function autosCercanosOrdenados(autos: Auto[], punto: { lon: number, alt: number }, radio: number): Auto[] {
    return autos.filter(auto => estaDentroDelRadio(punto.alt, punto.lon, auto.latitud, auto.longitud, radio));
}