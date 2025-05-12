export interface CoberturaInterface {
  id_carro: number;
  tipo_dano: string;
  descripcion: string;
  url?: string;
  valides: string;
}

export interface SeguroInterface {
  id?: number;
  id_carro: number;
  precio?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  coberturas?: CoberturaInterface[];
}
