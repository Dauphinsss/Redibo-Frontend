"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clipboard, XCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale"; //para tener idioma en español

export default function ProvisionalBooking() {
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const clearPickupDate = () => setPickupDate(undefined);
  const clearReturnDate = () => setReturnDate(undefined);


  return (
    <div className="max-w-md h-auto flex flex-col items-start gap-4 p-4 border border-gray-300 ">
      <div className="flex gap-4">
        {/* Botón de Recogida */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-auto h-auto justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold">Fecha de recogida</span>
                <span>
                  {pickupDate
                    ? format(pickupDate, "dd '/' MMMM '/' yyyy", { locale: es })
                    : "Agrega una Fecha"}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            {/* Dentro del calendario */}
            <Calendar
              mode="single"
              selected={pickupDate}
              onSelect={setPickupDate}
              initialFocus
              locale={es}
              disabled={{ before: new Date() }} //bloquea los dias antes de la actual
            />
            {/* Botón de limpiar */}
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearPickupDate}
                className="w-full flex items-center justify-center text-red-500"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Limpiar fecha
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Botón de Devolucion */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-auto h-auto justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold">Fecha de devolución</span>
                <span>
                  {returnDate
                    ? format(returnDate, "dd '/' MMMM '/' yyyy", { locale: es })
                    : "Agrega una Fecha"}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            {/* Dentro del calendario */}
            <Calendar
              mode="single"
              selected={returnDate}
              onSelect={setReturnDate}
              initialFocus
              locale={es}
              disabled={{ before: pickupDate || new Date() }} //bloquea los dias antes de la actual
            />
            {/* Botón de limpiar */}
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearReturnDate}
                className="w-full flex items-center justify-center text-red-500"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Limpiar fecha
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Button variant="outline" className="mx-auto">
        <Clipboard className="mr-2 h-4 w-4" />
        Reserva
      </Button>
    </div>
  );
}
