// src/app/host/types.ts
export interface Car {
    id: number;
    brand: string;
    model: string;
    year: number;
    vin: string;
    plate: string;
    status: string;
    price: number;
  }
  
  export interface Image {
    id: number;
    carId?: number;
    data: string;
  }
  
  export interface GetCarsParams {
    skip: number;
    take: number;
    hostId: number;
  }

  export interface Seguro {
  id: number;
  nombre: string;
  tipoSeguro: string;
  empresa: string;
}

export interface SeguroAdicional extends Seguro {
  fechaInicio: string;
  fechaFin?: string;
}
