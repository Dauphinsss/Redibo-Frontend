'use client';

import { useState, useEffect } from "react";
import { CalendarIcon, Search, RotateCcw } from "lucide-react";
import { format, addDays, isBefore, parse, isValid, isToday, isAfter } from "date-fns";
import { es } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import React from "react";

// Lista de ciudades de Bolivia - Datos locales
const CIUDADES_BOLIVIA = [
  { id: 1, nombre: "La Paz" },
  { id: 2, nombre: "Cochabamba" },
  { id: 3, nombre: "Santa Cruz" },
  { id: 4, nombre: "Sucre" },
  { id: 5, nombre: "Oruro" },
  { id: 6, nombre: "Potosí" },
  { id: 7, nombre: "Tarija" },
  { id: 8, nombre: "Beni" },
  { id: 9, nombre: "Pando" }
];

// Interfaz para opciones del combobox
interface Option {
  id: number;
  nombre: string;
}

// Props del componente
interface FiltrosIniProps {
  router: any; // Router de Next.js
  onFilterSubmit?: (filters: {
    ciudad: string;
    startDate: Date;
    endDate?: Date;
  }) => void;
  onResetFilters?: () => void;
}

const FormSchema = z.object({
  location: z.string().min(1, "Debes especificar una ciudad"),
  ciudadId: z.string().min(1, "Selecciona una ciudad"),
  startDate: z.date({
    required_error: "La fecha de inicio es requerida",
  }),
  // Fecha fin es opcional
  endDate: z.date({
    required_error: "La fecha de fin es requerida",
  }).optional(),
}).refine((data) => {
  // Solo validar si hay fecha fin
  if (!data.endDate || !data.startDate) return true;

  // Validar que endDate no sea mayor a 90 días después de startDate
  const maxEndDate = addDays(data.startDate, 90);
  return isBefore(data.endDate, maxEndDate) || data.endDate.getTime() === maxEndDate.getTime();
}, {
  message: "La fecha de fin no puede ser mayor a 90 días después de la fecha de inicio",
  path: ["endDate"],
});

// Función para parsear fecha manual con formato dd/mm/aaaa
const parseDateInput = (input: string): Date | null => {
  // Limpiar el input
  const cleanInput = input.replace(/[^\d\/]/g, '');
  
  // Verificar formato exacto dd/mm/aaaa
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = cleanInput.match(dateRegex);
  
  if (!match) return null;
  
  const [, day, month, year] = match;
  const dayNum = parseInt(day);
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);
  
  // Validar rangos básicos
  if (dayNum < 1 || dayNum > 31) return null;
  if (monthNum < 1 || monthNum > 12) return null;
  
  try {
    const parsedDate = new Date(yearNum, monthNum - 1, dayNum);
    
    // Validar que la fecha sea válida (por ejemplo, no 31/04)
    if (
      parsedDate.getFullYear() !== yearNum ||
      parsedDate.getMonth() !== monthNum - 1 ||
      parsedDate.getDate() !== dayNum
    ) {
      return null;
    }
    
    // Validar que la fecha no sea anterior a hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
    
    if (isBefore(parsedDate, today)) {
      return null;
    }
    
    return parsedDate;
  } catch {
    return null;
  }
};

// Función para formatear input mientras se escribe (dd/mm/aaaa)
const formatDateInput = (input: string): string => {
  // Remover caracteres no numéricos excepto /
  let cleaned = input.replace(/[^\d]/g, '');
  
  // Limitar a 8 dígitos (ddmmyyyy)
  cleaned = cleaned.substring(0, 8);
  
  // Agregar barras automáticamente
  if (cleaned.length > 4) {
    cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4) + '/' + cleaned.substring(4);
  } else if (cleaned.length > 2) {
    cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
  }
  
  return cleaned;
};

export default function FiltrosIni({ router, onFilterSubmit, onResetFilters }: FiltrosIniProps) {
  // Estados para el combobox de ciudades
  const [ciudades] = useState<Option[]>(CIUDADES_BOLIVIA);
  const [selectedCiudad, setSelectedCiudad] = useState<string | null>(null);
  const [nombreCiudad, setNombreCiudad] = useState<string>("");
  const [buscando, setBuscando] = useState<boolean>(false);

  // Estados para entrada manual de fechas
  const [startDateInput, setStartDateInput] = useState<string>("");
  const [endDateInput, setEndDateInput] = useState<string>("");
  const [startDateError, setStartDateError] = useState<string>("");
  const [endDateError, setEndDateError] = useState<string>("");

  // Formulario para búsqueda por fecha y ubicación
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      location: "",
      ciudadId: "",
    },
  });

  // Resetear fecha fin si la fecha inicio cambia
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  React.useEffect(() => {
    if (startDate && endDate) {
      const maxEndDate = addDays(startDate, 90);
      if (!isBefore(endDate, maxEndDate) && endDate.getTime() !== maxEndDate.getTime()) {
        form.setValue("endDate", undefined);
      }
    }
  }, [startDate, endDate, form]);

  // Sincronizar inputs manuales con fechas del formulario
  React.useEffect(() => {
    if (startDate) {
      setStartDateInput(format(startDate, "dd/MM/yyyy"));
    }
  }, [startDate]);

  React.useEffect(() => {
    if (endDate) {
      setEndDateInput(format(endDate, "dd/MM/yyyy"));
    }
  }, [endDate]);

  // Función para manejar el evento de tecla Enter
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Disparar el submit del formulario
      onSubmitWithValidation();
    }
  };

  // Función para restablecer todos los filtros
  const handleResetFilters = () => {
    // Resetear el formulario
    form.reset({
      location: "",
      ciudadId: "",
      startDate: undefined,
      endDate: undefined,
    });

    // Resetear estados locales
    setSelectedCiudad(null);
    setNombreCiudad("");
    setStartDateInput("");
    setEndDateInput("");
    setStartDateError("");
    setEndDateError("");
    setBuscando(false);

    // Llamar callback si está definido
    if (onResetFilters) {
      onResetFilters();
    }

    toast.success("Filtros restablecidos", {
      description: "Todos los filtros han sido limpiados",
    });
  };

  // Manejador para cuando cambia la ciudad seleccionada
  const handleCiudadChange = (value: string) => {
    setSelectedCiudad(value);
    form.setValue("ciudadId", value);

    // Actualizar el nombre de la ciudad seleccionada y establecer location
    const ciudadSeleccionada = ciudades.find(c => c.id.toString() === value);
    if (ciudadSeleccionada) {
      const nombreCiudad = ciudadSeleccionada.nombre;
      setNombreCiudad(nombreCiudad);
      form.setValue("location", nombreCiudad);
    }
  };

  // Manejador para entrada manual de fecha de inicio
  const handleStartDateInputChange = (value: string) => {
    const formatted = formatDateInput(value);
    setStartDateInput(formatted);
    setStartDateError("");

    if (formatted.length === 10) { // dd/mm/yyyy completo
      const parsedDate = parseDateInput(formatted);
      if (parsedDate) {
        form.setValue("startDate", parsedDate);
        // Limpiar fecha fin si es necesaria revalidación
        if (endDate) {
          const maxEndDate = addDays(parsedDate, 90);
          if (!isBefore(endDate, maxEndDate) && endDate.getTime() !== maxEndDate.getTime()) {
            form.setValue("endDate", undefined);
            setEndDateInput("");
          }
        }
      } else {
        setStartDateError("Fecha inválida");
        form.setValue("startDate", undefined as any);
      }
    } else if (formatted.length < 10) {
      form.setValue("startDate", undefined as any);
    }
  };

  // Manejador para entrada manual de fecha de fin
  const handleEndDateInputChange = (value: string) => {
    const formatted = formatDateInput(value);
    setEndDateInput(formatted);
    setEndDateError("");

    if (formatted.length === 10) { // dd/mm/yyyy completo
      const parsedDate = parseDateInput(formatted);
      if (parsedDate) {
        // Validar que haya fecha de inicio
        if (!startDate) {
          setEndDateError("Primero seleccione fecha de inicio");
          return;
        }

        // Validar que no sea anterior a la fecha de inicio
        if (isBefore(parsedDate, startDate)) {
          setEndDateError("No puede ser anterior a la fecha de inicio");
          return;
        }
        
        // Validar que no sea mayor a 90 días después de la fecha de inicio
        const maxEndDate = addDays(startDate, 90);
        if (!isBefore(parsedDate, maxEndDate) && parsedDate.getTime() !== maxEndDate.getTime()) {
          setEndDateError("No puede ser mayor a 90 días después de la fecha de inicio");
          return;
        }
        
        form.setValue("endDate", parsedDate);
      } else {
        setEndDateError("Fecha inválida");
      }
    } else if (formatted.length < 10) {
      form.setValue("endDate", undefined as any);
    }
  };

  const onSubmitWithValidation = form.handleSubmit((data) => {
    if (!data.startDate) {
      form.setError("startDate", {
        type: "manual",
        message: "La fecha de inicio es obligatoria"
      });
      return;
    }

    if (!data.location) {
      form.setError("location", {
        type: "manual",
        message: "Debes seleccionar una ciudad"
      });
      return;
    }

    onSubmit(data);
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setBuscando(true);

    toast.success("Aplicando filtros...", {
      description: (
        <>
          <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 text-white">
            <p>Ubicación: {data.location}</p>
            <p>País: Bolivia</p>
            <p>Ciudad: {nombreCiudad}</p>
            <p>Desde: {format(data.startDate, "dd/MM/yyyy")}</p>
            {data.endDate && (
              <p>Hasta: {format(data.endDate, "dd/MM/yyyy")}</p>
            )}
            {!data.endDate && (
              <p>Hasta: No especificada</p>
            )}
          </div>
        </>
      ),
    });

    try {
      // Crear objeto con los datos de búsqueda para pasar a la página de búsqueda
      const searchParams = new URLSearchParams({
        ciudad: data.location,
        fechaInicio: data.startDate.toISOString(),
        ...(data.endDate && { fechaFin: data.endDate.toISOString() })
      });

      // Redirigir a la página de búsqueda con los parámetros
      router.push(`/busqueda?${searchParams.toString()}`);

    } catch (error) {
      console.error("Error al procesar la búsqueda:", error);
      toast.error("Ocurrió un error al procesar tu búsqueda");
      setBuscando(false);
    }
  }

  return (
    <div className="w-full max-w-100xl bg-white p-6 rounded-lg shadow-md">
      <Form {...form}>
        <form
          onSubmit={onSubmitWithValidation}
          className="mt-8 w-full max-w-100xl bg-white p-6 rounded-lg shadow-md space-y-6"
          onKeyDown={handleKeyDown} // Agregar el manejador de teclas al formulario
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ComboBox para ciudad */}
            <FormField
              control={form.control}
              name="ciudadId"
              render={({ field }) => (
                <FormItem className="flex flex-col h-24">
                  <FormLabel>* Dónde te encuentras:</FormLabel>
                  <div className="flex gap-2 items-center">
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleCiudadChange(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger 
                          className={`${!field.value ? 'text-muted-foreground' : ''} h-10 flex-1`}
                          onKeyDown={handleKeyDown} // Agregar manejador de teclas
                        >
                          <SelectValue placeholder="Seleccione una ciudad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {ciudades.map((ciudad) => (
                            <SelectItem key={ciudad.id} value={ciudad.id.toString()}>
                              {ciudad.nombre}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Campo de fecha de inicio con entrada manual */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => {
                const [isStartDateOpen, setIsStartDateOpen] = useState(false);
                const [tempStartDate, setTempStartDate] = useState<Date | undefined>(field.value);

                const handleStartDateCancel = () => {
                  setTempStartDate(field.value);
                  setIsStartDateOpen(false);
                };

                const handleStartDateOk = () => {
                  field.onChange(tempStartDate);
                  setIsStartDateOpen(false);
                };

                return (
                  <FormItem className="flex flex-col h-24">
                    <FormLabel>* Fecha de inicio:</FormLabel>
                    <div className="relative">
                      <Input
                        placeholder="dd/mm/aaaa"
                        value={startDateInput}
                        onChange={(e) => handleStartDateInputChange(e.target.value)}
                        onKeyDown={handleKeyDown} // Agregar manejador de teclas
                        className="pr-10"
                        maxLength={10}
                      />
                      <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => {
                              setTempStartDate(field.value || new Date());
                              setIsStartDateOpen(true);
                            }}
                            onKeyDown={handleKeyDown} // Agregar manejador de teclas
                          >
                            <CalendarIcon className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div>
                            <Calendar
                              mode="single"
                              selected={tempStartDate}
                              onSelect={setTempStartDate}
                              initialFocus
                              locale={es}
                              fromDate={new Date()}
                            />
                            <div className="flex justify-end gap-2 p-3 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleStartDateCancel}
                              >
                                Cancelar
                              </Button>
                              <Button
                                size="sm"
                                onClick={handleStartDateOk}
                              >
                                Ok
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="h-5">
                      {startDateError && (
                        <p className="text-sm text-red-500">{startDateError}</p>
                      )}
                      <FormMessage />
                    </div>
                  </FormItem>
                );
              }}
            />

            {/* Campo de fecha de fin con entrada manual y botones de búsqueda y reset */}
            <div className="flex flex-col h-24">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => {
                  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
                  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(field.value);

                  const handleEndDateCancel = () => {
                    setTempEndDate(field.value);
                    setIsEndDateOpen(false);
                  };

                  const handleEndDateOk = () => {
                    field.onChange(tempEndDate);
                    setIsEndDateOpen(false);
                  };

                  return (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Fecha de fin:</FormLabel>
                      <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                          <Input
                            placeholder="dd/mm/aaaa"
                            value={endDateInput}
                            onChange={(e) => handleEndDateInputChange(e.target.value)}
                            onKeyDown={handleKeyDown} // Agregar manejador de teclas
                            className="pr-10"
                            maxLength={10}
                            disabled={!startDate}
                          />
                          <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                disabled={!startDate}
                                onClick={() => {
                                  if (startDate) {
                                    setTempEndDate(field.value || addDays(startDate, 1));
                                    setIsEndDateOpen(true);
                                  }
                                }}
                                onKeyDown={handleKeyDown} // Agregar manejador de teclas
                              >
                                <CalendarIcon className="h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <div>
                                <Calendar
                                  mode="single"
                                  selected={tempEndDate}
                                  onSelect={setTempEndDate}
                                  initialFocus
                                  locale={es}
                                  fromDate={startDate || new Date()}
                                  toDate={startDate ? addDays(startDate, 90) : undefined}
                                  disabled={(date) =>
                                    !startDate ||
                                    isBefore(date, startDate) ||
                                    (startDate && isBefore(addDays(startDate, 90), date))
                                  }
                                />
                                <div className="flex justify-end gap-2 p-3 border-t">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleEndDateCancel}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={handleEndDateOk}
                                  >
                                    Ok
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>

                        {/* Botón de restablecer filtros */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                className="h-10 w-10 p-0 rounded-full flex-shrink-0"
                                variant="outline"
                                onClick={handleResetFilters}
                                disabled={buscando}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Restablecer filtros</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* Botón de búsqueda redondo con tooltip */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="submit"
                                className="h-10 w-10 p-0 rounded-full flex-shrink-0"
                                variant="default"
                                disabled={buscando}
                              >
                                <Search className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Buscar vehículos</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="h-5">
                        {endDateError && (
                          <p className="text-sm text-red-500">{endDateError}</p>
                        )}
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}