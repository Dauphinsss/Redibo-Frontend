'use client';

import { useState, useEffect } from "react";
import { CalendarIcon, Search, RefreshCw } from "lucide-react";
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
import { transformAuto } from "@/utils/transformAuto_Recode";

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
    filtroCiudad,
    setFiltroCiudad,
  } = useAutos();

  // Estados para el combobox de ciudades
  const [ciudades] = useState<Option[]>(CIUDADES_BOLIVIA);
  const [selectedCiudad, setSelectedCiudad] = useState<string | null>(null);
  const [nombreCiudad, setNombreCiudad] = useState<string>("");
  const [buscando, setBuscando] = useState<boolean>(false);
  // Estado para indicar si se han aplicado filtros
  const [filtrosAplicados, setFiltrosAplicados] = useState<boolean>(false);
  // Estado para indicar si no se encontraron resultados
  const [sinResultados, setSinResultados] = useState<boolean>(false);

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
      
      // También actualizamos el filtro de ciudad para el hook useAutos
      setFiltroCiudad(nombreCiudad);
    }
  };

  // Función para filtrar autos localmente usando transformAuto
 const filtrarAutosLocalmente = (ciudad: string, fechaInicio: Date, fechaFin?: Date) => {
  const todosLosAutos = autos || [];
  
  console.log("Filtrando por ciudad:", ciudad);
  console.log("Autos a filtrar:", todosLosAutos);

  const autosFiltrados = todosLosAutos.filter(auto => {
    // Si auto ya está transformado, úsalo directamente; si no, transforma
    const autoTransformado = (auto && 'ciudad' in auto)
      ? auto
      : transformAuto(auto);
    if (!autoTransformado.ciudad) return false;
    
    console.log(`Auto ${autoTransformado.idAuto}: ciudad=${autoTransformado.ciudad}`);
    
    // Compara la ciudad del auto con la ciudad seleccionada
    const autoCiudad = autoTransformado.ciudad.toLowerCase().trim();
    const ciudadFiltro = ciudad.toLowerCase().trim();
    
    return autoCiudad === ciudadFiltro;
  });
  
  console.log("Autos filtrados:", autosFiltrados);
  
  return autosFiltrados;
};

  // Función para restablecer todos los filtros
  const restablecerFiltros = () => {
    // Limpiar formulario
    form.reset({
      location: "",
      ciudadId: "",
      startDate: undefined,
      endDate: undefined
    });
    
    // Limpiar estados
    setSelectedCiudad(null);
    setNombreCiudad("");
    setFiltroCiudad("");
    setFiltrosAplicados(false);
    setSinResultados(false);
    
    // Restaurar todos los autos
    setAutosFiltrados(autos || []);
    
    toast.success("Filtros restablecidos correctamente");
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
    setFiltrosAplicados(true);
    setSinResultados(false);
    
    toast.success("Aplicando filtros...", {
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
    
    try {
      // Filtrar autos localmente en lugar de llamar a la API
      const autosFiltradosResultado = filtrarAutosLocalmente(
        data.location,
        data.startDate,
        data.endDate
      );
      
      if (autosFiltradosResultado && autosFiltradosResultado.length > 0) {
        // Actualizar el estado con los autos filtrados
        setAutosFiltrados(autosFiltradosResultado);
        toast.success(`Se encontraron ${autosFiltradosResultado.length} vehículos disponibles`);
        setSinResultados(false);
      } else {
        toast.info("No se encontraron vehículos disponibles para los criterios elegidos");
        // Mostrar lista vacía
        setAutosFiltrados([]);
        // Establecer estado de sin resultados
        setSinResultados(true);
      }
    } catch (error) {
      console.error("Error al procesar la búsqueda:", error);
      toast.error("Ocurrió un error al procesar tu búsqueda");
    } finally {
      setBuscando(false);
    }
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
                  <FormItem className="flex flex-col h-24">
                    <FormLabel>* Donde te encuentras:</FormLabel>
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
                render={({ field }) => (
                  <FormItem className="flex flex-col h-24">
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
                    <div className="h-5">
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
                      <div className="flex gap-2 items-center">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal h-10 flex-1",
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
                          disabled={buscando}
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="h-5">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Botón para restablecer filtros - solo visible cuando hay filtros aplicados */}
            {filtrosAplicados && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={restablecerFiltros}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Restablecer filtros
                </Button>
              </div>
            )}
          </form>
        </Form>

        {/* Mensaje cuando no hay resultados */}
        {sinResultados && (
          <div className="w-full max-w-6xl mt-12 bg-amber-50 border border-amber-200 p-6 rounded-lg">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl font-semibold text-amber-800">No se encontraron vehículos disponibles</h3>
              <p className="mt-2 text-amber-700">
                No hay vehículos disponibles con los criterios de búsqueda seleccionados.
              </p>
              <Button
                onClick={restablecerFiltros}
                variant="outline"
                className="mt-4 border-amber-500 text-amber-700 hover:bg-amber-100 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Restablecer filtros y ver todos los vehículos
              </Button>
            </div>
          </div>
        )}

        {/* Sección de vehículos disponibles - solo visible cuando hay resultados o no se han aplicado filtros */}
        {(!sinResultados || !filtrosAplicados) && (
          <section className="w-full max-w-6xl mt-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {nombreCiudad 
                  ? `Vehículos disponibles en ${nombreCiudad}` 
                  : "Todos nuestros vehículos disponibles"}
              </h2>
              <div className="flex items-center">
                <p className="text-gray-700">
                  Mostrando {autosActuales.length} de {autosFiltrados.length} vehículos
                </p>
              </div>
            </div>
           
            {/* Lista de vehículos */}
            <ResultadosAutos
              cargando={cargando || buscando}
              autosActuales={autosActuales}
              autosFiltrados={autosFiltrados}
              autosVisibles={autosVisibles}
              mostrarMasAutos={mostrarMasAutos}
            />
          </section>
        )}
      </main>
    </div>
  );
}