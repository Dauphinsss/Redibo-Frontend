'use client';

import { useState, useEffect } from "react";
import { CalendarIcon, Search } from "lucide-react";
import { format, addDays, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAutos } from '@/hooks/useAutos_hook_Recode';
import Header from "@/components/ui/Header";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import ResultadosAutos from '@/components/recodeComponentes/seccionOrdenarMasResultados/ResultadosAutos_Recode';
import axios from "axios";
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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";

// URL de la API
const API_URL = "https://redibo-backend-sprinteros1.onrender.com/api";

// ID fijo para Bolivia - asegúrate de que este ID sea correcto para tu base de datos
const BOLIVIA_ID = "1"; // Ajusta este valor al ID real de Bolivia en tu sistema

// Interfaz para opciones del combobox
interface Option {
  id: number;
  nombre: string;
}

const FormSchema = z.object({
  location: z.string().min(1, "Debes especificar una ciudad"),
  paisId: z.string().optional(),
  ciudadId: z.string().optional(),
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

export default function Home() {
  // Hook para manejar los autos
  const {
    autos,
    autosFiltrados,
    autosActuales,
    autosVisibles,
    setAutosFiltrados,
    mostrarMasAutos,
    cargando,
  } = useAutos();

  // Estados para el combobox de ciudades
  const [ciudades, setCiudades] = useState<Option[]>([]);
  const [selectedCiudad, setSelectedCiudad] = useState<string | null>(null);
  const [nombreCiudad, setNombreCiudad] = useState<string>("");
  const [loadingLocations, setLoadingLocations] = useState<boolean>(false);

  // Cargar todos los autos al inicio
  useEffect(() => {
    if (autos && autos.length > 0) {
      setAutosFiltrados(autos);
    }
  }, [autos, setAutosFiltrados]);

  // Cargar ciudades de Bolivia al iniciar el componente
  useEffect(() => {
    const fetchCiudadesBolivia = async () => {
      setLoadingLocations(true);
      try {
        const response = await axios.get(`${API_URL}/ciudades/${BOLIVIA_ID}`);
        console.log(`Ciudades de Bolivia:`, response.data);
        if (response.data && Array.isArray(response.data)) {
          setCiudades(response.data);
        } else {
          setCiudades([]);
        }
      } catch (err) {
        console.error("Error al cargar ciudades de Bolivia:", err);
        setCiudades([]);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchCiudadesBolivia();
  }, []);

  // Formulario para búsqueda por fecha y ubicación
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      location: "",
      paisId: BOLIVIA_ID, // Bolivia como país por defecto
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
      setNombreCiudad(ciudadSeleccionada.nombre);
      form.setValue("location", ciudadSeleccionada.nombre);
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
    toast.success("Filtros aplicados:", {
      description: (
        <>
          <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 text-white">
            <p>Ubicación: {data.location}</p>
            <p>País: Bolivia</p>
            <p>Ciudad: {nombreCiudad}</p>
            <p>Desde: {format(data.startDate, "PPP", { locale: es })}</p>
            {data.endDate && (
              <p>Hasta: {format(data.endDate, "PPP", { locale: es })}</p>
            )}
            {!data.endDate && (
              <p>Hasta: No especificada</p>
            )}
          </div>
        </>
      ),
    });
   
    // Aquí podrías implementar la lógica de filtrado real
    // Por ahora mostramos todos los autos
  }

  return (
    <div>
      <Header />
      <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
        <h1 className="text-4xl font-bold text-center">Bienvenido a REDIBO</h1>
        <p className="mt-4 text-lg">
          Tu tienda en línea para rentar autos.
        </p>

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
    <FormItem className="flex flex-col h-24"> {/* Cambiado a flex flex-col para que coincida con la estructura de los otros campos */}
      <FormLabel>* Donde te encuentras:</FormLabel>
      <div className="flex gap-2 items-center"> {/* Agregado div contenedor similar al de fecha de fin */}
        <Select
          value={field.value}
          onValueChange={(value) => {
            field.onChange(value);
            handleCiudadChange(value);
          }}
          disabled={loadingLocations}
        >
          <FormControl>
            <SelectTrigger className={`${!field.value ? 'text-muted-foreground' : ''} h-10 flex-1`}> {/* Altura fija h-10 igual a los botones de fecha */}
              <SelectValue placeholder={loadingLocations ? "Cargando ciudades..." : "Seleccione una ciudad"} />
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
      <div className="h-5"> {/* Espacio fijo para mensajes de error */}
        <FormMessage />
      </div>
    </FormItem>
  )}
/>

              {/* Campo de fecha de inicio con altura fija */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col h-24"> {/* Altura fija para el contenedor */}
                    <FormLabel>* Fecha de inicio:</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={es}
                          fromDate={new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="h-5"> {/* Espacio fijo para mensajes de error */}
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* Campo de fecha de fin con botón de búsqueda y altura fija */}
              <div className="flex flex-col h-24">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Fecha de fin:</FormLabel>
                      <div className="flex gap-2 items-center"> {/* Contenedor para alinear horizontalmente */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal h-10 flex-1", // Altura fija
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={!form.watch("startDate")}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: es })
                                ) : (
                                  <span>Selecciona una fecha</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
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
                          </PopoverContent>
                        </Popover>
                        
                        {/* Botón de búsqueda redondo, alineado con el botón de fecha fin */}
                        <Button
                          type="submit"
                          className="h-10 w-10 p-0 rounded-full flex-shrink-0"
                          variant="default"
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="h-5"> {/* Espacio fijo para mensajes de error */}
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>

        {/* Sección de todos los vehículos disponibles */}
        <section className="w-full max-w-6xl mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Todos nuestros vehículos disponibles</h2>
            <div className="flex items-center">
              <p className="text-gray-700">
                Mostrando {Array.isArray(autosVisibles) ? autosVisibles.length : autosVisibles || 0} de {Array.isArray(autosFiltrados) ? autosFiltrados.length : autosFiltrados || 0} vehículos
              </p>
            </div>
          </div>
         
          {/* Lista de vehículos */}
          <ResultadosAutos
            cargando={cargando}
            autosActuales={autosActuales}
            autosFiltrados={autosFiltrados}
            autosVisibles={autosVisibles}
            mostrarMasAutos={mostrarMasAutos}
          />
        </section>
      </main>
    </div>
  );
}


