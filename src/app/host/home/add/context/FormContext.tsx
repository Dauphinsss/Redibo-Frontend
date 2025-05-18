// src/contexts/FormContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo
} from "react";
import { createFullCar, CreateFullCarPayload } from "@/app/host/services/carService";
import { uploadImage } from "@/app/host/services/imageService";

interface DireccionData {
  id_provincia: number | null;
  ciudadId?: number | null;
  calle: string;
  zona: string;
  num_casa: string;
}

interface DatosPrincipalesData {
  vim: string;
  año: number;
  marca: string;
  modelo: string;
  placa: string;
}

interface CaracteristicasData {
  combustibleIds: number[];
  asientos: number;
  puertas: number;
  transmicion: "automatica" | "manual";
  soat: boolean;
}

interface CaracteristicasAdicionalesData {
  extraIds: number[];
}

interface FinalizacionData {
  imagenes: File[];
  num_mantenimientos: number;
  precio_por_dia: number;
  estado: string;
  descripcion?: string;
}

interface FormData {
  direccion: DireccionData;
  datosPrincipales: DatosPrincipalesData;
  caracteristicas: CaracteristicasData;
  caracteristicasAdicionales: CaracteristicasAdicionalesData;
  finalizacion: FinalizacionData;
}

interface FormContextType {
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

const FormContext = createContext<FormContextType | undefined>(undefined);

const initialFormData: FormData = {
  direccion: { id_provincia: null, ciudadId: null, calle: "", zona: "", num_casa: "" },
  datosPrincipales: { vim: "", año: 0, marca: "", modelo: "", placa: "" },
  caracteristicas: { combustibleIds: [], asientos: 0, puertas: 0, transmicion: "automatica", soat: false },
  caracteristicasAdicionales: { extraIds: [] },
  finalizacion: { imagenes: [], num_mantenimientos: 0, precio_por_dia: 0, estado: "Disponible", descripcion: "" }
};

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const updateDireccion = useCallback(
    (data: DireccionData) => setFormData(prev => ({ ...prev, direccion: data })),
    []
  );
  const updateDatosPrincipales = useCallback(
    (data: DatosPrincipalesData) => setFormData(prev => ({ ...prev, datosPrincipales: data })),
    []
  );
  const updateCaracteristicas = useCallback(
    (data: CaracteristicasData) => setFormData(prev => ({ ...prev, caracteristicas: data })),
    []
  );
  const updateCaracteristicasAdicionales = useCallback(
    (data: CaracteristicasAdicionalesData) => setFormData(prev => ({ ...prev, caracteristicasAdicionales: data })),
    []
  );
  const updateFinalizacion = useCallback(
    (data: FinalizacionData) => setFormData(prev => ({ ...prev, finalizacion: data })),
    []
  );
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setSubmitError(null);
    setSubmitSuccess(false);
  }, []);

  const validateForm = useCallback(() => {
    const { direccion, datosPrincipales, caracteristicas, finalizacion } = formData;
    return (
      direccion.id_provincia !== null &&
      datosPrincipales.vim.trim() !== "" &&
      caracteristicas.combustibleIds.length > 0 &&
      finalizacion.imagenes.length === 3 &&
      finalizacion.precio_por_dia > 0
    );
  }, [formData]);

  const submitForm = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!validateForm()) {
      setSubmitError("Complete todos los campos obligatorios.");
      return { success: false, error: "Formulario incompleto" };
    }
    setIsSubmitting(true);
    setSubmitError(null);

    const {
      direccion: { id_provincia, calle, zona, num_casa },
      datosPrincipales: { vim, año, marca, modelo, placa },
      caracteristicas: { combustibleIds, asientos, puertas, transmicion, soat },
      caracteristicasAdicionales: { extraIds },
      finalizacion: { imagenes, num_mantenimientos, precio_por_dia, estado, descripcion }
    } = formData;

    const payload: CreateFullCarPayload = {
      id_provincia: id_provincia!,
      calle,
      zona,
      num_casa,
      vim,
      año,
      marca,
      modelo,
      placa,
      asientos,
      puertas,
      soat,
      transmicion,
      combustibleIds,
      extraIds,
      precio_por_dia,
      num_mantenimientos,
      estado,
      descripcion,
    };

    try {
      const result = await createFullCar(payload);
      if (!result.success) {
        setSubmitError(result.message || "Error al crear el carro");
        return { success: false, error: result.message };
      }
      const carId = result.data.id;
      await Promise.all(imagenes.map(file => uploadImage(carId, file)));
      setSubmitSuccess(true);
      resetForm();
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setSubmitError(msg);
      return { success: false, error: msg };
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, resetForm]);

  const value = useMemo(
    () => ({
      formData,
      isSubmitting,
      submitError,
      submitSuccess,
      updateDireccion,
      updateDatosPrincipales,
      updateCaracteristicas,
      updateCaracteristicasAdicionales,
      updateFinalizacion,
      submitForm,
      resetForm
    }),
    [formData, isSubmitting, submitError, submitSuccess, updateDireccion, updateDatosPrincipales, updateCaracteristicas, updateCaracteristicasAdicionales, updateFinalizacion, submitForm, resetForm]
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormContext debe usarse dentro de FormProvider");
  return ctx;
}