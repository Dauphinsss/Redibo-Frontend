"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

const API_URL = "http://localhost:4000/api";

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
  const vehiculoId = params?.id ? params.id.toString() : "1"; // Default a "1" si no hay ID

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaracteristicas = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log(`Intentando obtener: ${API_URL}/vehiculo/${vehiculoId}/caracteristicas-adicionales`);
        const response = await axios.get(`${API_URL}/vehiculo/${vehiculoId}/caracteristicas-adicionales`);
        console.log("Respuesta del servidor:", response.data);
        
        if (response.data && response.data.caracteristicasAdicionales) {
          const caracteristicasActivas = response.data.caracteristicasAdicionales;
          
          // Mapear los nombres a IDs
          const itemsSeleccionados = CARACTERISTICAS_OPTIONS
            .filter(item => caracteristicasActivas.includes(item.label))
            .map(item => item.id);
            
          setSelectedItems(itemsSeleccionados);
        }
      } catch (err: any) {
        console.error("Error al cargar características:", err);
        setError(`No se pudieron cargar las características: ${err.message || "Error desconocido"}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaracteristicas();
  }, [vehiculoId]);

  const handleCheckboxChange = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Convertir los IDs seleccionados a nombres para enviar
      const caracteristicasParaEnviar = selectedItems
        .map(id => {
          const caracteristica = CARACTERISTICAS_OPTIONS.find(item => item.id === id);
          return caracteristica ? caracteristica.label : null;
        })
        .filter(Boolean); // Filtrar null/undefined

      console.log("Nombres de características a enviar:", caracteristicasParaEnviar);
      
      // Verificar que haya al menos una característica seleccionada
      if (caracteristicasParaEnviar.length === 0) {
        setError("Error al guardar: Debe seleccionar al menos una característica adicional");
        setIsSaving(false);
        return;
      }
      
      // Enviar el array de características seleccionadas dentro de un objeto
      const response = await axios.post(
        `${API_URL}/vehiculo/${vehiculoId}/caracteristicas-adicionales`, 
        { caracteristicasAdicionales: caracteristicasParaEnviar }  // Enviar como objeto con la propiedad caracteristicasAdicionales
      );

      console.log("Respuesta exitosa:", response.data);
      setSuccessMessage("Características guardadas con éxito");
      
      // Redirigir después de un breve retraso
      setTimeout(() => {
        router.push("/host/cars");
      }, 1500);
    } catch (err: any) {
      console.error("Error completo:", err);
      
      // Si hay un error en la respuesta, intentamos extraer el mensaje detallado
      const errorMessage = err.response?.data?.mensaje || err.response?.data?.error || err.message;
      setError(`Error al guardar: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/host/cars");
  };

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-lg">Cargando características adicionales...</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      {/* Título */}
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold my-5 pl-7">Características Adicionales</h1>
      </div>

      {/* Mensajes de error o éxito */}
      {error && (
        <div className="w-full max-w-5xl mb-4 pl-7">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="w-full max-w-5xl mb-4 pl-7">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        </div>
      )}

      {/* Lista de Checkbox */}
      <div className="w-full h-120 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-5xl">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {CARACTERISTICAS_OPTIONS.map((item) => (
              <div key={item.id} className="flex items-center space-x-2 py-2">
                <Checkbox
                  id={`feature-${item.id}`}
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => handleCheckboxChange(item.id)}
                  className="h-5 w-5"
                />
                <label
                  htmlFor={`feature-${item.id}`}
                  className="text-sm font-medium"
                >
                  {item.label}
                </label>
              </div>
            ))}
          </div>

          {/* Sección de Botones */}
          <div className="w-full flex justify-between items-center mt-10">
            <Button 
              type="button"
              onClick={handleCancel}
              variant="secondary"
              className="w-[160px] h-12 text-lg font-semibold"
              disabled={isSaving}
            >
              CANCELAR
            </Button>
            
            <Button 
              type="submit"
              variant="default"
              className="h-12 text-lg font-semibold text-white px-6"
              disabled={isSaving}
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaracteristicasAdicionalesPage;