"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Seguro, SeguroAdicional } from "../../types";

interface CampoSeguroMultipleProps {
  apiUrl: string;
  endpointPrefix?: string;
  seleccionados: SeguroAdicional[];
  onChange: (items: SeguroAdicional[]) => void;
  error?: string;
  setError?: (msg: string) => void;
}

export default function CampoSeguroMultiple({ 
  apiUrl,
  endpointPrefix = "/api/v3",
  seleccionados = [], 
  onChange, 
  error, 
  setError 
}: CampoSeguroMultipleProps) {
  const [seguros, setSeguros] = useState<Seguro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateErrors, setDateErrors] = useState<Record<number, string>>({});

  // Función para convertir string a Date
  const parseDate = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;
    try {
      return new Date(dateString);
    } catch {
      return undefined;
    }
  };

  // Fetch seguros disponibles
  useEffect(() => {
    const fetchSeguros = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${apiUrl}${endpointPrefix}/seguros`);
        const segurosData = response.data.success ? response.data.data : [];
        setSeguros(segurosData);
        setError?.("");
      } catch (err) {
        console.error("Error fetching seguros:", err);
        const errorMessage = axios.isAxiosError(err) 
          ? err.response?.data?.message || "Error al cargar los seguros disponibles"
          : "Error desconocido al obtener seguros";
        setError?.(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeguros();
  }, [apiUrl, endpointPrefix, setError]);

  // Validar fechas
  const validateDates = (seguro: SeguroAdicional): boolean => {
    if (!seguro.fechaInicio || !seguro.fechaFin) {
      setDateErrors(prev => ({
        ...prev,
        [seguro.id]: "Ambas fechas son obligatorias"
      }));
      return false;
    }
    
    const inicio = new Date(seguro.fechaInicio);
    const fin = new Date(seguro.fechaFin);
    
    if (fin <= inicio) {
      setDateErrors(prev => ({
        ...prev,
        [seguro.id]: "La fecha fin debe ser posterior a la fecha inicio"
      }));
      return false;
    }
    
    setDateErrors(prev => {
      const newErrors = {...prev};
      delete newErrors[seguro.id];
      return newErrors;
    });
    return true;
  };

  // Handlers
  const handleAddSeguro = (seguro: Seguro) => {
    if (!seleccionados.some(s => s.id === seguro.id)) {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      
      const nuevoSeguro: SeguroAdicional = {
        ...seguro,
        fechaInicio: today.toISOString(),
        fechaFin: tomorrow.toISOString() // Establecer fecha fin por defecto (1 día después)
      };
      
      onChange([...seleccionados, nuevoSeguro]);
    }
  };

  const handleRemoveSeguro = (id: number) => {
    onChange(seleccionados.filter(s => s.id !== id));
    setDateErrors(prev => {
      const newErrors = {...prev};
      delete newErrors[id];
      return newErrors;
    });
  };

  const handleDateChange = (id: number, field: 'fechaInicio' | 'fechaFin', date: Date | undefined) => {
    if (!date) return; // No permitir fechas indefinidas
    
    const updated = seleccionados.map(seguro => 
      seguro.id === id ? { 
        ...seguro, 
        [field]: date.toISOString(),
        // Si cambiamos la fecha inicio, asegurarnos que la fecha fin sea posterior
        ...(field === 'fechaInicio' && seguro.fechaFin && new Date(seguro.fechaFin) <= date ? {
          fechaFin: new Date(date.getTime() + 86400000).toISOString() // +1 día
        } : {})
      } : seguro
    );
    
    onChange(updated);
    validateDates(updated.find(s => s.id === id)!);
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-medium">Seguros Adicionales</Label>
      
      {isLoading ? (
        <p className="text-sm text-gray-500">Cargando seguros...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <div className="space-y-3">
          {seguros.map(seguro => (
            <div key={seguro.id} className="flex items-center space-x-2">
              <Checkbox
                id={`seguro-${seguro.id}`}
                checked={seleccionados.some(s => s.id === seguro.id)}
                onCheckedChange={(checked: boolean) => {
                  if (checked) {
                    handleAddSeguro(seguro);
                  } else {
                    handleRemoveSeguro(seguro.id);
                  }
                }}
              />
              <Label htmlFor={`seguro-${seguro.id}`}>
                {seguro.nombre} - {seguro.empresa} ({seguro.tipoSeguro})
              </Label>
            </div>
          ))}
        </div>
      )}

      {seleccionados.length > 0 && (
        <div className="space-y-3 mt-4">
          {seleccionados.map(seguro => (
            <div key={seguro.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium">{seguro.nombre} - {seguro.empresa}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{seguro.tipoSeguro}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSeguro(seguro.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Fecha Inicio*</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {seguro.fechaInicio ? format(parseDate(seguro.fechaInicio)!, "PPP") : <span>Seleccione fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={parseDate(seguro.fechaInicio)}
                        onSelect={(date) => handleDateChange(seguro.id, 'fechaInicio', date || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Fecha Fin*</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {seguro.fechaFin ? format(parseDate(seguro.fechaFin)!, "PPP") : <span>Seleccione fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={parseDate(seguro.fechaFin)}
                        onSelect={(date) => handleDateChange(seguro.id, 'fechaFin', date || new Date(new Date(seguro.fechaInicio).getTime() + 86400000))}
                        initialFocus
                        fromDate={new Date(new Date(seguro.fechaInicio).getTime() + 86400000)} // +1 día
                      />
                    </PopoverContent>
                  </Popover>
                  {dateErrors[seguro.id] && (
                    <p className="text-red-500 text-xs">{dateErrors[seguro.id]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}