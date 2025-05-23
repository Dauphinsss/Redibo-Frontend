// src/contexts/form/formValidation.ts
import { FormData } from './types';

export const validateForm = (formData: FormData): boolean => {
  const { direccion, datosPrincipales, caracteristicas, finalizacion } = formData;
  
  return (
    direccion.id_provincia !== null &&
    datosPrincipales.vim.trim() !== "" &&
    caracteristicas.combustibleIds.length > 0 &&
    finalizacion.imagenes.length === 3 &&
    finalizacion.precio_por_dia > 0
  );
};