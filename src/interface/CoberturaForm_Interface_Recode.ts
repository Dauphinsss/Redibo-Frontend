export interface Cobertura {
  tipoDaño: string;
  descripcion: string;
  monto: string;
  validez?: string;
}

export interface SeguroForm {
  tieneSeguro: boolean;
  aseguradora?: string;
  validezSeguro?: string;
  coberturas: Cobertura[];
  imagenAcreditacion?: string;
}

export interface CoberturaResponse {
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
    valides: string;
  }>;
}