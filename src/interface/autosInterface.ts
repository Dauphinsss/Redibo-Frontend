export interface AutoImage {
  id: number;
  data: string;
}

export interface TipoCombustible {
  tipo_de_combustible: string;
}

export interface Combustible {
  tipocombustible?: TipoCombustible;
}
export interface InfoDestacableProps {
  marca: string;
  modelo: string;
  anio: number;
  soat: boolean;

}
export interface ReservaProps {
  precio: string;
}
export interface Direccion {
  calle?: string;
  zona?: string;
}

export interface AutoData {
  marca?: string;
  modelo?: string;
  imagen?: AutoImage[];
  direccion?: Direccion;
  precio_por_dia?: string;
  combustiblecarro?: Combustible[];
  anio?: string;
  soat?: string;
}
