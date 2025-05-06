'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
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

const FormSchema = z.object({
  location: z.string().min(1, "Debes especificar una ubicación"),
  startDate: z.date({
    required_error: "La fecha de inicio es requerida",
  }),
  endDate: z.date({
    required_error: "La fecha de fin es requerida",
  }),
});

export default function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      location: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success("Filtros aplicados:", {
      description: (
        <>
          <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 text-white">
            <p>Ubicación: {data.location}</p>
            <p>Desde: {format(data.startDate, "PPP", { locale: es })}</p>
            <p>Hasta: {format(data.endDate, "PPP", { locale: es })}</p>
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
            onSubmit={form.handleSubmit(onSubmit)} 
            className="mt-8 w-full max-w-4xl bg-white p-6 rounded-lg shadow-md space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Campo de ubicación */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Donde te encuentras:</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ciudad, provincia y aeropuerto" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo de fecha de inicio */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de inicio:</FormLabel>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo de fecha de fin con botón de búsqueda */}
              <div className="flex items-end gap-2">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-1">
                      <FormLabel>Fecha de fin:</FormLabel>
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
                            fromDate={form.watch("startDate") || new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Botón de búsqueda redondo */}
                <Button 
                  type="submit" 
                  className="h-10 w-10 p-0 rounded-full"
                  variant="default"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}