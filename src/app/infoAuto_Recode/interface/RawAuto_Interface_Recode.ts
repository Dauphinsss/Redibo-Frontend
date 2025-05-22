export interface RawAuto_Interface_Recode {
  id: number;
  modelo: string;
  marca: string;
  año: number;
  asientos: number;
  puertas: number;
  transmicion: string;
  precio_por_dia: number;
  latitud: number;
  longitud: number;
  combustiblesporCarro: {
    combustible?: {
      tipoDeCombustible: string;
    };
  }[];
  estado: string;
  usuario?: {
    nombre?: string;
  };
  direccion?: {
    calle?: string;
    provincia?: {
      ciudad?: {
        nombre?: string;
      };
    };
  };
  imagenes?: {
    data?: string;
  }[];
  reservas: {
    fecha_inicio: string;
    fecha_fin: string;
    estado: string;
  }[];
}