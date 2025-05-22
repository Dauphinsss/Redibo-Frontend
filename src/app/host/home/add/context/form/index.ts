// src/contexts/form/index.ts

// Exportamos los componentes principales 
export { FormProvider, useFormContext } from './FormContext';

// Exportamos los tipos para uso externo
export type { 
  FormContextType, 
  FormData,
  DireccionData,
  DatosPrincipalesData,
  CaracteristicasData,
  CaracteristicasAdicionalesData,
  FinalizacionData
} from './types';