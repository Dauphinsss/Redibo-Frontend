"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

// Interfaces (se mantienen igual)
interface DireccionData {
  pais: string;
  departamento: string;
  provincia: string;
  calle: string;
  numCasa: string;
}

interface DatosPrincipalesData {
  vin: string;
  anio: string;
  marca: string;
  modelo: string;
  placa: string;
}

interface CaracteristicasData {
  combustible: string;
  asientos: number;
  puertas: number;
  transmision: string;
  seguro: boolean;
}

interface CaracteristicasAdicionalesData {
  airConditioning: boolean;
  bluetooth: boolean;
  gps: boolean;
  bikeRack: boolean;
  skiStand: boolean;
  touchScreen: boolean;
  babySeat: boolean;
  reverseCamera: boolean;
  leatherSeats: boolean;
  antiTheft: boolean;
  roofRack: boolean;
  polarizedGlass: boolean;
  soundSystem: boolean;
  sunroof: boolean;
}

interface FinalizacionData {
  imagenes: File[];
  mantenimientos: number;
  precioAlquiler: number;
  descripcion: string;
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
  updateDireccion: (data: DireccionData) => void;
  updateDatosPrincipales: (data: DatosPrincipalesData) => void;
  updateCaracteristicas: (data: CaracteristicasData) => void;
  updateCaracteristicasAdicionales: (data: CaracteristicasAdicionalesData) => void;
  updateFinalizacion: (data: FinalizacionData) => void;
  submitForm: () => Promise<{ success: boolean; data?: any; error?: string }>;
  resetForm: () => void;
}

interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: any;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const initialFormState: FormData = {
    direccion: {
      pais: "",
      departamento: "",
      provincia: "",
      calle: "",
      numCasa: "",
    },
    datosPrincipales: {
      vin: "",
      anio: "",
      marca: "",
      modelo: "",
      placa: "",
    },
    caracteristicas: {
      combustible: "",
      asientos: 0,
      puertas: 0,
      transmision: "",
      seguro: false,
    },
    caracteristicasAdicionales: {
      airConditioning: false,
      bluetooth: false,
      gps: false,
      bikeRack: false,
      skiStand: false,
      touchScreen: false,
      babySeat: false,
      reverseCamera: false,
      leatherSeats: false,
      antiTheft: false,
      roofRack: false,
      polarizedGlass: false,
      soundSystem: false,
      sunroof: false,
    },
    finalizacion: {
      imagenes: [],
      mantenimientos: 0,
      precioAlquiler: 0,
      descripcion: "",
    },
  };

  const [formData, setFormData] = useState<FormData>(initialFormState);

  // Funciones memoizadas para actualizaciones
  const updateDireccion = useCallback((data: DireccionData) => {
    setFormData(prev => ({ ...prev, direccion: data }));
  }, []);

  const updateDatosPrincipales = useCallback((data: DatosPrincipalesData) => {
    setFormData(prev => ({ ...prev, datosPrincipales: data }));
  }, []);

  const updateCaracteristicas = useCallback((data: CaracteristicasData) => {
    setFormData(prev => ({ ...prev, caracteristicas: data }));
  }, []);

  const updateCaracteristicasAdicionales = useCallback((data: CaracteristicasAdicionalesData) => {
    setFormData(prev => ({ ...prev, caracteristicasAdicionales: data }));
  }, []);

  const updateFinalizacion = useCallback((data: FinalizacionData) => {
    setFormData(prev => ({ ...prev, finalizacion: data }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormState);
  }, [initialFormState]);

  const convertToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }, []);

  const validateForm = useCallback(() => {
    const { direccion, datosPrincipales, caracteristicas, finalizacion } = formData;

    return (
      direccion.pais &&
      direccion.departamento &&
      direccion.provincia &&
      direccion.calle &&
      direccion.numCasa &&
      datosPrincipales.vin &&
      datosPrincipales.anio &&
      datosPrincipales.marca &&
      datosPrincipales.modelo &&
      datosPrincipales.placa &&
      caracteristicas.combustible &&
      caracteristicas.asientos > 0 &&
      caracteristicas.puertas > 0 &&
      caracteristicas.transmision &&
      caracteristicas.seguro &&
      finalizacion.imagenes.length >= 3 &&
      finalizacion.precioAlquiler > 0 &&
      finalizacion.descripcion
    );
  }, [formData]);

  const submitForm = useCallback(async (): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      if (!validateForm()) {
        throw { message: "Por favor complete todos los campos obligatorios", status: 400 } as ApiError;
      }

      // Convertir imágenes a base64
      const imagenesBase64 = await Promise.all(
        formData.finalizacion.imagenes.map(file => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Error al leer la imagen"));
            reader.readAsDataURL(file);
          });
        })
      );

      const response = await fetch("http://localhost:4000/api/v3/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          ...formData.direccion,
          ...formData.datosPrincipales,
          ...formData.caracteristicas,
          ...formData.caracteristicasAdicionales,
          imagenes: imagenesBase64,
          mantenimientos: formData.finalizacion.mantenimientos,
          precioAlquiler: formData.finalizacion.precioAlquiler,
          descripcion: formData.finalizacion.descripcion,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw {
          message: responseData.error || "Error al enviar los datos",
          status: response.status,
          details: responseData
        } as ApiError;
      }

      return { success: true, data: responseData };

    } catch (error: unknown) {
      let errorMessage = "Error desconocido al enviar el formulario";
      let statusCode = 500;

      if (typeof error === 'object' && error !== null) {
        const apiError = error as ApiError;
        errorMessage = apiError.message || errorMessage;
        statusCode = apiError.status || statusCode;

        console.error("Error detallado:", {
          message: apiError.message,
          status: apiError.status,
          code: apiError.code,
          details: apiError.details
        });
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }, [formData, validateForm]);

  return (
    <FormContext.Provider
      value={{
        formData,
        updateDireccion,
        updateDatosPrincipales,
        updateCaracteristicas,
        updateCaracteristicasAdicionales,
        updateFinalizacion,
        submitForm,
        resetForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}