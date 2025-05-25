// src/contexts/form/FormContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo
} from "react";

import { FormContextType, FormData } from './types';
import { initialFormData } from './initialState';
import { createUpdateFormActions, createSubmitAction } from './formActions';

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Función para resetear el formulario
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setSubmitError(null);
    setSubmitSuccess(false);
  }, []);

  // Creamos las acciones de actualización
  const updateActions = useMemo(() => 
    createUpdateFormActions(setFormData), 
  []);

  // Creamos la acción de envío
  const submitForm = useCallback(
    createSubmitAction(
      formData, 
      setIsSubmitting, 
      setSubmitError, 
      setSubmitSuccess, 
      resetForm
    ),
    [formData, resetForm]
  );

  // Creamos el valor del contexto
  const value = useMemo(
    () => ({
      formData,
      isSubmitting,
      submitError,
      submitSuccess,
      ...updateActions,
      submitForm,
      resetForm
    }),
    [formData, isSubmitting, submitError, submitSuccess, updateActions, submitForm, resetForm]
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormContext debe usarse dentro de FormProvider");
  return ctx;
}