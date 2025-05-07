'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, addDays, addMonths, isBefore } from "date-fns";
import { es } from "date-fns/locale"; // Importar locale español
import { CalendarIcon, Search } from "lucide-react";
import Header from "@/components/ui/Header";
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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";

const FormSchema = z.object({
  location: z.string().min(1, "Debes especificar una ubicación"),
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
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      location: "",
    },
  });

  // Resetear fecha fin si la fecha inicio cambia
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  
  // Cuando cambie la fecha de inicio, verifica si la fecha de fin sigue siendo válida
  React.useEffect(() => {
    if (startDate && endDate) {
      const maxEndDate = addDays(startDate, 90);
      if (!isBefore(endDate, maxEndDate) && endDate.getTime() !== maxEndDate.getTime()) {
        // Si la fecha fin es mayor que 90 días después de fecha inicio, resetea fecha fin
        form.setValue("endDate", undefined);
      }
    }
  }, [startDate, endDate, form]);
  
  // Validar que se requiere fecha de inicio antes de enviar
  const onSubmitWithValidation = form.handleSubmit((data) => {
    // Si no hay fecha de inicio, mostrar error
    if (!data.startDate) {
      form.setError("startDate", {
        type: "manual",
        message: "La fecha de inicio es obligatoria"
      });
      return;
    }
    
    // Continuar con el envío normal
    onSubmit(data);
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success("Filtros aplicados:", {
      description: (
        <>
          <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 text-white">
            <p>Ubicación: {data.location}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Campo de ubicación con altura fija */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 h-24"> {/* Altura fija para el contenedor del campo */}
                    <FormLabel>* Donde te encuentras:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ciudad, provincia y aeropuerto"
                        {...field}
                      />
                    </FormControl>
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
              <div className="flex items-start gap-2 h-24">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel>Fecha de fin:</FormLabel>
                      <div className="flex gap-2 items-center"> {/* Contenedor para alinear horizontalmente */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal h-10", // Altura fija
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
      </main>
    </div>
  );
}