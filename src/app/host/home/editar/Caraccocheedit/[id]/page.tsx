"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

const API_URL = "http://localhost:4000/api";

// Opciones predefinidas que coinciden con el esquema de la base de datos
const ASIENTOS_OPTIONS = [2, 4, 5, 7, 9].map(num => ({
  label: num.toString(),
  value: num.toString()
}));

const PUERTAS_OPTIONS = [2, 3, 4, 5].map(num => ({
  label: num.toString(),
  value: num.toString()
}));

// Actualizado: "Mecánica" cambiado a "Manual"
const TRANSMISION_OPTIONS = [
  { label: "Manual", value: "Manual" },
  { label: "Automática", value: "Automática" }
];

const COMBUSTIBLE_OPTIONS = [
  { id: "gasolina", label: "Gasolina" },
  { id: "gnv", label: "GNV" },
  { id: "electrico", label: "Eléctrico" },
  { id: "diesel", label: "Diesel" }
];

interface CaracteristicasFormData {
  combustibles: string[]; // Array de ids de combustibles
  asientos: string;
  puertas: string;
  transmision: string; // Corregido: "transmicion" a "transmision" según la nueva respuesta
  soat: boolean;
}

interface ValidationErrors {
  combustibles?: string;
  asientos?: string;
  puertas?: string;
  transmision?: string;
  soat?: string;
}

const CaracteristicasPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const vehiculoId = params?.id ? params.id.toString() : null;

  const [formData, setFormData] = useState<CaracteristicasFormData>({
    combustibles: [],
    asientos: "",
    puertas: "",
    transmision: "", // Actualizando para coincidir con la respuesta
    soat: false
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchCaracteristicas = async () => {
      if (!vehiculoId) {
        setIsLoading(false);
        return;
      }
  
      try {
        console.log(`Intentando acceder a: ${API_URL}/vehiculo/${vehiculoId}/caracteristicas`);
        const response = await axios.get(`${API_URL}/vehiculo/${vehiculoId}/caracteristicas`);
        const carData = response.data;
        console.log("Datos del vehículo:", carData);
  
        // Manejo de tipos de combustible como array
        let combustiblesList = [];
        
        // Verificar si tipoDeCombustible es un array o un string
        if (Array.isArray(carData.tipoDeCombustible)) {
          combustiblesList = carData.tipoDeCombustible;
        } else if (typeof carData.tipoDeCombustible === 'string') {
          // Si viene como string separado por comas, lo convertimos a array
            combustiblesList = carData.tipoDeCombustible.split(", ").filter((item: string) => item);
        }
        
        // Mapear nombres de combustibles a IDs
        const combustiblesIds = combustiblesList.map((nombre: string) => {
          const combustible = COMBUSTIBLE_OPTIONS.find(
            opt => opt.label.toLowerCase() === nombre.toLowerCase()
          );
          return combustible ? combustible.id : null;
        }).filter((id: string | null): id is string => id !== null);
  
        setFormData({
          combustibles: combustiblesIds,
          asientos: carData.asientos?.toString() || "5",
          puertas: carData.puertas?.toString() || "4",
          transmision: carData.transmision || carData.transmicion || "Manual", // Aceptar ambas variantes
          soat: carData.soat || false
        });
  
      } catch (err: any) {
        console.error("Error completo:", err);
        console.error("URL solicitada:", err.config?.url);
        const errorMsg = err.response?.data?.message || err.message || "No se pudieron cargar las características del vehículo";
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchCaracteristicas();
  }, [vehiculoId]);

  // Validación en tiempo real cuando cambian los valores
  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const errors: ValidationErrors = {};
    
    // Validación de combustibles (seleccionar 1 o 2 tipos)
    if (formData.combustibles.length === 0) {
      errors.combustibles = "Seleccione al menos un tipo de combustible";
    } else if (formData.combustibles.length > 2) {
      errors.combustibles = "Seleccione máximo 2 tipos de combustible";
    }

    // Validación de asientos
    if (!formData.asientos) {
      errors.asientos = "Debe seleccionar el número de asientos";
    }

    // Validación de puertas
    if (!formData.puertas) {
      errors.puertas = "Debe seleccionar el número de puertas";
    }

    // Validación de transmisión
    if (!formData.transmision) {
      errors.transmision = "Debe seleccionar un tipo de transmisión";
    }

    // Validación de SOAT
    if (!formData.soat) {
      errors.soat = "El SOAT es obligatorio";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCombustibleChange = (id: string) => {
    setTouchedFields({...touchedFields, combustibles: true});
    setFormData(prev => {
      const newCombustibles = prev.combustibles.includes(id)
        ? prev.combustibles.filter(c => c !== id)
        : [...prev.combustibles, id];
      
      return {
        ...prev,
        combustibles: newCombustibles
      };
    });
  };

  const handleFieldChange = (field: keyof Omit<CaracteristicasFormData, 'combustibles'>, value: string | boolean) => {
    setTouchedFields({...touchedFields, [field]: true});
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados para mostrar todos los errores
    const allTouched = {
      combustibles: true,
      asientos: true,
      puertas: true,
      transmision: true,
      soat: true
    };
    setTouchedFields(allTouched);
    
    if (!validateForm()) {
      setError("Por favor, corrija los errores antes de continuar");
      return;
    }
    
    if (!vehiculoId) {
      setError("ID del vehículo no encontrado");
      return;
    }
    
    try {
      setIsSaving(true);
      setError(null);
  
      // Convertir IDs de combustibles a nombres y mantenerlos como array
      const tipoDeCombustible = formData.combustibles
        .map(id => {
          const combustible = COMBUSTIBLE_OPTIONS.find(opt => opt.id === id);
          return combustible ? combustible.label : null;
        })
        .filter(nombre => nombre !== null);
  
      // Preparar todos los datos para enviar a través de la API
      const caracteristicasData = {
        asientos: parseInt(formData.asientos),
        puertas: parseInt(formData.puertas),
        transmicion: formData.transmision, // Nota: Aquí usamos "transmicion" para coincidir con el backend
        soat: formData.soat,
        tipoDeCombustible: tipoDeCombustible // Ahora es un array
      };
      
      console.log("Enviando datos de características:", caracteristicasData);
      console.log(`Intentando actualizar: ${API_URL}/vehiculo/${vehiculoId}/caracteristicas`);
  
      // Actualizar características usando la ruta correcta
      await axios.put(`${API_URL}/vehiculo/${vehiculoId}/caracteristicas`, caracteristicasData);
  
      router.push("/host/pages");
    } catch (err: any) {
      console.error("Error completo al guardar:", err);
      console.error("URL solicitada para guardar:", err.config?.url);
      console.error("Datos enviados:", err.config?.data);
      const errorMsg = err.response?.data?.message || err.message || "Error al guardar las características";
      setError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("¿Está seguro que desea cancelar? Los cambios no guardados se perderán.")) {
      router.push("/host"); // Si confirma, vuelve a la lista de autos
    }
    // No hace nada si el usuario cancela el diálogo, simplemente permanece en la página actual
  };

  if (isLoading) {
    return <div className="p-6 flex justify-center min-h-screen">Cargando...</div>;
  }

  // Función para mostrar mensaje de error si el campo ha sido tocado y tiene error
  const showErrorMessage = (fieldName: keyof ValidationErrors) => {
    return touchedFields[fieldName] && validationErrors[fieldName] ? (
      <p className="text-red-500 text-sm mt-1">{validationErrors[fieldName]}</p>
    ) : null;
  };

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold my-5 pl-7">Características del coche</h1>
      </div>

      {error && (
        <div className="w-full max-w-5xl mb-4 px-7">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-5xl pl-7">
        {/* Combustible */}
        <div className="mb-6">
          <label className="text-lg font-semibold mb-2">Tipo de combustible*</label>
          <div className="mt-2 space-y-2">
            {COMBUSTIBLE_OPTIONS.map((item) => (
              <div key={item.id} className="flex items-center">
                <Checkbox
                  id={item.id}
                  checked={formData.combustibles.includes(item.id)}
                  onCheckedChange={() => handleCombustibleChange(item.id)}
                />
                <label htmlFor={item.id} className="ml-2">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
          {showErrorMessage('combustibles')}
        </div>

        {/* Asientos */}
        <div className="mb-6">
          <label className="text-lg font-semibold mb-2">Asientos*</label>
          <Select
            value={formData.asientos}
            onValueChange={(value) => handleFieldChange("asientos", value)}
          >
            <SelectTrigger className={`w-[600px] border-2 ${touchedFields.asientos && validationErrors.asientos ? 'border-red-500' : ''}`}>
              <SelectValue>
                {ASIENTOS_OPTIONS.find(opt => opt.value === formData.asientos)?.label || "Seleccione"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {ASIENTOS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {showErrorMessage('asientos')}
        </div>

        {/* Puertas */}
        <div className="mb-6">
          <label className="text-lg font-semibold mb-2">Puertas*</label>
          <Select
            value={formData.puertas}
            onValueChange={(value) => handleFieldChange("puertas", value)}
          >
            <SelectTrigger className={`w-[600px] border-2 ${touchedFields.puertas && validationErrors.puertas ? 'border-red-500' : ''}`}>
              <SelectValue>
                {PUERTAS_OPTIONS.find(opt => opt.value === formData.puertas)?.label || "Seleccione"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {PUERTAS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {showErrorMessage('puertas')}
        </div>

        {/* Transmisión */}
        <div className="mb-6">
          <label className="text-lg font-semibold mb-2">Transmisión*</label>
          <Select
            value={formData.transmision}
            onValueChange={(value) => handleFieldChange("transmision", value)}
          >
            <SelectTrigger className={`w-[600px] border-2 ${touchedFields.transmision && validationErrors.transmision ? 'border-red-500' : ''}`}>
              <SelectValue>
                {TRANSMISION_OPTIONS.find(opt => opt.value === formData.transmision)?.label || "Seleccione"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {TRANSMISION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {showErrorMessage('transmision')}
        </div>

        {/* SOAT */}
        <div className="mb-6">
          <label className="text-lg font-semibold mb-2">Seguro SOAT*</label>
          <div className="flex items-center">
            <Checkbox
              id="soat"
              checked={formData.soat}
              onCheckedChange={(checked) => handleFieldChange("soat", checked as boolean)}
              className={touchedFields.soat && validationErrors.soat ? 'border-red-500' : ''}
            />
            <label htmlFor="soat" className="ml-2">
              SOAT 
            </label>
          </div>
          {showErrorMessage('soat')}
        </div>
        {/* Botones */}
        <div className="flex justify-between mt-10">
          <Button
            type="button"
            onClick={handleCancel}
            variant="secondary"
            className="w-40 h-12"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="w-64 h-12"
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "FINALIZAR EDICIÓN Y GUARDAR"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CaracteristicasPage;