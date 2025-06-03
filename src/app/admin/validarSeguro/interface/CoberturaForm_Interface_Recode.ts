export interface CoberturaInterface {
  id: number;
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
  fecha_inicio: string;
  fecha_fin: string;
  enlace: string;
  Seguro: {
    empresa: string;
    nombre: string;
    tipoSeguro: string;
  };
  tiposeguro?: Array<{
    tipoda_o: string;
    descripcion: string;
    valides: string;
  }>;
}

export interface SeguroRawRecode {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  enlace: string;
  id_carro: number;
  Seguro: {
    empresa: string;
    nombre: string;
    tipoSeguro: string;
  };
  tiposeguro: Array<{
    tipoda_o: string | null;
    descripcion: string | null;
    valides: string | null;
  }>;
}
