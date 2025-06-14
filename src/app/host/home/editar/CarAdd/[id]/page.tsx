"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL ||"http://localhost:4000";

// Lista de características disponibles con nombres exactos
const CARACTERISTICAS_OPTIONS = [
  { id: "air-conditioning", label: "Aire acondicionado" },
  { id: "reverse-camera", label: "Cámara de reversa" },
  { id: "bluetooth", label: "Bluetooth" },
  { id: "leather-seats", label: "Asientos de cuero" },
  { id: "gps", label: "GPS" },
  { id: "anti-theft", label: "Sistema antirrobo" },
  { id: "bike-rack", label: "Portabicicletas" },
  { id: "roof-rack", label: "Toldo o rack de techo" },
  { id: "ski-stand", label: "Soporte para esquís" },
  { id: "polarized-glass", label: "Vidrios polarizados" },
  { id: "touch-screen", label: "Pantalla táctil" },
  { id: "sound-system", label: "Sistema de sonido" },
  { id: "baby-seat", label: "Sillas para bebé" },
];

const CaracteristicasAdicionalesPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const vehiculoId = params?.id ? params.id.toString() : "1";

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaracteristicas = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log(`Fetching: ${API_URL}/api/v1/vehiculo/${vehiculoId}/caracteristicas-adicionales`);
        const response = await axios.get(`${API_URL}/api/v1/vehiculo/${vehiculoId}/caracteristicas-adicionales`);
        console.log("Response data:", response.data);
        
        if (response.data) {
          // Extraer las características de la respuesta, adaptándose a diferentes estructuras posibles
          const caracteristicasActivas = 
            Array.isArray(response.data) ? response.data : 
            response.data.caracteristicasAdicionales || 
            [];
          
          const itemsSeleccionados = CARACTERISTICAS_OPTIONS
            .filter(item => caracteristicasActivas.includes(item.label))
            .map(item => item.id);
            
          setSelectedItems(itemsSeleccionados);
        }
      } catch (err: unknown) {
        const error = err as Error & { response?: { data?: { message?: string } } };
        console.error("Error loading features:", error);
        setError(`Error al cargar: ${error.response?.data?.message || error.message || "Error desconocido"}`);      
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaracteristicas();
  }, [vehiculoId]);

  useEffect(() => {
    // Validar número de características cada vez que cambia la selección
    if (selectedItems.length < 2) {
      setValidationError("Debe seleccionar al menos 2 características adicionales");
    } else {
      setValidationError(null);
    }
  }, [selectedItems]);

  const handleCheckboxChange = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Función para validar el formulario antes de mostrar el diálogo
  const handlePrepareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convertir los IDs seleccionados a los nombres exactos para el backend
    const caracteristicasParaEnviar = selectedItems
      .map(id => {
        const caracteristica = CARACTERISTICAS_OPTIONS.find(item => item.id === id);
        return caracteristica ? caracteristica.label : null;
      })
      .filter(Boolean) as string[];
    
    // Verificar que haya al menos dos características seleccionadas
    if (caracteristicasParaEnviar.length < 2) {
      setValidationError("Debe seleccionar al menos 2 características adicionales");
      return;
    }
    
    // Si la validación pasa, el diálogo se abrirá automáticamente
    // porque el botón está conectado como AlertDialogTrigger
    setValidationError(null);
  };

  // Función para procesar el envío después de confirmar en el diálogo
  const handleConfirmSubmit = async () => {
    // Verificar nuevamente antes de enviar
    if (selectedItems.length < 2) {
      setValidationError("Debe seleccionar al menos 2 características adicionales");
      return;
    }
    
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Convertir los IDs seleccionados a los nombres exactos para el backend
      const caracteristicasParaEnviar = selectedItems
        .map(id => {
          const caracteristica = CARACTERISTICAS_OPTIONS.find(item => item.id === id);
          return caracteristica ? caracteristica.label : null;
        })
        .filter(Boolean) as string[];

      console.log("Array de características para enviar:", caracteristicasParaEnviar);

      // CORRECCIÓN: Enviar objeto con la propiedad nuevasCaracteristicasAdicionales
      // CORRECCIÓN: Usar PUT en lugar de POST para coincidir con la ruta
     
      await axios.put(
        `${API_URL}/api/v1/vehiculo/${vehiculoId}/caracteristicas-adicionales`, 
        { 
          nuevasCaracteristicasAdicionales: caracteristicasParaEnviar 
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      

      setSuccessMessage("Características guardadas correctamente");
      
      // Redirigir después de un breve retraso
      setTimeout(() => router.push("/host/pages"), 1500);
    } catch (err: unknown) {
      const error = err as Error & { response?: { data?: { message?: string } } };
      console.error("Error completo:", error);
    }
     finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("¿Desea cancelar? Los cambios no guardados se perderán.")) {
      router.push("/host/pages");
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-blue-500 mb-3 md:mb-4" />
        <p className="text-base md:text-lg">Cargando características...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 flex flex-col items-start min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl md:text-4xl font-bold my-3 md:my-5 pl-2 md:pl-7">Características Adicionales</h1>
      </div>

      {error && (
        <div className="w-full max-w-5xl mb-3 md:mb-4 pl-2 md:pl-7">
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 md:px-4 md:py-3 rounded text-sm md:text-base">
            {error}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="w-full max-w-5xl mb-3 md:mb-4 pl-2 md:pl-7">
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 md:px-4 md:py-3 rounded text-sm md:text-base">
            {successMessage}
          </div>
        </div>
      )}

      <div className="w-full flex items-center justify-center">
        <form onSubmit={handlePrepareSubmit} className="w-full max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6 px-2 md:px-0">
            {CARACTERISTICAS_OPTIONS.map((item) => (
              <div key={item.id} className="flex items-center space-x-2 py-1 md:py-2">
                <Checkbox
                  id={`feature-${item.id}`}
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => handleCheckboxChange(item.id)}
                  className="h-4 w-4 md:h-5 md:w-5"
                />
                <label
                  htmlFor={`feature-${item.id}`}
                  className="text-xs md:text-sm font-medium"
                >
                  {item.label}
                </label>
              </div>
            ))}
          </div>

          {validationError && (
            <div className="w-full mb-3 md:mb-4 px-2 md:px-0">
              <div className="text-red-600 text-sm md:text-base">
                {validationError}
              </div>
            </div>
          )}

          <div className="w-full flex flex-col sm:flex-row justify-between items-center mt-6 md:mt-10 gap-4 px-2 md:px-0">
            <Button 
              type="button"
              onClick={handleCancel}
              variant="secondary"
              className="w-full sm:w-[160px] h-10 md:h-12 text-base md:text-lg font-semibold transition-colors duration-200"
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
                  className="w-full sm:w-auto h-10 md:h-12 text-base md:text-lg font-semibold text-white px-4 md:px-6"
                  disabled={isSaving || selectedItems.length < 2}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      GUARDANDO...
                    </>
                  ) : (
                    "FINALIZAR EDICIÓN Y GUARDAR"
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-md mx-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Guardar cambios
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Desea guardar los cambios en las características adicionales?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <AlertDialogCancel className="mt-2 sm:mt-0">Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmSubmit}>
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaracteristicasAdicionalesPage;