'use client';

import { useState, useEffect } from "react";
import { CalendarIcon, Search } from "lucide-react";
import { format, addDays, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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

export default function FiltrosIni({ router, onFilterSubmit, onResetFilters }: FiltrosIniProps) {

  // Estados para el combobox de ciudades
  const [ciudades] = useState<Option[]>(CIUDADES_BOLIVIA);
  const [selectedCiudad, setSelectedCiudad] = useState<string | null>(null);
  const [nombreCiudad, setNombreCiudad] = useState<string>("");
  const [buscando, setBuscando] = useState<boolean>(false);

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
            <p>Desde: {format(data.startDate, "dd/MM/yy")}</p>
            {data.endDate && (
              <p>Hasta: {format(data.endDate, "dd/MM/yy")}</p>
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
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ComboBox para ciudad con altura fija de 24 */}
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
                          <SelectTrigger className={`${!field.value ? 'text-muted-foreground' : ''} h-10 flex-1`}>
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

              {/* Campo de fecha de inicio con altura fija */}
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
                      <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              onClick={() => {
                                setTempStartDate(field.value);
                                setIsStartDateOpen(true);
                              }}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yy")
                              ) : (
                                <span>Selecciona una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
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
                      <div className="h-5">
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />

              {/* Campo de fecha de fin con botón de búsqueda y altura fija */}
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
                          <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal h-10 flex-1",
                                    !field.value && "text-muted-foreground"
                                  )}
                                  disabled={!form.watch("startDate")}
                                  onClick={() => {
                                    if (form.watch("startDate")) {
                                      setTempEndDate(field.value);
                                      setIsEndDateOpen(true);
                                    }
                                  }}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yy")
                                  ) : (
                                    <span>Selecciona una fecha</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <div>
                                <Calendar
                                  mode="single"
                                  selected={tempEndDate}
                                  onSelect={setTempEndDate}
                                  initialFocus
                                  locale={es}
                                  fromDate={form.watch("startDate") || new Date()}
                                  toDate={form.watch("startDate") ? addDays(form.watch("startDate"), 90) : undefined}
                                  disabled={(date) =>
                                    !form.watch("startDate") ||
                                    isBefore(date, form.watch("startDate")) ||
                                    (form.watch("startDate") && isBefore(addDays(form.watch("startDate"), 90), date))
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
                         
                          {/* Botón de búsqueda redondo, alineado con el botón de fecha fin */}
                          <Button
                            type="submit"
                            className="h-10 w-10 p-0 rounded-full flex-shrink-0"
                            variant="default"
                            disabled={buscando}
                          >
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="h-5">
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