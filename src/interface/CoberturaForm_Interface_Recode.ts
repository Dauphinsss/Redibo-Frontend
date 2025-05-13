export interface CoberturaInterface {
  id_carro: number;
  tipodaño: string;
  descripcion: string;
  valides: string;
}

export interface EnlaceInterface{
  id_carro: number;
  enlace: string;
}

export interface SeguroInterface {
  id?: number;
  tipoda_o:string;
  descripcion: string;
  valides: string;
}

export interface ValidarInterface {
  id_carro: number;
  fechaInicio: string;
  fechaFin: string;
  empresa: string;
  enlace: string;
}