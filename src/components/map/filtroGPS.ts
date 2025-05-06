import haversine from 'haversine-distance'

export function estaDentroDelRadio(latUsuario: number, lonUsuario: number, latAuto: number, lonAuto: number, radioKm: number) {
    const a = { lat: latUsuario, lng: lonUsuario }
    const b = { lat: latAuto, lon: lonAuto }
    return haversine(b, a) <= radioKm;
}