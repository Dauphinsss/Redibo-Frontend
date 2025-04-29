"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const API_URL = "https://redibo-backend-sprinteros1.onrender.com/api";

interface CarFormData {
  brand: string;
  model: string;
  year: string;
  vin: string;
  plate: string;
}

const years = Array.from({ length: 11 }, (_, i) => {
  const year = 2025 - i;
  return { label: year.toString(), value: year.toString() };
});

export default function DatosPrincipales() {
  const router = useRouter();
  const params = useParams();
  const carId = params?.id ? parseInt(params.id as string) : null;

  const [formData, setFormData] = useState<CarFormData>({
    brand: "",
    model: "",
    year: "",
    vin: "",
    plate: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CarFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const fetchCarData = async () => {
      if (!carId) {
        setIsLoading(false);
        setGeneralError("ID del vehículo no encontrado");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/vehiculo/${carId}`);
        let vehiculoData = response.data;

        if (response.data.data) vehiculoData = response.data.data;
        if (response.data.vehiculo) vehiculoData = response.data.vehiculo;

        const initialData = {
          brand: vehiculoData.marca || "",
          model: vehiculoData.modelo || "",
          year: vehiculoData.año?.toString() || "",
          vin: vehiculoData.vim || "",
          plate: vehiculoData.placa || "",
        };

        setFormData(initialData);
        
        // Validar inicialmente todos los campos
        const initialErrors: Partial<Record<keyof CarFormData, string>> = {};
        Object.entries(initialData).forEach(([key, value]) => {
          const fieldKey = key as keyof CarFormData;
          const error = validateField(fieldKey, value as string);
          if (error) initialErrors[fieldKey] = error;
        });
        
        setFieldErrors(initialErrors);
        
      } catch {
        try {
          const [marcaResp, modeloResp, anioResp, vimResp, placaResp] = await Promise.all([
            axios.get(`${API_URL}/vehiculo/${carId}/marca`).catch(() => ({ data: "" })),
            axios.get(`${API_URL}/vehiculo/${carId}/modelo`).catch(() => ({ data: "" })),
            axios.get(`${API_URL}/vehiculo/${carId}/anio`).catch(() => ({ data: "" })),
            axios.get(`${API_URL}/vehiculo/${carId}/vim`).catch(() => ({ data: "" })),
            axios.get(`${API_URL}/vehiculo/${carId}/placa`).catch(() => ({ data: "" })),
            
          ]);

          const initialData = {
            brand: typeof marcaResp.data === "object" ? marcaResp.data.marca || "" : marcaResp.data || "",
            model: typeof modeloResp.data === "object" ? modeloResp.data.modelo || "" : modeloResp.data || "",
            year: typeof anioResp.data === "object" ? anioResp.data.año?.toString() || "" : anioResp.data?.toString() || "",
            vin: typeof vimResp.data === "object" ? vimResp.data.vim || "" : vimResp.data || "",
            plate: typeof placaResp.data === "object" ? placaResp.data.placa || "" : placaResp.data || "",
          };

          setFormData(initialData);
          
          // Validar inicialmente todos los campos
          const initialErrors: Partial<Record<keyof CarFormData, string>> = {};
          Object.entries(initialData).forEach(([key, value]) => {
            const fieldKey = key as keyof CarFormData;
            const error = validateField(fieldKey, value as string);
            if (error) initialErrors[fieldKey] = error;
          });
          
          setFieldErrors(initialErrors);
          
        } catch {
          setGeneralError("Error al cargar los datos del vehículo");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarData();
  }, [carId]);

  // Efecto para verificar la validez del formulario cada vez que cambian los errores
  useEffect(() => {
    const isValid = Object.keys(fieldErrors).length === 0 && 
                    formData.brand.trim() !== '' && 
                    formData.model.trim() !== '' && 
                    formData.year.trim() !== '' && 
                    formData.vin.trim() !== '' && 
                    formData.plate.trim() !== '';
    
    setIsFormValid(isValid);
  }, [fieldErrors, formData]);

  const handleChange = (field: keyof CarFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Validar el campo inmediatamente
    const error = validateField(field, value);
    
    // Actualizar los errores
    setFieldErrors((prev) => {
      if (error) {
        return { ...prev, [field]: error };
      } else {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
    });
    
    setGeneralError(null);
  };
  
  const validateField = (field: keyof CarFormData, value: string): string | undefined => {
    switch (field) {
      case "brand":
        if (!value.trim()) return "La marca es obligatoria";
        if (value !== value.toUpperCase()) return "La marca debe estar en MAYÚSCULAS";
        if (!/^[A-Z\s]+$/.test(value)) return "Solo letras mayúsculas y espacios permitidos";
        break;
      case "model":
        if (!value.trim()) return "El modelo es obligatorio";
        if (value !== value.toUpperCase()) return "El modelo debe estar en MAYÚSCULAS";
        if (!/^[A-Z\s]+$/.test(value)) return "Solo letras mayúsculas y espacios permitidos";
        break;
      case "year":
        if (!value) return "Debe seleccionar un año";
        if (isNaN(parseInt(value))) return "Año inválido";
        break;
      case "plate":
        if (!value.trim()) return "La placa es obligatoria";
        if (!/^[0-9]{3,4}-[A-Z]{0,3}$/.test(value)) return "Formato de placa inválido (ej. 1234-ABC)";
        if (value !== value.toUpperCase()) return "La placa debe estar en MAYÚSCULAS";
        break;
      case "vin":
        if (!value.trim()) return "El VIN es obligatorio";
        if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(value)) return "El VIN debe tener 17 caracteres válidos";
        if (value !== value.toUpperCase()) return "El VIN debe estar en MAYÚSCULAS";
        break;
    }
    return undefined;
  };  

  // Función para manejar la validación del formulario antes de mostrar el diálogo
  const handlePrepareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carId) {
      setGeneralError("ID del vehículo no encontrado");
      return;
    }

    // Validar todos los campos nuevamente para asegurarse
    const errors: Partial<Record<keyof CarFormData, string>> = {};
    Object.entries(formData).forEach(([key, value]) => {
      const fieldKey = key as keyof CarFormData;
      const error = validateField(fieldKey, value as string);
      if (error) errors[fieldKey] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    // Si la validación pasa, el diálogo se abrirá automáticamente por estar
    // conectado al botón como AlertDialogTrigger
  };

  // Función para procesar el envío real después de confirmar en el diálogo
  const handleConfirmSubmit = async () => {
    if (!carId) {
      setGeneralError("ID del vehículo no encontrado");
      return;
    }

    // Volver a validar antes de enviar
    if (!isFormValid) {
      setGeneralError("Por favor, corrija los errores antes de continuar");
      return;
    }

    try {
      setIsSaving(true);
      const backendData = {
        vim: formData.vin,
        año: parseInt(formData.year),
        marca: formData.brand,
        modelo: formData.model,
        placa: formData.plate,
      };

      const response = await axios.put(`${API_URL}/vehiculo/${carId}`, backendData);

      if (response.status === 200 || response.data?.mensaje) {
        toast.success(response.data.mensaje || "¡Datos guardados correctamente!");
        setTimeout(() => {
          router.push("/host/pages");
        }, 1000);
      } else {
        setGeneralError("No se pudieron guardar los cambios.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setGeneralError(err.response?.data?.mensaje || "Error al guardar. Verifique la conexión.");
      } else if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError("Error inesperado al guardar.");
      }
    }
    
  };

  const handleCancel = () => {
    if (Object.values(formData).some((v) => v !== "")) {
      if (window.confirm("¿Desea cancelar? Los cambios no guardados se perderán.")) {
        router.push("/host/pages");
      }
    } else {
      router.push("/host/cars");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <p className="text-lg">Cargando datos del vehículo...</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl flex justify-start">
        <h1 className="text-4xl font-bold my-5 pl-7">Datos principales</h1>
      </div>

      <span className="text-lg font-medium pl-9 mb-6">
        Actualice los datos principales del vehículo
      </span>

      {generalError && (
        <div className="w-full max-w-5xl mb-6 pl-9">
          <p className="text-red-500">{generalError}</p>
        </div>
      )}

      <form onSubmit={handlePrepareSubmit} className="w-full max-w-5xl pl-13">

        {/* VIN */}
        <div className="w-full flex flex-col mt-4">
          <label className="text-lg font-semibold mb-1">Número de VIN</label>
          <Input
            type="text"
            value={formData.vin}
            onChange={(e) => handleChange("vin", e.target.value)}
            className={`w-[600px] mt-2 border-2 rounded-md ${
              fieldErrors.vin ? "border-red-500" : "border-black"
            }`}
            placeholder="Introducir Número VIN (EN MAYÚSCULAS)"
          />
          {fieldErrors.vin && <span className="text-sm text-red-500 mt-1">{fieldErrors.vin}</span>}
        </div>

        {/* Año */}
        <div className="w-full flex flex-col mt-6">
          <label className="text-lg font-semibold mb-1">Año del coche</label>
          <Select value={formData.year} onValueChange={(value) => handleChange("year", value)}>
            <SelectTrigger
              className={`w-[600px] mt-2 border-2 rounded-md ${
                fieldErrors.year ? "border-red-500" : "border-black"
              }`}
            >
              <SelectValue placeholder="Seleccione el año" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {years.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {fieldErrors.year && <span className="text-sm text-red-500 mt-1">{fieldErrors.year}</span>}
        </div>

        {/* Marca */}
        <div className="w-full flex flex-col mt-6">
          <label className="text-lg font-semibold mb-1">Marca</label>
          <Input
            type="text"
            value={formData.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
            className={`w-[600px] mt-2 border-2 rounded-md ${
              fieldErrors.brand ? "border-red-500" : "border-black"
            }`}
            placeholder="Introducir Marca (EN MAYÚSCULAS)"
          />
          {fieldErrors.brand && <span className="text-sm text-red-500 mt-1">{fieldErrors.brand}</span>}
        </div>

        {/* Modelo */}
        <div className="w-full flex flex-col mt-6">
          <label className="text-lg font-semibold mb-1">Modelo</label>
          <Input
            type="text"
            value={formData.model}
            onChange={(e) => handleChange("model", e.target.value)}
            className={`w-[600px] mt-2 border-2 rounded-md ${
              fieldErrors.model ? "border-red-500" : "border-black"
            }`}
            placeholder="Introducir Modelo (EN MAYÚSCULAS)"
          />
          {fieldErrors.model && <span className="text-sm text-red-500 mt-1">{fieldErrors.model}</span>}
        </div>

        {/* Placa */}
        <div className="w-full flex flex-col mt-6">
          <label className="text-lg font-semibold mb-1">Placa</label>
          <Input
            type="text"
            value={formData.plate}
            onChange={(e) => handleChange("plate", e.target.value)}
            className={`w-[600px] mt-2 border-2 rounded-md ${
              fieldErrors.plate ? "border-red-500" : "border-black"
            }`}
            placeholder="Introducir Placa (formato: 1234-ABC)"
          />
          {fieldErrors.plate && <span className="text-sm text-red-500 mt-1">{fieldErrors.plate}</span>}
        </div>

        {/* Botones */}
        <div className="w-full flex justify-between items-center mt-10">
            <Button
            type="button"
            onClick={handleCancel}
            variant="secondary"
            className="w-[160px] h-12 text-lg font-semibold transition-colors duration-200"
            style={{ backgroundColor: "#D3D3D3" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E0E0E0")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#D3D3D3")}
            disabled={isLoading || isSaving}
            >
            CANCELAR
            </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="submit"
                variant="default"
                className="h-12 text-lg font-semibold text-white px-6"
                disabled={isLoading || isSaving || !isFormValid}
              >
                {isSaving ? "GUARDANDO..." : "FINALIZAR EDICIÓN Y GUARDAR"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Guardar cambios
                </AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Desea guardar los cambios efectuados?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmSubmit}
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </div>
  );
}