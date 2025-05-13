export interface CoberturaInterface {
  id_carro: number;
  tipodaño: string;
  descripcion: string;
  valides: string;
}

export interface EnlaceInterface{
  enlace: string;
}

export interface SeguroInterface {
  id?: number;
  tipoda_o:string;
  descripcion: string;
  valides: string;
}

export interface ValidarInterface {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  empresa: string;
  enlace: string;
}