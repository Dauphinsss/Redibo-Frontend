// src/contexts/form/formActions.ts
import { 
  FormData, 
  DireccionData, 
  DatosPrincipalesData, 
  CaracteristicasData, 
  CaracteristicasAdicionalesData, 
  FinalizacionData, 
} from './types';
import { validateForm } from './formValidation';
import { createFullCar, CreateFullCarPayload } from "@/app/host/services/carService";
import { uploadImage } from "@/app/host/services/imageService";
import { enviarSegurosAlBackend } from "../seguros/segurosActions";

// Acciones de actualización de formulario
export const createUpdateFormActions = (
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
) => {
  return {
    updateDireccion: (data: DireccionData) => 
      setFormData(prev => ({ ...prev, direccion: data })),
      
    updateDatosPrincipales: (data: DatosPrincipalesData) => 
      setFormData(prev => ({ ...prev, datosPrincipales: data })),
      
    updateCaracteristicas: (data: CaracteristicasData) => 
      setFormData(prev => ({ ...prev, caracteristicas: data })),
      
    updateCaracteristicasAdicionales: (data: CaracteristicasAdicionalesData) => 
      setFormData(prev => ({ ...prev, caracteristicasAdicionales: data })),
      
    updateFinalizacion: (data: FinalizacionData) => 
      setFormData(prev => ({ ...prev, finalizacion: data })),
  };
};

// Acción de envío del formulario
export const createSubmitAction = (
  formData: FormData,
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
  setSubmitError: React.Dispatch<React.SetStateAction<string | null>>,
  setSubmitSuccess: React.Dispatch<React.SetStateAction<boolean>>,
  resetForm: () => void
) => {
  return async (): Promise<{ success: boolean; error?: string }> => {
    if (!validateForm(formData)) {
      setSubmitError("Complete todos los campos obligatorios.");
      return { success: false, error: "Formulario incompleto" };
    }
    
    setIsSubmitting(true);
    setSubmitError(null);

    const {
      direccion: { id_provincia, calle, zona, num_casa, latitud, longitud },
      datosPrincipales: { vim, año, marca, modelo, placa },
      caracteristicas: { combustibleIds, asientos, puertas, transmicion, soat },
      caracteristicasAdicionales: { extraIds },
      finalizacion: { imagenes, num_mantenimientos, precio_por_dia, estado, descripcion }
    } = formData;

    const payload: CreateFullCarPayload = {
      id_provincia: Number(id_provincia),
      calle: calle || "",
      zona: zona || "",
      num_casa: num_casa ?? "",
      latitud: Number(latitud), // Aseguramos que latitud sea un número
      longitud: Number(longitud), // Aseguramos que longitud sea un número
      vim: vim || "",
      año: Number(año),
      marca: marca || "",
      modelo: modelo || "",
      placa: placa || "",
      asientos: Number(asientos),
      puertas: Number(puertas),
      soat: Boolean(soat),
      transmicion: transmicion === "Manual" ? "Manual" : "Automatica",
      combustibleIds: Array.isArray(combustibleIds) ? combustibleIds : [],
      extraIds: Array.isArray(extraIds) ? extraIds : [],
      precio_por_dia: Number(precio_por_dia),
      num_mantenimientos: Number(num_mantenimientos) || 0,
      estado: estado || "",
      descripcion: descripcion ?? "",
    };

    try {
      const result = await createFullCar(payload);
      if (!result.success) {
        setSubmitError(result.message || "Error al crear el carro");
        return { success: false, error: result.message };
      }
      const carId = result.data.id;
      await Promise.all(imagenes.map(file => uploadImage(carId, file)));
      // Nuevo: asociar seguros adicionales al carro
      const segurosResult = await enviarSegurosAlBackend(carId);
      if (!segurosResult.success) {
        setSubmitError(segurosResult.error || "Error al asociar seguros");
        return { success: false, error: segurosResult.error };
      }
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
  };
};