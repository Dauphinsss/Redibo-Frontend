import { LatLngExpression } from "leaflet";

type cityType = {
  'La Paz': LatLngExpression;
  'Santa Cruz': LatLngExpression;
  Cochabamba: LatLngExpression;
  Sucre: LatLngExpression;
  Oruro: LatLngExpression;
  Potosí: LatLngExpression;
  Tarija: LatLngExpression;
  Beni: LatLngExpression;
  Pando: LatLngExpression;
}

export const CIUDADES_BOLIVIA: cityType = {
  'La Paz': [-16.49572, -68.13339],
  'Santa Cruz': [-17.78445, -63.18204],
  'Cochabamba': [-17.39449, -66.16003],
  'Sucre': [-19.04792, -65.25935],
  'Oruro': [-17.97052, -67.11498],
  'Potosí': [-19.58970, -65.75353],
  'Tarija': [-21.53466, -64.73438],
  'Beni': [-14.83527, -64.90466],
  'Pando': [-11.02165, -68.75846],
}

export const Airports =  [
    {
        "nombre": "Aeropuerto Apolo",
        "ciudad": { "nombre":"La Paz"},
        "latitud": -14.7333,
        "longitud": -68.4167
    },
    {
        "nombre": "Aeropuerto Ascensión de Guarayos",
        "ciudad": { "nombre":"Santa Cruz"},
        "latitud": -15.7167,
        "longitud": -63.1
    },
    {
        "nombre": "Aeropuerto de Bella Unión",
        "ciudad": { "nombre":"Beni"},
        "latitud": -13.6267,
        "longitud": -65.2738
    },
    {
        "nombre": "Aeropuerto Bermejo",
        "ciudad": { "nombre":"Tarija"},
        "latitud": -22.773333,
        "longitud": -64.312778
    },
    {
        "nombre": "Aeropuerto Grán Parapetí Camiri",
        "ciudad": { "nombre":"Santa Cruz"},
        "latitud": -20.0071,
        "longitud": -63.5275
    },
    {
        "nombre": "Aeropuerto Charaña",
        "ciudad": { "nombre":"La Paz"},
        "latitud": -17.5947,
        "longitud": -69.433
    },
    {
        "nombre": "Aeropuerto de Chimoré",
        "ciudad": { "nombre":"Cochabamba"},
        "latitud": -16.969444,
        "longitud": -65.15
    },
    {
        "nombre": "Aeropuerto Capitán Aníbal Arab",
        "ciudad": { "nombre":"Pando"},
        "latitud": -11.040278,
        "longitud": -68.782778
    },
    {
        "nombre": "Aeropuerto Internacional Jorge Wilstermann",
        "ciudad": { "nombre":"Cochabamba"},
        "latitud": -17.420833,
        "longitud": -66.176944
    },
    {
        "nombre": "Aeropuerto de Concepción",
        "ciudad": { "nombre":"Santa Cruz"},
        "latitud": -16.147222,
        "longitud": -62.021667
    },
    {
        "nombre": "Aeropuerto de Copacabana",
        "ciudad": { "nombre":"La Paz"},
        "latitud": -16.1922,
        "longitud": -69.0974
    },
    {
        "nombre": "Aeropuerto Apiaguaiki Tumpa",
        "ciudad": { "nombre":"Chuquisaca"},
        "latitud": -19.8238,
        "longitud": -63.9624
    },
    {
        "nombre": "Aeropuerto Ernesto Roca Barbadillo",
        "ciudad": { "nombre":"Beni"},
        "latitud": -10.884321,
        "longitud": -65.380441
    },
    {
        "nombre": "Aeropuerto Internacional El Alto",
        "ciudad": { "nombre":"La Paz"},
        "latitud": -16.513333,
        "longitud": -68.192222
    },
    {
        "nombre": "Aeropuerto de Magdalena",
        "ciudad": { "nombre":"Beni"},
        "latitud": -13.258055,
        "longitud": -64.063333
    },
    {
        "nombre": "Aeropuerto Juan Mendoza",
        "ciudad": { "nombre":"Oruro"},
        "latitud": -17.9625,
        "longitud": -67.076111
    },
    {
        "nombre": "Aeropuerto Capitán Nicolás Rojas",
        "ciudad": { "nombre":"Potosí"},
        "latitud": -19.543056,
        "longitud": -65.723611
    },
    {
        "nombre": "Aeropuerto de Puerto Rico",
        "ciudad": { "nombre":"Pando"},
        "latitud": -11.1075,
        "longitud": -67.5483
    },
    {
        "nombre": "Aeropuerto de Puerto Suárez",
        "ciudad": { "nombre":"Santa Cruz"},
        "latitud": -18.975278,
        "longitud": -57.820556
    },
    {
        "nombre": "Aeropuerto de Reyes",
        "ciudad": { "nombre":"Beni"},
        "latitud": -14.3058,
        "longitud": -67.3536
    },
    {
        "nombre": "Aeropuerto Capitán Av. Selin Zeitun López",
        "ciudad": { "nombre":"Beni"},
        "latitud": -11.016667,
        "longitud": -66.116667
    },
    {
        "nombre": "Aeropuerto de Roboré",
        "ciudad": { "nombre":"Santa Cruz"},
        "latitud": -18.318888,
        "longitud": -59.765833
    },
    {
        "nombre": "Aeropuerto Rurrenabaque",
        "ciudad": { "nombre":"Beni"},
        "latitud": -14.4275,
        "longitud": -67.498056
    },
    {
        "nombre": "Aeropuerto Capitán Germán Quiroga Guardia",
        "ciudad": { "nombre":"Beni"},
        "latitud": -14.866667,
        "longitud": -66.75
    },
    {
        "nombre": "Aeropuerto de San Ignacio de Moxos",
        "ciudad": { "nombre":"Beni"},
        "latitud": -14.9656,
        "longitud": -65.6335
    },
    {
        "nombre": "Aeropuerto de San Ignacio de Velasco",
        "ciudad": { "nombre":"Santa Cruz"},
        "latitud": -16.393889,
        "longitud": -61.044722
    },
    {
        "nombre": "Aeropuerto de San Javier",
        "ciudad": { "nombre":"Santa Cruz"},
        "latitud": -16.2647,
        "longitud": -62.4704
    },
    {
        "nombre": "Aeropuerto de San Joaquín",
        "ciudad": { "nombre":"Beni"},
        "latitud": -13.0529,
        "longitud": -64.6616
    },
    {
        "nombre": "Aeropuerto de San José de Chiquitos",
        "ciudad": { "nombre":"Santa Cruz"},
        "latitud": -17.8322,
        "longitud": -60.7431
    },
    {
        "nombre": "Aeropuerto de San Matías",
        "ciudad": { "nombre":"Santa Cruz"},
        "latitud": -16.3379,
        "longitud": -58.4015
    },
    {
        "nombre": "Aeropuerto de San Ramón",
        "ciudad": { "nombre":"Beni"},
        "latitud": -13.264,
        "longitud": -64.604
    },
    {
        "nombre": "Aeropuerto José Chávez Suárez",
        "ciudad": { "nombre":"Beni"},
        "latitud": -13.762222,
        "longitud": -65.435278
    },
    {
        "nombre": "Aeropuerto El Trompillo",
        "ciudad": { "nombre":"Santa Cruz"},
        "latitud": -17.811389,
        "longitud": -63.171389
    },
    {
        "nombre": "Aeropuerto Internacional Viru Viru",
        "ciudad": { "nombre":"Santa Cruz"},
        "latitud": -17.644722,
        "longitud": -63.135278
    },
    {
        "nombre": "Aeropuerto Internacional de Alcantarí",
        "ciudad": { "nombre":"Chuquisaca"},
        "latitud": -19.238297,
        "longitud": -65.149132
    },
    {
        "nombre": "Aeropuerto Capitán Oriel Lea Plaza",
        "ciudad": { "nombre":"Tarija"},
        "latitud": -21.555736,
        "longitud": -64.701325
    },
    {
        "nombre": "Aeropuerto Teniente Jorge Henrich Arauz",
        "ciudad": { "nombre":"Beni"},
        "latitud": -14.818611,
        "longitud": -64.918056
    },
    {
        "nombre": "Aeropuerto Joya Andina",
        "ciudad": { "nombre":"Potosí"},
        "latitud": -20.45,
        "longitud": -66.8422
    },
    {
        "nombre": "Aeropuerto Capitán Av. Vidal Villagomez Toledo",
        "ciudad": { "nombre":"Santa Cruz"},
        "latitud": -18.470278,
        "longitud": -64.098888
    },
    {
        "nombre": "Aeropuerto Teniente Coronel Rafael Pabón",
        "ciudad": { "nombre":"Tarija"},
        "latitud": -21.255,
        "longitud": -63.405556
    },
    {
        "nombre": "Aeropuerto de Ventilla",
        "ciudad": { "nombre":"Potosí"},
        "latitud": -21.1745,
        "longitud": -67.1685
    },
    {
        "nombre": "Aeropuerto de Yacuiba",
        "ciudad": { "nombre":"Tarija"},
        "latitud": -21.960833,
        "longitud": -63.651667
    }
]
