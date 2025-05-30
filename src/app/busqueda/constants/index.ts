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
