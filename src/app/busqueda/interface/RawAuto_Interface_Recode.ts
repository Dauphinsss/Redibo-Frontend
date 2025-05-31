export interface RawAuto_Interface_Recode {
  id: number;
  modelo: string;
  marca: string;
  asientos: number;
  puertas: number;
  transmicion: string;
  precio_por_dia: number;
  CombustibleCarro: {
    TipoCombustible: {
      tipoDeCombustible: string;
    };
  }[];
  estado: string;
  Usuario: {
    nombre: string;
  };
  Direccion: {
    calle: string;
    Provincia: {
      Ciudad: {
        nombre: string;
      };
    };
  };
  Imagen: {
    id: number;
    data: string;
    id_carro: number;
  }[];
  caracteristicasAdicionales: string[];
}
