// src/contexts/form/types.ts

export interface DireccionData {
  id_provincia: number | null;
  ciudadId?: number | null;
  calle: string;
  zona: string;
  num_casa: string;
}

export interface DatosPrincipalesData {
  vim: string;
  año: number;
  marca: string;
  modelo: string;
  placa: string;
}

export interface CaracteristicasData {
  combustibleIds: number[];
  asientos: number;
  puertas: number;
  transmicion: "Automatica" | "Manual";
  soat: boolean;
}

export interface CaracteristicasAdicionalesData {
  extraIds: number[];
}

export interface FinalizacionData {
  imagenes: File[];
  num_mantenimientos: number;
  precio_por_dia: number;
  estado: string;
  descripcion?: string;
}

export interface FormData {
  direccion: DireccionData;
  datosPrincipales: DatosPrincipalesData;
  caracteristicas: CaracteristicasData;
  caracteristicasAdicionales: CaracteristicasAdicionalesData;
  finalizacion: FinalizacionData;
}

export interface FormContextType {
  formData: FormData;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
  updateDireccion(data: DireccionData): void;
  updateDatosPrincipales(data: DatosPrincipalesData): void;
  updateCaracteristicas(data: CaracteristicasData): void;
  updateCaracteristicasAdicionales(data: CaracteristicasAdicionalesData): void;
  updateFinalizacion(data: FinalizacionData): void;
  submitForm(): Promise<{ success: boolean; error?: string }>;
  resetForm(): void;
}

export interface CreateFullCarResult {
  success: boolean;
  message?: string;
  data?: {
    id: number;
    [key: string]: any;
  };
}