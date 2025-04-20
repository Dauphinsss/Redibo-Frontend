"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo
} from "react";

interface DireccionData {
  provinciaId: number;
  calle: string;
  zona: string;
  num_casa?: string;
}

interface DatosPrincipalesData {
  vim: string;
  anio: number;
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
  submitForm(): Promise<void>;
  resetForm(): void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const initialFormData: FormData = {
  direccion: { provinciaId: 0, calle: "", zona: "", num_casa: "" },
  datosPrincipales: {
    vim: "",
    anio: new Date().getFullYear(),
    marca: "",
    modelo: "",
    placa: ""
  },
  caracteristicas: {
    combustibleIds: [],
    asientos: 0,
    puertas: 0,
    transmicion: "automatica",
    soat: false
  },
  caracteristicasAdicionales: { extraIds: [] },
  finalizacion: {
    imagenes: [],
    num_mantenimientos: 0,
    precio_por_dia: 0,
    estado: "disponible",
    descripcion: ""
  }
};

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const updateDireccion = useCallback(
    (data: DireccionData) =>
      setFormData((prev) => ({ ...prev, direccion: data })),
    []
  );
  const updateDatosPrincipales = useCallback(
    (data: DatosPrincipalesData) =>
      setFormData((prev) => ({ ...prev, datosPrincipales: data })),
    []
  );
  const updateCaracteristicas = useCallback(
    (data: CaracteristicasData) =>
      setFormData((prev) => ({ ...prev, caracteristicas: data })),
    []
  );
  const updateCaracteristicasAdicionales = useCallback(
    (data: CaracteristicasAdicionalesData) =>
      setFormData((prev) => ({ ...prev, caracteristicasAdicionales: data })),
    []
  );
  const updateFinalizacion = useCallback(
    (data: FinalizacionData) =>
      setFormData((prev) => ({ ...prev, finalizacion: data })),
    []
  );
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setSubmitError(null);
    setSubmitSuccess(false);
  }, []);

  const validateForm = useCallback(() => {
    const { direccion, datosPrincipales, caracteristicas, finalizacion, caracteristicasAdicionales } =
      formData;
    return (
      direccion.provinciaId > 0 &&
      direccion.calle.trim() !== "" &&
      direccion.zona.trim() !== "" &&
      datosPrincipales.vim.trim() !== "" &&
      datosPrincipales.anio >= 1900 &&
      datosPrincipales.marca.trim() !== "" &&
      datosPrincipales.modelo.trim() !== "" &&
      datosPrincipales.placa.trim() !== "" &&
      caracteristicas.combustibleIds.length > 0 &&
      caracteristicas.asientos > 0 &&
      caracteristicas.puertas > 0 &&
      caracteristicasAdicionales.extraIds.length > 0 && // Validación de extraIds
      finalizacion.imagenes.length >= 3 &&
      finalizacion.precio_por_dia > 0 &&
      finalizacion.estado.trim() !== ""
    );
  }, [formData]);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const b64 = (reader.result as string).split(",")[1];
        resolve(b64);
      };
      reader.onerror = (err) => reject(err);
    });

  const submitForm = useCallback(async () => {
    if (!validateForm()) {
      setSubmitError("Complete todos los campos obligatorios.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);

    const {
      direccion: { provinciaId, calle, zona, num_casa },
      datosPrincipales: { vim, anio, marca, modelo, placa },
      caracteristicas: { combustibleIds, asientos, puertas, transmicion, soat },
      caracteristicasAdicionales: { extraIds },
      finalizacion: {
        imagenes,
        num_mantenimientos,
        precio_por_dia,
        estado,
        descripcion
      }
    } = formData;

    const imagesBase64 = await Promise.all(imagenes.map(toBase64));
    const id_usuario_rol = 1; //No se donde ponerlo dado que en si el backend no deberia tener problemas si este no esa presente
    //lo puse por si acaso pero en si no se como implementar lo, hay un problema entre backend y forntend.

    const payload = {
      provinciaId,
      calle,
      zona,
      num_casa: num_casa || null,
      vim,
      anio,
      marca,
      modelo,
      placa,
      asientos,
      puertas,
      soat,
      combustibleIds,
      extraIds,
      imagesBase64,
      precio_por_dia,
      num_mantenimientos,
      transmicion,
      estado,
      descripcion,
      //id_usuario_rol deberia de entrar dado que tuve que modificar el backend por que me decia
      //error 500 por que no le estaba pasando el id_usuario_rol lo que en si no deberia pasar, 
      //pero incluso si le paso el id_usuario_rol no me lo toma en cuenta y no se por que.
    };

    try {
      const apiUrl = "http://localhost:4000/api/v2";
      if (!apiUrl) {
        throw new Error("La variable de entorno NEXT_PUBLIC_API_URL no está definida.");
      }

      const res = await fetch(`${apiUrl}/cars/full`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok) {
        const errorMsg = Array.isArray(json.errors)
          ? json.errors.map((e: any) => `${e.field}: ${e.message}`).join("\n")
          : json.message || JSON.stringify(json);
        setSubmitError(errorMsg);
      } else {
        setSubmitSuccess(true);
        resetForm();
      }
    } catch (err: any) {
      setSubmitError(err.message || "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, resetForm]);

  return (
    <FormContext.Provider
      value={{
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
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormContext debe usarse dentro de FormProvider");
  return ctx;
}