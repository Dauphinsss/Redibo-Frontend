{/*export interface CoberturaInterface {
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
  fechaInicio: string;
  fechaFin: string;
  enlace: string;
  id_carro: number;
  Seguro: {
    id: number;
    empresa: string;
    nombre: string;
    tipoSeguro: string;
  };
  tiposeguro: Array<{
    tipoda_o: string | null;
    descripcion: string | null;
    valides: string | null;
  }>;
}*/}
export interface SeguroBase {
  id: number;
  empresa: string;
  nombre: string;
  tipoSeguro: string;
}

export interface TipoCobertura {
  id: number;
  tipoda_o: string;
  descripcion: string;
  cantidadCobertura: string;
}

export interface SeguroEstructurado {
  id: number;
  Seguro: SeguroBase;
  tiposeguro: TipoCobertura[];
}
