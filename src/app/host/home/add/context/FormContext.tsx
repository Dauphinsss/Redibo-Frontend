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
import { createFullCar, FullCarPayload } from "@/app/host/services/carService";

// ========== TYPE DEFINITIONS ==========
type TransmissionType = "automatica" | "manual";
type CarStatus = "Disponible" | "En mantenimiento" | "No disponible";

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
  transmicion: TransmissionType;
  soat: boolean;
  segurosAdicionales?: SeguroAdicional[];
}

interface SeguroAdicional {
  id: number;
  nombre: string;
  tipoSeguro: string;
  empresa: string;
  fechaInicio: string;
  fechaFin?: string;
}

interface CaracteristicasAdicionalesData {
  extraIds: number[];
}

interface FinalizacionData {
  imagenes: File[];
  num_mantenimientos: number;
  precio_por_dia: number;
  estado: CarStatus;
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
  updateDireccion: (data: Partial<DireccionData>) => void;
  updateDatosPrincipales: (data: Partial<DatosPrincipalesData>) => void;
  updateCaracteristicas: (data: Partial<CaracteristicasData>) => void;
  updateCaracteristicasAdicionales: (data: Partial<CaracteristicasAdicionalesData>) => void;
  updateFinalizacion: (data: Partial<FinalizacionData>) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  validateForm: () => { isValid: boolean; errors: Record<string, string> };
}

// ========== INITIAL STATE ==========
const initialFormData: FormData = {
  direccion: { 
    id_provincia: null, 
    ciudadId: null, 
    calle: "", 
    zona: "", 
    num_casa: "" 
  },
  datosPrincipales: { 
    vim: "", 
    año: new Date().getFullYear(), 
    marca: "", 
    modelo: "", 
    placa: "" 
  },
  caracteristicas: { 
    combustibleIds: [], 
    asientos: 5, 
    puertas: 4, 
    transmicion: "automatica", 
    soat: false,
    segurosAdicionales: []
  },
  caracteristicasAdicionales: { 
    extraIds: [] 
  },
  finalizacion: { 
    imagenes: [], 
    num_mantenimientos: 0, 
    precio_por_dia: 0, 
    estado: "Disponible", 
    descripcion: "" 
  }
};

// ========== CONTEXT CREATION ==========
const FormContext = createContext<FormContextType | undefined>(undefined);

// ========== PROVIDER COMPONENT ==========
export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ========== UPDATE FUNCTIONS ==========
  const updateDireccion = useCallback((data: Partial<DireccionData>) => {
    setFormData(prev => ({
      ...prev,
      direccion: { ...prev.direccion, ...data }
    }));
  }, []);

  const updateDatosPrincipales = useCallback((data: Partial<DatosPrincipalesData>) => {
    setFormData(prev => ({
      ...prev,
      datosPrincipales: { ...prev.datosPrincipales, ...data }
    }));
  }, []);

  const updateCaracteristicas = useCallback((data: Partial<CaracteristicasData>) => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: { ...prev.caracteristicas, ...data }
    }));
  }, []);

  const updateCaracteristicasAdicionales = useCallback((data: Partial<CaracteristicasAdicionalesData>) => {
    setFormData(prev => ({
      ...prev,
      caracteristicasAdicionales: { ...prev.caracteristicasAdicionales, ...data }
    }));
  }, []);

  const updateFinalizacion = useCallback((data: Partial<FinalizacionData>) => {
    setFormData(prev => ({
      ...prev,
      finalizacion: { ...prev.finalizacion, ...data }
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setSubmitError(null);
    setSubmitSuccess(false);
  }, []);

  // ========== VALIDATION ==========
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    const { direccion, datosPrincipales, caracteristicas, caracteristicasAdicionales, finalizacion } = formData;

    // Address validation
    if (!direccion.id_provincia) errors.direccion_provincia = "Seleccione una provincia";
    if (!direccion.calle.trim()) errors.direccion_calle = "Ingrese la calle";
    if (!direccion.zona.trim()) errors.direccion_zona = "Ingrese la zona";
    if (!direccion.num_casa.trim()) errors.direccion_num_casa = "Ingrese el número de casa";

    // Main data validation
    if (!datosPrincipales.vim.trim()) errors.vim = "El VIM es obligatorio";
    if (datosPrincipales.año < 1900 || datosPrincipales.año > new Date().getFullYear() + 1) {
      errors.año = "Año inválido";
    }
    if (!datosPrincipales.marca.trim()) errors.marca = "La marca es obligatoria";
    if (!datosPrincipales.modelo.trim()) errors.modelo = "El modelo es obligatorio";
    if (!datosPrincipales.placa.trim()) errors.placa = "La placa es obligatoria";

    // Characteristics validation
    if (caracteristicas.combustibleIds.length === 0) errors.combustible = "Seleccione al menos un combustible";
    if (caracteristicas.asientos <= 0) errors.asientos = "Número de asientos inválido";
    if (caracteristicas.puertas <= 0) errors.puertas = "Número de puertas inválido";
    if (!caracteristicas.soat) errors.soat = "El SOAT es obligatorio";

    // Additional features
    if (caracteristicasAdicionales.extraIds.length === 0) {
      errors.extras = "Seleccione al menos una característica adicional";
    }

    // Finalization
    if (finalizacion.imagenes.length < 3) errors.imagenes = "Suba al menos 3 imágenes";
    if (finalizacion.precio_por_dia <= 0) errors.precio = "El precio debe ser mayor a 0";
    if (!finalizacion.estado) errors.estado = "Seleccione un estado";

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, [formData]);

  // ========== UTILITY FUNCTIONS ==========
  const toBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = err => reject(err);
    });
  }, []);

  // ========== FORM SUBMISSION ==========
  const submitForm = useCallback(async () => {
    const { isValid, errors } = validateForm();
    
    if (!isValid) {
      setSubmitError("Por favor corrija los errores en el formulario");
      console.error("Validation errors:", errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const {
        direccion: { id_provincia, calle, zona, num_casa },
        datosPrincipales: { vim, año, marca, modelo, placa },
        caracteristicas: { combustibleIds, asientos, puertas, transmicion, soat, segurosAdicionales },
        caracteristicasAdicionales: { extraIds },
        finalizacion: { imagenes, num_mantenimientos, precio_por_dia, estado, descripcion }
      } = formData;

      const imagesBase64 = await Promise.all(imagenes.map(toBase64));

      const payload: FullCarPayload = {
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
        imagesBase64,
        segurosAdicionales
      };

      const result = await createFullCar(payload);
      
      if (result.success) {
        setSubmitSuccess(true);
        resetForm();
      } else {
        setSubmitError(result.message || "Error al crear el vehículo");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitError(
        err instanceof Error 
          ? err.message 
          : "Ocurrió un error inesperado al procesar su solicitud"
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, resetForm, toBase64]);

  // ========== CONTEXT VALUE ==========
  const value = useMemo(() => ({
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
    resetForm,
    validateForm
  }), [
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
    resetForm,
    validateForm
  ]);

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

// ========== CUSTOM HOOK ==========
export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error("useFormContext debe usarse dentro de un FormProvider");
  }
  return ctx;
}