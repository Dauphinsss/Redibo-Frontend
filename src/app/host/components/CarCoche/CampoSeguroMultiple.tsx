"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useSegurosContext } from "@/app/host/home/add/context/seguros";

interface Seguro {
  id: number;
  nombre: string;
  tipoSeguro: string;
  empresa: string;
}

interface SeguroAdicional extends Seguro {
  fechaInicio: string;
  fechaFin: string;
}

interface CampoSeguroMultipleProps {
  apiUrl: string;
  endpointPrefix?: string;
  error?: string;
  setError?: (msg: string) => void;
  onChange?: (seguros: SeguroAdicional[]) => void;
}

export default function CampoSeguroMultiple({
  apiUrl,
  endpointPrefix = "/api/v3",
  error,
  setError,
  onChange,
}: CampoSeguroMultipleProps) {
  const { segurosAdicionales, setSegurosAdicionales } = useSegurosContext();
  const [seguros, setSeguros] = useState<Seguro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateErrors, setDateErrors] = useState<Record<number, string>>({});

  const parseDate = useCallback((dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }, []);

  // obtener seguros
  useEffect(() => {
    const fetchSeguros = async () => {
      setIsLoading(true);
      try {
        const url = `${apiUrl}${endpointPrefix}/seguros`;
        const response = await axios.get(url);
        const data = response.data.success ? response.data.data : [];
        setSeguros(data);
        setError?.("");
      } catch (err) {
        console.error("Error fetching seguros:", err);
        const msg = axios.isAxiosError(err)
          ? err.response?.data?.message || "Error al cargar los seguros disponibles"
          : "Error desconocido al obtener seguros";
        setError?.(msg);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSeguros();
  }, [apiUrl, endpointPrefix, setError]);

  const validateDates = useCallback((seg: SeguroAdicional): boolean => {
    const { fechaInicio, fechaFin, id } = seg;
    if (!fechaInicio || !fechaFin) {
      setDateErrors(prev => ({ ...prev, [id]: "Ambas fechas son obligatorias" }));
      return false;
    }
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);
    if (end <= start) {
      setDateErrors(prev => ({ ...prev, [id]: "La fecha fin debe ser posterior a la fecha inicio" }));
      return false;
    }
    setDateErrors(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    return true;
  }, []);

  const updateParent = useCallback((list: SeguroAdicional[]) => {
    onChange?.(list);
  }, [onChange]);

  const handleAddSeguro = useCallback((seg: Seguro) => {
    if (!segurosAdicionales.find(s => s.id === seg.id)) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const nuevo: SeguroAdicional = {
        ...seg,
        fechaInicio: today.toISOString(),
        fechaFin: tomorrow.toISOString(),
      };
      const updated = [...segurosAdicionales, nuevo];
      setSegurosAdicionales(updated);
      updateParent(updated);
    }
  }, [segurosAdicionales, setSegurosAdicionales, updateParent]);

  const handleRemoveSeguro = useCallback((id: number) => {
    const updated = segurosAdicionales.filter(s => s.id !== id);
    setSegurosAdicionales(updated);
    updateParent(updated);
    setDateErrors(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, [segurosAdicionales, setSegurosAdicionales, updateParent]);

  const handleDateChange = useCallback((id: number, field: 'fechaInicio' | 'fechaFin', date?: Date) => {
    if (!date) return;
    const updated = segurosAdicionales.map(s => {
      if (s.id !== id) return s;
      const base = { ...s, [field]: date.toISOString() };
      if (field === 'fechaInicio') {
        const fin = new Date(s.fechaFin);
        if (fin <= date) {
          base.fechaFin = new Date(date.getTime() + 86400000).toISOString();
        }
      }
      return base;
    });
    setSegurosAdicionales(updated);
    updateParent(updated);
    // validar nueva fecha
    const changed = updated.find(s => s.id === id);
    if (changed) validateDates(changed);
  }, [segurosAdicionales, setSegurosAdicionales, updateParent, validateDates]);

  return (
    <div className="space-y-4">
      <Label className="text-lg font-medium">Seguros Adicionales</Label>

      {isLoading ? (
        <p className="text-sm text-gray-500">Cargando seguros...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <div className="space-y-3">
          {seguros.map(seg => (
            <div key={seg.id} className="flex items-center space-x-2">
              <Checkbox
                id={`seguro-${seg.id}`}
                checked={!!segurosAdicionales.find(s => s.id === seg.id)}
                onCheckedChange={checked => checked ? handleAddSeguro(seg) : handleRemoveSeguro(seg.id)}
              />
              <Label htmlFor={`seguro-${seg.id}`}>
                {seg.nombre} - {seg.empresa} ({seg.tipoSeguro})
              </Label>
            </div>
          ))}
        </div>
      )}

      {segurosAdicionales.length > 0 && (
        <div className="space-y-4 mt-6">
          {segurosAdicionales.map(seg => (
            <div key={seg.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium">{seg.nombre} - {seg.empresa}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{seg.tipoSeguro}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveSeguro(seg.id)} className="text-red-500 hover:text-red-700">
                  Eliminar
                </Button>
              </div>

              <div className="flex space-x-4">
                {/* Fecha Inicio */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center">
                      {format(parseDate(seg.fechaInicio)!, "dd/MM/yyyy")}
                      <CalendarIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start">
                    <Calendar
                      mode="single"
                      selected={parseDate(seg.fechaInicio)}
                      onSelect={date => handleDateChange(seg.id, 'fechaInicio', date)}
                    />
                  </PopoverContent>
                </Popover>

                {/* Fecha Fin */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center">
                      {format(parseDate(seg.fechaFin)!, "dd/MM/yyyy")}
                      <CalendarIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start">
                    <Calendar
                      mode="single"
                      selected={parseDate(seg.fechaFin)}
                      onSelect={date => handleDateChange(seg.id, 'fechaFin', date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {dateErrors[seg.id] && (
                <p className="text-red-500 text-sm mt-2">{dateErrors[seg.id]}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
